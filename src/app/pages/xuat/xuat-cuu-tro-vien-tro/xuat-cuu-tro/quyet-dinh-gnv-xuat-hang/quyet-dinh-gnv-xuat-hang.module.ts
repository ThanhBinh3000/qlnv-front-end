import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChiTietQdGnvXuatHangComponent} from './chi-tiet-qd-gnv-xuat-hang/chi-tiet-qd-gnv-xuat-hang.component';
import {ComponentsModule} from "src/app/components/components.module";
import {DirectivesModule} from "src/app/directives/directives.module";
import {QuyetDinhGnvXuatHangComponent} from "./quyet-dinh-gnv-xuat-hang.component";
import { ThongTinQdGnvXuatHangComponent } from './thong-tin-qd-gnv-xuat-hang/thong-tin-qd-gnv-xuat-hang.component';


@NgModule({
  declarations: [
    ChiTietQdGnvXuatHangComponent,
    QuyetDinhGnvXuatHangComponent,
    ThongTinQdGnvXuatHangComponent
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
