import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStreamService } from '../services/data-stream.service';
import { MatDialog } from '@angular/material/dialog';

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
export class PatientComponent implements OnInit{

  public userName: string = "";
  loadVisit: boolean = false;
  loadPrescription: boolean = false;

  dataVisit: Visit[] = [];
  displayedColumns: string[] = ['id', 'date', 'room', 'doctor', 'prescription'];


  constructor(private router: Router, private http: HttpClient, private dataStream: DataStreamService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('name') + " " + localStorage.getItem('surname');
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
      for(let i = 0; i < this.dataVisit.length; i++){
        this.dataVisit[i].date = new Date(this.dataVisit[i].date);
      }
      this.loadVisit = true;
    })
  }

  onPrescription() {
    this.loadVisit = false;
  }

  openDialog() {
    this.dialog.open(DialogElementsExampleDialog);
  }

}


@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'dialog-elements-example-dialog.html',
})
export class DialogElementsExampleDialog{}

