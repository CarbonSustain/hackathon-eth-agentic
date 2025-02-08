import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface CarbonAction {
  type: string;
  impact: number;
  date: string;
  status: string;
  wallet: string;
  co2Estimate: number;
  aiCarbonFootprint: number;
  totalCO2e: number;
  totalCredits: number;
  netEmissions: number;
  creditTypes: string[];
  protocols: string[];
}

@Component({
  selector: 'app-carbon-actions',
  template: `
    <div class="actions-container">
      <div class="wallet-input">
        <mat-form-field appearance="fill">
          <mat-label>Wallet Address</mat-label>
          <input matInput [(ngModel)]="walletAddress" placeholder="Enter wallet address">
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="submitWalletAddress()">
          Submit
        </button>
      </div>

      <table mat-table [dataSource]="carbonActions" class="actions-table">
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let action">
            <span [ngClass]="{'status-success': action.status === 'Success', 'status-failed': action.status === 'Failed'}">
              {{ action.status }}
            </span>
          </td>
        </ng-container>
        <ng-container matColumnDef="impact">
          <th mat-header-cell *matHeaderCellDef>Carbon Impact</th>
          <td mat-cell *matCellDef="let action">{{ action.impact }} tons</td>
        </ng-container>
        <ng-container matColumnDef="co2Estimate">
          <th mat-header-cell *matHeaderCellDef>CO2 Estimate</th>
          <td mat-cell *matCellDef="let action">{{ action.co2Estimate }} tons</td>
        </ng-container>
        <ng-container matColumnDef="aiCarbonFootprint">
          <th mat-header-cell *matHeaderCellDef>AI Carbon Footprint</th>
          <td mat-cell *matCellDef="let action">{{ action.aiCarbonFootprint }} tons</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="['status', 'impact', 'co2Estimate', 'aiCarbonFootprint']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['status', 'impact', 'co2Estimate', 'aiCarbonFootprint'];"></tr>
      </table>

      <div class="actions-buttons">
        <button mat-raised-button color="primary" (click)="purchaseCredits()">
          <mat-icon>add_circle</mat-icon>
          Purchase Carbon Credits
        </button>
      </div>

      <div class="ai-carbon-footprint-total">
        <h3>Total AI Carbon Footprint: {{ getTotalAICarbonFootprint() }} tons</h3>
      </div>
    </div>
  `,
  styles: [`
    .actions-container {
      padding: 20px;
    }

    .actions-table {
      width: 100%;
      margin-bottom: 20px;
    }

    .status-success {
      color: green;
    }

    .status-failed {
      color: red;
    }

    .actions-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    button mat-icon {
      margin-right: 8px;
    }

    .wallet-input {
      margin-bottom: 20px;
    }

    .red-emoji {
      color: red;
    }

    .green-emoji {
      color: green;
    }

    .super-excited-emoji {
      color: blue;
    }

    .ai-carbon-footprint-total {
      margin-top: 20px;
      text-align: center;
    }
  `]
})
export class CarbonActionsComponent implements OnInit {
  carbonActions: CarbonAction[] = [
    {
      type: 'Carbon Credit Purchase',
      impact: 10,
      date: '2025-02-06',
      status: 'Verified',
      wallet: '',
      co2Estimate: 0,
      aiCarbonFootprint: 0,
      totalCO2e: 0,
      totalCredits: 0,
      netEmissions: 0,
      creditTypes: [],
      protocols: []
    },
    {
      type: 'L2 Transaction Bundle',
      impact: 2,
      date: '2025-02-04',
      status: 'Pending',
      wallet: '',
      co2Estimate: 0,
      aiCarbonFootprint: 0,
      totalCO2e: 0,
      totalCredits: 0,
      netEmissions: 0,
      creditTypes: [],
      protocols: []
    }
  ];

  displayedColumns: string[] = ['status', 'impact', 'co2Estimate', 'aiCarbonFootprint'];

  walletAddress: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  purchaseCredits(): void {
    console.log('Initiating carbon credit purchase...');
  }

  fetchAICarbonFootprint(txHash: string): number {
    return Math.random() * 0.1;
  }

  submitWalletAddress(): void {
    const etherscanApiKey = 'TQA3BPKKY7PFFZJJ3MKCHPRI8CKVFVTCXQ';
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${this.walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`;
    this.http.get(url).subscribe((response: any) => {
      if (response.status === '1') {
        this.carbonActions = response.result.map((tx: any) => ({
          wallet: this.walletAddress,
          type: 'Transaction',
          impact: 0,
          date: new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString(),
          status: tx.isError === '0' ? 'Success' : 'Failed',
          co2Estimate: this.estimateCO2(tx),
          aiCarbonFootprint: this.fetchAICarbonFootprint(tx.hash),
          totalCO2e: 0,
          totalCredits: 0,
          netEmissions: 0,
          creditTypes: [],
          protocols: []
        }));
      } else {
        console.error('Failed to fetch transactions');
      }
    }, error => {
      console.error('Error fetching transactions:', error);
    });
  }

  estimateCO2(tx: any): number {
    const gasUsed = parseInt(tx.gasUsed);
    return gasUsed * 0.0000001;
  }

  getTotalAICarbonFootprint(): number {
    return this.carbonActions.reduce((sum, action) => sum + action.aiCarbonFootprint, 0);
  }

  purchaseCarbonCredit(action: CarbonAction): void {
    console.log('Purchasing carbon credit for action:', action);
  }

  getEmojiState(action: CarbonAction): string {
    if (action.netEmissions > 0) {
      return 'red-emoji';
    } else if (action.totalCredits >= action.totalCO2e) {
      return 'green-emoji';
    } else {
      return 'super-excited-emoji';
    }
  }

  viewHistory(action: CarbonAction): void {
    console.log('Viewing history for action:', action);
  }

  updateCO2Estimate(estimate: number): void {
    const action = this.carbonActions.find(a => a.wallet === this.walletAddress);
    if (action) {
      action.co2Estimate = estimate;
    }
  }
}
