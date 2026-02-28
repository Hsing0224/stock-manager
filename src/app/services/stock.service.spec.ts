import { TestBed } from '@angular/core/testing';
import { StockService } from './stock.service';

describe('StockService', () => {
  let service: StockService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty array when no stocks stored', () => {
    expect(service.getStocks()).toEqual([]);
  });

  it('should add a stock', () => {
    const result = service.addStock('2330');
    expect(result).toBeTrue();
    expect(service.getStocks()).toEqual(['2330']);
  });

  it('should not add duplicate stock', () => {
    service.addStock('2330');
    const result = service.addStock('2330');
    expect(result).toBeFalse();
    expect(service.getStocks()).toEqual(['2330']);
  });

  it('should remove a stock', () => {
    service.addStock('2330');
    service.addStock('2884');
    service.removeStock('2330');
    expect(service.getStocks()).toEqual(['2884']);
  });

  it('should export stocks as JSON', () => {
    service.addStock('2330');
    service.addStock('0050');
    const json = service.exportStocks();
    expect(JSON.parse(json)).toEqual(['2330', '0050']);
  });

  it('should import stocks with overwrite', () => {
    service.addStock('2330');
    const result = service.importStocks('["0050","2884"]', false);
    expect(result).toBeTrue();
    expect(service.getStocks()).toEqual(['0050', '2884']);
  });

  it('should import stocks with merge', () => {
    service.addStock('2330');
    const result = service.importStocks('["0050","2330"]', true);
    expect(result).toBeTrue();
    expect(service.getStocks()).toEqual(['2330', '0050']);
  });

  it('should reject invalid JSON on import', () => {
    const result = service.importStocks('not json', false);
    expect(result).toBeFalse();
  });

  it('should reject non-array JSON on import', () => {
    const result = service.importStocks('{"key": "value"}', false);
    expect(result).toBeFalse();
  });

  it('should persist stocks to localStorage', () => {
    service.addStock('2330');
    const stored = localStorage.getItem('my_stocks');
    expect(stored).toBe('["2330"]');
  });
});
