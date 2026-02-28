import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { SouvenirService } from '../../services/souvenir.service';
import { Souvenir } from '../../models/souvenir.model';

@Component({
  selector: 'app-data-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-display.component.html',
  styleUrl: './data-display.component.scss',
})
export class DataDisplayComponent implements OnInit {
  souvenirs: Souvenir[] = [];
  myStocks: string[] = [];
  selectedCategory = '';
  categories: string[] = [];

  constructor(
    private stockService: StockService,
    private souvenirService: SouvenirService
  ) {}

  ngOnInit(): void {
    this.stockService.stocks$.subscribe((stocks) => {
      this.myStocks = stocks;
    });
    this.souvenirService.getSouvenirs().subscribe((data) => {
      this.souvenirs = data;
      this.categories = [...new Set(data.map((s) => s.souvenir_category))].sort();
    });
  }

  get ownedSouvenirs(): Souvenir[] {
    return this.souvenirs.filter((s) => this.myStocks.includes(s.stock_id));
  }

  get unownedSouvenirs(): Souvenir[] {
    let list = this.souvenirs.filter((s) => !this.myStocks.includes(s.stock_id));
    if (this.selectedCategory) {
      list = list.filter((s) => s.souvenir_category === this.selectedCategory);
    }
    return list;
  }

  getFlagClass(flag: string): string {
    if (flag.includes('零股不發')) return 'badge-warning';
    if (flag.includes('需身分證')) return 'badge-info';
    if (flag.includes('需電子投票')) return 'badge-info';
    if (flag.includes('零股可')) return 'badge-success';
    return 'badge-default';
  }
}
