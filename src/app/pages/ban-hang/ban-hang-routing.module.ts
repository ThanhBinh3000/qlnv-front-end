import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BanHangComponent } from './ban-hang.component';

const routes: Routes = [
    {
        path: '',
        component: BanHangComponent,
        children: [

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BanHangRoutingModule { }
