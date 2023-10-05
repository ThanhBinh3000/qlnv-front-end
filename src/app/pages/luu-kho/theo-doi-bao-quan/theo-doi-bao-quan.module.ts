import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from "../../../components/components.module";
import {TheoDoiBaoQuanComponent} from "./theo-doi-bao-quan.component";
import {TheoDoiBaoQuanRoutingModule} from "./theo-doi-bao-quan-routing.module";
import { ThemMoiSoTheoDoiBqComponent } from './them-moi-so-theo-doi-bq/them-moi-so-theo-doi-bq.component';


@NgModule({
  declarations: [TheoDoiBaoQuanComponent, ThemMoiSoTheoDoiBqComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    TheoDoiBaoQuanRoutingModule
  ]
})
export class TheoDoiBaoQuanModule {
}
