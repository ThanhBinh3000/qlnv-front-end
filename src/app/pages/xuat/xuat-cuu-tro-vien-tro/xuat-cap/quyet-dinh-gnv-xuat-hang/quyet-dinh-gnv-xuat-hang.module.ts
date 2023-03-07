import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from "../../../../../components/components.module";
import {DirectivesModule} from "../../../../../directives/directives.module";
import {ThongTinQdGnvXuatHangComponent} from "./thong-tin-qd-gnv-xuat-hang/thong-tin-qd-gnv-xuat-hang.component";


@NgModule({
  declarations: [
    ThongTinQdGnvXuatHangComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    ThongTinQdGnvXuatHangComponent,
  ]
})
export class QuyetDinhGnvXuatHangModule {
}
