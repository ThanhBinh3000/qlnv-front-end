import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { QuanTriHeThongRoutingModule } from './quantrihethong-routing.module';
import { QuanTriHeThongComponent } from './quantrihethong.component';
import { DanhSachComponent } from './danhsach/danhsach.component';

@NgModule({
  declarations: [
    QuanTriHeThongComponent,
    DanhSachComponent
  ],
  imports: [CommonModule, QuanTriHeThongRoutingModule, ComponentsModule, MainModule],
  
})
export class QuanTriHeThongModule { }
