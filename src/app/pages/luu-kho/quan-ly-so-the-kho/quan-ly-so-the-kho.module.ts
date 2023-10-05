import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangTheoDoiDacThuModule } from './hang-theo-doi-dac-thu/hang-theo-doi-dac-thu.module';
import { HangTrongKhoModule } from './hang-trong-kho/hang-trong-kho.module';
import { QuanLySoTheKhoRoutingModule } from './quan-ly-so-the-kho-routing.module';
import { QuanLySoTheKhoComponent } from './quan-ly-so-the-kho.component';
import { SoKhoTheKhoModule } from './so-kho-the-kho/so-kho-the-kho.module';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [QuanLySoTheKhoComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    QuanLySoTheKhoRoutingModule,
    HangTrongKhoModule,
    SoKhoTheKhoModule,
    HangTheoDoiDacThuModule,
  ],
  providers: [DatePipe]

})
export class QuanLySoTheKhoModule { }
