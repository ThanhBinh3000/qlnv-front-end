import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from "../../../components/components.module";
import {TheoDoiBaoQuanComponent} from "./theo-doi-bao-quan.component";
import {TheoDoiBaoQuanRoutingModule} from "./theo-doi-bao-quan-routing.module";


@NgModule({
  declarations: [TheoDoiBaoQuanComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    TheoDoiBaoQuanRoutingModule
  ]
})
export class TheoDoiBaoQuanModule {
}
