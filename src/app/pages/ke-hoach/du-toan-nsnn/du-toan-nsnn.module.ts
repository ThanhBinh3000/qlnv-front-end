import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DieuChinhDuToanModule } from './dieu-chinh-du-toan/dieu-chinh-du-toan.module';
import { DuToanNsnnRoutingModule } from './du-toan-nsnn-routing.module';
import { DuToanNsnnComponent } from './du-toan-nsnn.component';
import { GiaoDuToanChiNSNNModule } from './giao-du-toan-chi-nsnn/giao-du-toan-chi-nsnn.module';
import { LapKeHoachVaThamDinhDuToanModule } from './lap-ke-hoach-va-tham-dinh-du-toan/lap-ke-hoach-va-tham-dinh-du-toan.module';

@NgModule({
    declarations: [
        DuToanNsnnComponent,
    ],
    imports: [
        CommonModule,
        DuToanNsnnRoutingModule,
        ComponentsModule,
        LapKeHoachVaThamDinhDuToanModule,
        DieuChinhDuToanModule,
        GiaoDuToanChiNSNNModule,
    ],
    providers: [DatePipe]
})
export class DuToanNsnnModule { }
