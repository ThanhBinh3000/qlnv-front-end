import { ThemMoiPhieuNhapDayKhoComponent } from './quan-ly-phieu-nhap-day-kho/them-moi-phieu-nhap-day-kho/them-moi-phieu-nhap-day-kho.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhapKhoComponent } from './nhap-kho.component';
import { ChucNangNhapKhoComponent } from './chuc-nang-nhap-kho/chuc-nang-nhap-kho.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { QuanLyPhieuNhapDayKhoComponent } from './quan-ly-phieu-nhap-day-kho/quan-ly-phieu-nhap-day-kho.component';

@NgModule({
  declarations: [
    NhapKhoComponent,
    ChucNangNhapKhoComponent,
    QuanLyPhieuNhapDayKhoComponent,
    ThemMoiPhieuNhapDayKhoComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    NhapKhoComponent,
    ChucNangNhapKhoComponent,
    QuanLyPhieuNhapDayKhoComponent
  ]
})
export class NhapKhoModule { }
