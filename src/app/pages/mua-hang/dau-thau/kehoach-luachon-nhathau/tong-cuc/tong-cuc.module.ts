import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TongCucRoutingModule } from './tong-cuc-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { ThemmoiPhuonganKhlcntComponent } from './phuong-an-khlcnt/themmoi-phuongan-khlcnt/themmoi-phuongan-khlcnt.component';
import { ThemmoiQuyetdinhKhlcntComponent } from './quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt/themmoi-quyetdinh-khlcnt.component';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    TongCucRoutingModule,
    ComponentsModule, 
    MainModule
  ]
})
export class TongCucModule { }
