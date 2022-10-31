import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { BaoCaoRoutingModule } from './bao-cao-routing.module';
import { BaoCaoThucHienDuToanChiModule } from './bao-cao-thuc-hien-du-toan-chi/bao-cao-thuc-hien-du-toan-chi.module';
import { BaoCaoThucHienVonPhiModule } from './bao-cao-thuc-hien-von-phi/bao-cao-thuc-hien-von-phi.module';
import { BaoCaoComponent } from './bao-cao.component';

@NgModule({
    declarations: [
        BaoCaoComponent,
    ],
    imports: [
        CommonModule,
        BaoCaoRoutingModule,
        ComponentsModule,
        BaoCaoThucHienDuToanChiModule,
        BaoCaoThucHienVonPhiModule,
    ],
})
export class BaoCaoModule { }
