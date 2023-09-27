import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XuatKhoRoutingModule } from './xuat-kho-routing.module';
import { XuatKhoComponent } from './xuat-kho.component';
import {ComponentsModule} from "../../../../../components/components.module";
import { XtlPhieuXkComponent } from './xtl-phieu-xk/xtl-phieu-xk.component';
import { XtlBangKeChComponent } from './xtl-bang-ke-ch/xtl-bang-ke-ch.component';
import { XtlBbTinhKhoComponent } from './xtl-bb-tinh-kho/xtl-bb-tinh-kho.component';
import { XtlBbHaoDoiComponent } from './xtl-bb-hao-doi/xtl-bb-hao-doi.component';
import { XtlThemPhieuXkComponent } from './xtl-phieu-xk/xtl-them-phieu-xk/xtl-them-phieu-xk.component';
import { XtlThemBangKeChComponent } from './xtl-bang-ke-ch/xtl-them-bang-ke-ch/xtl-them-bang-ke-ch.component';
import { XtlThemBbHaoDoiComponent } from './xtl-bb-hao-doi/xtl-them-bb-hao-doi/xtl-them-bb-hao-doi.component';
import { XtlThemBbTinhKhoComponent } from './xtl-bb-tinh-kho/xtl-them-bb-tinh-kho/xtl-them-bb-tinh-kho.component';


@NgModule({
  declarations: [
    XuatKhoComponent,
    XtlPhieuXkComponent,
    XtlBangKeChComponent,
    XtlBbTinhKhoComponent,
    XtlBbHaoDoiComponent,
    XtlThemPhieuXkComponent,
    XtlThemBangKeChComponent,
    XtlThemBbHaoDoiComponent,
    XtlThemBbTinhKhoComponent
  ],
  imports: [
    CommonModule,
    XuatKhoRoutingModule,
    ComponentsModule
  ]
})
export class XuatKhoModule { }
