import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong.component';

const routes: Routes = [
  {
    path: '',
    component: KiemTraChatLuongComponent,
    children: [
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KiemTraChatLuongRoutingModule { }
