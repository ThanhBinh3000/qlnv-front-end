import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HangTrongKhoComponent } from './hang-trong-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangTrongKhoTheoLoaiModule } from './hang-trong-kho-theo-loai/hang-trong-kho-theo-loai.module';

@NgModule({
  declarations: [HangTrongKhoComponent],
  imports: [CommonModule, ComponentsModule, HangTrongKhoTheoLoaiModule],
  exports: [
    HangTrongKhoComponent
  ]
})
export class HangTrongKhoModule { }
