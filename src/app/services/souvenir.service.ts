import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Souvenir } from '../models/souvenir.model';

@Injectable({
  providedIn: 'root',
})
export class SouvenirService {
  private dataUrl = 'souvenirs.json';

  constructor(private http: HttpClient) {}

  getSouvenirs(): Observable<Souvenir[]> {
    return this.http.get<Souvenir[]>(this.dataUrl);
  }
}
