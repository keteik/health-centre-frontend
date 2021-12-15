import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  public userName: any = localStorage.getItem('name') + " " + localStorage.getItem('surname');


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onLogOut() {
    localStorage.clear();
    window.location.reload();
  }

}
