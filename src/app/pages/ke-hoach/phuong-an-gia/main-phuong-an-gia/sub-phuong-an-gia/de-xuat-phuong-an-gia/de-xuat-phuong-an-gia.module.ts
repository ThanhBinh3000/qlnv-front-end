import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DeXuatPhuongAnGiaComponent } from './de-xuat-phuong-an-gia.component';
import { ThemQdDeXuatPhuongAnGiaComponent } from './them-dx-pag-lt/them-qd-de-xuat-phuong-an-gia.component';
import { ThongTinKsgComponent } from './them-dx-pag-lt/thong-tin-ksg/thong-tin-ksg.component';
import { ThemMoiDeXuatPagComponent } from './them-dx-pag-vt/them-moi-de-xuat-pag.component';


@NgModule({
  declarations: [
    DeXuatPhuongAnGiaComponent,
    ThemQdDeXuatPhuongAnGiaComponent,
    ThongTinKsgComponent,
    ThemMoiDeXuatPagComponent
  ],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [DeXuatPhuongAnGiaComponent],
})
export class DeXuatPhuongAnGiaModule { }
