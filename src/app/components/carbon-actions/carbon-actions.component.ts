import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

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
  input: string;
  methodId: string;
}

const carbonSustainAbi = [
  "function createCarbonCredit(uint256 _companyId, uint256 _amount) external"
];

const carbonSustainAddress = '0x289b1796AdAD1d9e1e02488C38967B1a73541021'; // Replace with actual contract address

@Component({
  selector: 'app-carbon-actions',
  template: `
    <div class="layout-container">
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

        <div class="token-purchase">
          <mat-form-field appearance="fill">
            <mat-label>Number of Tokens</mat-label>
            <input matInput type="number" [(ngModel)]="tokenAmount" placeholder="Enter number of tokens">
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="purchaseCredits()">
            <mat-icon>add_circle</mat-icon>
            Purchase Carbon Credits
          </button>
        </div>

        <div class="stats-container">
          <div class="stat-box">
            <h3>Total AI Carbon Footprint</h3>
            <p>{{ getTotalAICarbonFootprint() }} tons</p>
          </div>
          <div class="stat-box">
            <h3>Total Transactions</h3>
            <p>{{ getTotalTransactions() }}</p>
          </div>
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
          <ng-container matColumnDef="input">
            <th mat-header-cell *matHeaderCellDef>Input</th>
            <td mat-cell *matCellDef="let action">{{ action.input }}</td>
          </ng-container>
          <ng-container matColumnDef="methodId">
            <th mat-header-cell *matHeaderCellDef>Method ID</th>
            <td mat-cell *matCellDef="let action">{{ action.methodId }}</td>
          </ng-container>
          <ng-container matColumnDef="aiCarbonFootprint">
            <th mat-header-cell *matHeaderCellDef>AI Carbon Footprint</th>
            <td mat-cell *matCellDef="let action">{{ action.aiCarbonFootprint }} tons</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div class="actions-buttons">
          <button mat-raised-button color="primary" (click)="purchaseCredits()">
            <mat-icon>add_circle</mat-icon>
            Purchase Carbon Credits
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
    }

    .actions-container {
      flex: 1;
      overflow: auto;
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
    }

    .actions-table {
      width: 100%;
      margin-top: 20px;
    }

    .wallet-input {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      width: 100%;
    }

    mat-form-field {
      flex: 1;
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
      margin-bottom: 20px;
      text-align: left;
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
    }

    .ai-carbon-footprint-total h3 {
      margin: 0;
      color: #333;
    }

    .stats-container {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .stat-box {
      flex: 1;
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      text-align: center;
    }

    .stat-box h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 1rem;
    }

    .stat-box p {
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
      color: #1976d2;
    }

    .token-purchase {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }
  `]
})
export class CarbonActionsComponent implements OnInit {
  carbonActions: CarbonAction[] = [
    {
      type: 'Transaction',
      impact: 0.5,
      date: '2024-02-08',
      status: 'Success',
      wallet: '0x123...',
      co2Estimate: 0.3,
      aiCarbonFootprint: 0.2,
      totalCO2e: 0.8,
      totalCredits: 1.0,
      netEmissions: -0.2,
      creditTypes: ['VCS'],
      protocols: ['ETH'],
      input: '0x',
      methodId: '0x23b872dd'
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
      protocols: [],
      input: '',
      methodId: ''
    }
  ];

  displayedColumns: string[] = ['status', 'input', 'methodId', 'aiCarbonFootprint'];

  walletAddress: string = '';

  tokenAmount: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  async purchaseCredits() {
    try {
      if (!window.ethereum) {
        console.error('MetaMask is not installed!');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      const carbonSustainContract = new ethers.Contract(carbonSustainAddress, carbonSustainAbi, signer);
      const companyId = 1; // Example company ID
      const amount = ethers.utils.parseUnits(this.tokenAmount.toString(), 18); // Use input amount

      const tx = await carbonSustainContract['createCarbonCredit'](companyId, amount);
      console.log('Transaction sent:', tx.hash);

      await tx.wait();
      console.log('Transaction confirmed:', tx.hash);
    } catch (error) {
      console.error('Error purchasing credits:', error);
    }
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
          protocols: [],
          input: '',
          methodId: ''
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

  getTotalTransactions(): number {
    return this.carbonActions.length;
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
