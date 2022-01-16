import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PrescriptionDialogComponent } from '../prescription-dialog/prescription-dialog.component';
import { DataStreamService } from '../services/data-stream.service';
import { VisitComponent } from '../visit/visit.component';

type Visit = {
  date: Date;
  id: number;
  visitNumber: number;
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
  loadNewVisitForm: boolean = false;
  loadUpcomingVisit: boolean = false;
  checked: boolean = false;

  dataVisit: Visit[] = [];
  dataUpcomingVisit: Visit[] = [];
  dataPatient: Patient[] = [];
  patients: Patient[] = [];

  displayedColumnsUpcomingVisit: string[] = ['id', 'patient', 'room', 'date', 'status'];
  displayedColumnsVisit: string[] = ['id', 'patient', 'room', 'date', 'prescription'];
  displayedColumnsPatient: string[] = ['id', 'patient', 'age', 'gender'];
  options: string[] = [];
  filteredOptions: Observable<string[]> | undefined;

  newVisitControl = new FormControl();
  public newVisitForm = new FormGroup({
    user: new FormControl('', Validators.required),
    room: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    name: new FormControl('', Validators.nullValidator),
    payment: new FormControl('', Validators.nullValidator),
  });


  constructor(private http: HttpClient, private dataStream: DataStreamService, public dialog: MatDialog, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('name') + " " + localStorage.getItem('surname');
  }

  onLogOut() {
    this.http.get('http://localhost:5000/logout', {
      }).subscribe((data: any) => { }

    );

    this.openSnackBar("Wylogowano", 1);

    localStorage.clear();
    window.location.reload();
  }

  onVisit() {
    this.loadPatient = false;
    this.loadNewVisitForm = false;
    this.loadUpcomingVisit = false;
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
    this.loadNewVisitForm = false;
    this.loadUpcomingVisit = false;
    const url = "http://localhost:5000/patients/doctor/" + localStorage.getItem('id');
    
    if(this.dataPatient.length === 0) {
      this.dataStream.getPatients(url).subscribe(results => {
        this.dataPatient = results;
 
        this.loadPatient = true;
      })
    }
    this.loadPatient = true;  
  }

  openPrescriptionDialog(id: number) {
    this.dialog.open(PrescriptionDialogComponent, {
      data: {id: id},
      width: '80%',
      height: '90%'
    });
  }

  onNewVisit() {
    this.loadVisit = false;
    this.loadPatient = false;
    this.loadUpcomingVisit = false;
    this.loadNewVisitForm = true;
    
    const url = "http://localhost:5000/patients";

    if(this.patients.length === 0) {
      this.dataStream.getPatients(url).subscribe(results => {
        this.patients = results;
        for(let i = 0; i < this.patients.length; i++){
          this.options.push(this.patients[i].name + " " + this.patients[i].surname);
        }

        this.filteredOptions = this.newVisitControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
        this.loadNewVisitForm = true;
      })
    }
    
    this.filteredOptions = this.newVisitControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.loadNewVisitForm = true;

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmitNewVisit() {
    if(this.newVisitForm.status !== "INVALID"){
      const userName = this.newVisitForm.controls.user.value;
      const room = this.newVisitForm.controls.room.value;
      const date = this.newVisitForm.controls.date.value;
      const name = this.newVisitForm.controls.name.value;
      const payment = this.newVisitForm.controls.payment.value;

      var patientId: number = 0;
      var visitId: number = 0;

      const userId = localStorage.getItem('id');

      for(let i = 0; i < this.patients.length; i++){
        if(this.patients[i].name + " " + this.patients[i].surname === userName){
          patientId = this.patients[i].id;
        }
      }

      this.http.post('http://localhost:5000/visits', {
        date,
        room,
        patientId,
        userId
      }).subscribe((data: any) => {
          if(data.id) {
            visitId = data.id;

            this.http.post('http://localhost:5000/prescriptions', {
              visitId,
              name,
              payment,
            }).subscribe((data: any) => {
                if(!data.id) {
                  this.openSnackBar(data.message, 3);
                }
              });
              
            window.location.reload();
            this.openSnackBar("Wizyta została dodana !", 2);
          } else {
            this.openSnackBar(data.message, 3);
          }
        });

        
    } else {
      this.openSnackBar("Wypełnij wszytkie pola !", 3);
    }
    
  }

  openSnackBar(message: string, duration: number) {
    this._snackBar.open(message, "", {
      verticalPosition: 'top',
      duration: duration * 1000,
    });
  }

  onCheckBox() {
    if(!this.checked){
      this.newVisitForm.controls['name'].setValidators(Validators.required);
      this.newVisitForm.controls['payment'].setValidators(Validators.required);
      this.checked = true;
    } else {
      this.newVisitForm.controls['name'].clearValidators();
      this.newVisitForm.controls['name'].updateValueAndValidity();

      this.newVisitForm.controls['payment'].clearValidators();
      this.newVisitForm.controls['payment'].updateValueAndValidity();

      this.checked = false;
    }
  }

  onUpcomingVisit() {
    this.loadPatient = false;
    this.loadNewVisitForm = false;
    this.loadVisit = false;
    const url = "http://localhost:5000/visits/upcoming/" + localStorage.getItem('id');
    
    if(this.dataUpcomingVisit.length === 0) {
      this.dataStream.getUpcomingVisits(url).subscribe(results => {
        this.dataUpcomingVisit = results;
        this.loadUpcomingVisit = true;
        console.log(this.dataUpcomingVisit);
      })
    }
    this.loadUpcomingVisit = true; 
  }

  openVisitDialog(id: number) {
    this.dialog.open(VisitComponent, {
      data: {id: id},
      width: '400px',
      height: '400px'
    });
  }

}