import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CapUngVonChoDonViCapDuoiComponent } from './cap-ung-von-cho-don-vi-cap-duoi/cap-ung-von-cho-don-vi-cap-duoi.component';
import { DanhSachCapUngVonChoDonViCapDuoiComponent } from './danh-sach-cap-ung-von-cho-don-vi-cap-duoi/danh-sach-cap-ung-von-cho-don-vi-cap-duoi.component';
import { DanhSachGhiNhanCapUngVonTaiCkvCcComponent } from './danh-sach-ghi-nhan-cap-ung-von-tai-ckv-cc/danh-sach-ghi-nhan-cap-ung-von-tai-ckv-cc.component';
import { DanhSachGhiNhanCapUngVonTaiTongCucComponent } from './danh-sach-ghi-nhan-cap-ung-von-tai-tong-cuc/danh-sach-ghi-nhan-cap-ung-von-tai-tong-cuc.component';
import { DanhSachGhiNhanTienThuaComponent } from './danh-sach-ghi-nhan-tien-thua/danh-sach-ghi-nhan-tien-thua.component';
import { DanhSachThanhToanChoKhachHangComponent } from './danh-sach-thanh-toan-cho-khach-hang/danh-sach-thanh-toan-cho-khach-hang.component';
import { DanhSachTienThuaComponent } from './danh-sach-tien-thua/danh-sach-tien-thua.component';
import { DialogTaoMoiComponent } from './dialog-tao-moi/dialog-tao-moi.component';
import { GhiNhanCapUngVonTaiCkvCcComponent } from './ghi-nhan-cap-ung-von-tai-ckv-cc/ghi-nhan-cap-ung-von-tai-ckv-cc.component';
import { GhiNhanCapUngVonTuDvctTaiTongCucComponent } from './ghi-nhan-cap-ung-von-tu-dvct-tai-tong-cuc/ghi-nhan-cap-ung-von-tu-dvct-tai-tong-cuc.component';
import { ThanhToanChoKhachHangComponent } from './thanh-toan-cho-khach-hang/thanh-toan-cho-khach-hang.component';
import { TienVonThuaComponent } from './tien-von-thua/tien-von-thua.component';
import { VonMuaVonUngComponent } from './von-mua-von-ung.component';

@NgModule({
    declarations: [
        VonMuaVonUngComponent,
        //ghi nhan von tu don vi cap tren
        DanhSachGhiNhanCapUngVonTaiTongCucComponent,
        DanhSachGhiNhanCapUngVonTaiCkvCcComponent,
        GhiNhanCapUngVonTuDvctTaiTongCucComponent,
        GhiNhanCapUngVonTaiCkvCcComponent,
        //cap ung von cho don vi cap duoi
        DanhSachCapUngVonChoDonViCapDuoiComponent,
        CapUngVonChoDonViCapDuoiComponent,
        //nop tien von thua
        DanhSachTienThuaComponent,
        DanhSachGhiNhanTienThuaComponent,
        TienVonThuaComponent,
        //thanh toan cho khach hang
        DanhSachThanhToanChoKhachHangComponent,
        ThanhToanChoKhachHangComponent,
        //tao moi bao cao
        DialogTaoMoiComponent,
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        DirectivesModule,
    ],
    exports: [
        VonMuaVonUngComponent,
        DanhSachGhiNhanCapUngVonTaiTongCucComponent,
        DanhSachGhiNhanCapUngVonTaiCkvCcComponent,
        GhiNhanCapUngVonTuDvctTaiTongCucComponent,
        GhiNhanCapUngVonTaiCkvCcComponent,
        DanhSachCapUngVonChoDonViCapDuoiComponent,
        CapUngVonChoDonViCapDuoiComponent,
        DanhSachTienThuaComponent,
        DanhSachGhiNhanTienThuaComponent,
        TienVonThuaComponent,
        DanhSachThanhToanChoKhachHangComponent,
        ThanhToanChoKhachHangComponent,
        DialogTaoMoiComponent,
    ]
})
export class VonMuaVonUngModule { }
