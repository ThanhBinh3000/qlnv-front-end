import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
    AuthModule,
    CoreModule,
    DanhMucDonViModule,
    QuanLyDanhMucHangDTQGModule,
    QuanLyNguoiDungModule
} from './modules';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdminModule } from './modules/admin';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ChartsModule } from 'ng2-charts';
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        NgxSpinnerModule,
        AuthModule.forRoot(environment.api),
        NgxsModule.forRoot([], { developmentMode: !environment.production }),
        AdminModule.forRoot(environment.api),
        QuanLyNguoiDungModule.forRoot(environment.api),
        DanhMucDonViModule.forRoot(environment.api),
        QuanLyDanhMucHangDTQGModule.forRoot(environment.api),
        HttpClientModule,
        BrowserAnimationsModule,
        MDBBootstrapModule.forRoot(),
        ChartsModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
