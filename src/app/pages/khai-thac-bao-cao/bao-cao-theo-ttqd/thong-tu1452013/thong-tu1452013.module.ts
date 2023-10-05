import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from "../../../../components/components.module";
import {DirectivesModule} from "../../../../directives/directives.module";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {BrowserModule} from "@angular/platform-browser";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    PdfViewerModule,
    BrowserModule
  ]
})
export class ThongTu1452013Module {
}
