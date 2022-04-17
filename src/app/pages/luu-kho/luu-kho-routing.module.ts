import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LuuKhoComponent } from './luu-kho.component';

const routes: Routes = [
    {
        path: '',
        component: LuuKhoComponent,
        children: [

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LuuKhoRoutingModule { }
