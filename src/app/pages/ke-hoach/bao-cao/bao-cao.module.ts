import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { BaoCaoKetQuaThucHienVonPhiHangDTQGModule } from './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg/bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg.module';
import { BaoCaoRoutingModule } from './bao-cao-routing.module';
import { BaoCaoThucHienDuToanChiNSNNModule } from './bao-cao-thuc-hien-du-toan-chi-nsnn/bao-cao-thuc-hien-du-toan-chi-nsnn.module';
import { BaoCaoThucHienDuToanChiModule } from './bao-cao-thuc-hien-du-toan-chi/bao-cao-thuc-hien-du-toan-chi.module';
import { BaoCaoComponent } from './bao-cao.component';

@NgModule({
    declarations: [
        BaoCaoComponent,
    ],
    imports: [
        CommonModule,
        BaoCaoRoutingModule,
        ComponentsModule,
        BaoCaoThucHienDuToanChiNSNNModule,
        BaoCaoKetQuaThucHienVonPhiHangDTQGModule,
        BaoCaoThucHienDuToanChiModule,
    ],
})
export class BaoCaoModule { }
