import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapVonNguonChiComponent } from './cap-von-nguon-chi.component';

const routes: Routes = [
    {
        path: '',
        component: CapVonNguonChiComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CapVonNguonChiRoutingModule { }
