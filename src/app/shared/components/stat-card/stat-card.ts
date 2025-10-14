import { Component, Input } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-stat-card',
  imports: [NgClass],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  @Input() title: string = '';
  @Input() value: string | number | null = '';
  @Input() icon = '';
  @Input() color = 'text-primary';
}
