import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapPhiChiComponent } from './cap-phi-chi.component';

const routes: Routes = [
    {
        path: '',
        component: CapPhiChiComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CapPhiChiRoutingModule { }
