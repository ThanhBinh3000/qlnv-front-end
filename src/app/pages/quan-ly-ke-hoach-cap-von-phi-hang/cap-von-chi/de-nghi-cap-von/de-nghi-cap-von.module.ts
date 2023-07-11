import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DeNghiCapVonComponent } from './de-nghi-cap-von.component';
import { DanhSachHopDongComponent } from './hop-dong/danh-sach-hop-dong/danh-sach-hop-dong.component';
import { DialogTaoMoiHopDongComponent } from './hop-dong/dialog-tao-moi-hop-dong/dialog-tao-moi-hop-dong.component';
import { HopDongMuaThocGaoMuoiComponent } from './hop-dong/hop-dong-mua-thoc-gao-muoi/hop-dong-mua-thoc-gao-muoi.component';
import { HopDongMuaVatTuComponent } from './hop-dong/hop-dong-mua-vat-tu/hop-dong-mua-vat-tu.component';
import { DeNghiCapVonMuaThocGaoMuoiTheoDonGiaMuaComponent } from './tong-hop-de-nghi-cap-von/de-nghi-cap-von/de-nghi-cap-von-mua-thoc-gao-muoi-theo-don-gia-mua/de-nghi-cap-von-mua-thoc-gao-muoi-theo-don-gia-mua.component';
import { DeNghiCapVonMuaThocGaoMuoiTheoHopDongComponent } from './tong-hop-de-nghi-cap-von/de-nghi-cap-von-mua-thoc-gao-muoi-theo-hop-dong/de-nghi-cap-von-mua-thoc-gao-muoi-theo-hop-dong.component';
import { DeNghiCapVonMuaVatTuComponent } from './tong-hop-de-nghi-cap-von/de-nghi-cap-von-mua-vat-tu/de-nghi-cap-von-mua-vat-tu.component';
import { DialogTaoMoiDeNghiCapVonComponent } from './tong-hop-de-nghi-cap-von/dialog-tao-moi-de-nghi-cap-von/dialog-tao-moi-de-nghi-cap-von.component';
import { DanhSachCapVonComponent } from './tong-hop-de-nghi-cap-von/chi-cuc/danh-sach-cap-von/danh-sach-cap-von.component';
import { CapVonComponent } from './tong-hop-de-nghi-cap-von/chi-cuc/cap-von/cap-von.component';
import { DialogTaoMoiCapVonComponent } from './tong-hop-de-nghi-cap-von/chi-cuc/dialog-tao-moi-cap-von/dialog-tao-moi-cap-von.component';
import { DanhSachTongHopTuDonViCapDuoiComponent } from './tong-hop-de-nghi-cap-von/danh-sach-tong-hop-tu-don-vi-cap-duoi/danh-sach-tong-hop-tu-don-vi-cap-duoi.component';
import { DanhSachDeNghiTuDonViCapDuoiComponent } from './tong-hop-de-nghi-cap-von/de-nghi-cua-don-vi-cap-duoi/danh-sach-de-nghi-tu-don-vi-cap-duoi/danh-sach-de-nghi-tu-don-vi-cap-duoi.component';
import { HopDongCapVonComponent } from './hop-dong/cap-von/hop-dong-cap-von/hop-dong-cap-von.component';
import { DeNghiDonViCapDuoiComponent } from './tong-hop-de-nghi-cap-von/de-nghi-cua-don-vi-cap-duoi/de-nghi-don-vi-cap-duoi/de-nghi-don-vi-cap-duoi.component';
import { DanhSachDeNghiCapVonComponent } from './tong-hop-de-nghi-cap-von/de-nghi-cap-von/danh-sach-de-nghi-cap-von/danh-sach-de-nghi-cap-von.component';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    declarations: [
        DeNghiCapVonComponent,
        DanhSachHopDongComponent,
        HopDongMuaThocGaoMuoiComponent,
        HopDongMuaVatTuComponent,
        DeNghiCapVonMuaThocGaoMuoiTheoHopDongComponent,
        DeNghiCapVonMuaVatTuComponent,
        DeNghiCapVonMuaThocGaoMuoiTheoDonGiaMuaComponent,
        DialogTaoMoiHopDongComponent,
        DanhSachDeNghiCapVonComponent,
        DialogTaoMoiDeNghiCapVonComponent,
        DanhSachCapVonComponent,
        CapVonComponent,
        DialogTaoMoiCapVonComponent,
        DanhSachTongHopTuDonViCapDuoiComponent,
        DanhSachDeNghiTuDonViCapDuoiComponent,
        HopDongCapVonComponent,
        DeNghiDonViCapDuoiComponent
    ],
    exports: [
        DeNghiCapVonComponent,
    ]
})
export class DeNghiCapVonModule { }
