import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DeNghiCapVonCacDonViComponent } from './de-nghi-cap-von-cac-don-vi.component';
import { DanhSachDeNghiCapVonComponent } from './danh-sach-de-nghi-cap-von/danh-sach-de-nghi-cap-von.component';
import { CapVonQuyetDinhDonGiaMuaComponent } from './cap-von-quyet-dinh-don-gia-mua/cap-von-quyet-dinh-don-gia-mua.component';
import { DialogTaoMoiCapVonComponent } from './dialog-tao-moi-cap-von/dialog-tao-moi-cap-von.component';
import { DanhSachDeNghiCapVonTuDvcdComponent } from './danh-sach-de-nghi-cap-von-tu-dvcd/danh-sach-de-nghi-cap-von-tu-dvcd.component';
import { DeNghiCapVonQuyetDinhDonGiaMuaComponent } from './de-nghi-cap-von-quyet-dinh-don-gia-mua/de-nghi-cap-von-quyet-dinh-don-gia-mua.component';
import { DialogTaoMoiDeNghiComponent } from './dialog-tao-moi-de-nghi/dialog-tao-moi-de-nghi.component';
import { DialogTongHopCapVonComponent } from './dialog-tong-hop-cap-von/dialog-tong-hop-cap-von.component';
import { DeNghiCapVonTheoHopDongTrungThauComponent } from './de-nghi-cap-von-theo-hop-dong-trung-thau/de-nghi-cap-von-theo-hop-dong-trung-thau.component';
import { CapVonTheoHopDongTrungThauComponent } from './cap-von-theo-hop-dong-trung-thau/cap-von-theo-hop-dong-trung-thau.component';

@NgModule({
    declarations: [
        DeNghiCapVonCacDonViComponent,
        DanhSachDeNghiCapVonComponent,
        DanhSachDeNghiCapVonTuDvcdComponent,
        CapVonQuyetDinhDonGiaMuaComponent,
        CapVonTheoHopDongTrungThauComponent,
        DeNghiCapVonQuyetDinhDonGiaMuaComponent,
        DeNghiCapVonTheoHopDongTrungThauComponent,
        DialogTaoMoiCapVonComponent,
        DialogTaoMoiDeNghiComponent,
        DialogTongHopCapVonComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
  exports: [
    DeNghiCapVonCacDonViComponent,
    DeNghiCapVonQuyetDinhDonGiaMuaComponent,
  ],
})
export class DeNghiCapVonCacDonViModule { }
