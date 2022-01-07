import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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

type Patient = {
  id: number;
  name: string;
  surname: string;
  age: number;
  gender: string;
}

type Prescription = {
  id: number;
  name: string;
  payment: number;
  create_time: String;
}

@Injectable({
  providedIn: 'root'
})
export class DataStreamService {

  constructor(private http: HttpClient) { }

  getVisitPatients(url: string): Observable<any> {
    return this.http.get<Visit>(url).pipe(map((res: Visit) => {
      return res;
    }))
  }

  getDoctorPatients(url: string): Observable<any> {
    return this.http.get<Patient>(url).pipe(map((res: Patient) => {
      return res;
    }))
  }

  getUserDetails(email: string, password: string) {
    return this.http.post('http://localhost:5000/login', {
      email,
      password
    });
  }

  getPrescription(url: string): Observable<any> {
    return this.http.get<Prescription>(url).pipe(map((res:Prescription) => {
      return res;
    }))
  }
  
}
