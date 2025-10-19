import { Component, signal, HostListener, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { ThemeService } from '../../core/services/themeService/theme-service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/authService/auth';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, CommonModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {

  profileOpen = false;


  @ViewChild('profileMenu', { static: false }) profileMenuRef!: ElementRef<HTMLElement>;


  private initialCollapse = (() => {
    try {
      const raw = localStorage.getItem('sideBarCollabse');
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  })();
  isCollapsed = signal<boolean>(this.initialCollapse);

  isMobileOpen = signal(false);

  constructor(
    public theme: ThemeService,
    private auth: AuthService,
    private router: Router
  ) {}


  toggleSidebar() {
    this.isCollapsed.update(v => !v);
    localStorage.setItem('sideBarCollabse', JSON.stringify(this.isCollapsed()));
  }
  toggleMobileSidebar() {
    this.isMobileOpen.update(v => !v);
  }
  closeMobileSidebar() {
    this.isMobileOpen.set(false);
  }

  
  toggleProfile() {
    this.profileOpen = !this.profileOpen;
  }
  goToProfile() {
    this.profileOpen = false;
    this.router.navigate(['/dashboard/profile']);
  }
  logout() {
    this.profileOpen = false;
    this.auth.logout();
  }


  get loggedUser() {
    return this.auth.getLoggedUser();
  }
  get initials(): string {
    const u = this.loggedUser;
    if (!u || !u.name) return '';
    const parts = u.name.trim().split(/\s+/);
    if (parts.length === 1) return (parts[0][0] || '').toUpperCase();
    return ((parts[0][0] || '') + (parts[1][0] || '')).toUpperCase();
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(evt: MouseEvent) {
    if (!this.profileOpen) return;
    const menuEl = this.profileMenuRef?.nativeElement;
    const target = evt.target as Node | null;
    if (menuEl && target && !menuEl.contains(target)) {
      this.profileOpen = false;
    }
  }


  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.profileOpen) this.profileOpen = false;
  }
}
