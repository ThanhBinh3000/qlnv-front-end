import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TongHopDeNghiCapVonComponent } from "./tong-hop-de-nghi-cap-von.component";

const routes: Routes = [
    {
        path: '',
        component: TongHopDeNghiCapVonComponent,
    },
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class TongHopDeNghiCapVonRoutingModule {}