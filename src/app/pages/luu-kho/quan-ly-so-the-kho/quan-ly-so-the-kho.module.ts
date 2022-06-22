import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanLySoTheKhoComponent } from './quan-ly-so-the-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { SoKhoTheKhoModule } from './so-kho-the-kho/so-kho-the-kho.module';
import { HangTrongKhoModule } from './hang-trong-kho/hang-trong-kho.module';
import { HangTheoDoiDacThuModule } from './hang-theo-doi-dac-thu/hang-theo-doi-dac-thu.module';
import { QuanLySoTheKhoRoutingModule } from './quan-ly-so-the-kho-routing.module';



@NgModule({
  declarations: [
    QuanLySoTheKhoComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    SoKhoTheKhoModule,
    HangTrongKhoModule,
    HangTheoDoiDacThuModule,
    QuanLySoTheKhoRoutingModule
  ],
})
export class QuanLySoTheKhoModule { }
