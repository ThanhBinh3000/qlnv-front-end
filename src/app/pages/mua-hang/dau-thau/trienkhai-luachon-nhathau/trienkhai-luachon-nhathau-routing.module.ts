import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrienkhaiLuachonNhathauComponent } from './trienkhai-luachon-nhathau.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'thoc',
    pathMatch: 'full',
  },
  {
    path: ':type',
    component: TrienkhaiLuachonNhathauComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrienkhaiLuachonNhathauRoutingModule { }
