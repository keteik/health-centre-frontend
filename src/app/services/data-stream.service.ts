import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';


type PeriodicElement = {
  id: number;
  date: Date;
  room: number;
}


@Injectable({
  providedIn: 'root'
})
export class DataStreamService {

  constructor(private http: HttpClient) { }


  /*getVisitPatient(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      tap(response => {

        return response;
      })
    )

  }*/

  getVisitPatient(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(map((res: Response) => {
      return res;
    }))

  }
}
