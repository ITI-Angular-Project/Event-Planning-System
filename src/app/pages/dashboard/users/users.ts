import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableColumn, TableFilter } from '../../../shared/components/table/table';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  usersColumns: TableColumn[] = [
    { key: 'name', label: 'User Name', type: 'avatar' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'role', label: 'Role', type: 'badge' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'lastLogin', label: 'Last Login', type: 'date' },
    { key: 'createdAt', label: 'Created', type: 'date' },
  ];

  usersFilters: TableFilter[] = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'manager', label: 'Manager' },
        { value: 'organizer', label: 'Organizer' },
        { value: 'viewer', label: 'Viewer' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
      ],
    },
  ];

  usersData = JSON.parse(localStorage.getItem('users') || '[]');

  onCreateUser(): void {
    console.log('Add new user');
  }

  onViewUser(user: any): void {
    console.log('View user:', user);
  }

  onEditUser(user: any): void {
    console.log('Edit user:', user);
  }

  onDeleteUser(user: any): void {
    console.log('Delete user:', user);
  }

  onSearchUsers(searchTerm: string): void {
    console.log('Search users:', searchTerm);
  }

  onFilterUsers(filter: { key: string; value: string }): void {
    console.log('Filter users:', filter);
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
  }
}
