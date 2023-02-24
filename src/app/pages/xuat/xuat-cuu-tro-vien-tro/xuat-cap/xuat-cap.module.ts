import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { XuatCapComponent } from "./xuat-cap.component";
import { XuatCapRoutingModule } from "./xuat-cap-routing.module";
import { ComponentsModule } from "../../../../components/components.module";
import { DirectivesModule } from "../../../../directives/directives.module";
import { QuyetDinhPhuongAnModule } from "./quyet-dinh-phuong-an/quyet-dinh-phuong-an.module";


@NgModule({
  declarations: [
    XuatCapComponent

  ],
  exports: [
    XuatCapComponent
  ],
  imports: [
    CommonModule,
    XuatCapRoutingModule,
    ComponentsModule,
    DirectivesModule,
    QuyetDinhPhuongAnModule
  ]
})
export class XuatCapModule {
}
