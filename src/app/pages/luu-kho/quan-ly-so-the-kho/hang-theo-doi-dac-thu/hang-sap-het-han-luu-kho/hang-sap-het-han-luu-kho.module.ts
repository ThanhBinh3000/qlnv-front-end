import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangSapHetHanLuuKhoComponent } from './hang-sap-het-han-luu-kho.component';

@NgModule({
  declarations: [HangSapHetHanLuuKhoComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [HangSapHetHanLuuKhoComponent],
})
export class HangSapHetHanLuuKhoModule {}
