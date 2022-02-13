import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {

  loadEditPatient: boolean = false;
  loadDeletePatient: boolean = false;
  loadEditDoctor: boolean = false;
  loadDeleteDoctor: boolean = false;
  loadConfirmVisit: boolean = false;


  editPatientForm: any;
  editDoctorForm: any;
  confirmVisitForm: any;


  constructor(private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) { }

  ngOnInit(): void {

    switch(this.data.type) {
      case "confirmVisit": {

        this.confirmVisitForm = new FormGroup({
          room: new FormControl('', Validators.required)
        });

        this.loadConfirmVisit = true;
        break;
      }
      case "deleteVisit": {
        //this.loadEditVisit = true;
        break;
      }
      case "editPatient": {

        this.editPatientForm = new FormGroup({
          name: new FormControl(this.data.patient.name, Validators.required),
          surname: new FormControl(this.data.patient.surname, Validators.required),
          phone: new FormControl(this.data.patient.phone, Validators.required),
          pesel: new FormControl(this.data.patient.pesel, Validators.required),
          age: new FormControl(this.data.patient.age, Validators.required),
          gender: new FormControl(this.data.patient.gender, Validators.required)
        });

        this.loadEditPatient = true;
        break;
      }
      case "deletePatient": {
        this.loadDeletePatient = true;
        break;
      }
      case "editDoctor": {   
        this.editDoctorForm = new FormGroup({
          name: new FormControl(this.data.doctor.name, Validators.required),
          surname: new FormControl(this.data.doctor.surname, Validators.required),
          phone: new FormControl(this.data.doctor.phone, Validators.required),
          specialty: new FormControl(this.data.doctor.specialty, Validators.required),
          age: new FormControl(this.data.doctor.age, Validators.required),
          gender: new FormControl(this.data.doctor.gender, Validators.required)
        });
        
        this.loadEditDoctor = true;
        break;
      }
      case "deleteDoctor": {
        this.loadDeleteDoctor = true;
        break;
      }
    }

  }

  onEditPatientSubmit() {
    if(this.editPatientForm.status !== "INVALID"){
      const name = this.editPatientForm.controls.name.value;
      const surname = this.editPatientForm.controls.surname.value;
      const phone = this.editPatientForm.controls.phone.value;
      const pesel = this.editPatientForm.controls.pesel.value;
      const age = this.editPatientForm.controls.age.value;
      const gender = this.editPatientForm.controls.gender.value;
      const id = this.data.patient.id;

      this.http.put('http://localhost:5000/patients', {
        id, name, surname, phone, pesel, age, gender
      }).subscribe((data: any) => {
        if(data.message === "success"){
          this.openSnackBar("Pacjent edytowany !", 3);
          window.location.reload();
        }
      })
      
    } else {
      this.openSnackBar("Wypełnij wszytkie pola !", 3);
    }

  }

  onDeletePatientSubmit() {
    const id:number = this.data.id;
    const url = 'http://localhost:5000/patients/' + id;

    this.http.delete(url, {
      }).subscribe((data: any) => {
        if(data.status === "0"){
          this.openSnackBar("Pacjent usuniety !", 3);
          window.location.reload();
        } else {
          this.openSnackBar(data.message, 3);
        }
      })
  }

  onEditDoctorSubmit() {
    if(this.editDoctorForm.status !== "INVALID"){
      const name = this.editDoctorForm.controls.name.value;
      const surname = this.editDoctorForm.controls.surname.value;
      const phone = this.editDoctorForm.controls.phone.value;
      const specialty = this.editDoctorForm.controls.specialty.value;
      const age = this.editDoctorForm.controls.age.value;
      const gender = this.editDoctorForm.controls.gender.value;
      const id = this.data.doctor.id;

      this.http.put('http://localhost:5000/doctors', {
        id, name, surname, phone, specialty, age, gender
      }).subscribe((data: any) => {
        if(data.message === "success"){
          this.openSnackBar("Lekarz edytowany !", 3);
          window.location.reload();
        }
      })
      
    } else {
      this.openSnackBar("Wypełnij wszytkie pola !", 3);
    }

  }

  onDeleteDoctorSubmit() {
    const id:number = this.data.id;
    const url = 'http://localhost:5000/doctors/' + id;

    this.http.delete(url, {
      }).subscribe((data: any) => {
        if(data.status === "0"){
          this.openSnackBar("Lekarz usuniety !", 3);
          window.location.reload();
        } else {
          this.openSnackBar(data.message, 3);
        }
      })
  }

  onConfirmVisitSubmit() {
    const id: number = this.data.id;
    const url = 'http://localhost:5000/visits';

    if(this.confirmVisitForm.status !== "INVALID"){
      const room = this.confirmVisitForm.controls.room.value;

      this.http.put(url, {
          id, room
      }).subscribe((data: any) => {
          if(data.status === 1){
            this.openSnackBar("Wizyta potwierdzona !", 3);
            window.location.reload();
          } else {
            this.openSnackBar(data.message, 3);
          }
      })
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
