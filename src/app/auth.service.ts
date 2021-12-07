import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInStatus: boolean = false;

  constructor(private http: HttpClient) { }

  setisLoggedIn(value: boolean) {
    this.loggedInStatus = value;
  }

  get isLoggedIn() {
    return this.loggedInStatus;
  }

  getUserDetails(email: string, password: string) {
    return this.http.post('http://localhost:5000/login', {
      email,
      password
    });
  }
}
