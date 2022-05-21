import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QdCvGiaoSoKiemTraTranChiNsnnComponent } from './qd-cv-giao-so-kiem-tra-tran-chi-nsnn.component';
import { QdCvGiaoSoKiemTraTranChiNsnnRoutingModule } from './qd-cv-giao-so-kiem-tra-tran-chi-nsnn-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [QdCvGiaoSoKiemTraTranChiNsnnComponent],
  imports: [CommonModule, QdCvGiaoSoKiemTraTranChiNsnnRoutingModule, ComponentsModule],
})
export class QdCvGiaoSoKiemTraTranChiNsnnModule {}
