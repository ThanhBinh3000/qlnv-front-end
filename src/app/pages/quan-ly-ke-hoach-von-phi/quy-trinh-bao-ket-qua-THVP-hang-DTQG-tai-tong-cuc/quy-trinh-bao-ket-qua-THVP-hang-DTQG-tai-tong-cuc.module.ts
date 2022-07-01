import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucRoutingModule } from './quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc-routing.module';
import { QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucComponent } from './quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { TimKiemBaoCaoThucHienVonPhiHangDTQGModule } from './nhom-chuc-nang-chi-cuc/tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG/tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.module';
import { DuyetBaoCaoThucHienVonPhiModule } from './nhom-chuc-nang-khu-vuc/duyet-bao-cao-thuc-hien-von-phi/duyet-bao-cao-thuc-hien-von-phi.module';
import { KiemTraTinhTrangPheDuyetBaoCaoTuChiCucModule } from './nhom-chuc-nang-khu-vuc/tong-hop-bao-cao/kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc/kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc.module';
import { TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGModule } from './nhom-chuc-nang-khu-vuc/tong-hop-bao-cao/tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG/tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.module';
import { KhaiThacBaoCaoModule } from './khai-thac-bao-cao/khai-thac-bao-cao.module';

@NgModule({
  declarations: [QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucComponent],
  imports: [CommonModule,
    QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucRoutingModule,
    ComponentsModule,
    TimKiemBaoCaoThucHienVonPhiHangDTQGModule,
    DuyetBaoCaoThucHienVonPhiModule,
    KiemTraTinhTrangPheDuyetBaoCaoTuChiCucModule,
    TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGModule,
    KhaiThacBaoCaoModule],
})
export class QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucModule { }
