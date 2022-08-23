import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ComponentsModule } from "src/app/components/components.module";
import { QuyetDinhGiaBtcComponent } from "./quyet-dinh-gia-btc.component";
import { ThemQuyetDinhGiaBtcLtComponent } from "./them-quyet-dinh-gia-btc-lt/them-quyet-dinh-gia-btc-lt.component";
import { ThemQuyetDinhGiaBtcVtComponent } from "./them-quyet-dinh-gia-btc-vt/them-quyet-dinh-gia-btc-vt.component";


@NgModule({
  declarations: [QuyetDinhGiaBtcComponent, ThemQuyetDinhGiaBtcLtComponent, ThemQuyetDinhGiaBtcVtComponent],
  imports: [CommonModule,
    ComponentsModule
  ],
  exports: [QuyetDinhGiaBtcComponent]
})
export class QuyetDinhGiaBtcModule {
}
