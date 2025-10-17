import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableFilter } from '../../../core/models/table.types';
import { FormsModule } from '@angular/forms';

export type { TableColumn, TableFilter } from '../../../core/models/table.types';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table implements OnInit {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() createButtonText: string = 'Create';
  @Input() showFilters: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() filters: TableFilter[] = [];
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;

  @Output() create = new EventEmitter<void>();
  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ key: string; value: string }>();
  @Output() pageChange = new EventEmitter<number>();

  selectedFilters: { [key: string]: string | null } = {};
  Math = Math;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  ngOnInit() {
    this.filters.forEach((f) => (this.selectedFilters[f.key] = null));
  }

  // Event handlers
  onCreate(): void {
    this.create.emit();
  }

  onView(item: any): void {
    this.view.emit(item);
  }

  onEdit(item: any): void {
    this.edit.emit(item);
  }

  onDelete(item: any): void {
    this.delete.emit(item);
  }

  onSearch(event: any): void {
    this.search.emit(event.target.value);
  }

  onFilterChange(key: string, event: any): void {
    this.filterChange.emit({ key, value: event.target.value });
  }

  clearFilters(): void {
    Object.keys(this.selectedFilters).forEach((key) => (this.selectedFilters[key] = null));
    this.filterChange.emit({ key: '__clearAll__', value: '' });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  get pagedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Utility methods
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  getAvatarText(item: any, key: string): string {
    const value = this.getNestedValue(item, key);
    if (typeof value === 'string') {
      return value
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '??';
  }

  getFormattedDate(item: any, key: string): string {
    const value = this.getNestedValue(item, key);
    if (value) {
      return new Date(value).toLocaleDateString();
    }
    return '';
  }

  getFormattedTime(item: any, key: string): string {
    const value = this.getNestedValue(item, key);
    if (value) {
      return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  }

  getBadgeClass(item: any, key: string): string {
    const value = this.getNestedValue(item, key);
    const badgeClasses: { [key: string]: string } = {
      Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      Completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      Published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return badgeClasses[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }

  getStatusClass(item: any, key: string): string {
    const value = String(this.getNestedValue(item, key)).toLowerCase();

    switch (value) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 pulse-dot';
      case 'up-coming':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300';
    }
  }

  formatStatusLabel(status: string): string {
    if (!status) return '';
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getStatusDotClass(item: any, key: string): string {
    const value = String(this.getNestedValue(item, key)).toLowerCase();

    switch (value) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'up-coming':
        return 'bg-yellow-500';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
