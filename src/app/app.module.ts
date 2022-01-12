import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { LoginGuard } from './services/login.guard';
import { PatientComponent } from './patient/patient.component';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './home/home.component';
import { DoctorComponent } from './doctor/doctor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register/register.component';

import { FlexLayoutModule } from '@angular/flex-layout'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table' 
import { MatDialogModule } from '@angular/material/dialog';
import { PrescriptionDialogComponent } from './prescription-dialog/prescription-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import  {MatSelectModule } from '@angular/material/select';


import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { SnackBarComponent } from './snack-bar/snack-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PatientComponent,
    HomeComponent,
    DoctorComponent,
    RegisterComponent,
    PrescriptionDialogComponent,
    SnackBarComponent
  ],
  imports: [
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTableModule,
    MatExpansionModule,
    MatRadioModule,
    MatIconModule,
    ReactiveFormsModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
        canActivate: [LoginGuard]
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [LoginGuard]
      },
      {
        path: 'patient',
        component: PatientComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'doctor',
        component: DoctorComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        component: PageNotFoundComponent
      }
    ]),
    BrowserAnimationsModule
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
