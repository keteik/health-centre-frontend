import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  public userName: any = localStorage.getItem('name') + " " + localStorage.getItem('surname');


  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
  }

  onLogOut() {
    /*this.http.get('http://localhost:5000/logout', {})
    .subscribe((data: any) => {
      console.log(data.message);
    })*/

    this.http.get('http://localhost:5000/logout', {
      }).subscribe((data: any) => {}
    );

    localStorage.clear();
    window.location.reload();
  }

}
