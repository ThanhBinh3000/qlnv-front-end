import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { CucComponent } from './cuc/cuc.component';
import { DanhsachKehoachLcntComponent } from './cuc/danhsach-kehoach-lcnt/danhsach-kehoach-lcnt.component';
import { ThemmoiKehoachLcntComponent } from './cuc/danhsach-kehoach-lcnt/themmoi-kehoach-lcnt/themmoi-kehoach-lcnt.component';
import { MainCucComponent } from './cuc/main-cuc/main-cuc.component';
import { KeHoachLuachonNhathauComponent } from './kehoach-luachon-nhathau.component';
import { MainTongCucComponent } from './tong-cuc/main-tong-cuc/main-tong-cuc.component';
import { QuyetdinhPheduyetKhlcntComponent } from './tong-cuc/quyetdinh-pheduyet-khlcnt/quyetdinh-pheduyet-khlcnt.component';
import { ThemmoiQuyetdinhKhlcntComponent } from './tong-cuc/quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt/themmoi-quyetdinh-khlcnt.component';
import { ThemmoiKehoachLcntTongCucComponent } from './tong-cuc/themmoi-kehoach-lcnt-tong-cuc/themmoi-kehoach-lcnt-tong-cuc.component';
import { TongCucComponent } from './tong-cuc/tong-cuc.component';
import { ThemmoiTonghopKhlcntComponent } from './tong-cuc/tong-hop-khlcnt/themmoi-tonghop-khlcnt/themmoi-tonghop-khlcnt.component';
import { TongHopKhlcntComponent } from './tong-cuc/tong-hop-khlcnt/tong-hop-khlcnt.component';
import { ThongtinDexuatComponent } from './tong-cuc/quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt/thongtin-dexuat/thongtin-dexuat.component';


@NgModule({
  declarations: [
    KeHoachLuachonNhathauComponent,
    CucComponent,
    DanhsachKehoachLcntComponent,
    ThemmoiKehoachLcntComponent,
    MainCucComponent,
    QuyetdinhPheduyetKhlcntComponent,
    TongCucComponent,
    MainTongCucComponent,
    QuyetdinhPheduyetKhlcntComponent,
    ThemmoiQuyetdinhKhlcntComponent,
    ThemmoiKehoachLcntTongCucComponent,
    TongHopKhlcntComponent,
    ThemmoiTonghopKhlcntComponent,
    ThongtinDexuatComponent,
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
    QuyetdinhPheduyetKhlcntComponent,
    TongCucComponent,
    MainTongCucComponent,
    QuyetdinhPheduyetKhlcntComponent,
    TongHopKhlcntComponent,
  ]
})
export class KehoachLuachonNhathauModule { }
