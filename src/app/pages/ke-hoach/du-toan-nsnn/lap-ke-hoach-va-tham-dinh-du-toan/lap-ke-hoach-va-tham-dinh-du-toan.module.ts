import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BaoCaoModule } from './bao-cao/bao-cao.module';
import { DanhSachBaoCaoTuDonViCapDuoiComponent } from './danh-sach-bao-cao-tu-don-vi-cap-duoi/danh-sach-bao-cao-tu-don-vi-cap-duoi.component';
import { DanhSachBaoCaoComponent } from './danh-sach-bao-cao/danh-sach-bao-cao.component';
import { LapKeHoachVaThamDinhDuToanComponent } from './lap-ke-hoach-va-tham-dinh-du-toan.component';
import { TongHopBaoCaoTuDonViCapDuoiComponent } from './tong-hop-bao-cao-tu-don-vi-cap-duoi/tong-hop-bao-cao-tu-don-vi-cap-duoi.component';

@NgModule({
    declarations: [
        LapKeHoachVaThamDinhDuToanComponent,
        DanhSachBaoCaoComponent,
        DanhSachBaoCaoTuDonViCapDuoiComponent,
        TongHopBaoCaoTuDonViCapDuoiComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
        BaoCaoModule,
    ],
    exports: [
        LapKeHoachVaThamDinhDuToanComponent,
        DanhSachBaoCaoComponent,
        DanhSachBaoCaoTuDonViCapDuoiComponent,
        TongHopBaoCaoTuDonViCapDuoiComponent,
    ]
})
export class LapKeHoachVaThamDinhDuToanModule { }
