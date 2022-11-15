import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { GiaoDuToanComponent } from './giao-du-toan.component';

@NgModule({
  declarations: [GiaoDuToanComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [GiaoDuToanComponent],
})
export class GiaoDuToanModule { }
