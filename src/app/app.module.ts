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
    DanhMucDonViTinhModule,
    QuanLyNguoiDungModule,
    DanhMucHangDtqgModule,
    TrangChuModule
} from './modules';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdminModule } from './modules/admin';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
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
        DanhMucDonViTinhModule.forRoot(environment.api),
        TrangChuModule.forRoot(environment.api),
        DanhMucHangDtqgModule.forRoot(environment.api),
        HttpClientModule,
        BrowserAnimationsModule,
        MDBBootstrapModule.forRoot(),
        ToastrModule.forRoot(),
        ChartsModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
