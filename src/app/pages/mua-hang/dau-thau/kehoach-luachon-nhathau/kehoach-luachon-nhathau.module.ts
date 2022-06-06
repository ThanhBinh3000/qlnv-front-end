import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KehoachLuachonNhathauRoutingModule } from './kehoach-luachon-nhathau-routing.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { ThemmoiTonghopKhlcntComponent } from './tong-cuc/tong-hop-khlcnt/themmoi-tonghop-khlcnt/themmoi-tonghop-khlcnt.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    KehoachLuachonNhathauRoutingModule,
    ComponentsModule,
    MainModule
  ]
})
export class KehoachLuachonNhathauModule { }
