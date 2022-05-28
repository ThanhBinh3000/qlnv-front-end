import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrienkhaiLuachonNhathauRoutingModule } from './trienkhai-luachon-nhathau-routing.module';
import { ThongtinDauthauComponent } from './thongtin-dauthau/thongtin-dauthau.component';
import { QuyetdinhKetquaLcntComponent } from './quyetdinh-ketqua-lcnt/quyetdinh-ketqua-lcnt.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { ThemmoiThongtinDauthauComponent } from './thongtin-dauthau/themmoi-thongtin-dauthau/themmoi-thongtin-dauthau.component';
import { ThemmoiQuyetdinhKetquaLcntComponent } from './quyetdinh-ketqua-lcnt/themmoi-quyetdinh-ketqua-lcnt/themmoi-quyetdinh-ketqua-lcnt.component';


@NgModule({
  declarations: [
    ThemmoiThongtinDauthauComponent,
    ThemmoiQuyetdinhKetquaLcntComponent
  ],
  imports: [
    CommonModule,
    TrienkhaiLuachonNhathauRoutingModule,
    ComponentsModule,
    MainModule
  ]
})
export class TrienkhaiLuachonNhathauModule { }
