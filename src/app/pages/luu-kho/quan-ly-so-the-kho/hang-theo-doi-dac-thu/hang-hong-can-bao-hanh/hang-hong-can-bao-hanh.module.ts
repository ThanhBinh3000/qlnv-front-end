import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangHongCanBaoHanhComponent } from './hang-hong-can-bao-hanh.component';

@NgModule({
  declarations: [HangHongCanBaoHanhComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [HangHongCanBaoHanhComponent],
})
export class HangHongCanBaoHanhModule {}
