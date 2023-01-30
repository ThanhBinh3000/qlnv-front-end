import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { QuanLyKhoTangRoutingModule } from './quan-ly-kho-tang-routing.module';
import { QuanLyKhoTangComponent } from './quan-ly-kho-tang.component';
import { MangLuoiKhoComponent } from './mang-luoi-kho/mang-luoi-kho.component';
import { KeHoachComponent } from './ke-hoach/ke-hoach.component';
import { QuyHoachKhoComponent } from './ke-hoach/quy-hoach-kho/quy-hoach-kho.component';
import { KeHoachXayDungTrungHanComponent } from './ke-hoach/ke-hoach-xay-dung-trung-han/ke-hoach-xay-dung-trung-han.component';
import { KeHoachXayDungHangNamComponent } from './ke-hoach/ke-hoach-xay-dung-hang-nam/ke-hoach-xay-dung-hang-nam.component';
import { KeHoachSuaChuaLonComponent } from './ke-hoach/ke-hoach-sua-chua-lon/ke-hoach-sua-chua-lon.component';
import { KeHoachSuaChuaHangNamComponent } from './ke-hoach/ke-hoach-sua-chua-hang-nam/ke-hoach-sua-chua-hang-nam.component';
import { QuyetDinhQuyHoachComponent } from './ke-hoach/quy-hoach-kho/quyet-dinh-quy-hoach/quyet-dinh-quy-hoach.component';
import { QuyetDinhDieuChinhQuyHoachComponent } from './ke-hoach/quy-hoach-kho/quyet-dinh-dieu-chinh-quy-hoach/quyet-dinh-dieu-chinh-quy-hoach.component';
import { DeXuatKeHoachComponent } from './ke-hoach/ke-hoach-xay-dung-trung-han/de-xuat-ke-hoach/de-xuat-ke-hoach.component';
import { TongHopDeXuatKeHoachComponent } from './ke-hoach/ke-hoach-xay-dung-trung-han/tong-hop-de-xuat-ke-hoach/tong-hop-de-xuat-ke-hoach.component';
import { QuyetDinhPheDuyetKeHoachComponent } from './ke-hoach/ke-hoach-xay-dung-trung-han/quyet-dinh-phe-duyet-ke-hoach/quyet-dinh-phe-duyet-ke-hoach.component';
import { DeXuatNhuCauComponent } from './ke-hoach/ke-hoach-xay-dung-hang-nam/de-xuat-nhu-cau/de-xuat-nhu-cau.component';
import { TongHopDxNhuCauComponent } from './ke-hoach/ke-hoach-xay-dung-hang-nam/tong-hop-dx-nhu-cau/tong-hop-dx-nhu-cau.component';
import { QuyetDinhPheDuyetKhxdComponent } from './ke-hoach/ke-hoach-xay-dung-hang-nam/quyet-dinh-phe-duyet-khxd/quyet-dinh-phe-duyet-khxd.component';
import {ThemMoiQdComponent} from "./ke-hoach/quy-hoach-kho/quyet-dinh-quy-hoach/them-moi-qd/them-moi-qd.component";
import {
    ThemMoiQdDcComponent
} from "./ke-hoach/quy-hoach-kho/quyet-dinh-dieu-chinh-quy-hoach/them-moi-qd-dc/them-moi-qd-dc.component";
import {
  ThemMoiDxkhTrungHanComponent
} from "./ke-hoach/ke-hoach-xay-dung-trung-han/de-xuat-ke-hoach/them-moi-dxkh-trung-han/them-moi-dxkh-trung-han.component";
import {
  ThemMoiTongHopKhxdTrungHanComponent
} from "./ke-hoach/ke-hoach-xay-dung-trung-han/tong-hop-de-xuat-ke-hoach/them-moi-tong-hop-khxd-trung-han/them-moi-tong-hop-khxd-trung-han.component";
import {
    ThemMoiQdPheDuyetComponent
} from "./ke-hoach/ke-hoach-xay-dung-trung-han/quyet-dinh-phe-duyet-ke-hoach/them-moi-qd-phe-duyet/them-moi-qd-phe-duyet.component";
import {
    ThemMoiDxNhuCauComponent
} from "./ke-hoach/ke-hoach-xay-dung-hang-nam/de-xuat-nhu-cau/them-moi-dx-nhu-cau/them-moi-dx-nhu-cau.component";
import {
  ThemMoiQdPdDxNhuCauComponent
} from "./ke-hoach/ke-hoach-xay-dung-hang-nam/quyet-dinh-phe-duyet-khxd/them-moi-qd-pd-dx-nhu-cau/them-moi-qd-pd-dx-nhu-cau.component";
import {
  ThemMoiTongHopDxNhuCauComponent
} from "./ke-hoach/ke-hoach-xay-dung-hang-nam/tong-hop-dx-nhu-cau/them-moi-tong-hop-dx-nhu-cau/them-moi-tong-hop-dx-nhu-cau.component";
import { ThemMoiKhoComponent } from './mang-luoi-kho/them-moi-kho/them-moi-kho.component';
import {DanhMucDuAnComponent} from "./ke-hoach/danh-muc-du-an/danh-muc-du-an.component";


@NgModule({
    declarations: [
        QuanLyKhoTangComponent,
        MangLuoiKhoComponent,
        KeHoachComponent,
        QuyHoachKhoComponent,
        KeHoachXayDungTrungHanComponent,
        KeHoachXayDungHangNamComponent,
        KeHoachSuaChuaLonComponent,
        KeHoachSuaChuaHangNamComponent,
        QuyetDinhQuyHoachComponent,
        QuyetDinhDieuChinhQuyHoachComponent,
        DeXuatKeHoachComponent,
        TongHopDeXuatKeHoachComponent,
        QuyetDinhPheDuyetKeHoachComponent,
        DeXuatNhuCauComponent,
        TongHopDxNhuCauComponent,
        QuyetDinhPheDuyetKhxdComponent,
        ThemMoiQdComponent,
        ThemMoiQdDcComponent,
        ThemMoiDxkhTrungHanComponent,
        ThemMoiTongHopKhxdTrungHanComponent,
        ThemMoiQdPheDuyetComponent,
        ThemMoiDxNhuCauComponent,
        ThemMoiQdPdDxNhuCauComponent,
        ThemMoiTongHopDxNhuCauComponent,
        ThemMoiKhoComponent,
        DanhMucDuAnComponent,
    ],
    imports: [CommonModule, QuanLyKhoTangRoutingModule, ComponentsModule, MainModule],
})
export class QuanLyKhoTangModule {
}
