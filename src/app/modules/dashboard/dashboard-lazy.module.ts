import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container/container.component';
import { AdminModule } from '../admin';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ChartsModule, WavesModule } from 'angular-bootstrap-md'
import { BookingsChartComponent } from './components/bookings-chart/bookings-chart.component';
import { PatientChartComponent } from './components/patient-chart/patient-chart.component';
import { ProductChartComponent } from './components/product-chart/product-chart.component';
import { MaterialModule } from '../shared/material.module';
import { FilterTimeBookingDialogComponent } from './components/filter-time-booking-dialog/filter-time-booking-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterTimeProductPatientDialogComponent } from './components/filter-time-product-patient-dialog/filter-time-product-patient-dialog.component';

@NgModule({
  declarations: [
    ContainerComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    BookingsChartComponent,
    PatientChartComponent,
    ProductChartComponent,
    FilterTimeBookingDialogComponent,
    FilterTimeProductPatientDialogComponent,
  ],
  imports: [
    CommonModule,
    AdminModule,
    ChartsModule,
    WavesModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AdminDashboardComponent,
    UserDashboardComponent,
    BookingsChartComponent,
    PatientChartComponent,
    ProductChartComponent,
    FilterTimeBookingDialogComponent,
    FilterTimeProductPatientDialogComponent,
  ]
})
export class DashboardLazyModule { }
