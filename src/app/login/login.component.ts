import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private Auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  loginUser(event: any){
    event.preventDefault();
    const target = event.target;
    const email = target.querySelector('#email').value;
    const password = target.querySelector('#password').value;

    this.Auth.getUserDetails(email, password).subscribe((data: any) => {
      if(data.id){
        console.log(data);
        this.router.navigate(['patient']);
        this.Auth.setisLoggedIn(true);
      }
      else{
       window.alert(data);
      }
    });
  }

}
