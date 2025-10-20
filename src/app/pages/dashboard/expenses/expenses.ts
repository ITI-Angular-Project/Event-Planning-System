import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableColumn, TableFilter } from '../../../shared/components/table/table';
import { Modal } from '../../../shared/components/modal/modal';
import { DataService } from '../../../core/services/dataService/data-service';
import { AuthService } from '../../../core/services/authService/auth';
import { Expense, ExpenseCategory } from '../../../core/models/expenses';
import { ToastService } from '../../../core/services/toastService/toast-service';

// ng2-charts / Chart.js
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { FormsModule } from '@angular/forms';

type Row = Expense & { eventName: string };

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, Table, BaseChartDirective, Modal],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css'
})
export class Expenses implements OnInit {
  // ===== Role visibility =====
  private isOrganizer = false;
  private currentUserId: number | null = null;
  private visibleEventIds = new Set<number>();

  // ===== Events (with optional budgets) =====
  events: Array<{ id: number; name: string; budget?: number; createdBy?: number }> = [];
  private eventsMap = new Map<number, { id: number; name: string; budget?: number }>();

  // ===== Table columns =====
  expensesColumns: TableColumn[] = [
    { key: 'name',      label: 'Name',      type: 'text'      },
    { key: 'eventName', label: 'Event',     type: 'text'      },
    { key: 'category',  label: 'Category',  type: 'badge'     },
    { key: 'amount',    label: 'Amount',    type: 'currency', align: 'right' },
    { key: 'date',      label: 'Date',      type: 'date'      },
  ];

  // ===== Filters =====
  expensesFilters: TableFilter[] = [
    {
      key: 'category',
      label: 'Category',
      options: [
        { value: 'Venue',         label: 'Venue' },
        { value: 'Decoration',    label: 'Decoration' },
        { value: 'Food',          label: 'Food' },
        { value: 'Music',         label: 'Music' },
        { value: 'Transport',     label: 'Transport' },
        { value: 'Miscellaneous', label: 'Miscellaneous' },
      ]
    },
    { key: 'eventId', label: 'Event', options: [] }, // filled reactively
  ];

  // ===== Data =====
  private allExpenses: Row[] = [];
  expensesData: Row[] = [];

  // ===== Pagination =====
  currentPage = 1;
  pageSize = 20;
  totalItems = 0;

  // ===== Filters/Search state =====
  private activeFilters: Record<string, string> = {};
  private searchQuery = '';

  // ===== Totals / Budget =====
  totalCost = 0;
  categoryTotals: Record<ExpenseCategory, number> = {
    Venue: 0, Decoration: 0, Food: 0, Music: 0, Transport: 0, Miscellaneous: 0
  };
  remainingBudgetEnabled = false;
  selectedEventName = '';
  selectedEventBudget = 0;
  remainingBudget = 0;
  overBudget = false;
  overBudgetBy = 0;

  // (Optional) set to true if you want to block saving when exceeding budget
  private enforceBudget = false;

  // ===== Chart.js (ng2-charts) =====
  doughnutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [], hoverOffset: 6 }]
  };
  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      tooltip: { enabled: true }
    },
    cutout: '48%'
  };

  // ===== Create/Edit modals =====
  showCreateModal = false;
  showEditModal = false;
  createForm!: Partial<Expense>;
  editForm!: Partial<Expense>;
  editingId: number | null = null;

  constructor(
    private data: DataService,
    private auth: AuthService,
    private toast: ToastService
  ) {
    // Initialize user/role IN CONSTRUCTOR (injection context)
    const u = this.auth.getLoggedUser?.();

    // Coerce types
    this.currentUserId = u?.id != null ? Number(u.id) : null;
    this.isOrganizer = String(u?.role || '').toLowerCase() === 'organizer';

    // Prepare forms (safe defaults; event options will be filled by the effect)
    this.createForm = this.emptyForm();
    this.editForm = this.emptyForm();

    // Create the reactive effect IN CONSTRUCTOR (valid injection context)
    effect(() => {
      // ===== 1) Events (restrict for organizers)
      const allEvents = this.data.events();

      const visibleEvents = (this.isOrganizer && this.currentUserId != null)
        ? allEvents.filter((e: any) => Number(e.createdBy) === this.currentUserId)
        : allEvents;

      this.events = visibleEvents.map((e: any) => ({
        id: Number(e.id),
        name: e.name,
        budget: Number(e.budget ?? 0),
        createdBy: Number(e.createdBy),
      }));

      this.eventsMap.clear();
      this.visibleEventIds = new Set(this.events.map(e => e.id));
      this.events.forEach(e => this.eventsMap.set(e.id, { id: e.id, name: e.name, budget: e.budget }));

      const evFilter = this.expensesFilters.find(f => f.key === 'eventId');
      if (evFilter) {
        evFilter.options = this.events.map(e => ({ value: String(e.id), label: e.name }));
      }

      // ===== 2) Expenses (restrict for organizers)
      const store = this.data.expenses() as Expense[];
      const visibleStore = this.isOrganizer
        ? store.filter(e => this.visibleEventIds.has(Number(e.eventId)))
        : store;

      this.allExpenses = visibleStore.map((e: any): Row => ({
        ...e,
        eventId: Number(e.eventId), // normalize
        eventName: this.eventsMap.get(Number(e.eventId))?.name ?? 'Unknown Event',
      }));

      // ===== 3) Refresh UI/totals/chart
      this.applyFiltersAndSearch();
    });
  }

  ngOnInit(): void {
    // nothing needed here now
  }

  // ===== Helpers =====
  private emptyForm(): Partial<Expense> {
    const firstEventId = this.events[0]?.id ?? 0;
    const now = new Date().toISOString().slice(0, 16); // datetime-local
    return {
      eventId: firstEventId,
      name: '',
      amount: 0,
      category: 'Miscellaneous',
      date: now,
      notes: '',
    };
  }

  private nextId(): number {
    // Use FULL store to avoid collisions
    const store = this.data.expenses() as Expense[];
    const max = store.length ? Math.max(...store.map(e => e.id)) : 0;
    return max + 1;
  }

  private normalizeDateTimeLocal(v: any): string {
    try {
      const d = new Date(v);
      return d.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  // ===== Filtering / searching / totals / chart =====
  private applyFiltersAndSearch(): void {
    let filtered = [...this.allExpenses];

    // Search (by name/notes)
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(e =>
        (e.name || '').toLowerCase().includes(q) ||
        (e.notes || '').toLowerCase().includes(q)
      );
    }

    // Filters
    Object.entries(this.activeFilters).forEach(([key, value]) => {
      if (!value) return;
      if (key === 'eventId') {
        filtered = filtered.filter(e => String(e.eventId) === value);
      } else if (key === 'category') {
        filtered = filtered.filter(e => e.category === (value as ExpenseCategory));
      }
    });

    // UI shows newest first
    this.expensesData = filtered.slice().reverse();
    this.totalItems = filtered.length;

    // Totals + budget + chart
    this.computeTotals(filtered);
    this.computeRemainingBudget(); // reacts to selected event filter
    this.updateChartFromTotals();
  }

  private computeTotals(list: Row[]): void {
    const totals: Record<ExpenseCategory, number> = {
      Venue: 0, Decoration: 0, Food: 0, Music: 0, Transport: 0, Miscellaneous: 0
    };
    let sum = 0;
    for (const e of list) {
      const amt = Number(e.amount) || 0;
      sum += amt;
      if (totals[e.category] != null) totals[e.category] += amt;
      else totals.Miscellaneous += amt;
    }
    this.totalCost = sum;
    this.categoryTotals = totals;
  }

  private computeRemainingBudget(): void {
    const evId = this.activeFilters['eventId'];
    if (!evId) {
      this.remainingBudgetEnabled = false;
      this.selectedEventName = '';
      this.selectedEventBudget = 0;
      this.remainingBudget = 0;
      this.overBudget = false;
      this.overBudgetBy = 0;
      return;
    }
    const eid = Number(evId);
    const ev = this.eventsMap.get(eid);
    const budget = Number(ev?.budget || 0);
    this.selectedEventName = ev?.name ?? '';
    this.selectedEventBudget = budget;

    const eventTotal = this.allExpenses
      .filter(e => e.eventId === eid)
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    const remain = budget - eventTotal;
    this.remainingBudget = Math.max(remain, 0);
    this.overBudget = remain < 0;
    this.overBudgetBy = this.overBudget ? Math.abs(remain) : 0;
    this.remainingBudgetEnabled = true;
  }

  private updateChartFromTotals(): void {
    const palette = ['#f97316','#22c55e','#3b82f6','#eab308','#ef4444','#8b5cf6'];
    const entries = Object.entries(this.categoryTotals)
      .filter(([, v]) => v > 0) as Array<[ExpenseCategory, number]>;

    if (entries.length === 0) {
      this.doughnutData = { labels: [], datasets: [{ data: [], backgroundColor: [] }] };
      return;
    }

    const labels = entries.map(([k]) => k);
    const data = entries.map(([, v]) => v);
    const bg = labels.map((_, i) => palette[i % palette.length]);

    this.doughnutData = {
      labels,
      datasets: [{ data, backgroundColor: bg, hoverOffset: 6 }]
    };
  }

  // ===== Table events =====
  onSearchExpenses(value: string): void {
    this.searchQuery = value || '';
    this.currentPage = 1;
    this.applyFiltersAndSearch();
  }

  onFilterExpenses(filter: { key: string; value: string }): void {
    if (!filter) return;
    if (filter.key === '__clearAll__') {
      this.activeFilters = {};
    } else if (filter.key) {
      this.activeFilters[filter.key] = filter.value || '';
    }
    this.currentPage = 1;
    this.applyFiltersAndSearch();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  // ===== Create =====
  onCreateExpense(): void {
    this.createForm = this.emptyForm();
    this.showCreateModal = true;
  }

  saveCreate(): void {
    const f = this.createForm;

    // Basic required fields
    if (!f.name?.trim()) {
      this.toast.show('error', 'Name is required.');
      return;
    }
    if (!f.eventId) {
      this.toast.show('error', 'Please select an event.');
      return;
    }

    // Organizer guard
    if (this.isOrganizer && !this.visibleEventIds.has(Number(f.eventId))) {
      this.toast.show('error', 'You are not allowed to add expenses to this event.');
      return;
    }

    // Amount validation (your request)
    const amt = Number(f.amount);
    if (isNaN(amt) || amt < 0) {
      this.toast.show('error', 'Amount must be 0 or greater.');
      return;
    }

    // Optional hard budget gate
    if (this.enforceBudget) {
      const eid = Number(f.eventId);
      const ev = this.eventsMap.get(eid);
      const budget = Number(ev?.budget || 0);
      if (budget > 0) {
        const eventTotal = (this.data.expenses() as Expense[])
          .filter(e => e.eventId === eid)
          .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
        if (eventTotal + amt > budget) {
          this.toast.show('error', 'This expense exceeds the event budget.');
          return;
        }
      }
    }

    const now = new Date().toISOString();
    const row: Row = {
      id: this.nextId(),
      eventId: Number(f.eventId),
      name: f.name!.trim(),
      amount: amt,
      category: (f.category as ExpenseCategory) ?? 'Miscellaneous',
      date: this.normalizeDateTimeLocal(f.date),
      notes: (f.notes || '').trim(),
      createdAt: now,
      updatedAt: now,
      eventName: this.eventsMap.get(Number(f.eventId))?.name ?? 'Unknown Event',
    };

    // append to full store
    const full = this.data.expenses();
    const merged = [...full, { ...row, eventName: undefined } as any];
    this.data.updateExpenses(merged);

    this.toast.show('success', 'Expense added.');
    this.showCreateModal = false;
  }

  // ===== Edit =====
  onEditExpense(expense: Row): void {
    if (this.isOrganizer && !this.visibleEventIds.has(expense.eventId)) return;

    this.editingId = expense.id;
    this.editForm = {
      ...expense,
      date: new Date(expense.date).toISOString().slice(0, 16),
    };
    this.showEditModal = true;
  }

  saveEdit(): void {
    if (this.editingId == null) return;

    const f = this.editForm;

    if (!f.name?.trim()) {
      this.toast.show('error', 'Name is required.');
      return;
    }
    if (!f.eventId) {
      this.toast.show('error', 'Please select an event.');
      return;
    }

    if (this.isOrganizer && !this.visibleEventIds.has(Number(f.eventId))) {
      this.toast.show('error', 'You are not allowed to edit expenses for this event.');
      return;
    }

    // Amount validation (your request)
    const amt = Number(f.amount);
    if (isNaN(amt) || amt < 0) {
      this.toast.show('error', 'Amount must be 0 or greater.');
      return;
    }

    // Optional budget gate on edit
    if (this.enforceBudget) {
      const eid = Number(f.eventId);
      const ev = this.eventsMap.get(eid);
      const budget = Number(ev?.budget || 0);
      if (budget > 0) {
        const fullCheck = this.data.expenses() as Expense[];
        const eventTotalExcludingThis = fullCheck
          .filter(e => e.eventId === eid && e.id !== this.editingId)
          .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
        if (eventTotalExcludingThis + amt > budget) {
          this.toast.show('error', 'This change would exceed the event budget.');
          return;
        }
      }
    }

    const full = this.data.expenses();
    const idx = full.findIndex(e => e.id === this.editingId);
    if (idx === -1) {
      this.toast.show('error', 'Expense not found.');
      return;
    }

    const updated: Expense = {
      ...(full[idx]),
      eventId: Number(f.eventId),
      name: f.name!.trim(),
      amount: amt,
      category: (f.category as ExpenseCategory) ?? 'Miscellaneous',
      date: this.normalizeDateTimeLocal(f.date),
      notes: (f.notes || '').trim(),
      updatedAt: new Date().toISOString(),
    };

    const merged = [...full];
    merged[idx] = updated;
    this.data.updateExpenses(merged);

    this.toast.show('success', 'Expense updated.');
    this.showEditModal = false;
    this.editingId = null;
  }

  // ===== Delete =====
  onDeleteExpense(expense: Row): void {
    if (this.isOrganizer && !this.visibleEventIds.has(expense.eventId)) return;
    if (!confirm(`Delete expense "${expense.name}"?`)) return;

    const full = this.data.expenses();
    const merged = full.filter(e => e.id !== expense.id);
    this.data.updateExpenses(merged);

    this.toast.show('success', 'Expense deleted.');
  }

  // Not used
  onViewExpense(_: any): void {}
}
