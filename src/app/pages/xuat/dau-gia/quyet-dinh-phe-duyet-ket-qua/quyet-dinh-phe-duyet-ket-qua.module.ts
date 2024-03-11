import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {QuyetDinhPheDuyetKetQuaComponent} from "./quyet-dinh-phe-duyet-ket-qua.component";
import {
  DanhSachQuyetDinhPheDuyetKetQuaComponent
} from './danh-sach-quyet-dinh-phe-duyet-ket-qua/danh-sach-quyet-dinh-phe-duyet-ket-qua.component';
import {
  ThemMoiQuyetDinhPheDuyetKetQuaComponent
} from './danh-sach-quyet-dinh-phe-duyet-ket-qua/them-moi-quyet-dinh-phe-duyet-ket-qua/them-moi-quyet-dinh-phe-duyet-ket-qua.component';
import {KeHoachBanDauGiaModule} from "../ke-hoach-ban-dau-gia/ke-hoach-ban-dau-gia.module";

@NgModule({
  declarations: [
    QuyetDinhPheDuyetKetQuaComponent,
    DanhSachQuyetDinhPheDuyetKetQuaComponent,
    ThemMoiQuyetDinhPheDuyetKetQuaComponent,
  ],
  exports: [
    QuyetDinhPheDuyetKetQuaComponent,
    ThemMoiQuyetDinhPheDuyetKetQuaComponent,
    DanhSachQuyetDinhPheDuyetKetQuaComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    KeHoachBanDauGiaModule,
  ]
})
export class QuyetDinhPheDuyetKetQuaModule {
}
