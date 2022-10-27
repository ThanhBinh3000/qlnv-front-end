import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DanhSachDeNghiCapVonComponent } from './danh-sach-de-nghi-cap-von/danh-sach-de-nghi-cap-von.component';
import { DeNghiCapVonComponent } from './de-nghi-cap-von.component';
import { DeNghiTheoDonGiaMuaComponent } from './de-nghi-theo-don-gia-mua/de-nghi-theo-don-gia-mua.component';
import { DeNghiTheoHopDongTrungThauComponent } from './de-nghi-theo-hop-dong-trung-thau/de-nghi-theo-hop-dong-trung-thau.component';
import { DialogTaoMoiDeNghiComponent } from './dialog-tao-moi-de-nghi/dialog-tao-moi-de-nghi.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    declarations: [
        DeNghiCapVonComponent,
        DanhSachDeNghiCapVonComponent,
        DeNghiTheoDonGiaMuaComponent,
        DialogTaoMoiDeNghiComponent,
        DeNghiTheoHopDongTrungThauComponent,
    ],
    exports: [
        DeNghiCapVonComponent,
        DanhSachDeNghiCapVonComponent,
        DeNghiTheoDonGiaMuaComponent,
        DialogTaoMoiDeNghiComponent,
        DeNghiTheoHopDongTrungThauComponent,
    ]
})
export class DeNghiCapVonModule { }
