import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DieuchinhLuachonNhathauComponent } from './dieuchinh-luachon-nhathau.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'thoc',
    pathMatch: 'full',
  },
  {
    path: ':type',
    component: DieuchinhLuachonNhathauComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DieuchinhLuachonNhathauRoutingModule { }
