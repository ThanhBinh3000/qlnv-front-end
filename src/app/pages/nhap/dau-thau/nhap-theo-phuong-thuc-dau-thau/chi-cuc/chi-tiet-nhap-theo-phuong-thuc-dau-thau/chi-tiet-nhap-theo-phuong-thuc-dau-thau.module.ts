import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { ChiTietNhapTheoPhuongThucDauThauRoutingModule } from './chi-tiet-nhap-theo-phuong-thuc-dau-thau-routing.module';
import { ChiTietNhapTheoPhuongThucDauThauComponent } from './chi-tiet-nhap-theo-phuong-thuc-dau-thau.component';
import { LapBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan/lap-bien-ban-nghiem-thu-bao-quan.component';



@NgModule({
    declarations: [
        ChiTietNhapTheoPhuongThucDauThauComponent,
        LapBienBanNghiemThuBaoQuanComponent,
    ],
    imports: [
        CommonModule,
        ChiTietNhapTheoPhuongThucDauThauRoutingModule,
        ComponentsModule,
        MainModule
    ]
})
export class ChiTietNhapTheoPhuongThucDauThauModule { }
