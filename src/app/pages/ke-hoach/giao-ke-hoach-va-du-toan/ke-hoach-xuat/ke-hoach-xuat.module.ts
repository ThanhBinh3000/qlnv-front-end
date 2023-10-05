import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeHoachXuatComponent } from './ke-hoach-xuat.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [
    KeHoachXuatComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    KeHoachXuatComponent,
  ]
})
export class KeHoachXuatModule { }
