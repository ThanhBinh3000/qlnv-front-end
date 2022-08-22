import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DeXuatPhuongAnGiaComponent } from './de-xuat-phuong-an-gia.component';
import { ThemDeXuatPagLuongThucComponent } from './them-dx-pag-lt/them-dx-pag-lt.component';
import { ThongTinKsgComponent } from './them-dx-pag-lt/thong-tin-ksg/thong-tin-ksg.component';
import { ThemMoiDeXuatPagComponent } from './them-dx-pag-vt/them-moi-de-xuat-pag.component';


@NgModule({
  declarations: [
    DeXuatPhuongAnGiaComponent,
    ThemDeXuatPagLuongThucComponent,
    ThongTinKsgComponent,
    ThemMoiDeXuatPagComponent
  ],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [DeXuatPhuongAnGiaComponent],
})
export class DeXuatPhuongAnGiaModule { }
