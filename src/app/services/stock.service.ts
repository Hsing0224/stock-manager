import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const STORAGE_KEY = 'my_stocks';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private stocksSubject = new BehaviorSubject<string[]>(this.loadStocks());
  stocks$: Observable<string[]> = this.stocksSubject.asObservable();

  private loadStocks(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveStocks(stocks: string[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
    this.stocksSubject.next(stocks);
  }

  getStocks(): string[] {
    return this.stocksSubject.value;
  }

  addStock(stockId: string): boolean {
    const stocks = this.getStocks();
    if (stocks.includes(stockId)) {
      return false;
    }
    this.saveStocks([...stocks, stockId]);
    return true;
  }

  removeStock(stockId: string): void {
    const stocks = this.getStocks().filter((id) => id !== stockId);
    this.saveStocks(stocks);
  }

  exportStocks(): string {
    return JSON.stringify(this.getStocks(), null, 2);
  }

  importStocks(json: string, merge: boolean): boolean {
    try {
      const imported = JSON.parse(json);
      if (!Array.isArray(imported) || !imported.every((item: unknown) => typeof item === 'string')) {
        return false;
      }
      if (merge) {
        const current = this.getStocks();
        const merged = [...new Set([...current, ...imported])];
        this.saveStocks(merged);
      } else {
        this.saveStocks(imported);
      }
      return true;
    } catch {
      return false;
    }
  }
}
