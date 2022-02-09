import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
    AuthModule,
    CoreModule,
    EmployeeModule,
    QuanLyDanhMucHangDTQGModule,
    QuanLyNguoiDungModule
} from './modules';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ResetPasswordModule } from './modules/reset-password';
import { UserSettingsModule } from './modules/user-settings/user-settings.module';
import { AdminModule } from './modules/admin';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ChartsModule } from 'ng2-charts';
import { DashboardModule } from './modules/dashboard/dashboard.module';
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        NgxSpinnerModule,
        AuthModule.forRoot(environment.api),
        NgxsModule.forRoot([], { developmentMode: !environment.production }),
        ResetPasswordModule.forRoot(environment.api),
        EmployeeModule.forRoot(environment.api),
        UserSettingsModule.forRoot(environment.api),
        AdminModule.forRoot(environment.api),
        DashboardModule.forRoot(environment.api),
        QuanLyNguoiDungModule.forRoot(environment.api),
        QuanLyDanhMucHangDTQGModule.forRoot(environment.api),
        HttpClientModule,
        BrowserAnimationsModule,
        MDBBootstrapModule.forRoot(),
        ChartsModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
