import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { LuuKhoRoutingModule } from './luu-kho-routing.module';
import { LuuKhoComponent } from './luu-kho.component';
import {TheoDoiBaoQuanComponent} from "./theo-doi-bao-quan/theo-doi-bao-quan.component";
import {
  ThemMoiSoTheoDoiBqComponent
} from "./theo-doi-bao-quan/them-moi-so-theo-doi-bq/them-moi-so-theo-doi-bq.component";
import { ThemMoiCtietTdbqComponent } from './theo-doi-bao-quan/them-moi-so-theo-doi-bq/them-moi-ctiet-tdbq/them-moi-ctiet-tdbq.component';


@NgModule({
    declarations: [
      LuuKhoComponent,
      TheoDoiBaoQuanComponent,
      ThemMoiSoTheoDoiBqComponent,
      ThemMoiCtietTdbqComponent
    ],
    imports: [CommonModule, LuuKhoRoutingModule, ComponentsModule, MainModule],
})
export class LuuKhoModule { }
