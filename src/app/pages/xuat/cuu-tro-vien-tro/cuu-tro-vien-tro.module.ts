import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CuuTroVienTroRoutingModule } from './cuu-tro-vien-tro-routing.module';
import { CuuTroVienTroComponent } from './cuu-tro-vien-tro.component';
@NgModule({
  declarations: [
    CuuTroVienTroComponent,
  ],
  imports: [
    CommonModule,
    CuuTroVienTroRoutingModule,
    ComponentsModule,
    DirectivesModule,
  ],
})
export class CuuTroVienTroModule { }
