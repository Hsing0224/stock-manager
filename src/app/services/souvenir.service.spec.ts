import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SouvenirService } from './souvenir.service';
import { Souvenir } from '../models/souvenir.model';

describe('SouvenirService', () => {
  let service: SouvenirService;
  let httpMock: HttpTestingController;

  const mockSouvenirs: Souvenir[] = [
    {
      stock_id: '2330',
      stock_name: '台積電',
      year: 2024,
      souvenir_category: '生活用品',
      souvenir_name: '特製馬克杯',
      eligibility_flags: ['零股可', '需身分證'],
      last_buy_date: '2024-03-15',
      meeting_date: '2024-06-05',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SouvenirService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch souvenirs from souvenirs.json', () => {
    service.getSouvenirs().subscribe((data) => {
      expect(data.length).toBe(1);
      expect(data[0].stock_id).toBe('2330');
    });

    const req = httpMock.expectOne('souvenirs.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockSouvenirs);
  });
});
