import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartTypeRegistry } from 'chart.js';

import { Event } from '../../../core/models/events';
import { Guest } from '../../../core/models/guests';
import { Expense } from '../../../core/models/expenses';
import { Feedback } from '../../../core/models/feedback';
import { User } from '../../../core/models/users';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CurrencyPipe, TitleCasePipe, StatCard, BaseChartDirective],
  templateUrl: './home-dashboard.html',
  styleUrl: './home-dashboard.css',
})
export class HomeDashboard implements OnInit {
  // ======= Stats =======
  stats = signal({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalGuests: 0,
    totalExpenses: 0,
    avgFeedback: 0,
  });

  loggedUser: User | null = null;

  // ======= Filtered sets =======
  private filteredEvents = signal<Event[]>([]);
  private filteredExpenses = signal<Expense[]>([]);
  private filteredFeedback = signal<Feedback[]>([]);
  private filteredGuests = signal<Guest[]>([]);

  // ======= Chart options (no custom colors set) =======
  pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { intersect: false },
    },
  };

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { autoSkip: true, maxRotation: 0 } },
      y: { beginAtZero: true, grid: { color: 'rgba(120,120,120,0.2)' } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { intersect: false },
    },
  };

  lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.35 }, // subtle smoothing
      point: { radius: 3 },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: 'rgba(120,120,120,0.2)' } },
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { intersect: false, mode: 'index' },
    },
  };

  // ======= Helpers: months window =======
  private monthKeysLast12 = computed(() => {
    // returns ['YYYY-01', 'YYYY-02', ...] for last 12 months (ascending)
    const keys: string[] = [];
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    for (let i = 0; i < 12; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      keys.push(key);
    }
    return keys;
  });

  monthLabels = computed(() => {
    // pretty labels for X axis
    return this.monthKeysLast12().map((k) => {
      const [y, m] = k.split('-').map(Number);
      const d = new Date(y, m - 1, 1);
      return d.toLocaleString(undefined, { month: 'short', year: '2-digit' }); // e.g., "Jan 25"
    });
  });

  private static parseDateSafe(v: any): Date | null {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
    // if your dates are in custom format, normalize them before new Date()
  }

  private static ymKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  // ======= Pie: expenses by category =======
  private expenseCategoryMap = computed(() => {
    const map = new Map<string, number>();
    for (const ex of this.filteredExpenses()) {
      const category = (ex as any).category ?? 'Uncategorized';
      const amt = Number((ex as any).amount ?? 0);
      map.set(category, (map.get(category) ?? 0) + amt);
    }
    return map;
  });

  expenseCategoryLabels = computed(() => Array.from(this.expenseCategoryMap().keys()));
  expenseCategoryValues = computed(() => Array.from(this.expenseCategoryMap().values()));

  expensePieData = computed<ChartData<'pie'>>(() => ({
    labels: this.expenseCategoryLabels(),
    datasets: [{ data: this.expenseCategoryValues() }],
  }));

  // ======= Bar: events by month (use startDate) =======
  eventsBarData = computed<ChartData<'bar'>>(() => {
    const counts = this.monthKeysLast12().map(() => 0);
    for (const ev of this.filteredEvents()) {
      const d = HomeDashboard.parseDateSafe((ev as any).startDate);
      if (!d) continue;
      const key = HomeDashboard.ymKey(d);
      const idx = this.monthKeysLast12().indexOf(key);
      if (idx !== -1) counts[idx]++;
    }
    return {
      labels: this.monthLabels(),
      datasets: [{ data: counts, label: 'Events' }],
    };
  });

  // ======= Line: guest trend (Invited vs Accepted) =======
  responsesLineData = computed<ChartData<'line'>>(() => {
    const invited = this.monthKeysLast12().map(() => 0);
    const accepted = this.monthKeysLast12().map(() => 0);

    for (const g of this.filteredGuests()) {
      // Invited -> registrationDate (fallback: invitedAt)
      const invitedDate =
        HomeDashboard.parseDateSafe((g as any).registrationDate) ||
        HomeDashboard.parseDateSafe((g as any).invitedAt);
      if (invitedDate) {
        const ik = HomeDashboard.ymKey(invitedDate);
        const i = this.monthKeysLast12().indexOf(ik);
        if (i !== -1) invited[i]++;
      }

      // Accepted -> respondedAt AND status === 'Accepted'
      if ((g as any).status === 'Accepted') {
        const resp = HomeDashboard.parseDateSafe((g as any).respondedAt);
        if (resp) {
          const rk = HomeDashboard.ymKey(resp);
          const j = this.monthKeysLast12().indexOf(rk);
          if (j !== -1) accepted[j]++;
        }
      }
    }

    return {
      labels: this.monthLabels(),
      datasets: [
        { data: invited, label: 'Invited', fill: false },
        { data: accepted, label: 'Accepted', fill: false },
      ],
    };
  });

  // ======= Lifecycle =======
  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null');
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const events: Event[] = JSON.parse(localStorage.getItem('events') || '[]');
    const guests: Guest[] = JSON.parse(localStorage.getItem('guests') || '[]');
    const expenses: Expense[] = JSON.parse(localStorage.getItem('expenses') || '[]');
    const feedback: Feedback[] = JSON.parse(localStorage.getItem('feedback') || '[]');

    // defaults: admin (or non-organizer) sees all
    let filteredEvents = events;
    let filteredGuests = guests;
    let filteredExpenses = expenses;
    let filteredFeedback = feedback;

    if ((this.loggedUser?.role || '').toLowerCase() === 'organizer') {
      const myEvents = events.filter((e: any) => e.createdBy === this.loggedUser?.id);
      const eventIds = myEvents.map((e: any) => e.id);

      filteredEvents = myEvents;
      filteredGuests = guests.filter((g: any) => eventIds.includes(g.eventId));
      filteredExpenses = expenses.filter((ex: any) => eventIds.includes(ex.eventId));
      filteredFeedback = feedback.filter((f: any) => eventIds.includes(f.eventId));
    }

    // set signals (for charts)
    this.filteredEvents.set(filteredEvents);
    this.filteredGuests.set(filteredGuests);
    this.filteredExpenses.set(filteredExpenses);
    this.filteredFeedback.set(filteredFeedback);

    // compute cards
    const totalEvents = filteredEvents.length;
    const upcomingEvents = filteredEvents.filter((e: any) => e.status === 'up-coming').length;
    const completedEvents = filteredEvents.filter((e: any) => e.status === 'completed').length;
    const totalGuests = filteredGuests.length;
    const totalExpenses = filteredExpenses.reduce(
      (sum: number, e: any) => sum + Number(e.amount || 0),
      0
    );
    const avgFeedback =
      filteredFeedback.length > 0
        ? Number(
            (
              filteredFeedback.reduce((a: number, b: any) => a + Number(b.rating || 0), 0) /
              filteredFeedback.length
            ).toFixed(1)
          )
        : 0;

    this.stats.set({
      totalEvents,
      upcomingEvents,
      completedEvents,
      totalGuests,
      totalExpenses,
      avgFeedback,
    });
  }
}
