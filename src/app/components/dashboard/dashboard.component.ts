import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <mat-card class="score-card">
        <mat-card-header>
          <mat-card-title>Sustainability Reputation Score (SRS)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-reputation-score></app-reputation-score>
        </mat-card-content>
      </mat-card>

      <mat-card class="actions-card">
        <mat-card-header>
          <mat-card-title>Carbon Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-carbon-actions></app-carbon-actions>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    
    .score-card, .actions-card {
      margin-bottom: 20px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
