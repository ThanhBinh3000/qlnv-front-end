import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThongtinDauthauComponent } from './thongtin-dauthau/thongtin-dauthau.component';
import { TrienkhaiLuachonNhathauComponent } from './trienkhai-luachon-nhathau.component';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { BienBanBanDauGiaComponent } from './bien-ban-ban-dau-gia/bien-ban-ban-dau-gia.component';
import { ThemmoiBienBanBanDauGiaComponent } from './bien-ban-ban-dau-gia/themmoi-bien-ban-ban-dau-gia/themmoi-bien-ban-ban-dau-gia.component';
import { QuyetDinhPheDuyetKQBanDauGiaComponent } from './quyet-dinh-phe-duyet-kq-ban-dau-gia/quyet-dinh-phe-duyet-kq-ban-dau-gia.component';
import { ThemmoiQuyetDinhPheDuyetKQBanDauGiaComponent } from './quyet-dinh-phe-duyet-kq-ban-dau-gia/themmoi-quyet-dinh-phe-duyet-kq-ban-dau-gia/themmoi-quyet-dinh-phe-duyet-kq-ban-dau-gia.component';
import { TheoPhuongThucDauThauComponent } from './theo-phuong-thuc-dau-thau/theo-phuong-thuc-dau-thau.component';
import { ChiTietThongBaoDauGiaKhongThanhComponent } from './thong-bao-dau-gia-khong-thanh/chi-tiet-thong-bao-dau-gia-khong-thanh/chi-tiet-thong-bao-dau-gia-khong-thanh.component';
import { ThongBaoDauGiaKhongThanhComponent } from './thong-bao-dau-gia-khong-thanh/thong-bao-dau-gia-khong-thanh.component';
import { ChiTietThongBaoDauGiaTaiSanComponent } from './thong-bao-dau-gia-tai-san/chi-tiet-thong-bao-dau-gia-tai-san/chi-tiet-thong-bao-dau-gia-tai-san.component';
import { ThongBaoDauGiaTaiSanComponent } from './thong-bao-dau-gia-tai-san/thong-bao-dau-gia-tai-san.component';
import { ThemmoiThongtinDauthauComponent } from './thongtin-dauthau/themmoi-thongtin-dauthau/themmoi-thongtin-dauthau.component';


@NgModule({
  declarations: [
    TrienkhaiLuachonNhathauComponent,
    TheoPhuongThucDauThauComponent,
    ThongtinDauthauComponent,
    ThemmoiThongtinDauthauComponent,
    ThongBaoDauGiaTaiSanComponent,
    ChiTietThongBaoDauGiaTaiSanComponent,
    ThongBaoDauGiaKhongThanhComponent,
    ChiTietThongBaoDauGiaKhongThanhComponent,
    BienBanBanDauGiaComponent,
    ThemmoiBienBanBanDauGiaComponent,
    QuyetDinhPheDuyetKQBanDauGiaComponent,
    ThemmoiQuyetDinhPheDuyetKQBanDauGiaComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
  ],
    exports: [
        TrienkhaiLuachonNhathauComponent,
        TheoPhuongThucDauThauComponent,
        ThongtinDauthauComponent,
        ThongBaoDauGiaTaiSanComponent,
        ThongBaoDauGiaKhongThanhComponent,
        ThemmoiThongtinDauthauComponent,
    ]
})
export class TrienkhaiLuachonNhathauModule { }
