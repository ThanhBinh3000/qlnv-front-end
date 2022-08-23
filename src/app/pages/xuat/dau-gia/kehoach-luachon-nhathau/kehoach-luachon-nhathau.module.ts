import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { CucComponent } from './cuc/cuc.component';
import { DanhsachKehoachLcntComponent } from './cuc/danhsach-kehoach-lcnt/danhsach-kehoach-lcnt.component';
import { ThemmoiKehoachLcntComponent } from './cuc/danhsach-kehoach-lcnt/themmoi-kehoach-lcnt/themmoi-kehoach-lcnt.component';
import { MainCucComponent } from './cuc/main-cuc/main-cuc.component';
import { QdPheDuyetKhBanDauGiaComponent } from './cuc/qd-phe-duyet-kh-ban-dau-gia/qd-phe-duyet-kh-ban-dau-gia.component';
import { ThemMoiQdPheDuyetKhBanDauGiaComponent } from './cuc/qd-phe-duyet-kh-ban-dau-gia/them-moi-qd-phe-duyet-kh-ban-dau-gia/them-moi-qd-phe-duyet-kh-ban-dau-gia.component';
import { KeHoachLuachonNhathauComponent } from './kehoach-luachon-nhathau.component';
import { MainTongCucComponent } from './tong-cuc/main-tong-cuc/main-tong-cuc.component';
import { QuyetDinhPheDuyetKhBanDauGiaComponent } from './tong-cuc/quyet-dinh-phe-duyet-kh-ban-dau-gia/quyet-dinh-phe-duyet-kh-ban-dau-gia.component';
import { ThemMoiQuyetDinhPheDuyetKhBanDauGiaComponent } from './tong-cuc/quyet-dinh-phe-duyet-kh-ban-dau-gia/them-moi-quyet-dinh-phe-duyet-kh-ban-dau-gia/them-moi-quyet-dinh-phe-duyet-kh-ban-dau-gia.component';
import { TongCucComponent } from './tong-cuc/tong-cuc.component';
import { ThemMoiTongHopDeXuatKhBanDauGiaComponent } from './tong-cuc/tong-hop-de-xuat-kh-ban-dau-gia/them-moi-tong-hop-de-xuat-kh-ban-dau-gia/them-moi-tong-hop-de-xuat-kh-ban-dau-gia.component';
import { TongHopDeXuatKhBanDauGiaComponent } from './tong-cuc/tong-hop-de-xuat-kh-ban-dau-gia/tong-hop-de-xuat-kh-ban-dau-gia.component';


@NgModule({
  declarations: [
    KeHoachLuachonNhathauComponent,
    CucComponent,
    DanhsachKehoachLcntComponent,
    ThemmoiKehoachLcntComponent,
    MainCucComponent,
    TongCucComponent,
    MainTongCucComponent,
    QdPheDuyetKhBanDauGiaComponent,
    ThemMoiQdPheDuyetKhBanDauGiaComponent,
    QuyetDinhPheDuyetKhBanDauGiaComponent,
    ThemMoiQuyetDinhPheDuyetKhBanDauGiaComponent,
    TongHopDeXuatKhBanDauGiaComponent,
    ThemMoiTongHopDeXuatKhBanDauGiaComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
  ],
  exports: [
    KeHoachLuachonNhathauComponent,
    CucComponent,
    DanhsachKehoachLcntComponent,
    MainCucComponent,
    TongCucComponent,
    MainTongCucComponent,
  ]
})
export class KehoachLuachonNhathauModule { }
