import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DieuChinhDuToanChiNSNNModule } from './dieu-chinh-du-toan-chi-nsnn/dieu-chinh-du-toan-chi-nsnn.module';
import { DuToanNsnnRoutingModule } from './du-toan-nsnn-routing.module';
import { DuToanNsnnComponent } from './du-toan-nsnn.component';
import { LapThamDinhModule } from './lap-tham-dinh/lap-tham-dinh.module';
// import { KeHoachVonDauNamModule } from './ke-hoach-von-dau-nam/ke-hoach-von-dau-nam.module';
// import { KeHoachVonMuaBuModule } from './ke-hoach-von-mua-bu/ke-hoach-von-mua-bu.module';
// import { KeHoachXuatModule } from './ke-hoach-xuat/ke-hoach-xuat.module';

@NgModule({
    declarations: [
        DuToanNsnnComponent,
    ],
    imports: [
        CommonModule,
        DuToanNsnnRoutingModule,
        ComponentsModule,
        LapThamDinhModule,
        DieuChinhDuToanChiNSNNModule,
        // KeHoachVonDauNamModule,
        // KeHoachVonMuaBuModule,
        // KeHoachXuatModule,
    ],
})
export class DuToanNsnnModule { }
