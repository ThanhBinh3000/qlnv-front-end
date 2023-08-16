import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TochucTrienkhaiMuatructiepComponent } from './tochuc-trienkhai-muatructiep.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ChaogiaUyquyenMualeComponent } from './chaogia-uyquyen-muale/chaogia-uyquyen-muale.component';
import { MainModule } from 'src/app/layout/main/main.module';
import { TheoPhuongThucMuaTrucTiepComponent } from './theo-phuong-thuc-mua-truc-tiep/theo-phuong-thuc-mua-truc-tiep.component';
import { QuyetdinhPheduyetKqcgComponent } from './quyetdinh-pheduyet-kqcg/quyetdinh-pheduyet-kqcg.component';
import { ThemmoiQuyetdinhKetquaChaogiaComponent } from './quyetdinh-pheduyet-kqcg/themmoi-quyetdinh-ketqua-chaogia/themmoi-quyetdinh-ketqua-chaogia.component';
import { ThemmoiChaogiaUyquyenMualeComponent } from './chaogia-uyquyen-muale/themmoi-chaogia-uyquyen-muale/themmoi-chaogia-uyquyen-muale.component';
@NgModule({
  declarations: [
    TochucTrienkhaiMuatructiepComponent,
    ChaogiaUyquyenMualeComponent,
    TheoPhuongThucMuaTrucTiepComponent,
    QuyetdinhPheduyetKqcgComponent,
    ThemmoiQuyetdinhKetquaChaogiaComponent,
    ThemmoiChaogiaUyquyenMualeComponent

  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
  ],
    exports: [
        TochucTrienkhaiMuatructiepComponent,
        ChaogiaUyquyenMualeComponent,
        TheoPhuongThucMuaTrucTiepComponent,
        QuyetdinhPheduyetKqcgComponent,
    ]
})
export class TochucTrienkhaiMuatructiepModule { }
