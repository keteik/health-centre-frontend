import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    email: new FormControl('', [ 
      Validators.required, 
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(6)]),
    phone: new FormControl('', Validators.required),
    pesel: new FormControl('', [
      Validators.min(11111111111),
      Validators.max(99999999999)
    ]),    age: new FormControl('', [ 
      Validators.required, 
      Validators.min(1), 
      Validators.max(130)
    ]),
    gender: new FormControl('', Validators.required),
  });

  constructor(private router: Router, private http: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onRegister() {
    if(this.registerForm.status !== "INVALID"){
      const name = this.registerForm.controls.name.value;
      const surname = this.registerForm.controls.surname.value;
      const email = this.registerForm.controls.email.value;
      const password = this.registerForm.controls.password.value;
      const role = "patient";
      const phone = this.registerForm.controls.phone.value;
      const pesel = this.registerForm.controls.pesel.value;
      const age = this.registerForm.controls.age.value;
      const gender = this.registerForm.controls.gender.value;
 
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
            this.router.navigate(['login']);
          } else {
            window.alert(data.message);
          }
        });
    } else {
      this.openSnackBar("Wype??nij wszystkie pola", 2);
    }
}

    onHome() {
    this.router.navigate(['/']);
  }

  openSnackBar(message: string, duration: number) {
    this._snackBar.open(message, "", {
      verticalPosition: 'top',
      duration: duration * 1000,
    });
  }
}
