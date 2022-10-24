import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { DanhsachKehoachLcntComponent } from './danhsach-kehoach-lcnt/danhsach-kehoach-lcnt.component';
import { ThemmoiKehoachLcntComponent } from './danhsach-kehoach-lcnt/themmoi-kehoach-lcnt/themmoi-kehoach-lcnt.component';
import { KeHoachLuachonNhathauComponent } from './kehoach-luachon-nhathau.component';
import { QuyetdinhPheduyetKhlcntComponent } from './quyetdinh-pheduyet-khlcnt/quyetdinh-pheduyet-khlcnt.component';
import { ThemmoiQuyetdinhKhlcntComponent } from './quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt/themmoi-quyetdinh-khlcnt.component';
import { ThemmoiKehoachLcntTongCucComponent } from './danhsach-kehoach-lcnt/themmoi-kehoach-lcnt-tong-cuc/themmoi-kehoach-lcnt-tong-cuc.component';
import { ThemmoiTonghopKhlcntComponent } from './tong-hop-khlcnt/themmoi-tonghop-khlcnt/themmoi-tonghop-khlcnt.component';
import { TongHopKhlcntComponent } from './tong-hop-khlcnt/tong-hop-khlcnt.component';
import { ThongtinDexuatComponent } from './quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt/thongtin-dexuat/thongtin-dexuat.component';
import { MainKehoachLuachonNhathauComponent } from './main-kehoach-luachon-nhathau/main-kehoach-luachon-nhathau.component';


@NgModule({
  declarations: [
    KeHoachLuachonNhathauComponent,
    DanhsachKehoachLcntComponent,
    ThemmoiKehoachLcntComponent,
    QuyetdinhPheduyetKhlcntComponent,
    QuyetdinhPheduyetKhlcntComponent,
    ThemmoiQuyetdinhKhlcntComponent,
    ThemmoiKehoachLcntTongCucComponent,
    TongHopKhlcntComponent,
    ThemmoiTonghopKhlcntComponent,
    ThongtinDexuatComponent,
    MainKehoachLuachonNhathauComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
  ],
  exports: [
    KeHoachLuachonNhathauComponent,
    DanhsachKehoachLcntComponent,
    QuyetdinhPheduyetKhlcntComponent,
    QuyetdinhPheduyetKhlcntComponent,
    TongHopKhlcntComponent,
  ]
})
export class KehoachLuachonNhathauModule { }
