import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoCaoNhapXuatHangDtqgRoutingModule } from './bao-cao-nhap-xuat-hang-dtqg-routing.module';
import { BaoCaoNhapXuatHangDtqgComponent } from './bao-cao-nhap-xuat-hang-dtqg.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ComponentsModule } from '../../../components/components.module';
import { MainModule } from '../../../layout/main/main.module';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { DirectivesModule } from '../../../directives/directives.module';
import { BcTienDoNhapGaoTheoGoiThauComponent } from './bc-tien-do-nhap-gao-theo-goi-thau/bc-tien-do-nhap-gao-theo-goi-thau.component';
import { BaoCaoChitietXuatGaoHotroDiaphuongComponent } from './bao-cao-chitiet-xuat-gao-hotro-diaphuong/bao-cao-chitiet-xuat-gao-hotro-diaphuong.component';
import {BaoCaoNhapXuatTonComponent} from "./bao-cao-nhap-xuat-ton/bao-cao-nhap-xuat-ton.component";
import { BaoCaoTienDoBdgThocGaoTheoNamComponent } from './bao-cao-tien-do-bdg-thoc-gao-theo-nam/bao-cao-tien-do-bdg-thoc-gao-theo-nam.component';
import { ThongTinDauThauMuaVtComponent } from './thong-tin-dau-thau-mua-vt/thong-tin-dau-thau-mua-vt.component';
import { KquaNhapVtComponent } from './kqua-nhap-vt/kqua-nhap-vt.component';
import { BaoCaoTdoBdgHangTheoNamNhapComponent } from './bao-cao-tdo-bdg-hang-theo-nam-nhap/bao-cao-tdo-bdg-hang-theo-nam-nhap.component';
import { TongHopTonKhoVatTuComponent } from './tong-hop-ton-kho-vat-tu/tong-hop-ton-kho-vat-tu.component';
import {BcKetQuaXuatCapVatTuComponent} from "./bc-ket-qua-xuat-cap-vat-tu/bc-ket-qua-xuat-cap-vat-tu.component";
import {BaoCaoKeHoachHoTroGaoComponent} from "./bao-cao-ke-hoach-ho-tro-gao/bao-cao-ke-hoach-ho-tro-gao.component";
import {BaoCaoKetQuaHoTroGaoComponent} from "./bao-cao-ket-qua-ho-tro-gao/bao-cao-ket-qua-ho-tro-gao.component";
import { BaoCaoBanThocThuocKeHoachNamComponent } from './bao-cao-ban-thoc-thuoc-ke-hoach-nam/bao-cao-ban-thoc-thuoc-ke-hoach-nam.component';
import { BcDanhSachNhaThauUyTinComponent } from './bc-danh-sach-nha-thau-uy-tin/bc-danh-sach-nha-thau-uy-tin.component';
import { BcThKetQuaDauThauGaoTheoNamComponent } from './bc-th-ket-qua-dau-thau-gao-theo-nam/bc-th-ket-qua-dau-thau-gao-theo-nam.component';
import { KqXuatGaoCthtChoDiaPhuongTrongNamComponent } from './kq-xuat-gao-ctht-cho-dia-phuong-trong-nam/kq-xuat-gao-ctht-cho-dia-phuong-trong-nam.component';
import { BcTienDoXuatGaoHoTroHocSinhComponent } from './bc-tien-do-xuat-gao-ho-tro-hoc-sinh/bc-tien-do-xuat-gao-ho-tro-hoc-sinh.component';
import {
  BaoCaoChiTietHoTroGaoHsComponent
} from "src/app/pages/khai-thac-bao-cao/bao-cao-nhap-xuat-hang-dtqg/bao-cao-chi-tiet-ho-tro-gao-hs/bao-cao-chi-tiet-ho-tro-gao-hs.component";


@NgModule({
  declarations: [
    BaoCaoNhapXuatHangDtqgComponent,
    BcTienDoNhapGaoTheoGoiThauComponent,
    BaoCaoChitietXuatGaoHotroDiaphuongComponent,
    BaoCaoNhapXuatTonComponent,
    BaoCaoTienDoBdgThocGaoTheoNamComponent,
    BaoCaoChitietXuatGaoHotroDiaphuongComponent,
    ThongTinDauThauMuaVtComponent,
    KquaNhapVtComponent,
    BaoCaoTdoBdgHangTheoNamNhapComponent,
    TongHopTonKhoVatTuComponent,
    BcKetQuaXuatCapVatTuComponent,
    BaoCaoKeHoachHoTroGaoComponent,
    BaoCaoKetQuaHoTroGaoComponent,
    BaoCaoBanThocThuocKeHoachNamComponent,
    BcDanhSachNhaThauUyTinComponent,
    BcThKetQuaDauThauGaoTheoNamComponent,
    KqXuatGaoCthtChoDiaPhuongTrongNamComponent,
    BcTienDoXuatGaoHoTroHocSinhComponent,
    BaoCaoChiTietHoTroGaoHsComponent
  ],
  imports: [
    CommonModule,
    BaoCaoNhapXuatHangDtqgRoutingModule,
    ComponentsModule,
    MainModule,
    NzTreeViewModule,
    DirectivesModule,
    NzIconModule
  ],
})
export class BaoCaoNhapXuatHangDtqgModule { }
