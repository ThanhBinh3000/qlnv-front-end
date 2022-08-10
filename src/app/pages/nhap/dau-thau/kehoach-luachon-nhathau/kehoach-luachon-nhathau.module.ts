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
import { PhuongAnKhlcntComponent } from './tong-cuc/phuong-an-khlcnt/phuong-an-khlcnt.component';
import { ThemmoiPhuonganKhlcntComponent } from './tong-cuc/phuong-an-khlcnt/themmoi-phuongan-khlcnt/themmoi-phuongan-khlcnt.component';
import { QuyetdinhPheduyetKhlcntComponent } from './tong-cuc/quyetdinh-pheduyet-khlcnt/quyetdinh-pheduyet-khlcnt.component';
import { ThemmoiQuyetdinhKhlcntComponent } from './tong-cuc/quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt/themmoi-quyetdinh-khlcnt.component';
import { ThemmoiKehoachLcntTongCucComponent } from './tong-cuc/themmoi-kehoach-lcnt-tong-cuc/themmoi-kehoach-lcnt-tong-cuc.component';
import { TongCucComponent } from './tong-cuc/tong-cuc.component';
import { ThemmoiTonghopKhlcntComponent } from './tong-cuc/tong-hop-khlcnt/themmoi-tonghop-khlcnt/themmoi-tonghop-khlcnt.component';
import { TongHopKhlcntComponent } from './tong-cuc/tong-hop-khlcnt/tong-hop-khlcnt.component';


@NgModule({
  declarations: [
    KeHoachLuachonNhathauComponent,
    CucComponent,
    DanhsachKehoachLcntComponent,
    ThemmoiKehoachLcntComponent,
    MainCucComponent,
    PhuongAnKhlcntComponent,
    QuyetdinhPheduyetKhlcntComponent,
    TongCucComponent,
    MainTongCucComponent,
    PhuongAnKhlcntComponent,
    ThemmoiPhuonganKhlcntComponent,
    QuyetdinhPheduyetKhlcntComponent,
    ThemmoiQuyetdinhKhlcntComponent,
    ThemmoiKehoachLcntTongCucComponent,
    TongHopKhlcntComponent,
    ThemmoiTonghopKhlcntComponent,
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
    PhuongAnKhlcntComponent,
    QuyetdinhPheduyetKhlcntComponent,
    TongCucComponent,
    MainTongCucComponent,
    PhuongAnKhlcntComponent,
    QuyetdinhPheduyetKhlcntComponent,
    TongHopKhlcntComponent,
  ]
})
export class KehoachLuachonNhathauModule { }
