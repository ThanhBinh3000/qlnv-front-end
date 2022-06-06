import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { NhapRoutingModule } from './nhap-routing.module';
import { NhapComponent } from './nhap.component';


@NgModule({
  declarations: [
    NhapComponent,
  ],
  imports: [CommonModule, NhapRoutingModule, ComponentsModule, MainModule],
})
export class NhapModule { }
