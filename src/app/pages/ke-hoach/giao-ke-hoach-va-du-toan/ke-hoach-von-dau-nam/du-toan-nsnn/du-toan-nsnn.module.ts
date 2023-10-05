import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuToanNsnnComponent } from './du-toan-nsnn.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [
    DuToanNsnnComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    DuToanNsnnComponent,
  ]
})
export class DuToanNsnnModule { }
