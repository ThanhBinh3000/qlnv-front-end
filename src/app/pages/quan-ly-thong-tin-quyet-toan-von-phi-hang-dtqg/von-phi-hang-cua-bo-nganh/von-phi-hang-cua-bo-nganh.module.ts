import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { VonPhiHangCuaBoNganhComponent } from './von-phi-hang-cua-bo-nganh.component';
import {VonPhiHangCuaBoNganhRoutingModule} from "./von-phi-hang-cua-bo-nganh-routing.module";
import {
  ThemMoiVonPhiHangCuaBoNganhComponent
} from "./them-moi-vp-hang-cua-bo-nganh/them-moi-von-phi-hang-cua-bo-nganh.component";


@NgModule({
    declarations: [
        VonPhiHangCuaBoNganhComponent,
        ThemMoiVonPhiHangCuaBoNganhComponent
    ],
    imports: [
        CommonModule,
        VonPhiHangCuaBoNganhRoutingModule,
        ComponentsModule,
    ],
    exports: [
        ThemMoiVonPhiHangCuaBoNganhComponent
    ]
})
export class VonPhiHangCuaBoNganhModule { }
