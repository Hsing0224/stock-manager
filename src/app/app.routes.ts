import { Routes } from '@angular/router';
import { MyStocksComponent } from './components/my-stocks/my-stocks.component';
import { DataDisplayComponent } from './components/data-display/data-display.component';

export const routes: Routes = [
  { path: '', redirectTo: 'my-stocks', pathMatch: 'full' },
  { path: 'my-stocks', component: MyStocksComponent },
  { path: 'data-display', component: DataDisplayComponent },
];
