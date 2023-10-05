import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DieuChinhDuToanModule } from './dieu-chinh-du-toan/dieu-chinh-du-toan.module';
import { DuToanNsnnRoutingModule } from './du-toan-nsnn-routing.module';
import { DuToanNsnnComponent } from './du-toan-nsnn.component';
import { GiaoDuToanThucTeModule } from './giao-du-toan-thuc-te/giao-du-toan-thuc-te.module';
import { GiaoDuToanModule } from './giao-du-toan/giao-du-toan.module';
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
        GiaoDuToanModule,
        GiaoDuToanThucTeModule
    ],
    providers: [
        DatePipe,
        DecimalPipe,
    ]
})
export class DuToanNsnnModule { }
