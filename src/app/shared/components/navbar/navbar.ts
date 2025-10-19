import { Component, OnDestroy, OnInit, signal, computed, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ThemeService } from '../../../core/services/themeService/theme-service';
import { AuthService } from '../../../core/services/authService/auth';
import { DataService } from '../../../core/services/dataService/data-service';
import { User } from '../../../core/models/users';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [RouterLink],
  standalone: true,
})
export class Navbar implements OnInit, OnDestroy {
  menuOpen = false;
  profileOpen = false;

  private _user = signal<User | null>(null);
  user = computed(() => this._user());

  // 🔔 pending invitations for the logged-in user (guest)
  pendingInvites = computed(() => {
    const u = this._user();
    if (!u?.email) return 0;
    const email = (u.email || '').toLowerCase();
    const guests = this.dataService.guests(); // event attendees (not user accounts)
    return guests.filter(
      g =>
        (g.email || '').toLowerCase() === email &&
        (g.status === 'Invited' || g.status === 'Pending')
    ).length;
  });

  constructor(
    public theme: ThemeService,
    private auth: AuthService,
    private router: Router,
    private dataService: DataService
  ) {}

  get themeSignal() { return this.theme.theme; }

  ngOnInit(): void {
    this.syncUser();
    window.addEventListener('auth-changed', this.syncUser);
    window.addEventListener('storage', this.onStorage);
  }

  ngOnDestroy(): void {
    window.removeEventListener('auth-changed', this.syncUser);
    window.removeEventListener('storage', this.onStorage);
  }

  private onStorage = (e: StorageEvent) => {
    if (e.key === 'loggedUser' || e.key === null) this.syncUser();
  };

  private syncUser = () => {
    this._user.set(this.auth.getLoggedUser());
  };

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleProfile() { this.profileOpen = !this.profileOpen; }
  closeProfile() { this.profileOpen = false; }

  goLogin() { this.router.navigate(['/login']); }
  goRegister() { this.router.navigate(['/register']); }

  logout() {
    this.auth.logout();
    this.closeProfile();
  }

  initials(name?: string | null, email?: string | null): string {
    const src = (name && name.trim()) || (email && email.split('@')[0]) || '';
    if (!src) return 'U';
    const parts = src.trim().split(/\s+/);
    const s = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
    return s.toUpperCase() || src[0]?.toUpperCase() || 'U';
  }

  // 🧠 Close the dropdown when clicking anywhere outside
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.profileOpen) return;
    const target = ev.target as HTMLElement | null;
    if (!target) return;
    const insideMenu = target.closest('#profile-menu');
    const onButton = target.closest('#profile-btn');
    if (!insideMenu && !onButton) this.closeProfile();
  }

  // (Optional) close on ESC
  @HostListener('document:keydown.escape', [])
  onEsc() {
    if (this.profileOpen) this.closeProfile();
  }
}
