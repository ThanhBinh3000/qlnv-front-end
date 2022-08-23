import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoCaoThucHienDuToanChiNSNNComponent } from './bao-cao-thuc-hien-du-toan-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        BaoCaoThucHienDuToanChiNSNNComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        RouterModule,
    ],
    exports: [
        BaoCaoThucHienDuToanChiNSNNComponent,
    ]
})
export class BaoCaoThucHienDuToanChiNSNNModule { }
