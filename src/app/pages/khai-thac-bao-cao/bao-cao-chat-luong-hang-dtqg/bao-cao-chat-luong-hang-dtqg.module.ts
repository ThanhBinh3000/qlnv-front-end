import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../../components/components.module";
import { MainModule } from "../../../layout/main/main.module";
import { NzTreeViewModule } from "ng-zorro-antd/tree-view";
import { DirectivesModule } from "../../../directives/directives.module";
import { NzIconModule } from "ng-zorro-antd/icon";
import { BaoCaoChatLuongHangDtqgRoutingModule } from "./bao-cao-chat-luong-hang-dtqg-routing.module";
import {
  ThBcSoLuongClMayMocThietBiChuyenDungComponent
} from "./th-bc-so-luong-cl-may-moc-thiet-bi-chuyen-dung/th-bc-so-luong-cl-may-moc-thiet-bi-chuyen-dung.component";
import { BaoCaoChatLuongHangDtqgComponent } from "./bao-cao-chat-luong-hang-dtqg.component";
import { ThBcSoLuongClCcdcComponent } from "./th-bc-so-luong-cl-ccdc/th-bc-so-luong-cl-ccdc.component";
import { BaoCaoHaoHutHangDtqgComponent } from './bao-cao-hao-hut-hang-dtqg/bao-cao-hao-hut-hang-dtqg.component';
import { BcclCongTacBaoQuanGaoComponent } from './bccl-cong-tac-bao-quan/bccl-cong-tac-bao-quan-gao.component';
import { BcclHangDtqgXuatKhoComponent } from './bccl-hang-dtqg-xuat-kho/bccl-hang-dtqg-xuat-kho.component';
import { BcclHangDtqgNhapKhoComponent } from './bccl-hang-dtqg-nhap-kho/bccl-hang-dtqg-nhap-kho.component';
import { BcCongTacDinhmucKtktComponent } from './bc-cong-tac-dinhmuc-ktkt/bc-cong-tac-dinhmuc-ktkt.component';
import { BcclGiakeKichkePaletComponent } from './bccl-giake-kichke-palet/bccl-giake-kichke-palet.component';
import { BcTinhHinhKiemDinhComponent } from './bc-tinh-hinh-kiem-dinh/bc-tinh-hinh-kiem-dinh.component';


@NgModule({
  declarations: [
    ThBcSoLuongClMayMocThietBiChuyenDungComponent,
    BaoCaoChatLuongHangDtqgComponent,
    ThBcSoLuongClCcdcComponent,
    BaoCaoHaoHutHangDtqgComponent,
    BcclCongTacBaoQuanGaoComponent,
    BcclHangDtqgXuatKhoComponent,
    BcclHangDtqgNhapKhoComponent,
    BcCongTacDinhmucKtktComponent,
    BcclGiakeKichkePaletComponent,
    BcTinhHinhKiemDinhComponent
  ],
  imports: [
    CommonModule,
    BaoCaoChatLuongHangDtqgRoutingModule,
    ComponentsModule,
    MainModule,
    NzTreeViewModule,
    DirectivesModule,
    NzIconModule
  ]
})
export class BaoCaoChatLuongHangDtqgModule {
}
