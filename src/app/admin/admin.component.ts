import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith, throwIfEmpty } from 'rxjs/operators';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DataStreamService } from '../services/data-stream.service';

type Patient = {
  id: number;
  name: string;
  surname: string;
  phone: number;
  pesel: number;
  age: number;
  gender: string;
}

type Doctor = {
  id: number;
  name: string;
  surname: string;
  phone: number;
  pesel: number;
  age: number;
  gender: string;
  specialty: string
}

type Visit = {
  id: number;
  date: Date;
  dateAsString: string;
  room: number;
  status: number;
  doctor: {
    name: string;
    surname: string;
  },
  patient: {
    name: string;
    surname: string
  }
}

type Specialty = {
  specialty: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public userName: string = "";

  loadPatients: boolean = false;
  loadDoctors: boolean = false;
  loadVisits: boolean = false;
  loadNewPatientForm: boolean = false;
  loadNewDoctorForm: boolean = false;
  loadNewVisitForm: boolean = false;
  isSpecialitySelected: boolean = false;
  loadUnconfirmedVisits: boolean = false;


  loadPrescription: boolean = false;

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  doctorsBySpecialty: Doctor[] = [];
  visits: Visit[] = [];
  visitsUnconfirmed: Visit[] = [];
  specialties: Specialty[] = [];

  filteredOptionsSpecialty: Observable<string[]> | undefined;
  filteredOptionsDoctor: Observable<string[]> | undefined;
  filteredOptionsPatient: Observable<string[]> | undefined;

  optionsSpecialty: string[] = [];
  optionsDoctor: string[] = [];
  optionsPatient: string[] = [];

  public newPatientForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required, 
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    password: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    pesel: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
  });

  public newDoctorForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required, 
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    password: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    specialty: new FormControl('', Validators.required)
  });

  newSpecialtyControl = new FormControl();
  newPatientControl = new FormControl();
  newVisitControl = new FormControl();

  public newVisitForm = new FormGroup({
    specialty: new FormControl('', Validators.required),
    doctor: new FormControl('', Validators.required),
    patient: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    room: new FormControl('', Validators.required)
  });

  displayedColumnsPatients: string[] = ['id', 'patient', 'age', 'gender', 'pesel', 'phone', 'status'];
  displayedColumnsDoctors: string[] = ['id', 'doctor', 'specialty', 'age', 'gender', 'phone', 'status'];
  displayedColumnsVisits: string[] = ['id', 'patient', 'doctor', 'room', 'date'];
  displayedColumnsVisitsUnconfirmed: string[] = ['id', 'patient', 'doctor', 'room', 'date', 'status'];

  
  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private dataStream: DataStreamService, public dialog: MatDialog) { }

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

  openSnackBar(message: string, duration: number) {
    this._snackBar.open(message, "", {
      verticalPosition: 'top',
      duration: duration * 1000,
    });
  }

  onPatients() {
    this.loadNewPatientForm = false;
    this.loadNewDoctorForm = false;
    this.loadDoctors = false;
    this.loadNewVisitForm = false;
    this.loadVisits = false;
    this.loadUnconfirmedVisits = false;

    const url = "http://localhost:5000/patients";
    
    if(this.patients.length === 0) {
      this.dataStream.getPatients(url).subscribe(results => {
        this.patients = results;
 
        this.loadPatients = true;
      })
    }
    this.loadPatients = true;  

  }

  onNewPatient() {
    this.loadNewDoctorForm = false;
    this.loadDoctors = false;
    this.loadPatients = false;
    this.loadNewPatientForm = true;
    this.loadNewVisitForm = false;
    this.loadVisits = false;
    this.loadUnconfirmedVisits = false;
  }

  onNewPatientSubmit() {
    if(this.newPatientForm.status !== "INVALID"){
      const name = this.newPatientForm.controls.name.value;
      const surname = this.newPatientForm.controls.surname.value;
      const email = this.newPatientForm.controls.email.value;
      const password = this.newPatientForm.controls.password.value;
      const role = "patient";
      const phone = this.newPatientForm.controls.phone.value;
      const pesel = this.newPatientForm.controls.pesel.value;
      const age = this.newPatientForm.controls.age.value;
      const gender = this.newPatientForm.controls.gender.value;
 
      this.http.post('http://localhost:5000/register', {
        name,
        surname,
        email,
        password,
        role,
        phone,
        pesel,
        age,
        gender
      }).subscribe((data: any) => {
          if(data.id) {
            window.location.reload();
            this.openSnackBar("Pacjent został dodany !", 2);
          } else {
            this.openSnackBar(data.message, 2);
          }
        });
    } else {
      this.openSnackBar("Fill all fields", 2);
    }
  }

  onEditPatient(patient: Patient) {

    const data = {
      type: "editPatient",
      patient: patient
    }

    this.dialog.open(EditDialogComponent, {
      data: data,
      width: '400px',
      height: '750px'
    });
  }

  onDeletePatient(id: number) {
    const data = {
      type: "deletePatient",
      id: id
    }

    this.dialog.open(EditDialogComponent, {
      data: data,
      width: '290px',
      height: '190px'
    });
  }

  onNewDoctor() {
    this.loadNewPatientForm = false;
    this.loadPatients = false;
    this.loadDoctors = false;
    this.loadNewDoctorForm = true;
    this.loadNewVisitForm = false;
    this.loadVisits = false;
    this.loadUnconfirmedVisits = false;
  }

  onNewDoctorSubmit() {
    if(this.newDoctorForm.status !== "INVALID"){
      const name = this.newDoctorForm.controls.name.value;
      const surname = this.newDoctorForm.controls.surname.value;
      const email = this.newDoctorForm.controls.email.value;
      const password = this.newDoctorForm.controls.password.value;
      const role = "doctor";
      const phone = this.newDoctorForm.controls.phone.value;
      const age = this.newDoctorForm.controls.age.value;
      const gender = this.newDoctorForm.controls.gender.value;
      const specialty = this.newDoctorForm.controls.specialty.value;

 
      this.http.post('http://localhost:5000/users', {
        name,
        surname,
        email,
        password,
        role,
        phone,
        age,
        gender,
        specialty
      }).subscribe((data: any) => {
          if(data.id) {
            window.location.reload();
            this.openSnackBar("Lekarz został dodany !", 2);
          } else {
            this.openSnackBar(data.message, 2);
          }
        });
    } else {
      this.openSnackBar("Fill all fields", 2);
    }
  }

  onDoctors() {
    this.loadNewPatientForm = false;
    this.loadPatients = false;
    this.loadNewDoctorForm = false;
    this.loadNewVisitForm = false;
    this.loadVisits = false;
    this.loadUnconfirmedVisits = false;

    const url = "http://localhost:5000/doctors";
    
    if(this.doctors.length === 0) {
      this.dataStream.getDoctors(url).subscribe(results => {
        this.doctors = results;
        this.loadDoctors = true;
      })
    }
    this.loadDoctors = true;  
  }

  onEditDoctor(doctor: Doctor) {

    const data = {
      type: "editDoctor",
      doctor: doctor
    }

    this.dialog.open(EditDialogComponent, {
      data: data,
      width: '400px',
      height: '750px'
    });
  }

  onDeleteDoctor(id: number) {
    const data = {
      type: "deleteDoctor",
      id: id
    }

    this.dialog.open(EditDialogComponent, {
      data: data,
      width: '290px',
      height: '190px'
    });
  }

  onNewVisit() {
    const patientUrl = "http://localhost:5000/patients";

    this.loadPatients = false;
    this.loadNewPatientForm = false;
    this.loadDoctors = false;
    this.loadNewDoctorForm = false;
    this.loadVisits = false;
    this.loadUnconfirmedVisits = false;

    var patientLoaded: boolean = false;
    var specialtyLoaded: boolean = false;

    if(this.patients.length === 0) {
      this.dataStream.getPatients(patientUrl).subscribe(results => {
        this.patients = results;
        this.optionsPatient.length = 0;
        for(let i = 0; i < this.patients.length; i++){
          this.optionsPatient.push(this.patients[i].name + " " + this.patients[i].surname);
        }
        this.filteredOptionsPatient = this.newPatientControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterPatients(value))
        );
        patientLoaded = true;
        if(specialtyLoaded) {
          this.loadNewVisitForm = true;
        }
      })
    }

    const doctorUrl = "http://localhost:5000/doctors/specialties";

    if(this.doctorsBySpecialty.length === 0) {
      this.dataStream.getDoctors(doctorUrl).subscribe(results => {
        this.doctorsBySpecialty = results;
        this.optionsSpecialty.length = 0;
        for(let i = 0; i < this.doctorsBySpecialty.length; i++){
          this.optionsSpecialty.push(this.doctorsBySpecialty[i].specialty);
        }

        this.filteredOptionsSpecialty = this.newSpecialtyControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterSpecialties(value))
        );
        specialtyLoaded = true;
        if(patientLoaded) {
          this.loadNewVisitForm = true;
        }
      })
    }

    this.loadNewVisitForm = true;
  }

  private _filterPatients(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionsPatient.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterSpecialties(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionsSpecialty.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterDoctors(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionsDoctor.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSpecialitySelect() {
    const specialty = this.newVisitForm.controls.specialty.value;
    const url = "http://localhost:5000/doctors";

    this.dataStream.getDoctorsBySpecialty(url, specialty).subscribe(results => {
      this.doctorsBySpecialty = results;
      this.optionsDoctor.length = 0;
      for(let i = 0; i < this.doctorsBySpecialty.length; i++){
        this.optionsDoctor.push(this.doctorsBySpecialty[i].name + " " + this.doctorsBySpecialty[i].surname);
      }

      this.filteredOptionsDoctor = this.newVisitControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterDoctors(value))
      );

      this.isSpecialitySelected = true;
    })

  }

  onSubmitNewVisit() {
    if(this.newVisitForm.status !== "INVALID"){
      const patient = this.newVisitForm.controls.patient.value;
      const doctor = this.newVisitForm.controls.doctor.value;
      const date = this.newVisitForm.controls.date.value;
      const room = this.newVisitForm.controls.room.value;

      var doctorId: number = 0;
      var patientId: number = 0;
      var status = 1;

      for(let i = 0; i < this.doctorsBySpecialty.length; i++){
        if(this.doctorsBySpecialty[i].name + " " + this.doctorsBySpecialty[i].surname === doctor){
          doctorId = this.doctorsBySpecialty[i].id;
        }
      }
      for(let i = 0; i < this.patients.length; i++){
        if(this.patients[i].name + " " + this.patients[i].surname === patient){
          patientId = this.patients[i].id;
        }
      }

      this.http.post('http://localhost:5000/visits', {
        date,
        room,
        status,
        patientId,
        doctorId
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

  onVisits() {

    this.loadNewDoctorForm = false;
    this.loadDoctors = false;
    this.loadPatients = false;
    this.loadNewPatientForm = false;
    this.loadNewVisitForm = false;
    this.loadUnconfirmedVisits = false;
    
    const url = "http://localhost:5000/visits/completed";
    
    if(this.visits.length === 0) {
      this.dataStream.getCompletedVisits(url).subscribe(results => {
        this.visits = results;
        for(let i = 0; i < this.visits.length; i++) {
          this.visits[i].dateAsString = new Date(this.visits[i].date).toLocaleString()
        }
        this.loadVisits = true;
      })
    }
    this.loadVisits = true;
  }

  onUnconfirmedVisits() {

    this.loadNewDoctorForm = false;
    this.loadDoctors = false;
    this.loadPatients = false;
    this.loadNewPatientForm = false;
    this.loadNewVisitForm = false;
    this.loadVisits = false;
    
    const url = "http://localhost:5000/visits/unconfirmed";
    
    if(this.visitsUnconfirmed.length === 0) {
      this.dataStream.getUnconfirmedVisits(url).subscribe(results => {
        this.visitsUnconfirmed = results;
        for(let i = 0; i < this.visitsUnconfirmed.length; i++) {
          this.visitsUnconfirmed[i].dateAsString = new Date(this.visitsUnconfirmed[i].date).toLocaleString()
        }
        this.loadUnconfirmedVisits = true;
      })
    }
    this.loadUnconfirmedVisits = true;
  }

  onConfirmVisit(id: number) {
    const data = {
      type: "confirmVisit",
      id: id
    }
  
    this.dialog.open(EditDialogComponent, {
      data: data,
      width: '300px',
      height: '190px'
    });
  }
  

}


