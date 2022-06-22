import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangSapHetHanBaoHanhComponent } from './hang-sap-het-han-bao-hanh.component';

@NgModule({
  declarations: [HangSapHetHanBaoHanhComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [HangSapHetHanBaoHanhComponent],
})
export class HangSapHetHanBaoHanhModule {}
