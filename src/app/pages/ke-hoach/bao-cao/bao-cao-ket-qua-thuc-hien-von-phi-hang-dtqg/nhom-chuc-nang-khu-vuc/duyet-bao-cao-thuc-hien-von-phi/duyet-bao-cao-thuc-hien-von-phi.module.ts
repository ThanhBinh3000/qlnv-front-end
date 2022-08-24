import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ComponentsModule } from 'src/app/components/components.module';
import { DuyetBaoCaoThucHienVonPhiComponent } from './duyet-bao-cao-thuc-hien-von-phi.component';
import { DuyetBaoCaoThucHienVonPhiRoutingModule } from './duyet-bao-cao-thuc-hien-von-phi-routing.module';

@NgModule({
  declarations: [DuyetBaoCaoThucHienVonPhiComponent],
  imports: [CommonModule, DuyetBaoCaoThucHienVonPhiRoutingModule, ComponentsModule],
  exports:[DuyetBaoCaoThucHienVonPhiComponent]
})
export class DuyetBaoCaoThucHienVonPhiModule {}
