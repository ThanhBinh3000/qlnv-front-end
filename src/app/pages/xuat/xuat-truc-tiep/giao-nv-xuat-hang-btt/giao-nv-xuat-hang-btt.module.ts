import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {GiaoNvXuatHangBttComponent} from './giao-nv-xuat-hang-btt.component';
import {QdGiaoNvXuatBttComponent} from './qd-giao-nv-xuat-btt/qd-giao-nv-xuat-btt.component';
import {
  ThemMoiQdGiaoNvXuatBttComponent
} from './qd-giao-nv-xuat-btt/them-moi-qd-giao-nv-xuat-btt/them-moi-qd-giao-nv-xuat-btt.component';
import {HopDongBttModule} from '../hop-dong-btt/hop-dong-btt.module';
import {QuyetDinhChaogiaBttModule} from "../quyet-dinh-chaogia-btt/quyet-dinh-chaogia-btt.module";

@NgModule({
  declarations: [
    GiaoNvXuatHangBttComponent,
    QdGiaoNvXuatBttComponent,
    ThemMoiQdGiaoNvXuatBttComponent,

  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    HopDongBttModule,
    QuyetDinhChaogiaBttModule,
  ],
  exports: [
    GiaoNvXuatHangBttComponent,
    ThemMoiQdGiaoNvXuatBttComponent,
  ]
})
export class GiaoNvXuatHangBttModule {
}
