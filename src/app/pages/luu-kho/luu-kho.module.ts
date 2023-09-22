import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { LuuKhoRoutingModule } from './luu-kho-routing.module';
import { LuuKhoComponent } from './luu-kho.component';
import { TheoDoiBaoQuanComponent } from "./theo-doi-bao-quan/theo-doi-bao-quan.component";
import {
  ThemMoiSoTheoDoiBqComponent
} from "./theo-doi-bao-quan/them-moi-so-theo-doi-bq/them-moi-so-theo-doi-bq.component";
import { ThemMoiCtietTdbqComponent } from './theo-doi-bao-quan/them-moi-so-theo-doi-bq/them-moi-ctiet-tdbq/them-moi-ctiet-tdbq.component';
import { TableCsclComponent } from './theo-doi-bao-quan/them-moi-so-theo-doi-bq/table-cscl/table-cscl.component';
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { SoKhoTheKhoComponent } from './so-kho-the-kho/so-kho-the-kho.component';
import { ThemSoKhoTheKhoComponent } from './so-kho-the-kho/them-so-kho-the-kho/them-so-kho-the-kho.component';


@NgModule({
  declarations: [
    LuuKhoComponent,
    TheoDoiBaoQuanComponent,
    ThemMoiSoTheoDoiBqComponent,
    ThemMoiCtietTdbqComponent,
    TableCsclComponent,
    SoKhoTheKhoComponent,
    ThemSoKhoTheKhoComponent
  ],
  imports: [
    CommonModule,
    LuuKhoRoutingModule,
    ComponentsModule,
    MainModule
  ],
})
export class LuuKhoModule { }
