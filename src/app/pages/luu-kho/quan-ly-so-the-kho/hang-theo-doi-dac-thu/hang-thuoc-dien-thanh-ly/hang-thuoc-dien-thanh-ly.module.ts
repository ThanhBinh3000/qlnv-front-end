import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { HangThuocDienThanhLyComponent } from './hang-thuoc-dien-thanh-ly.component';
import { ThemHangThuocDienThanhLyComponent } from './them-hang-thuoc-dien-thanh-ly/them-hang-thuoc-dien-thanh-ly.component';

@NgModule({
  declarations: [HangThuocDienThanhLyComponent, ThemHangThuocDienThanhLyComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [HangThuocDienThanhLyComponent],
})
export class HangThuocDienThanhLyModule {}
