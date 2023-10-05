import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';
import { DieuChinhModule } from './dieu-chinh/dieu-chinh.module';
import { GiaoNhapHangModule } from './giao-nhap-hang/giao-nhap-hang.module';
import { HopDongModule } from './hop-dong/hop-dong.module';
import { KehoachLuachonNhathauModule } from './kehoach-luachon-nhathau/kehoach-luachon-nhathau.module';
import { KiemTraChatLuongModule } from './kiem-tra-chat-luong/kiem-tra-chat-luong.module';
import { NhapKhoModule } from './nhap-kho/nhap-kho.module';
import {QuyetdinhKetquaLcntComponent} from "./quyetdinh-ketqua-lcnt/quyetdinh-ketqua-lcnt.component";
import {
  DanhSachQuyetdinhKetquaLcntComponent
} from "./quyetdinh-ketqua-lcnt/danh-sach-quyetdinh-ketqua-lcnt/danh-sach-quyetdinh-ketqua-lcnt.component";
import {
  ThemmoiQuyetdinhKetquaLcntComponent
} from "./quyetdinh-ketqua-lcnt/themmoi-quyetdinh-ketqua-lcnt/themmoi-quyetdinh-ketqua-lcnt.component";
import {TrienkhaiLuachonNhathauComponent} from "./trienkhai-luachon-nhathau/trienkhai-luachon-nhathau.component";
import {
  TheoPhuongThucDauThauComponent
} from "./trienkhai-luachon-nhathau/theo-phuong-thuc-dau-thau/theo-phuong-thuc-dau-thau.component";
import {ThongtinDauthauComponent} from "./trienkhai-luachon-nhathau/thongtin-dauthau/thongtin-dauthau.component";
import {
  ThemmoiThongtinDauthauComponent
} from "./trienkhai-luachon-nhathau/thongtin-dauthau/themmoi-thongtin-dauthau/themmoi-thongtin-dauthau.component";
import {QdPdHsMoiThauComponent} from "./trienkhai-luachon-nhathau/qd-pd-hs-moi-thau/qd-pd-hs-moi-thau.component";
import {
  ThemMoiQdPdHsMtVtComponent
} from "./trienkhai-luachon-nhathau/qd-pd-hs-moi-thau/them-moi-qd-pd-hs-mt-vt/them-moi-qd-pd-hs-mt-vt.component";
import {
  ThemmoiThongtinDauthauVtComponent
} from "./trienkhai-luachon-nhathau/thongtin-dauthau/themmoi-thongtin-dauthau-vt/themmoi-thongtin-dauthau-vt.component";
import { ThemMoiQdPdHsMtComponent } from './trienkhai-luachon-nhathau/qd-pd-hs-moi-thau/them-moi-qd-pd-hs-mt/them-moi-qd-pd-hs-mt.component';

@NgModule({
  declarations: [
    DauThauComponent,
    QuyetdinhKetquaLcntComponent,
    DanhSachQuyetdinhKetquaLcntComponent,
    ThemmoiQuyetdinhKetquaLcntComponent,
    TrienkhaiLuachonNhathauComponent,
    TheoPhuongThucDauThauComponent,
    ThongtinDauthauComponent,
    ThemmoiThongtinDauthauComponent,
    QdPdHsMoiThauComponent,
    ThemMoiQdPdHsMtVtComponent,
    ThemmoiThongtinDauthauVtComponent,
    ThemMoiQdPdHsMtComponent,
  ],
  imports: [
    CommonModule,
    DauThauRoutingModule,
    ComponentsModule,
    DirectivesModule,
    KiemTraChatLuongModule,
    GiaoNhapHangModule,
    NhapKhoModule,
    DieuChinhModule,
    HopDongModule,
    KehoachLuachonNhathauModule,
  ],
})
export class DauThauModule { }
