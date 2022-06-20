import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangThuocDienThanhLyComponent } from './hang-thuoc-dien-thanh-ly.component';

@NgModule({
  declarations: [HangThuocDienThanhLyComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [HangThuocDienThanhLyComponent],
})
export class HangThuocDienThanhLyModule {}
