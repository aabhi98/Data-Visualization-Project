import { Injectable } from '@angular/core';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class ContractDataService {
  private web3: Web3;
  private contract: any;
  
  constructor() {
    this.web3 = new Web3('https://rpc-mumbai.maticvigil.com');
  }
  
  public async fetchContractData(contractAddress: string): Promise<void> {
    this.initializeContract(contractAddress);
    
    try {
        const name = await this.contract.methods.name().call();
        const symbol = await this.contract.methods.symbol().call();
        const customMsg = await this.contract.methods.customMessage().call();

        console.log('Name:', name);
        console.log('Symbol:', symbol);
        console.log('Custom Message:', customMsg);
    } catch (error) {
        console.error('An error occurred:', error);
    }
  }
  
  private initializeContract(contractAddress: string) {
    const abi = [
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "customMessage",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
    ];
    this.contract = new this.web3.eth.Contract(abi as any, contractAddress);
  }
}

