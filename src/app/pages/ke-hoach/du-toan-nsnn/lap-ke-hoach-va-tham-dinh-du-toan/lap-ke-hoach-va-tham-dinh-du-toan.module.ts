import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BaoCaoModule } from './bao-cao/bao-cao.module';
import { DialogThemKhoanMucComponent } from './bao-cao/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DanhSachBaoCaoTuDonViCapDuoiComponent } from './danh-sach-bao-cao-tu-don-vi-cap-duoi/danh-sach-bao-cao-tu-don-vi-cap-duoi.component';
import { DanhSachBaoCaoComponent } from './danh-sach-bao-cao/danh-sach-bao-cao.component';
import { DialogTaoMoiComponent } from './dialog-tao-moi/dialog-tao-moi.component';
import { LapKeHoachVaThamDinhDuToanComponent } from './lap-ke-hoach-va-tham-dinh-du-toan.component';
import { TongHopBaoCaoTuDonViCapDuoiComponent } from './tong-hop-bao-cao-tu-don-vi-cap-duoi/tong-hop-bao-cao-tu-don-vi-cap-duoi.component';
import { DanhSachHeSoBaoHiemComponent } from './danh-sach-he-so-bao-hiem/danh-sach-he-so-bao-hiem.component';
import { HeSoBaoHiemComponent } from './he-so-bao-hiem/he-so-bao-hiem.component';
import { DialogTaoMoiTyLeBaoHiemComponent } from './dialog-tao-moi-ty-le-bao-hiem/dialog-tao-moi-ty-le-bao-hiem.component';
import { DialogChonLoaiBaoQuanComponent } from './bao-cao/dialog-chon-loai-bao-quan/dialog-chon-loai-bao-quan.component';

@NgModule({
    declarations: [
        LapKeHoachVaThamDinhDuToanComponent,
        DanhSachBaoCaoComponent,
        DanhSachHeSoBaoHiemComponent,
        DanhSachBaoCaoTuDonViCapDuoiComponent,
        TongHopBaoCaoTuDonViCapDuoiComponent,
        DialogTaoMoiComponent,
        DialogTaoMoiTyLeBaoHiemComponent,
        DialogThemKhoanMucComponent,
        DialogChonLoaiBaoQuanComponent,
        HeSoBaoHiemComponent,
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
