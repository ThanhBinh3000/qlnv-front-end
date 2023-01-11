import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DeNghiCapVonComponent } from './de-nghi-cap-von.component';
import { DanhSachHopDongComponent } from './hop-dong/danh-sach-hop-dong/danh-sach-hop-dong.component';
import { DialogTaoMoiHopDongComponent } from './hop-dong/dialog-tao-moi-hop-dong/dialog-tao-moi-hop-dong.component';
import { HopDongMuaThocGaoMuoiComponent } from './hop-dong/hop-dong-mua-thoc-gao-muoi/hop-dong-mua-thoc-gao-muoi.component';
import { HopDongMuaVatTuComponent } from './hop-dong/hop-dong-mua-vat-tu/hop-dong-mua-vat-tu.component';
import { DanhSachDeNghiCapVonComponent } from './tong-hop-de-nghi-cap-von/danh-sach-de-nghi-cap-von/danh-sach-de-nghi-cap-von.component';
import { DeNghiCapVonMuaThocGaoMuoiTheoDonGiaMuaComponent } from './tong-hop-de-nghi-cap-von/de-nghi-cap-von-mua-thoc-gao-muoi-theo-don-gia-mua/de-nghi-cap-von-mua-thoc-gao-muoi-theo-don-gia-mua.component';
import { DeNghiCapVonMuaThocGaoMuoiTheoHopDongComponent } from './tong-hop-de-nghi-cap-von/de-nghi-cap-von-mua-thoc-gao-muoi-theo-hop-dong/de-nghi-cap-von-mua-thoc-gao-muoi-theo-hop-dong.component';
import { DeNghiCapVonMuaVatTuComponent } from './tong-hop-de-nghi-cap-von/de-nghi-cap-von-mua-vat-tu/de-nghi-cap-von-mua-vat-tu.component';
import { DialogTaoMoiDeNghiCapVonComponent } from './tong-hop-de-nghi-cap-von/dialog-tao-moi-de-nghi-cap-von/dialog-tao-moi-de-nghi-cap-von.component';

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
    ],
    exports: [
        DeNghiCapVonComponent,
    ]
})
export class DeNghiCapVonModule { }
