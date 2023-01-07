import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CapUngVonChoDvcdComponent } from './cap-ung-von-cho-dvcd/cap-ung-von-cho-dvcd.component';
import { DanhSachVonMuaVonUngComponent } from './danh-sach-von-mua-von-ung/danh-sach-von-mua-von-ung.component';
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
    ]
})
export class VonMuaVonUngModule { }
