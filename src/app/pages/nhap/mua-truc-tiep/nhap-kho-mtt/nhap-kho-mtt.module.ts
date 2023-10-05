import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NhapKhoMttComponent } from './nhap-kho-mtt.component';
import { ChucNangNhapKhoMuattComponent } from './chuc-nang-nhap-kho-muatt/chuc-nang-nhap-kho-muatt.component';
import { PhieuNhapKhoComponent } from './phieu-nhap-kho/phieu-nhap-kho.component';
import { ThemMoiPhieuNhapKhoComponent } from './phieu-nhap-kho/them-moi-phieu-nhap-kho/them-moi-phieu-nhap-kho.component';
import { BangKeCanHangComponent } from './bang-ke-can-hang/bang-ke-can-hang.component';
import { ThemMoiBangKeCanHangComponent } from './bang-ke-can-hang/them-moi-bang-ke-can-hang/them-moi-bang-ke-can-hang.component';
import { BienBanNhapDayKhoComponent } from './bien-ban-nhap-day-kho/bien-ban-nhap-day-kho.component';
import { ThemMoiBienBanNhapDayKhoComponent } from './bien-ban-nhap-day-kho/them-moi-bien-ban-nhap-day-kho/them-moi-bien-ban-nhap-day-kho.component';


@NgModule({
  declarations: [
    NhapKhoMttComponent,
    ChucNangNhapKhoMuattComponent,
    PhieuNhapKhoComponent,
    ThemMoiPhieuNhapKhoComponent,
    BangKeCanHangComponent,
    ThemMoiBangKeCanHangComponent,
    BienBanNhapDayKhoComponent,
    ThemMoiBienBanNhapDayKhoComponent,

  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    NhapKhoMttComponent,

  ]
})
export class NhapKhoMttModule { }
