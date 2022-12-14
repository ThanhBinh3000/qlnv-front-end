import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {DuLieuTongHopTcdtComponent} from './du-lieu-tong-hop-tcdt.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    DuLieuTongHopTcdtComponent,
  ],
  exports: [
    DuLieuTongHopTcdtComponent,
  ]
})
export class DuLieuTongHopTcdtModule {
}
