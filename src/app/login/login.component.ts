import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private Auth: AuthService, private router: Router) {}

  public loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  ngOnInit():  void {
  }

  onLogin() {
    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;

    this.Auth.getUserDetails(email, password).subscribe((data: any) => {
      if(data.id){
        localStorage.setItem('role', data.role);
        localStorage.setItem('name', data.name);
        localStorage.setItem('surname', data.surname);
        this.router.navigate([data.role]);
        this.Auth.setIsLoggedIn(true);
      }
      else{
       window.alert(data.message);
      }
    });
  }

 onHome() {
   this.router.navigate(['/']);
 }


}
