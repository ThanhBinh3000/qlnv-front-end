import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TonghopPheduyetComponent} from "./tonghop-pheduyet.component";

const routes: Routes = [
    {
        path: '',
        component: TonghopPheduyetComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TonghopPheduyetRoutingModule { }
