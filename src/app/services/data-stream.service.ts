import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

type Visit = {
  id: number;
  date: Date;
  room: number;
  status: number;
  doctor: {
    name: string;
    surname: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataStreamService {

  constructor(private http: HttpClient) { }

  getVisitPatient(url: string): Observable<any> {
    return this.http.get<Visit>(url).pipe(map((res: Visit) => {
      return res;
    }))
  }

  getUserDetails(email: string, password: string) {
    return this.http.post('http://localhost:5000/login', {
      email,
      password
    });
  }
  
}
