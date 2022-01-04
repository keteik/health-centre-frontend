import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStreamService } from '../services/data-stream.service';

type Visit = {
  date: Date;
  id: number;
  room: number;
  status: number;
  doctor: {
    name: string;
    surname: string;
  }
  doctorName: string;
}


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})

export class PatientComponent implements OnInit {

  public userName: any = localStorage.getItem('name') + " " + localStorage.getItem('surname');

  loadVisit = false;
  loadPrescription = false;

  dataVisit: Visit[] = [];

  displayedColumns: string[] = ['id', 'date', 'room', 'doctor'];


  constructor(private router: Router, private http: HttpClient, private dataStream: DataStreamService) { }

  ngOnInit(): void {
  }

  onLogOut() {
    this.http.get('http://localhost:5000/logout', {
      }).subscribe((data: any) => {}
    );

    localStorage.clear();
    window.location.reload();
  }

  onVisit() {
    this.loadPrescription = false;

    const url = "http://localhost:5000/visits/" + localStorage.getItem('id');

    this.dataStream.getVisitPatient(url).subscribe(results => {
      this.dataVisit = results;
      this.loadVisit = true;
    })


  }

  onPrescription() {
    this.loadVisit = false;
  }

}
