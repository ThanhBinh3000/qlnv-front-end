import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DanhSachKeHoachBanDauGiaComponent } from './danh-sach-ke-hoach-ban-dau-gia/danh-sach-ke-hoach-ban-dau-gia.component';
import { KeHoachBanDauGiaComponent } from './ke-hoach-ban-dau-gia.component';
import { ThongTinKeHoachBanDauGiaComponent } from './thong-tin-ke-hoach-ban-dau-gia/thong-tin-ke-hoach-ban-dau-gia.component';

@NgModule({
    declarations: [
        KeHoachBanDauGiaComponent,
        DanhSachKeHoachBanDauGiaComponent,
        ThongTinKeHoachBanDauGiaComponent
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        KeHoachBanDauGiaComponent,
    ]
})
export class KeHoachBanDauGiaModule { }
