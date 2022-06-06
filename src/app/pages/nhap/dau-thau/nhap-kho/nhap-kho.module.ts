import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhapKhoComponent } from './nhap-kho.component';
import { ChucNangNhapKhoComponent } from './chuc-nang-nhap-kho/chuc-nang-nhap-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [
    NhapKhoComponent,
    ChucNangNhapKhoComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    NhapKhoComponent,
    ChucNangNhapKhoComponent,
  ]
})
export class NhapKhoModule { }
