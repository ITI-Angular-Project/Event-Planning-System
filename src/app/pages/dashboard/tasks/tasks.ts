import { Component, OnInit } from '@angular/core';
import { Table, TableColumn } from '../../../shared/components/table/table';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/tasks';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, Table],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  tasksColumns: TableColumn[] = [
    { key: 'title', label: 'Task Title', type: 'text' },
    { key: 'assignedTo', label: 'Assigned To', type: 'avatar' },
    { key: 'deadline', label: 'Due Date', type: 'date' },
    { key: 'priority', label: 'Priority', type: 'badge' },
    { key: 'status', label: 'Status', type: 'status' },
  ];

  tasksFilters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'up-coming', label: 'UpComing' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { value: 'Low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' },
      ],
    },
  ];

  // Full dataset
  private allTasks: Task[] = [];

  // Filtered/searched dataset
  tasksData: Task[] = [];

  // Pagination state
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Filter state
  private activeFilters: { [key: string]: any } = {};
  private searchQuery = '';

  ngOnInit() {
    this.loadTasks();
  }

  private loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    this.allTasks = storedTasks ? JSON.parse(storedTasks) : this.getDefaultTasks();
    this.applyFiltersAndSearch();
  }

  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.allTasks));
  }

  private applyFiltersAndSearch() {
    let filtered = [...this.allTasks];

    // Apply search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) || task.assignedTo.toLowerCase().includes(query)
      );
    }

    Object.keys(this.activeFilters).forEach((key) => {
      const filterValue = this.activeFilters[key];
      if (filterValue) {
        filtered = filtered.filter((task) => {
          const taskValue = String(task[key as keyof Task] || '').toLowerCase();
          return taskValue === filterValue;
        });
      }
    });

    this.totalItems = filtered.length;
    this.tasksData = filtered;
  }

  onCreateTask() {
    // Navigate to create form or open modal
    console.log('Create new task');

    // Example: Add a new task
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      assignedTo: 'Unassigned',
      dueDate: new Date().toISOString(),
      priority: 'medium',
      status: 'pending',
    };

    this.allTasks.unshift(newTask);
    this.saveTasks();
    this.applyFiltersAndSearch();
  }

  onViewTask(task: Task) {
    console.log('View task:', task);
    // Navigate to task detail view or open modal
  }

  onEditTask(task: Task) {
    console.log('Edit task:', task);
    // Navigate to edit form or open modal
    // After editing, don't forget to call saveTasks() and applyFiltersAndSearch()
  }

  onDeleteTask(task: Task) {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.allTasks = this.allTasks.filter((t) => t.id !== task.id);
      this.saveTasks();
      this.applyFiltersAndSearch();
    }
  }

  onSearchTasks(query: string) {
    this.searchQuery = query;
    this.currentPage = 1; // Reset to first page
    this.applyFiltersAndSearch();
  }

  onFilterTasks(filter: { key: string; value: string }) {
    if (filter.key === '__clearAll__') {
      this.activeFilters = {};
    } else if (filter.key && filter.value) {
      this.activeFilters[filter.key] = filter.value.toLowerCase();
    } else {
      delete this.activeFilters[filter.key];
    }
    this.currentPage = 1;
    this.applyFiltersAndSearch();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    // If your table component doesn't handle pagination internally,
    // you may need to slice the data here
  }

  // Default tasks if localStorage is empty
  private getDefaultTasks(): Task[] {
    return [
      {
        id: '1',
        title: 'Complete project proposal',
        assignedTo: 'John Doe',
        dueDate: '2025-10-20',
        priority: 'high',
        status: 'in-progress',
      },
      {
        id: '2',
        title: 'Review code changes',
        assignedTo: 'Jane Smith',
        dueDate: '2025-10-15',
        priority: 'medium',
        status: 'pending',
      },
      // Add more default tasks as needed
    ];
  }
}
