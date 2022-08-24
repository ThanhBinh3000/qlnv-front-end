import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { BaoCaoKetQuaThucHienVonPhiHangDTQGModule } from './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg/bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg.module';
import { BaoCaoRoutingModule } from './bao-cao-routing.module';
import { BaoCaoThucHienDuToanChiNSNNModule } from './bao-cao-thuc-hien-du-toan-chi-nsnn/bao-cao-thuc-hien-du-toan-chi-nsnn.module';
import { BaoCaoComponent } from './bao-cao.component';
// import { KeHoachVonDauNamModule } from './ke-hoach-von-dau-nam/ke-hoach-von-dau-nam.module';
// import { KeHoachVonMuaBuModule } from './ke-hoach-von-mua-bu/ke-hoach-von-mua-bu.module';
// import { KeHoachXuatModule } from './ke-hoach-xuat/ke-hoach-xuat.module';

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
        // KeHoachVonDauNamModule,
        // KeHoachVonMuaBuModule,
        // KeHoachXuatModule,
    ],
})
export class BaoCaoModule { }
