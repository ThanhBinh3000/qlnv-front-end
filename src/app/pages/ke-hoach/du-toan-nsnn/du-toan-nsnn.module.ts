import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DieuChinhDuToanChiNSNNModule } from './dieu-chinh-du-toan-chi-nsnn/dieu-chinh-du-toan-chi-nsnn.module';
import { DuToanNsnnRoutingModule } from './du-toan-nsnn-routing.module';
import { DuToanNsnnComponent } from './du-toan-nsnn.component';
import { GiaoDuToanChiNSNNModule } from './giao-du-toan-chi-nsnn/giao-du-toan-chi-nsnn.module';
import { LapThamDinhModule } from './lap-tham-dinh/lap-tham-dinh.module';

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
        GiaoDuToanChiNSNNModule,
    ],
})
export class DuToanNsnnModule { }
