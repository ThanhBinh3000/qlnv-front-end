import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { PheDuyetBaoCaoDieuChinhComponent } from './phe-duyet-bao-cao-dieu-chinh.component';
import { PheDuyetBaoCaoDieuChinhRoutingModule } from './phe-duyet-bao-cao-dieu-chinh-routing.module';

@NgModule({
  declarations: [PheDuyetBaoCaoDieuChinhComponent],
  imports: [CommonModule, PheDuyetBaoCaoDieuChinhRoutingModule, ComponentsModule],
  exports: [PheDuyetBaoCaoDieuChinhComponent,]
})
export class PheDuyetBaoCaoDieuChinhModule { }
