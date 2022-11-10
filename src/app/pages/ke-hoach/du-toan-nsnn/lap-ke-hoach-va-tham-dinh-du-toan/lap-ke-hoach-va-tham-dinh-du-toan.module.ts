import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BaoCaoModule } from './bao-cao/bao-cao.module';
import { DanhSachBaoCaoTuDonViCapDuoiComponent } from './danh-sach-bao-cao-tu-don-vi-cap-duoi/danh-sach-bao-cao-tu-don-vi-cap-duoi.component';
import { DanhSachBaoCaoComponent } from './danh-sach-bao-cao/danh-sach-bao-cao.component';
import { DanhSachPhuongAnGiaoSktTranChiComponent } from './danh-sach-phuong-an-giao-skt-tran-chi/danh-sach-phuong-an-giao-skt-tran-chi.component';
import { DanhSachSoKiemTraTranChiTuBTCComponent } from './danh-sach-so-kiem-tra-tran-chi-tu-BTC/danh-sach-so-kiem-tra-tran-chi-tu-BTC.component';
import { DanhSachSoKiemTraTranChiComponent } from './danh-sach-so-kiem-tra-tran-chi/danh-sach-so-kiem-tra-tran-chi.component';
import { DialogTaoMoiComponent } from './dialog-tao-moi/dialog-tao-moi.component';
import { DialogThemMoiQdCvComponent } from './dialog-them-moi-qd-cv/dialog-them-moi-qd-cv.component';
import { LapKeHoachVaThamDinhDuToanComponent } from './lap-ke-hoach-va-tham-dinh-du-toan.component';
import { PhuongAnGiaoSktTranChiComponent } from './phuong-an-giao-skt-tran-chi/phuong-an-giao-skt-tran-chi.component';
import { SoKiemTraTranChiTuBtcComponent } from './so-kiem-tra-tran-chi-tu-btc/so-kiem-tra-tran-chi-tu-btc.component';
import { SoKiemTraTranChiComponent } from './so-kiem-tra-tran-chi/so-kiem-tra-tran-chi.component';
import { TongHopBaoCaoTuDonViCapDuoiComponent } from './tong-hop-bao-cao-tu-don-vi-cap-duoi/tong-hop-bao-cao-tu-don-vi-cap-duoi.component';

@NgModule({
    declarations: [
        LapKeHoachVaThamDinhDuToanComponent,
        DanhSachBaoCaoComponent,
        DanhSachBaoCaoTuDonViCapDuoiComponent,
        TongHopBaoCaoTuDonViCapDuoiComponent,
        DanhSachSoKiemTraTranChiTuBTCComponent,
        SoKiemTraTranChiTuBtcComponent,
        DanhSachPhuongAnGiaoSktTranChiComponent,
        PhuongAnGiaoSktTranChiComponent,
        DanhSachSoKiemTraTranChiComponent,
        SoKiemTraTranChiComponent,
        DialogTaoMoiComponent,
        DialogThemMoiQdCvComponent,
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
