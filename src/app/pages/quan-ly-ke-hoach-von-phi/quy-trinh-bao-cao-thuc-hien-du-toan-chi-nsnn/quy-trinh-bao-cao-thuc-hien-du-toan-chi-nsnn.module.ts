import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuyTrinhBaoCaoThucHienDuToanChiNSNNRoutingModule } from './quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn-routing.module';
import { QuyTrinhBaoCaoThucHienDuToanChiNSNNComponent } from './quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DsBaoCaoTinhHinhSdDtoanThangNamModule } from './chuc-nang-chi-cuc/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam.module';
import { DsBaoCaoTinhHinhSdDtoanThangNamTuCCModule } from './chuc-nang-cuc-khu-vuc/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC.module';
import { KiemTraModule } from './chuc-nang-cuc-khu-vuc/kiem-tra/kiem-tra.module';
import { TongHopBCTinhHinhSuDungDuToanTuCCModule } from './chuc-nang-cuc-khu-vuc/tong-hop-bc-tinh-hinh-su-dung-du-toan-tu-CC/tong-hop-bc-tinh-hinh-su-dung-du-toan-tu-CC.module';

@NgModule({
  declarations: [QuyTrinhBaoCaoThucHienDuToanChiNSNNComponent],
  imports: [CommonModule, QuyTrinhBaoCaoThucHienDuToanChiNSNNRoutingModule, ComponentsModule,
    DsBaoCaoTinhHinhSdDtoanThangNamModule,
    DsBaoCaoTinhHinhSdDtoanThangNamTuCCModule,
    KiemTraModule,
    TongHopBCTinhHinhSuDungDuToanTuCCModule
  ],
})
export class QuyTrinhBaoCaoThucHienDuToanChiNSNNModule {}
