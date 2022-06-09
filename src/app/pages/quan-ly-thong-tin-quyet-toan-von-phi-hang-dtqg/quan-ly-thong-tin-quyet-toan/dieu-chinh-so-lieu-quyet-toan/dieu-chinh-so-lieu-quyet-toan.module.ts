import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DieuChinhSoLieuQuyetToanComponent } from './dieu-chinh-so-lieu-quyet-toan.component';
import { DieuChinhSoLieuQuyetToanRoutingModule } from './dieu-chinh-so-lieu-quyet-toan-routing.module';


@NgModule({
  declarations: [
    DieuChinhSoLieuQuyetToanComponent,
  ],
  imports: [
    CommonModule,
    DieuChinhSoLieuQuyetToanRoutingModule,
    ComponentsModule,
  ],
})

export class DieuChinhSoLieuQuyetToanModule {}
