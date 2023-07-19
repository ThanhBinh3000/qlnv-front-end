import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ComponentsModule} from 'src/app/components/components.module';
import {TongHopPhuongAnGiaComponent} from './tong-hop-phuong-an-gia.component';
import {ThemTongHopPhuongAnGiaComponent} from './them-tong-hop-phuong-an-gia/them-tong-hop-phuong-an-gia.component';
import {ThemMoiToTrinhPagComponent} from './them-moi-to-trinh-pag/them-moi-to-trinh-pag.component';
import {DeXuatPhuongAnGiaModule} from "../de-xuat-phuong-an-gia/de-xuat-phuong-an-gia.module";


@NgModule({
  declarations: [TongHopPhuongAnGiaComponent, ThemTongHopPhuongAnGiaComponent, ThemMoiToTrinhPagComponent],
  imports: [CommonModule,
    ComponentsModule, DeXuatPhuongAnGiaModule
  ],
  exports: [TongHopPhuongAnGiaComponent],
})
export class TongHopPhuongAnGiaModule {
}
