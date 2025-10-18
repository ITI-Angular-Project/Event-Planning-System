import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableColumn, TableFilter } from '../../../shared/components/table/table';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/authService/auth';
import { ToastService } from '../../../core/services/toastService/toast-service';
import { Modal } from '../../../shared/components/modal/modal';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, Table, FormsModule, Modal],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  constructor(private auth: AuthService, private toast: ToastService) {}

  // Table columns + filters
  usersColumns: TableColumn[] = [
    { key: 'name', label: 'User Name', type: 'avatar' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'role', label: 'Role', type: 'badge' },
    { key: 'phone', label: 'Phone', type: 'text' },
  ];

  usersFilters: TableFilter[] = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'organizer', label: 'Organizer' },
      ],
    },
  ];

  // Paging + search/filter state
  currentPage = 1;
  searchTerm = signal<string>('');
  activeFilters = signal<{ [key: string]: string }>({});

  // Raw list from localStorage (admins/organizers only)
  private allUsersSignal = signal<any[]>(this.readUsers());
  private readUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
  private writeUsers(users: any[]) {
    localStorage.setItem('users', JSON.stringify(users));
    this.allUsersSignal.set(users);
  }

  // Exposed filtered list (reactive)
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const filters = this.activeFilters();
    let arr = [...this.allUsersSignal()];

    if (term) {
      arr = arr.filter(
        (u) =>
          (u.name ?? '').toLowerCase().includes(term) ||
          (u.email ?? '').toLowerCase().includes(term) ||
          (u.role ?? '').toLowerCase().includes(term) ||
          (u.phone ?? '').toLowerCase().includes(term)
      );
    }

    Object.entries(filters).forEach(([k, v]) => {
      if (v) arr = arr.filter((u) => String(u[k] ?? '').toLowerCase() === v);
    });

    return arr.slice().reverse();
  });

  // Modal / CRUD state
  showUserModal = false;
  editingUser: any = null; // null -> create
  userForm: any = { name: '', email: '', role: 'organizer', phone: '', password: '' };
  formError = '';

  // Delete confirmation state
  showDeleteModal = false;
  userToDelete: any = null;

  // Helpers
  private loggedUser = () => this.auth.getLoggedUser();

  // UI Actions
  onCreateUser(): void {
    this.editingUser = null;
    this.userForm = { name: '', email: '', role: 'organizer', phone: '', password: '' };
    this.formError = '';
    this.showUserModal = true;
  }

  onEditUser(user: any): void {
    this.editingUser = user;
    this.userForm = { ...user, password: '' }; // leave empty to keep
    this.formError = '';
    this.showUserModal = true;
  }

  closeModal() {
    this.showUserModal = false;
    this.formError = '';
  }

  // Open delete modal instead of native confirm
  onDeleteUser(user: any): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    const user = this.userToDelete;
    if (!user) return;

    const me = this.loggedUser();
    if (me && me.id === user.id) {
      this.toast.show('warning', "You can't delete your own account.");
      this.cancelDelete();
      return;
    }

    const users = this.readUsers();

    // Prevent deleting the last admin
    if ((user.role ?? '').toLowerCase() === 'admin') {
      const remaining = users.filter((u: any) => u.id !== user.id);
      const hasAdmin = remaining.some((u: any) => (u.role ?? '').toLowerCase() === 'admin');
      if (!hasAdmin) {
        this.toast.show('error', 'Cannot delete the last admin.');
        this.cancelDelete();
        return;
      }
    }

    const idx = users.findIndex((u: any) => u.id === user.id);
    if (idx !== -1) {
      users.splice(idx, 1);
      this.writeUsers(users);
      this.toast.show('success', `User "${user.name}" deleted.`);
    }

    this.cancelDelete();
  }

  // Save (create / update)
  saveUser() {
    this.formError = '';

    const { name, email, phone, role, password } = this.userForm;
    if (!name || !email || !phone || !role || (!this.editingUser && !password)) {
      this.formError = 'Please fill all required fields.';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      this.formError = 'Invalid email address.';
      return;
    }
    if (!/^01[0-9]{9}$/.test(String(phone))) {
      this.formError = 'Phone must start with 01 and contain 11 digits.';
      return;
    }
    const roleNorm = String(role).toLowerCase();
    if (roleNorm !== 'admin' && roleNorm !== 'organizer') {
      this.formError = 'Role must be Admin or Organizer.';
      return;
    }

    const users = this.readUsers();

    if (this.editingUser) {
      // unique email (except self)
      if (
        users.some(
          (u: any) =>
            (u.email ?? '').toLowerCase() === String(email).toLowerCase() &&
            u.id !== this.editingUser.id
        )
      ) {
        this.formError = 'Email already in use.';
        return;
      }
      // prevent demoting the last admin
      const current = users.find((u: any) => u.id === this.editingUser.id);
      const wasAdmin = (current?.role ?? '').toLowerCase() === 'admin';
      const willBeAdmin = roleNorm === 'admin';
      if (wasAdmin && !willBeAdmin) {
        const stillHasAdmin = users
          .filter((u: any) => u.id !== this.editingUser.id)
          .some((u: any) => (u.role ?? '').toLowerCase() === 'admin');
        if (!stillHasAdmin) {
          this.formError = 'Cannot remove admin role from the last admin.';
          return;
        }
      }

      const idx = users.findIndex((u: any) => u.id === this.editingUser.id);
      if (idx !== -1) {
        const updated = { ...users[idx], name, email, phone, role: roleNorm };
        if (password && password.trim()) {
          updated.password = this.auth.encryptText(String(password).trim());
        }
        users[idx] = updated;
        this.writeUsers(users);
        this.toast.show('success', `User "${name}" updated.`);
      }
    } else {
      // create
      if (users.some((u: any) => (u.email ?? '').toLowerCase() === String(email).toLowerCase())) {
        this.formError = 'Email already in use.';
        return;
      }
      const newId = users.length ? users[users.length - 1].id + 1 : 1;
      const newUser = {
        id: newId,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        role: roleNorm,
        password: this.auth.encryptText(String(password).trim()),
      };
      users.push(newUser);
      this.writeUsers(users);
      this.toast.show('success', `User "${newUser.name}" created.`);
    }

    this.showUserModal = false;
  }

  // Search & Filters
  onSearchUsers(term: string): void {
    this.searchTerm.set(term || '');
    this.currentPage = 1;
  }

  onFilterUsers(filter: { key: string; value: string }): void {
    if (filter.key === '__clearAll__') {
      this.activeFilters.set({});
    } else if (filter.key && filter.value) {
      this.activeFilters.set({ ...this.activeFilters(), [filter.key]: filter.value.toLowerCase() });
    } else {
      const next = { ...this.activeFilters() };
      delete next[filter.key];
      this.activeFilters.set(next);
    }
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
