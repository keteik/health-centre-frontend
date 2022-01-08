import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  loadNewVisitForm: boolean = false;


  dataVisit: Visit[] = [];
  dataPatient: Patient[] = [];
  patients: Patient[] = [];

  displayedColumnsVisit: string[] = ['id', 'patient', 'room', 'date', 'prescription'];
  displayedColumnsPatient: string[] = ['id', 'patient', 'age', 'gender'];
  options: string[] = [];
  filteredOptions: Observable<string[]> | undefined;

  myControl = new FormControl();
  public newVisitForm = new FormGroup({
    user: new FormControl('', Validators.required),
    room: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
  });


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
    this.loadNewVisitForm = false;
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
    const url = "http://localhost:5000/patients/doctor/" + localStorage.getItem('id');
    
    if(this.dataPatient.length === 0) {
      this.dataStream.getPatients(url).subscribe(results => {
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

  onNewVisit() {
    this.loadVisit = false;
    this.loadPatient = false;
    this.loadNewVisitForm = true;
    
    const url = "http://localhost:5000/patients";

    if(this.patients.length === 0) {
      this.dataStream.getPatients(url).subscribe(results => {
        this.patients = results;
        for(let i = 0; i < this.patients.length; i++){
          this.options.push(this.patients[i].name + " " + this.patients[i].surname);
        }

        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
        this.loadNewVisitForm = true;
      })
    }
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
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
      var patientId: number = 0;
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
            window.alert("Wizyta została dodana");
            window.location.reload();
          } else {
            window.alert(data.message);
          }
        });
    } else {
      window.alert("Fill all fields");
    }
    
  }

}
