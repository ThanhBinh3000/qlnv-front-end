import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsChiTietNhapLieuBaoCaoRoutingModule } from './ds-chi-tiet-nhap-lieu-bao-cao-routing.module';
import { DsChiTietNhapLieuBaoCaoComponent } from './ds-chi-tiet-nhap-lieu-bao-cao.component';

@NgModule({
  declarations: [DsChiTietNhapLieuBaoCaoComponent],
  imports: [CommonModule, DsChiTietNhapLieuBaoCaoRoutingModule, ComponentsModule],
})
export class DsChiTietNhapLieuBaoCaoModule {}
