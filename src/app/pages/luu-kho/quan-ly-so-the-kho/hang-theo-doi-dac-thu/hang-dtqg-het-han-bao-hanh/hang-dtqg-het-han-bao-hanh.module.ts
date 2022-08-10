import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangDtqgHetHanBaoHanhComponent } from './hang-dtqg-het-han-bao-hanh.component';

@NgModule({
  declarations: [HangDtqgHetHanBaoHanhComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [HangDtqgHetHanBaoHanhComponent],
})
export class HangDtqgHetHanBaoHanhModule {}
