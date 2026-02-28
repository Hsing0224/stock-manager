import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { SouvenirService } from '../../services/souvenir.service';
import { Souvenir } from '../../models/souvenir.model';

@Component({
  selector: 'app-my-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-stocks.component.html',
  styleUrl: './my-stocks.component.scss',
})
export class MyStocksComponent implements OnInit {
  stockInput = '';
  stocks: string[] = [];
  souvenirs: Souvenir[] = [];
  importMode: 'merge' | 'overwrite' = 'merge';

  constructor(
    private stockService: StockService,
    private souvenirService: SouvenirService
  ) {}

  ngOnInit(): void {
    this.stockService.stocks$.subscribe((stocks) => {
      this.stocks = stocks;
    });
    this.souvenirService.getSouvenirs().subscribe((data) => {
      this.souvenirs = data;
    });
  }

  getStockName(stockId: string): string {
    const found = this.souvenirs.find((s) => s.stock_id === stockId);
    return found ? found.stock_name : '';
  }

  addStock(): void {
    const input = this.stockInput.trim();
    if (!input) return;

    const souvenir = this.souvenirs.find(
      (s) => s.stock_id === input || s.stock_name === input
    );
    const stockId = souvenir ? souvenir.stock_id : input;

    this.stockService.addStock(stockId);
    this.stockInput = '';
  }

  removeStock(stockId: string): void {
    this.stockService.removeStock(stockId);
  }

  exportStocks(): void {
    const json = this.stockService.exportStocks();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_stocks.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      this.stockService.importStocks(content, this.importMode === 'merge');
    };
    reader.readAsText(file);
    input.value = '';
  }
}
