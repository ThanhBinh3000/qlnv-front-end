import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { ThemMoiBaoCaoQuyetToanRoutingModule } from './them-moi-bao-cao-quyet-toan-routing.module';
import { ThemMoiBaoCaoQuyetToanComponent } from './them-moi-bao-cao-quyet-toan.component';

@NgModule({
  declarations: [
    ThemMoiBaoCaoQuyetToanComponent,
  ],
  imports: [
    CommonModule,
    ThemMoiBaoCaoQuyetToanRoutingModule,
    ComponentsModule,
  ],
})

export class ThemMoiBaoCaoQuyetToanModule {}
