import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { NghiemThuThanhLyComponent } from './nghiem-thu-thanh-ly.component';

@NgModule({
  declarations: [NghiemThuThanhLyComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [NghiemThuThanhLyComponent],
})
export class NghiemThuThanhLyModule { }
