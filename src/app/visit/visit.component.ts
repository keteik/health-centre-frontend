import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {

  newVisitControl = new FormControl();
  public newVisitForm = new FormGroup({
    name: new FormControl('', Validators.nullValidator),
    payment: new FormControl('', Validators.nullValidator),
  });

  checked: boolean = false;

  constructor( private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<VisitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private http: HttpClient) { }

  ngOnInit(): void {
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

  onSubmitVisit() {
    if(this.newVisitForm.status !== "INVALID"){
      const name = this.newVisitForm.controls.name.value;
      const payment = this.newVisitForm.controls.payment.value;
      const visitId = this.data.id;
      const id = visitId;
      console.log(visitId);

      if(name !== '' && payment !== '') {
        this.http.post('http://localhost:5000/prescriptions', {
              visitId,
              name,
              payment,
        }).subscribe((data: any) => {
          if(!data.id) {
            this.openSnackBar(data.message, 3);
          }
        });
      }

      this.http.put('http://localhost:5000/visits', {
        id
      }).subscribe((data: any) => {
        if(data.message === "success"){
          this.openSnackBar("Wizyta zakończona", 3);
          window.location.reload();
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
function body<T>(arg0: string, body: any) {
  throw new Error('Function not implemented.');
}

