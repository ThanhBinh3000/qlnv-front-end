import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { MainPhuongAnGiaComponent } from './main-phuong-an-gia.component';
import { SubPhuongAnGiaModule } from './sub-phuong-an-gia/sub-phuong-an-gia';

@NgModule({
  declarations: [MainPhuongAnGiaComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    SubPhuongAnGiaModule
  ],
  exports: [
    MainPhuongAnGiaComponent,
  ]
})
export class MainPhuongAnGiaModule { }
