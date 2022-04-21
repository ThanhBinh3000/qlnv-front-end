import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyChatLuongComponent } from './quan-ly-chat-luong.component';

const routes: Routes = [
    {
        path: '',
        component: QuanLyChatLuongComponent,
        children: [

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QuanLyChatLuongRoutingModule { }
