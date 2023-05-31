import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { FormsModule } from "@angular/forms";
import { TongHopKhnkComponent } from "./tong-hop-khnk.component";



@NgModule({
  declarations: [
    TongHopKhnkComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    FormsModule,
  ],
  exports: [
    TongHopKhnkComponent,
  ]
})
export class TongHopKhnkModule { }
