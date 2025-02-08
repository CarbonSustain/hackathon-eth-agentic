import { Component, OnInit } from '@angular/core';

interface ReputationData {
  score: number;
  level: string;
  carbonCredits: number;
  daoParticipation: number;
}

@Component({
  selector: 'app-reputation-score',
  template: `
    <div class="score-container">
      <div class="score-circle">
        <h2>{{ reputationData.score }}</h2>
        <p>SRS Score</p>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <mat-icon>eco</mat-icon>
          <span>Carbon Credits: {{ reputationData.carbonCredits }}</span>
        </div>
        <div class="stat-item">
          <mat-icon>groups</mat-icon>
          <span>DAO Participation: {{ reputationData.daoParticipation }}%</span>
        </div>
        <div class="stat-item">
          <mat-icon>stars</mat-icon>
          <span>Level: {{ reputationData.level }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .score-container {
      text-align: center;
      padding: 20px;
    }

    .score-circle {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4CAF50, #8BC34A);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .score-circle h2 {
      font-size: 2.5em;
      margin: 0;
    }

    .score-circle p {
      margin: 5px 0 0;
    }

    .stats {
      text-align: left;
    }

    .stat-item {
      display: flex;
      align-items: center;
      margin: 10px 0;
    }

    .stat-item mat-icon {
      margin-right: 10px;
      color: #4CAF50;
    }
  `]
})
export class ReputationScoreComponent implements OnInit {
  reputationData: ReputationData = {
    score: 85,
    level: 'Gold',
    carbonCredits: 150,
    daoParticipation: 75
  };

  constructor() {}

  ngOnInit(): void {
    // In a real application, we would fetch this data from a blockchain or API
  }
}
