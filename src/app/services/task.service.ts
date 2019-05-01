import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Question } from '../Models/Questions';
import { environment } from 'src/environments/environment';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { InvestorType } from '../Models/investor-type-enum';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  questionsList$: BehaviorSubject<Question[]>;
  private loaded = false;

  constructor(
    private http: HttpClient
  ) {
    this.questionsList$ = new BehaviorSubject<Question[]>([]);
  }

  /**
   * запрашивает список вопросов
   * (если список уже загружен, то вернет его
   * если не загружен, то делает запрос на сервер)
   */
  public getQuestionsList(): Observable<Question[]> {
    if (!this.loaded) {
      return this.reloadQuestionList().pipe(switchMap(r => this.questionsList$));
    }
    return this.questionsList$;
  }

  private reloadQuestionList(): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.apiUrl}/api/Task/GetQuestions`)
      .pipe(catchError(this.handleError),
        tap(response => {
          this.questionsList$.next(response);
          this.loaded = true;
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    let msg: string;
    if (error.error instanceof ErrorEvent) {
        msg = 'Произошла ошибка:' + error.error.message;
    } else {
        msg = `Произошла ошибка: ${error.error}. Код ошибки ${error.status}`;
    }
    return throwError(msg);
  }

  public determineInvestorType(balls: number) : Observable<InvestorType> {
    return this.http.get<InvestorType>(`${environment.apiUrl}/api/Task/GetInvestorType/?=${balls}`);
  }

  public convertRiskToEnum(balls: number): InvestorType {
      switch (balls)
      {
        case 5 : 
          return InvestorType.Guaranteed;
        case 10 :
          return InvestorType.Conservative;
        case 15 : 
          return InvestorType.Moderate;
        case 25 : 
          return InvestorType.Growth;
        case 30 :
          return InvestorType.AggressiveGrowth;
        case 40 : 
          return InvestorType.MaximumGrowth;
      }
      return InvestorType.Growth
  } 

}
