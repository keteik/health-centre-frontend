import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStreamService } from '../services/data-stream.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrescriptionDialogComponent } from '../prescription-dialog/prescription-dialog.component';

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

type Prescription = {
  id: number;
  name: string;
  payment: number;
  create_time: String;
}

export interface DialogData {
  id: number;
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
  currentVisit: number = 0;

  dataVisit: Visit[] = [];
  displayedColumns: string[] = ['id', 'date', 'room', 'doctor', 'prescription'];

  constructor(private router: Router, private http: HttpClient, private dataStream: DataStreamService, public dialog: MatDialog) { }

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
    const url = "http://localhost:5000/visits/patient/" + localStorage.getItem('id');
    
    if(this.dataVisit.length === 0) {
      this.dataStream.getVisitPatients(url).subscribe(results => {
        this.dataVisit = results;
        this.loadVisit = true;
      })
    }
    this.loadVisit = true;  
  }

  onPrescription() {
    this.loadVisit = false;
  }

  openDialog(id: number) {
    this.dialog.open(PrescriptionDialogComponent, {
      data: {id: id},
      width: '80%',
      height: '90%'
    });
  }

}

/*@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./patient.component.css']
})
export class PrescriptionComponent {
  constructor(public dialogRef: MatDialogRef<PrescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private dataStream: DataStreamService
    ) {}

  dataPrescription: Prescription[] = [];
  loadPrescription: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'payment', 'date'];

  ngOnInit(): void {
    const url = "http://localhost:5000/prescriptions/" + this.data.id;

    if(this.dataPrescription.length === 0) {
      this.dataStream.getPrescription(url).subscribe(results => {
        this.dataPrescription = results;
        this.loadPrescription = true;
        window.scroll(0,0);
      })
    }
  }
}

*/