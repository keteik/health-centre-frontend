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
  },
  patient: {
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

type Doctor = {
  id: number;
  name: string;
  surname: string;
  phone: number;
  speciality: string;
  age: number;
  gender: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataStreamService {

  constructor(private http: HttpClient) { }

  getVisitPatients(url: string): Observable<any> {
    return this.http.get<Visit>(url).pipe(map((res: Visit) => { return res; }));
  }

  getPatients(url: string): Observable<any> {
    return this.http.get<Patient>(url).pipe(map((res: Patient) => { return res; }));
  }

  getPrescription(url: string): Observable<any> {
    return this.http.get<Prescription>(url).pipe(map((res:Prescription) => { return res; }));
  }

  getDoctors(url: string): Observable<any> {
    return this.http.get<Doctor>(url).pipe(map((res: Doctor) => { return res; }));
  }

  getDoctorsBySpecialty(url: string, specialty: string): Observable<any> {
    return this.http.post(url, {specialty});
  }

  getUpcomingVisits(url: string): Observable<any> {
    return this.http.get<Visit>(url).pipe(map((res: Visit) => { return res; }));
  }

  getCompletedVisits(url: string): Observable<any> {
    return this.http.get<Visit>(url).pipe(map((res: Visit) => { return res; }));
  }

  getUnconfirmedVisits(url: string): Observable<any> {
    return this.http.get<Visit>(url).pipe(map((res: Visit) => { return res; }));
  }
}
