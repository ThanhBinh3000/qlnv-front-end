import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhieuXuatKhoComponent } from './phieu-xuat-kho/phieu-xuat-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { MainXuatKhoComponent } from './main-xuat-kho/main-xuat-kho.component';



@NgModule({
  declarations: [
    MainXuatKhoComponent,
    PhieuXuatKhoComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    MainXuatKhoComponent,
  ]
})
export class XuatKhoModule { }
