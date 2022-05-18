import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KehoachLuachonNhathauRoutingModule } from './kehoach-luachon-nhathau-routing.module';
import { CucComponent } from './luong-thuc/cuc/cuc.component';
import { TongCucComponent } from './luong-thuc/tong-cuc/tong-cuc.component';
import { LuongThucComponent } from './luong-thuc/luong-thuc.component';
import { MainModule } from 'src/app/layout/main/main.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { QuyetdinhPheduyetKhlcntComponent } from './luong-thuc/tong-cuc/quyetdinh-pheduyet-khlcnt/quyetdinh-pheduyet-khlcnt.component';
import { PhuongAnKhlcntComponent } from './luong-thuc/tong-cuc/phuong-an-khlcnt/phuong-an-khlcnt.component';
import { TongHopKhlcntComponent } from './luong-thuc/tong-cuc/tong-hop-khlcnt/tong-hop-khlcnt.component';


@NgModule({
  declarations: [
    TongCucComponent,
    CucComponent,
    LuongThucComponent,
    QuyetdinhPheduyetKhlcntComponent,
    PhuongAnKhlcntComponent,
    TongHopKhlcntComponent
  ],
  imports: [
    CommonModule,
    KehoachLuachonNhathauRoutingModule,
    ComponentsModule, 
    MainModule
  ]
})
export class KehoachLuachonNhathauModule { }
