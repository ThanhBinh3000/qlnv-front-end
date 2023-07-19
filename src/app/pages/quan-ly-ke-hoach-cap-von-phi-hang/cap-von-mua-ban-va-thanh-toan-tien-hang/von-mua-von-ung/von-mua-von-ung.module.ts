import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { VonMuaVonUngComponent } from './von-mua-von-ung.component';
import { CapUngVonComponent } from './cap-ung-von/cap-ung-von.component';
import { DanhSachVonMuaVonUngComponent } from './danh-sach-von-mua-von-ung/danh-sach-von-mua-von-ung.component';
import { DialogTaoMoiCapUngVonComponent } from './cap-ung-von/dialog-tao-moi-cap-ung-von/dialog-tao-moi-cap-ung-von.component';
import { QuanLyThuChiComponent } from './quan-ly-thu-chi/quan-ly-thu-chi.component';
import { NopTienThuaComponent } from './nop-tien-thua/nop-tien-thua.component';
import { DialogTaoMoiTienThuaComponent } from './nop-tien-thua/dialog-tao-moi-tien-thua/dialog-tao-moi-tien-thua.component';
import { DialogTaoMoiThanhToanComponent } from './thanh-toan-cho-khach-hang/dialog-tao-moi-thanh-toan/dialog-tao-moi-thanh-toan.component';
import { ThanhToanTheoDonGiaComponent } from './thanh-toan-cho-khach-hang/thanh-toan-theo-don-gia/thanh-toan-theo-don-gia.component';
import { ThanhToanTheoHopDongComponent } from './thanh-toan-cho-khach-hang/thanh-toan-theo-hop-dong/thanh-toan-theo-hop-dong.component';

@NgModule({
    declarations: [
        VonMuaVonUngComponent,
        DanhSachVonMuaVonUngComponent,
        CapUngVonComponent,
        DialogTaoMoiCapUngVonComponent,
        QuanLyThuChiComponent,
        NopTienThuaComponent,
        DialogTaoMoiTienThuaComponent,
        DialogTaoMoiThanhToanComponent,
        ThanhToanTheoDonGiaComponent,
        ThanhToanTheoHopDongComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonMuaVonUngComponent,
    ]
})
export class VonMuaVonUngModule { }
