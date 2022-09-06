import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TienDoThucHienComponent } from './tien-do-thuc-hien.component';

@NgModule({
  declarations: [TienDoThucHienComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [TienDoThucHienComponent],
})
export class TienDoThucHienModule { }
