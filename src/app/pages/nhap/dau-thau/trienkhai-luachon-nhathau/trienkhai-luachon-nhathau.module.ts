import { TrienkhaiLuachonNhathauComponent } from './trienkhai-luachon-nhathau.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { QuyetdinhKetquaLcntComponent } from './quyetdinh-ketqua-lcnt/quyetdinh-ketqua-lcnt.component';
import { ThongtinDauthauComponent } from './thongtin-dauthau/thongtin-dauthau.component';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DauThauModule } from 'src/app/pages/nhap/dau-thau/dau-thau.module';
import { ThemmoiQuyetdinhKetquaLcntComponent } from './quyetdinh-ketqua-lcnt/themmoi-quyetdinh-ketqua-lcnt/themmoi-quyetdinh-ketqua-lcnt.component';
import { TheoPhuongThucDauThauComponent } from './theo-phuong-thuc-dau-thau/theo-phuong-thuc-dau-thau.component';
import { ThemmoiThongtinDauthauComponent } from './thongtin-dauthau/themmoi-thongtin-dauthau/themmoi-thongtin-dauthau.component';
import { KehoachLuachonNhathauModule } from '../kehoach-luachon-nhathau/kehoach-luachon-nhathau.module';
import { QdPdHsMoiThauComponent } from './qd-pd-hs-moi-thau/qd-pd-hs-moi-thau.component';
import { ThemMoiQdPdHsMtVtComponent } from './qd-pd-hs-moi-thau/them-moi-qd-pd-hs-mt-vt/them-moi-qd-pd-hs-mt-vt.component';
import { ThemmoiThongtinDauthauVtComponent } from './thongtin-dauthau/themmoi-thongtin-dauthau-vt/themmoi-thongtin-dauthau-vt.component';


@NgModule({
  declarations: [
    TrienkhaiLuachonNhathauComponent,
    QuyetdinhKetquaLcntComponent,
    ThemmoiQuyetdinhKetquaLcntComponent,
    TheoPhuongThucDauThauComponent,
    ThongtinDauthauComponent,
    ThemmoiThongtinDauthauComponent,
    QdPdHsMoiThauComponent,
    ThemMoiQdPdHsMtVtComponent,
    ThemmoiThongtinDauthauVtComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    KehoachLuachonNhathauModule
  ],
  exports: [
    TrienkhaiLuachonNhathauComponent,
    QuyetdinhKetquaLcntComponent,
    TheoPhuongThucDauThauComponent,
    ThongtinDauthauComponent,
    ThemmoiQuyetdinhKetquaLcntComponent
  ]
})
export class TrienkhaiLuachonNhathauModule { }
