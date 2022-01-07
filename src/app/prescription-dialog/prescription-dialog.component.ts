import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../patient/patient.component';
import { DataStreamService } from '../services/data-stream.service';

type Prescription = {
  id: number;
  name: string;
  payment: number;
  create_time: String;
}

@Component({
  selector: 'app-prescription-dialog',
  templateUrl: './prescription-dialog.component.html',
  styleUrls: ['./prescription-dialog.component.css']
})
export class PrescriptionDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<PrescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private dataStream: DataStreamService
    ) {}

  dataPrescription: Prescription[] = [];
  loadPrescription: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'payment', 'date'];

  ngOnInit(): void {
    const url = "http://localhost:5000/prescriptions/" + this.data.id;

    if(this.dataPrescription.length === 0) {
      this.dataStream.getPrescription(url).subscribe(results => {
        this.dataPrescription = results;
        this.loadPrescription = true;
        window.scroll(0,0);
      })
    }
  }
}
