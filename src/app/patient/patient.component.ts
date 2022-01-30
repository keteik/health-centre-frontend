import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStreamService } from '../services/data-stream.service';
import { MatDialog } from '@angular/material/dialog';
import { PrescriptionDialogComponent } from '../prescription-dialog/prescription-dialog.component';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

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

type Specialty = {
  specialty: string;
}

type Doctor = {
  id: number;
  name: string;
  surname: string;
  phone: number;
  specialty: string;
  age: number;
  gender: string;
  userId: number;
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
  loadNewVisit = false;
  isSpecialitySelected = false;
  currentVisit: number = 0;

  selectedOpt: string = " ";

  dataDoctor: Doctor[] = [];
  datasSpecialty: Specialty[] = [];
  dataVisit: Visit[] = [];

  filteredOptionsSpecialty: Observable<string[]> | undefined;
  filteredOptionsDoctor: Observable<string[]> | undefined;
  
  optionsSpecialty: string[] = [];
  optionsDoctor: string[] = [];

  displayedColumns: string[] = ['id', 'date', 'room', 'doctor', 'prescription'];

  newVisitControl = new FormControl();
  public newVisitForm = new FormGroup({
    specialty: new FormControl('', Validators.required),
    user: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
  });

  constructor(private router: Router, private http: HttpClient, private dataStream: DataStreamService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

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
    this.loadNewVisit = false;
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
      height: '70%'
    });
  }

  onNewVisit() {
    this.loadVisit = false;
    
    const url = "http://localhost:5000/doctors/specialties";

    if(this.dataDoctor.length === 0) {
      this.dataStream.getDoctors(url).subscribe(results => {
        this.datasSpecialty = results;
        this.optionsSpecialty.length = 0;
        for(let i = 0; i < this.datasSpecialty.length; i++){
          this.optionsSpecialty.push(this.datasSpecialty[i].specialty);
        }

        this.filteredOptionsSpecialty = this.newVisitControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterSpecialty(value))
        );
        this.loadNewVisit = true;
      })
    }
    this.loadNewVisit = true;
  }

  private _filterSpecialty(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionsSpecialty.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterSDoctor(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionsDoctor.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSpecialitySelect(){
    const specialty = this.newVisitForm.controls.specialty.value;

    const url = "http://localhost:5000/doctors/by-specialty";


    this.dataStream.getDoctorsBySpecialty(url, specialty).subscribe(results => {
      this.dataDoctor = results;
      this.optionsDoctor.length = 0;
      for(let i = 0; i < this.dataDoctor.length; i++){
        this.optionsDoctor.push(this.dataDoctor[i].name + " " + this.dataDoctor[i].surname);
      }

      this.filteredOptionsDoctor = this.newVisitControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterSDoctor(value))
      );
      this.loadNewVisit = true;

      this.isSpecialitySelected = true;
    })
  }

  onSubmitNewVisit() {
    if(this.newVisitForm.status !== "INVALID"){
      const userName = this.newVisitForm.controls.user.value;
      const date = this.newVisitForm.controls.date.value;

      var doctorId: number = 0;
      var status = 0;
      const userId = localStorage.getItem('id');

      for(let i = 0; i < this.dataDoctor.length; i++){
        if(this.dataDoctor[i].name + " " + this.dataDoctor[i].surname === userName){
          doctorId = this.dataDoctor[i].id;
        }
      }

      this.http.post('http://localhost:5000/visits', {
        date,
        doctorId,
        userId,
        status
      }).subscribe((data: any) => {
          if(data.id) {
             
            window.location.reload();
            this.openSnackBar("Wizyta została ustalona !", 2);
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

}