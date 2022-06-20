import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HangTrongKhoTheoLoaiComponent } from './hang-trong-kho-theo-loai.component';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [
    HangTrongKhoTheoLoaiComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule
  ],
  exports: [
    HangTrongKhoTheoLoaiComponent
  ]
})
export class HangTrongKhoTheoLoaiModule { }
