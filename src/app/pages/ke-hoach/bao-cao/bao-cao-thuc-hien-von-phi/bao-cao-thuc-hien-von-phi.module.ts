import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BaoCaoThucHienVonPhiComponent } from './bao-cao-thuc-hien-von-phi.component';
import { DanhSachBaoCaoThucHienVonPhiComponent } from './danh-sach-bao-cao-thuc-hien-von-phi/danh-sach-bao-cao-thuc-hien-von-phi.component';
import { DanhSachBaoCaoTuDonViCapDuoiComponent } from './danh-sach-bao-cao-tu-don-vi-cap-duoi/danh-sach-bao-cao-tu-don-vi-cap-duoi.component';
import { KhaiThacBaoCaoComponent } from './khai-thac-bao-cao/khai-thac-bao-cao.component';
import { KiemTraBaoCaoCacDonViCapDuoiComponent } from './kiem-tra-bao-cao-cac-don-vi-cap-duoi/kiem-tra-bao-cao-cac-don-vi-cap-duoi.component';
import { TongHopBaoCaoComponent } from './tong-hop-bao-cao/tong-hop-bao-cao.component';

@NgModule({
    declarations: [
        BaoCaoThucHienVonPhiComponent,
        DanhSachBaoCaoThucHienVonPhiComponent,
        DanhSachBaoCaoTuDonViCapDuoiComponent,
        KiemTraBaoCaoCacDonViCapDuoiComponent,
        TongHopBaoCaoComponent,
        KhaiThacBaoCaoComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        BaoCaoThucHienVonPhiComponent,
        DanhSachBaoCaoThucHienVonPhiComponent,
        DanhSachBaoCaoTuDonViCapDuoiComponent,
        KiemTraBaoCaoCacDonViCapDuoiComponent,
        TongHopBaoCaoComponent,
        KhaiThacBaoCaoComponent,
    ]
})
export class BaoCaoThucHienVonPhiModule { }
