import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XuatHangRoutingModule } from './xuat-hang-routing.module';
import { XuatHangComponent } from './xuat-hang.component';
import { QuyetDinhXhComponent } from './quyet-dinh-xh/quyet-dinh-xh.component';
import { PhieuXuatKhoComponent } from './phieu-xuat-kho/phieu-xuat-kho.component';
import { BangKeComponent } from './bang-ke/bang-ke.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ThemMoiBkComponent } from './bang-ke/them-moi-bk/them-moi-bk.component';
import { ThemMoiPxkComponent } from './phieu-xuat-kho/them-moi-pxk/them-moi-pxk.component';
import { ThemMoiQdxhComponent } from './quyet-dinh-xh/them-moi-qdxh/them-moi-qdxh.component';


@NgModule({
  declarations: [
    XuatHangComponent,
    QuyetDinhXhComponent,
    PhieuXuatKhoComponent,
    BangKeComponent,
    ThemMoiBkComponent,
    ThemMoiPxkComponent,
    ThemMoiQdxhComponent
  ],
  imports: [
    CommonModule,
    XuatHangRoutingModule,
    ComponentsModule
  ],
  exports: [
    XuatHangComponent,
    QuyetDinhXhComponent,
    PhieuXuatKhoComponent,
    BangKeComponent
  ]
})
export class XuatHangModule { }
