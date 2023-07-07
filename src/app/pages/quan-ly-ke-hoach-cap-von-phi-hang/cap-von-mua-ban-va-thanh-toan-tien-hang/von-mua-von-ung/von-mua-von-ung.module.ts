import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { VonMuaVonUngComponent } from './von-mua-von-ung.component';
import { DanhSachVonMuaVonUngComponent } from './danh-sach-von-mua-von-ung/danh-sach-von-mua-von-ung.component';
import { DialogTaoMoiCapVonComponent } from './dialog-tao-moi-cap-von/dialog-tao-moi-cap-von.component';
import { CapUngVonComponent } from './cap-ung-von/cap-ung-von.component';
import { QuanLyThuChiComponent } from './quan-ly-thu-chi/quan-ly-thu-chi.component';

@NgModule({
    declarations: [
        VonMuaVonUngComponent,
        DanhSachVonMuaVonUngComponent,
        CapUngVonComponent,
        QuanLyThuChiComponent,
        // CapUngVonChoDvcdComponent,
        // ThanhToanKhachHangTheoDonGiaComponent,
        // ThanhToanKhachHangTheoHopDongVatTuComponent,
        // ThanhToanKhachHangTheoHopDongThocGaoMuoiComponent,
        // NopTienThuaComponent,
        DialogTaoMoiCapVonComponent,
        // DialogTaoMoiTienThuaComponent,
        // DialogTaoMoiThanhToanComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonMuaVonUngComponent,
        // DanhSachVonMuaVonUngComponent,
        // CapUngVonChoDvcdComponent,
        // ThanhToanKhachHangTheoDonGiaComponent,
        // ThanhToanKhachHangTheoHopDongVatTuComponent,
        // ThanhToanKhachHangTheoHopDongThocGaoMuoiComponent,
        // NopTienThuaComponent,
        // DialogTaoMoiCapVonComponent,
        // DialogTaoMoiTienThuaComponent,
        // DialogTaoMoiThanhToanComponent,
    ]
})
export class VonMuaVonUngModule { }
