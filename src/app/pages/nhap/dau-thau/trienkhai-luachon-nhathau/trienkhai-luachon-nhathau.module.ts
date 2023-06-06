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


@NgModule({
  declarations: [
    TrienkhaiLuachonNhathauComponent,
    QuyetdinhKetquaLcntComponent,
    ThemmoiQuyetdinhKetquaLcntComponent,
    TheoPhuongThucDauThauComponent,
    ThongtinDauthauComponent,
    ThemmoiThongtinDauthauComponent,
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
