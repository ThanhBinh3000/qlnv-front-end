import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChiTietQdGnvXuatHangComponent} from './chi-tiet-qd-gnv-xuat-hang/chi-tiet-qd-gnv-xuat-hang.component';
import {ComponentsModule} from "../../../../components/components.module";
import {DirectivesModule} from "../../../../directives/directives.module";
import {QuyetDinhGnvXuatHangComponent} from "./quyet-dinh-gnv-xuat-hang.component";


@NgModule({
  declarations: [
    ChiTietQdGnvXuatHangComponent,
    QuyetDinhGnvXuatHangComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    QuyetDinhGnvXuatHangComponent,
    ChiTietQdGnvXuatHangComponent,
  ]
})
export class QuyetDinhGnvXuatHangModule {
}
