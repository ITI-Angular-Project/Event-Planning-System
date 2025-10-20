import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableColumn, TableFilter } from '../../../shared/components/table/table';
import { Task, TaskPriority, TaskStatus } from '../../../core/models/tasks';
import { DataService } from '../../../core/services/dataService/data-service';
import { Modal } from '../../../shared/components/modal/modal';
import { AuthService } from '../../../core/services/authService/auth';
import { ToastService } from '../../../core/services/toastService/toast-service';

type Row = Task & {
  eventName: string;
  __overdue: boolean;
};

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, Table, Modal],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  constructor(
    private data: DataService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  // ===== reference options =====
  events: Array<{ id: number; name: string; endDate: string; createdBy?: number }> = [];
  private eventsMap = new Map<number, { id: number; name: string; endDate: string; createdBy?: number }>();
  private visibleEventIds = new Set<number>();

  statusOptions: TaskStatus[] = ['not-started', 'in-progress', 'completed'];
  priorityOptions: TaskPriority[] = ['low', 'medium', 'high', 'critical'];

  // ===== Table columns
  tasksColumns: TableColumn[] = [
    { key: 'title',      label: 'Task Title',  type: 'text'   },
    { key: 'eventName',  label: 'Event',       type: 'text'   },
    { key: 'assignedTo', label: 'Assigned To', type: 'avatar' },
    { key: 'deadline',   label: 'Deadline',    type: 'date'   },
    { key: 'priority',   label: 'Priority',    type: 'badge'  },
    { key: 'status',     label: 'Status',      type: 'status' },
  ];

  // ===== Table filters
  tasksFilters: TableFilter[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'not-started', label: 'Not Started' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed',   label: 'Completed'   },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { value: 'low',      label: 'Low'      },
        { value: 'medium',   label: 'Medium'   },
        { value: 'high',     label: 'High'     },
        { value: 'critical', label: 'Critical' },
      ],
    },
    {
      key: 'eventId',
      label: 'Event',
      options: [], // filled in ngOnInit()
    },
  ];

  // ===== Data (visible subset for UI)
  private allTasks: Row[] = [];
  tasksData: Row[] = [];

  // ===== Paging
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // ===== Filters/Search state
  private activeFilters: Record<string, string> = {};
  private searchQuery = '';

  // ===== Subtitle & progress
  subtitle = 'Manage and track all your tasks';
  progressEnabled = false;
  progressName = '';
  progressDone = 0;
  progressTotal = 0;
  progressPct = 0;

  // ===== Create/Edit/Delete modal state
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  taskToDelete: Row | null = null;

  createForm!: Partial<Task>;
  editForm!: Partial<Task>;
  editingId: number | null = null;

  private isOrganizer = false;
  private currentUserId: number | null = null;

  ngOnInit(): void {
    // --- Who's logged in? ---
    const user = this.auth.getLoggedUser();
    this.isOrganizer = (user?.role || '').toLowerCase() === 'organizer';
    this.currentUserId = user?.id ?? null;

    // --- Events: restrict visible events for organizers ---
    const allEvents = this.data.events();
    const visibleEvents = this.isOrganizer && this.currentUserId != null
      ? allEvents.filter(e => e.createdBy === this.currentUserId)
      : allEvents;

    this.events = visibleEvents.map(e => ({
      id: e.id,
      name: e.name,
      endDate: e.endDate,
      createdBy: e.createdBy,
    }));

    this.eventsMap.clear();
    this.visibleEventIds = new Set(this.events.map(e => e.id));
    this.events.forEach(e => this.eventsMap.set(e.id, e));

    // Fill event filter options (only visible events)
    const evFilter = this.tasksFilters.find(f => f.key === 'eventId');
    if (evFilter) {
      evFilter.options = this.events.map(e => ({ value: String(e.id), label: e.name }));
    }

    // Initialize blank forms AFTER events are available
    this.createForm = this.emptyForm();
    this.editForm = this.emptyForm();

    this.loadTasks();
  }

  // ---------- Data load / save ----------
  private loadTasks(): void {
    const allEventsById = new Map(this.data.events().map(e => [e.id, e]));
    const storeTasks = (this.data.tasks() || []) as Task[];

    // Visible tasks are only those for visibleEventIds (organizer) or all (admin)
    const visibleStore = this.isOrganizer
      ? storeTasks.filter(t => this.visibleEventIds.has(t.eventId))
      : storeTasks;

    this.allTasks = visibleStore.map((t): Row => {
      const ev = allEventsById.get(t.eventId);
      const completed = (t.status || '').toLowerCase() === 'completed';
      const overdue = !completed && new Date(t.deadline) < this.midnightToday();
      return {
        ...t,
        eventName: ev?.name ?? 'Unknown Event',
        __overdue: overdue,
      };
    });

    // Keep source order; reverse only for UI
    this.applyFiltersAndSearch();
  }

  private saveTasks(): void {
    const store = (this.data.tasks() || []) as Task[];
    const byId = new Map<number, Task>(store.map(t => [t.id, t]));

    for (const r of this.allTasks) {
      const { eventName, __overdue, ...pure } = r;
      byId.set(r.id, pure as Task);
    }

    this.data.updateTask(Array.from(byId.values()) as any);
  }

  private midnightToday(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Generate new id from the LAST ITEM of the FULL STORE (original order), not max().
   */
  private nextId(): number {
    const store = (this.data.tasks() || []) as Task[];
    const lastId = store.length ? store[store.length - 1].id : 0;
    return lastId + 1;
  }

  private emptyForm(): Partial<Task> {
    const firstEventId = this.events[0]?.id ?? 0;
    return {
      eventId: firstEventId,
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      deadline: new Date().toISOString().slice(0, 16), // for <input type="datetime-local">
      status: 'not-started',
    };
  }

  // ---------- Filtering / Searching / Progress ----------
  private applyFiltersAndSearch(): void {
    const today0 = this.midnightToday();
    this.allTasks = this.allTasks.map(t => ({
      ...t,
      __overdue: (t.status || '').toLowerCase() !== 'completed' && new Date(t.deadline) < today0,
    }));

    const q = this.searchQuery.trim().toLowerCase();
    let filtered = this.allTasks.filter(t =>
      q ? (t.title.toLowerCase().includes(q) || (t.assignedTo || '').toLowerCase().includes(q)) : true
    );

    Object.entries(this.activeFilters).forEach(([key, value]) => {
      if (!value) return;
      if (key === 'eventId') {
        filtered = filtered.filter(t => String(t.eventId) === value);
      } else {
        filtered = filtered.filter(t => String((t as any)[key] ?? '').toLowerCase() === value.toLowerCase());
      }
    });

    // Reverse ONLY for the rendered UI
    this.tasksData = filtered.slice().reverse();
    this.totalItems = filtered.length;

    // progress (only when one event selected)
    const evId = this.activeFilters['eventId'];
    if (evId) {
      const evTasks = filtered.filter(t => String(t.eventId) === evId);
      const total = evTasks.length;
      const done = evTasks.filter(t => (t.status || '').toLowerCase() === 'completed').length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      const evName = evTasks[0]?.eventName ?? this.getEventName(Number(evId));
      this.subtitle = `Progress for "${evName}": ${pct}% (${done}/${total} completed)`;
      this.progressEnabled = true;
      this.progressName = `Progress for "${evName}"`;
      this.progressDone = done;
      this.progressTotal = total;
      this.progressPct = pct;
    } else {
      this.subtitle = 'Manage and track all your tasks';
      this.progressEnabled = false;
      this.progressName = '';
      this.progressDone = 0;
      this.progressTotal = 0;
      this.progressPct = 0;
    }
  }

  // ---------- Table outputs ----------
  onSearchTasks(q: string): void {
    this.searchQuery = q || '';
    this.currentPage = 1;
    this.applyFiltersAndSearch();
  }

  onFilterTasks(filter: { key: string; value: string }): void {
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

  // ---------- Create ----------
  onCreateTask(): void {
    this.createForm = this.emptyForm();
    this.showCreateModal = true;
  }

  saveCreate(): void {
    const f = this.createForm;
    if (!f.title?.trim() || !f.assignedTo?.trim() || !f.eventId) {
      this.toast.show('error', 'Please fill in Title, Assigned To, and Event.');
      return;
    }

    if (this.isOrganizer && !this.visibleEventIds.has(Number(f.eventId))) {
      this.toast.show('error', 'You are not allowed to create tasks for this event.');
      return;
    }

    // Deadline must be <= event end
    const evEnd = this.getEventEnd(f.eventId);
    if (evEnd) {
      const d = new Date(this.normalizeDateTimeLocal(f.deadline));
      if (d > new Date(evEnd)) {
        this.toast.show('error', 'Deadline cannot be after event end date.');
        return;
      }
    }

    const now = new Date().toISOString();
    const eventName = this.getEventName(f.eventId);

    const row: Row = {
      id: this.nextId(),
      eventId: Number(f.eventId),
      title: f.title!.trim(),
      description: f.description?.trim() ?? '',
      assignedTo: f.assignedTo!.trim(),
      priority: (f.priority as TaskPriority) ?? 'medium',
      deadline: this.normalizeDateTimeLocal(f.deadline),
      status: (f.status as TaskStatus) ?? 'not-started',
      comments: [],
      createdAt: now,
      updatedAt: now,
      eventName,
      __overdue: false,
    };

    // Keep original order; UI will show reversed
    this.allTasks.push(row);

    // Append to FULL store
    const store = (this.data.tasks() || []) as Task[];
    const merged = [...store, { ...row, eventName: undefined, __overdue: undefined } as any];
    this.data.updateTask(merged as any);

    this.applyFiltersAndSearch();
    this.showCreateModal = false;
    this.toast.show('success', 'Task created successfully.');
  }

  // ---------- Edit ----------
  onEditTask(task: Row): void {
    if (this.isOrganizer && !this.visibleEventIds.has(task.eventId)) {
      this.toast.show('error', 'You are not allowed to edit this task.');
      return;
    }

    this.editingId = task.id;
    this.editForm = {
      ...task,
      deadline: new Date(task.deadline).toISOString().slice(0, 16),
    };
    this.showEditModal = true;
  }

  saveEdit(): void {
    if (this.editingId == null) return;
    const f = this.editForm;
    if (!f.title?.trim() || !f.assignedTo?.trim() || !f.eventId) {
      this.toast.show('error', 'Please fill in Title, Assigned To, and Event.');
      return;
    }

    if (this.isOrganizer && !this.visibleEventIds.has(Number(f.eventId))) {
      this.toast.show('error', 'You are not allowed to edit tasks for this event.');
      return;
    }

    // Deadline <= event end
    const evEnd = this.getEventEnd(f.eventId);
    if (evEnd) {
      const d = new Date(this.normalizeDateTimeLocal(f.deadline));
      if (d > new Date(evEnd)) {
        this.toast.show('error', 'Deadline cannot be after event end date.');
        return;
      }
    }

    const idx = this.allTasks.findIndex(t => t.id === this.editingId);
    if (idx === -1) return;

    const eventName = this.getEventName(f.eventId);

    const updated: Row = {
      ...(this.allTasks[idx]),
      eventId: Number(f.eventId),
      title: f.title!.trim(),
      description: f.description?.trim() ?? '',
      assignedTo: f.assignedTo!.trim(),
      priority: (f.priority as TaskPriority) ?? 'medium',
      deadline: this.normalizeDateTimeLocal(f.deadline),
      status: (f.status as TaskStatus) ?? 'not-started',
      updatedAt: new Date().toISOString(),
      eventName,
    };

    // Update UI subset (preserve original order)
    this.allTasks[idx] = updated;

    // Merge into FULL store (preserve original order)
    const store = (this.data.tasks() || []) as Task[];
    const merged = store.map(t => (t.id === updated.id ? { ...updated } as any : t)) as Task[];
    this.data.updateTask(merged as any);

    this.applyFiltersAndSearch();
    this.showEditModal = false;
    this.editingId = null;
    this.toast.show('success', 'Task updated successfully.');
  }

  cancelCreate(): void { this.showCreateModal = false; }
  cancelEdit(): void { this.showEditModal = false; this.editingId = null; }

  // ---------- Delete with confirmation modal ----------
  onDeleteTask(task: Row): void {
    if (this.isOrganizer && !this.visibleEventIds.has(task.eventId)) {
      this.toast.show('error', 'You are not allowed to delete this task.');
      return;
    }
    this.taskToDelete = task;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.taskToDelete) return;

    // Update UI subset
    this.allTasks = this.allTasks.filter(t => t.id !== this.taskToDelete!.id);

    // Remove from FULL store
    const store = (this.data.tasks() || []) as Task[];
    this.data.updateTask(store.filter(t => t.id !== this.taskToDelete!.id) as any);

    this.applyFiltersAndSearch();
    this.toast.show('success', `Task "${this.taskToDelete.title}" deleted.`);
    this.taskToDelete = null;
    this.showDeleteModal = false;
  }

  cancelDelete(): void {
    this.taskToDelete = null;
    this.showDeleteModal = false;
  }

  // ===== Template helpers =====
  getEventEnd(id: any): string | null {
    const ev = this.eventsMap.get(Number(id));
    return ev?.endDate ?? null;
  }
  getEventName(id: any): string {
    return this.eventsMap.get(Number(id))?.name ?? 'Unknown Event';
  }

  // Helpers
  private normalizeDateTimeLocal(v: any): string {
    try {
      const d = new Date(v);
      return d.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
}
