import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataStreamService } from '../services/data-stream.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private Auth: AuthService, private router: Router, private dataStream: DataStreamService, private _snackBar: MatSnackBar) {}

  public loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,      
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    password: new FormControl('', Validators.required)
  })

  ngOnInit():  void {
  }

  onLogin() {
    if(this.loginForm.status !== "INVALID"){
      const email = this.loginForm.controls.email.value;
      const password = this.loginForm.controls.password.value;

      this.Auth.getUserDetails(email, password).
      subscribe((data: any) => {
        if(data.id) {
          localStorage.setItem('role', data.role);
          localStorage.setItem('name', data.name);
          localStorage.setItem('surname', data.surname);
          localStorage.setItem('id', data.id);
          this.router.navigate([data.role]);
          this.Auth.setIsLoggedIn(true);
        }
        else{
          this.openSnackBar(data.message, 2);
        }
      });
    } else {
      this.openSnackBar("Wypełnij poprawnie wszytkie pola !", 3);
    }

  }

  onHome() {
    this.router.navigate(['/']);
  }

  onRegister() {
    this.router.navigate(['register']);
  }

  openSnackBar(message: string, duration: number) {
    this._snackBar.open(message, "", {
      verticalPosition: 'top',
      duration: duration * 1000,
    });
  }

}
