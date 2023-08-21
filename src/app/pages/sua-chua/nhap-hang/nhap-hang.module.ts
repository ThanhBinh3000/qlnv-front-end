import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NhapHangRoutingModule } from './nhap-hang-routing.module';
import { NhapHangComponent } from './nhap-hang.component';
import { QuyetDinhNhComponent } from './quyet-dinh-nh/quyet-dinh-nh.component';
import { PhieuNhapKhoComponent } from './phieu-nhap-kho/phieu-nhap-kho.component';
import { BangKeNhapComponent } from './bang-ke-nhap/bang-ke-nhap.component';
import { BbKthucNhapComponent } from './bb-kthuc-nhap/bb-kthuc-nhap.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ThemMoiBknComponent } from './bang-ke-nhap/them-moi-bkn/them-moi-bkn.component';
import { ThemMoiKthucComponent } from './bb-kthuc-nhap/them-moi-kthuc/them-moi-kthuc.component';
import { ThemMoiPnkComponent } from './phieu-nhap-kho/them-moi-pnk/them-moi-pnk.component';
import { ThemMoiQdnhComponent } from './quyet-dinh-nh/them-moi-qdnh/them-moi-qdnh.component';


@NgModule({
  declarations: [
    NhapHangComponent,
    QuyetDinhNhComponent,
    PhieuNhapKhoComponent,
    BangKeNhapComponent,
    BbKthucNhapComponent,
    ThemMoiBknComponent,
    ThemMoiKthucComponent,
    ThemMoiPnkComponent,
    ThemMoiQdnhComponent
  ],
  imports: [
    CommonModule,
    NhapHangRoutingModule,
    ComponentsModule
  ],
  exports: [
    NhapHangComponent,
    QuyetDinhNhComponent,
    PhieuNhapKhoComponent,
    BangKeNhapComponent,
    BbKthucNhapComponent
  ]
})
export class NhapHangModule { }
