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


@NgModule({
  declarations: [
    ThBcSoLuongClMayMocThietBiChuyenDungComponent,
    BaoCaoChatLuongHangDtqgComponent,
    ThBcSoLuongClCcdcComponent,
    BaoCaoHaoHutHangDtqgComponent
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
