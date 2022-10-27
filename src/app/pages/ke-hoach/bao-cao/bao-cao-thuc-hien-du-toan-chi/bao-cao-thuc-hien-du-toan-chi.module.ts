import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BaoCaoThucHienDuToanChiComponent } from './bao-cao-thuc-hien-du-toan-chi.component';
import { DanhSachBaoCaoThucHienDuToanChiComponent } from './danh-sach-bao-cao-thuc-hien-du-toan-chi/danh-sach-bao-cao-thuc-hien-du-toan-chi.component';
import { DanhSachBaoCaoTuDonViCapDuoiComponent } from './danh-sach-bao-cao-tu-don-vi-cap-duoi/danh-sach-bao-cao-tu-don-vi-cap-duoi.component';
import { KiemTraBaoCaoCacDonViCapDuoiComponent } from './kiem-tra-bao-cao-cac-don-vi-cap-duoi/kiem-tra-bao-cao-cac-don-vi-cap-duoi.component';
import { TongHopBaoCaoComponent } from './tong-hop-bao-cao/tong-hop-bao-cao.component';

@NgModule({
    declarations: [
        BaoCaoThucHienDuToanChiComponent,
        DanhSachBaoCaoThucHienDuToanChiComponent,
        DanhSachBaoCaoTuDonViCapDuoiComponent,
        KiemTraBaoCaoCacDonViCapDuoiComponent,
        TongHopBaoCaoComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        BaoCaoThucHienDuToanChiComponent,
        DanhSachBaoCaoThucHienDuToanChiComponent,
        DanhSachBaoCaoTuDonViCapDuoiComponent,
        KiemTraBaoCaoCacDonViCapDuoiComponent,
        TongHopBaoCaoComponent,
    ]
})
export class BaoCaoThucHienDuToanChiModule { }
