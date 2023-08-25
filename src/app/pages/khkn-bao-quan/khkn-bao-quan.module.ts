import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { KhknBaoQuanRoutingModule } from './khkn-bao-quan-routing.module';
import { KhknBaoQuanComponent } from './khkn-bao-quan.component';
import { QuanLyCongTrinhNghienCuuBaoQuanComponent } from './quan-ly-cong-trinh-nghien-cuu-bao-quan/quan-ly-cong-trinh-nghien-cuu-bao-quan.component';
import { ThongTinQuanLyCongTrinhNghienCuuModule } from './quan-ly-cong-trinh-nghien-cuu-bao-quan/thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan/thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan.module';
import { QuanLyQuyChuanKyThuatQuocGiaComponent } from './quan-ly-quy-chuan-ky-thuat-quoc-gia/quan-ly-quy-chuan-ky-thuat-quoc-gia.component';
import { ThongTinQuanLyQuyChuanKyThuatQuocGiaComponent } from './quan-ly-quy-chuan-ky-thuat-quoc-gia/thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia/thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia.component';
import { TieuChuanKyThuatComponent } from './quan-ly-quy-chuan-ky-thuat-quoc-gia/thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia/tieu-chuan-ky-thuat/tieu-chuan-ky-thuat.component';
import { TimKiemVanBanComponent } from './quan-ly-quy-chuan-ky-thuat-quoc-gia/thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia/tim-kiem-van-ban/tim-kiem-van-ban.component';


@NgModule({
    declarations: [
        KhknBaoQuanComponent,
        QuanLyCongTrinhNghienCuuBaoQuanComponent,
        QuanLyQuyChuanKyThuatQuocGiaComponent,
        ThongTinQuanLyQuyChuanKyThuatQuocGiaComponent,
        TieuChuanKyThuatComponent,
        TimKiemVanBanComponent,
    ],
  imports: [CommonModule, KhknBaoQuanRoutingModule, ComponentsModule, MainModule, ThongTinQuanLyCongTrinhNghienCuuModule],
})
export class KhknBaoQuanModule { }
