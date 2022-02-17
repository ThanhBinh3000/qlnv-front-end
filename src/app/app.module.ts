import { NzButtonModule } from 'ng-zorro-antd/button';
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
    TrangChuModule,
    DanhMucCongCuDungCuModule,
    DanhMucDonViCuuTroModule,
    DanhMucKeLotModule,
    DanhMucLoaiHinhKhoTangModule,
	DanhMucLoaiHinhNHapXuatModule,
    DanhMucKyBaoQuanModule,
	DanhMucQuocGiaSanXuatModule,
    DanhMucPhuongThucDauThauModule,
} from './modules';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdminModule } from './modules/admin';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { DanhMucThuKhoModule } from './modules/danh-muc-thu-kho';
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
        DanhMucCongCuDungCuModule.forRoot(environment.api),
        DanhMucDonViCuuTroModule.forRoot(environment.api),
        DanhMucKeLotModule.forRoot(environment.api),
        DanhMucLoaiHinhKhoTangModule.forRoot(environment.api),
        DanhMucLoaiHinhNHapXuatModule.forRoot(environment.api),
        DanhMucKyBaoQuanModule.forRoot(environment.api),
        DanhMucQuocGiaSanXuatModule.forRoot(environment.api),
        DanhMucPhuongThucDauThauModule.forRoot(environment.api),
        DanhMucThuKhoModule.forRoot(environment.api),
        HttpClientModule,
        BrowserAnimationsModule,
        MDBBootstrapModule.forRoot(),
        ToastrModule.forRoot(),
        ChartsModule,
        NzButtonModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
