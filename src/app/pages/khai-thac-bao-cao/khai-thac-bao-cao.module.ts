import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KhaiThacBaoCaoRoutingModule } from './khai-thac-bao-cao-routing.module';
import { KhaiThacBaoCaoComponent } from './khai-thac-bao-cao.component';
import { ComponentsModule } from "../../components/components.module";
import { MainModule } from "../../layout/main/main.module";
import { BaoCaoNhapXuatHangDtqgComponent } from './bao-cao-nhap-xuat-hang-dtqg/bao-cao-nhap-xuat-hang-dtqg.component';
import { BaoCaoNghiepVuQlyKhoComponent } from './bao-cao-nghiep-vu-qly-kho/bao-cao-nghiep-vu-qly-kho.component';


@NgModule({
  declarations: [
    KhaiThacBaoCaoComponent,
    BaoCaoNhapXuatHangDtqgComponent,
    // BaoCaoNghiepVuQlyKhoComponent,
  ],
  imports: [
    CommonModule,
    KhaiThacBaoCaoRoutingModule,
    ComponentsModule,
    MainModule
  ]
})
export class KhaiThacBaoCaoModule {
}
