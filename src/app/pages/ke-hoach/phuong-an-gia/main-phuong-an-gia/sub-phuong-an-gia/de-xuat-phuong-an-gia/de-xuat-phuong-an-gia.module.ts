import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DeXuatPhuongAnGiaComponent } from './de-xuat-phuong-an-gia.component';
import { ThemDeXuatPagLuongThucComponent } from './them-dx-pag-lt/them-dx-pag-lt.component';
import { ThongTinKsgComponent } from './them-dx-pag-lt/thong-tin-ksg/thong-tin-ksg.component';
import { ThemMoiDeXuatPagComponent } from './them-dx-pag-vt/them-dx-pag-vt';
import {ThongTinKsgVtComponent} from "./them-dx-pag-vt/thong-tin-ksg-vt/thong-tin-ksg-vt.component";


@NgModule({
  declarations: [
    DeXuatPhuongAnGiaComponent,
    ThemDeXuatPagLuongThucComponent,
    ThongTinKsgComponent,
    ThemMoiDeXuatPagComponent,
    ThongTinKsgVtComponent
  ],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [DeXuatPhuongAnGiaComponent, ThemDeXuatPagLuongThucComponent, ThemMoiDeXuatPagComponent],
})
export class DeXuatPhuongAnGiaModule { }
