import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrescriptionDialogComponent } from '../prescription-dialog/prescription-dialog.component';
import { DataStreamService } from '../services/data-stream.service';


type Visit = {
  date: Date;
  id: number;
  room: number;
  status: number;
  patient: {
    name: string;
    surname: string;
  }
  patientName: string;
}

type Patient = {
  id: number;
  name: string;
  surname: string;
  age: number;
  gender: string;
  patientName: string;
}

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  public userName: string = "";
  loadVisit: boolean = false;
  loadPatient: boolean = false;


  dataVisit: Visit[] = [];
  dataPatient: Patient[] = [];

  displayedColumnsVisit: string[] = ['id', 'patient', 'room', 'date', 'prescription'];
  displayedColumnsPatient: string[] = ['id', 'patient', 'age', 'gender'];


  constructor(private http: HttpClient, private dataStream: DataStreamService, public dialog: MatDialog) { }

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
    this.loadPatient = false;
    const url = "http://localhost:5000/visits/doctor/" + localStorage.getItem('id');
    
    if(this.dataVisit.length === 0) {
      this.dataStream.getVisitPatients(url).subscribe(results => {
        this.dataVisit = results;
 
        this.loadVisit = true;
      })
    }
    this.loadVisit = true;  
  }

  onPatient() {
    this.loadVisit = false
    const url = "http://localhost:5000/patients/doctor/" + localStorage.getItem('id');
    
    if(this.dataPatient.length === 0) {
      this.dataStream.getDoctorPatients(url).subscribe(results => {
        this.dataPatient = results;
 
        this.loadPatient = true;
      })
    }
    this.loadPatient = true;  
  }

  openDialog(id: number) {
    this.dialog.open(PrescriptionDialogComponent, {
      data: {id: id},
      width: '80%',
      height: '90%'
    });
  }

}
