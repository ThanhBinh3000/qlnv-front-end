import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CapUngVonChoDvcdComponent } from './cap-ung-von-cho-dvcd/cap-ung-von-cho-dvcd.component';
import { DanhSachVonMuaVonUngComponent } from './danh-sach-von-mua-von-ung/danh-sach-von-mua-von-ung.component';
import { DialogTaoMoiCapVonComponent } from './dialog-tao-moi-cap-von/dialog-tao-moi-cap-von.component';
import { DialogTaoMoiThanhToanComponent } from './dialog-tao-moi-thanh-toan/dialog-tao-moi-thanh-toan.component';
import { DialogTaoMoiTienThuaComponent } from './dialog-tao-moi-tien-thua/dialog-tao-moi-tien-thua.component';
import { GhiNhanCapUngVonTuBtcComponent } from './ghi-nhan-cap-ung-von-tu-btc/ghi-nhan-cap-ung-von-tu-btc.component';
import { NopTienThuaComponent } from './nop-tien-thua/nop-tien-thua.component';
import { ThanhToanKhachHangTheoDonGiaComponent } from './thanh-toan-cho-khach-hang/thanh-toan-khach-hang-theo-don-gia/thanh-toan-khach-hang-theo-don-gia.component';
import { ThanhToanKhachHangTheoHopDongThocGaoMuoiComponent } from './thanh-toan-cho-khach-hang/thanh-toan-khach-hang-theo-hop-dong-thoc-gao-muoi/thanh-toan-khach-hang-theo-hop-dong-thoc-gao-muoi.component';
import { ThanhToanKhachHangTheoHopDongVatTuComponent } from './thanh-toan-cho-khach-hang/thanh-toan-khach-hang-theo-hop-dong-vat-tu/thanh-toan-khach-hang-theo-hop-dong-vat-tu.component';
import { VonMuaVonUngComponent } from './von-mua-von-ung.component';

@NgModule({
    declarations: [
        VonMuaVonUngComponent,
        DanhSachVonMuaVonUngComponent,
        GhiNhanCapUngVonTuBtcComponent,
        CapUngVonChoDvcdComponent,
        ThanhToanKhachHangTheoDonGiaComponent,
        ThanhToanKhachHangTheoHopDongVatTuComponent,
        ThanhToanKhachHangTheoHopDongThocGaoMuoiComponent,
        NopTienThuaComponent,
        DialogTaoMoiCapVonComponent,
        DialogTaoMoiTienThuaComponent,
        DialogTaoMoiThanhToanComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonMuaVonUngComponent,
        DanhSachVonMuaVonUngComponent,
        GhiNhanCapUngVonTuBtcComponent,
        CapUngVonChoDvcdComponent,
        ThanhToanKhachHangTheoDonGiaComponent,
        ThanhToanKhachHangTheoHopDongVatTuComponent,
        ThanhToanKhachHangTheoHopDongThocGaoMuoiComponent,
        NopTienThuaComponent,
        DialogTaoMoiCapVonComponent,
        DialogTaoMoiTienThuaComponent,
        DialogTaoMoiThanhToanComponent,
    ]
})
export class VonMuaVonUngModule { }
