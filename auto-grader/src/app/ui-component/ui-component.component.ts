import { Component } from '@angular/core';
import { ContractDataService } from '../services/contract-data.service'; // Make sure the path is correct

@Component({
  selector: 'app-ui-component',
  templateUrl: './ui-component.component.html',
  styleUrls: ['./ui-component.component.css']
})
export class UIComponentComponent {

  uid: string = '';
  smartcontractvalue: string = '';

  constructor(private contractDataService: ContractDataService) {} // Injecting the service

  async generateOutput() {
    console.log('Smart Contract Value:', this.smartcontractvalue);
    await this.contractDataService.fetchContractData(this.smartcontractvalue); // Using the service method
  }
}
