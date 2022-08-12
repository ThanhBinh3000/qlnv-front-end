import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { PhuongAnGiaRoutingModule } from './phuong-an-gia-routing.module';
import { PhuongAnGiaComponent } from './phuong-an-gia.component';
import { ThocGaoMuoiModule } from './thoc-gao-muoi/thoc-gao-muoi.module';
import { VatTuThietBiComponent } from './vat-tu-thiet-bi/vat-tu-thiet-bi.component';
import { VatTuThietBiModule } from './vat-tu-thiet-bi/vat-tu-thiet-bi.module';


@NgModule({
  declarations: [
    PhuongAnGiaComponent,
  ],
  imports: [
    CommonModule,
    PhuongAnGiaRoutingModule,
    ComponentsModule,
    ThocGaoMuoiModule,
    VatTuThietBiModule,
  ],
})
export class PhuongAnGiaModule { }
