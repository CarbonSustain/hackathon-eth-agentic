import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>Carbon Reputation System</span>
    </mat-toolbar>
    
    <div class="container">
      <app-dashboard></app-dashboard>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  title = 'Carbon Reputation System';
}
