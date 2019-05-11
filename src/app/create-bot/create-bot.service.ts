import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { industry } from '../models/industry-enum';
import { Strategy } from '../models/strategy';
import { FinancialInstrument } from '../models/financial-instrument-enum';

@Injectable({
  providedIn: 'root'
})
export class CreateBotService {

  mockFinancialInstruments: string[] = ['Акции', 'Индексы', 'Валюта', 'Криптовалюта', 'ПФИ'];
  mockAssets: string[] = ['Apple', 'Amazon', 'Facebook', 'Microsoft', 'Google'];

  constructor(
    private http: HttpClient
  ) {}

  createBot(createdBot: any, userId: number): Observable<null> {
    const obj = {bot: createdBot, id: userId};
    return this.http.post<any>(`${environment.apiUrl}/api/robots/CreateBot`, obj)
    .pipe(catchError(this.handleError),
      tap( _ => {})
    );
  }

  getFinancialInstruments() {
    return Object.values(FinancialInstrument);
  }

  getIndustries() {
    return Object.values(industry);
  }

  getAssets() {
    return this.mockAssets;
  }

  public getStrategies(): Observable<Strategy[]> {
    return this.http.get<Strategy[]>(`${environment.apiUrl}/api/Strategy/GetAllStrategies/`);
  }

  private handleError(error: HttpErrorResponse) {
    let msg: string;

    if (error.error instanceof ErrorEvent) {
      msg = 'Произошла ошибка:' + error.error.message;
    } else {
      msg = `Произошла ошибка: ${error.error}. Код ошибки ${error.status}`;
    }

    console.error('CreateBotService::handleError() ' + msg);

    return throwError(msg);
  }
}
