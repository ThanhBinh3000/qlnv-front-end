import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DuToanNsnnComponent } from './du-toan-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: DuToanNsnnComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class DuToanNsnnRoutingModule { }
