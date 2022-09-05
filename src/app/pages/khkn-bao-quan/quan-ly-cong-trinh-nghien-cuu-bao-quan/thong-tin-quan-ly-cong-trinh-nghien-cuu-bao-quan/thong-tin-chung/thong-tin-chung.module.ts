import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { ThongTinChungComponent } from './thong-tin-chung.component';

@NgModule({
  declarations: [ThongTinChungComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [ThongTinChungComponent],
})
export class ThongTinChungModule { }
