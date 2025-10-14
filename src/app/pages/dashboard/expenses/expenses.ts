import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableColumn, TableFilter } from '../../../shared/components/table/table';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css'
})
export class Expenses {
  expensesColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'category', label: 'Category', type: 'badge' },
    { key: 'amount', label: 'Amount', type: 'currency', align: 'right' },
    { key: 'eventId', label: 'Event', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'vendor', label: 'Vendor', type: 'text' }
  ];

  expensesFilters: TableFilter[] = [
    {
      key: 'category',
      label: 'Category',
      options: [
        { value: 'venue', label: 'Venue' },
        { value: 'catering', label: 'Catering' },
        { value: 'transportation', label: 'Transportation' },
        { value: 'equipment', label: 'Equipment' },
        { value: 'marketing', label: 'Marketing' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'paid', label: 'Paid' },
        { value: 'rejected', label: 'Rejected' }
      ]
    }
  ];

  expensesData = JSON.parse(localStorage.getItem('expenses') || '[]');
  eventId = [];
  constructor() {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    this.expensesData = expenses.map((e: any) => ({
      ...e,
      eventId: e.name,
    }));
    console.log(this.expensesData);

  }

  onCreateExpense(): void {
    console.log('Add new expense');
  }

  onViewExpense(expense: any): void {
    console.log('View expense:', expense);
  }

  onEditExpense(expense: any): void {
    console.log('Edit expense:', expense);
  }

  onDeleteExpense(expense: any): void {
    console.log('Delete expense:', expense);
  }

  onSearchExpenses(searchTerm: string): void {
    console.log('Search expenses:', searchTerm);
  }

  onFilterExpenses(filter: { key: string; value: string }): void {
    console.log('Filter expenses:', filter);
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
  }
}
