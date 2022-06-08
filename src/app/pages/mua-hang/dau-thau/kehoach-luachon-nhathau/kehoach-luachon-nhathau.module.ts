import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KehoachLuachonNhathauRoutingModule } from './kehoach-luachon-nhathau-routing.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainTongCucComponent } from './tong-cuc/main-tong-cuc/main-tong-cuc.component';
import { DauThauModule } from '../dau-thau.module';
import { MainCucComponent } from './cuc/main-cuc/main-cuc.component';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    KehoachLuachonNhathauRoutingModule,
    ComponentsModule,
    MainModule,
    DauThauModule
  ]
})
export class KehoachLuachonNhathauModule { }
