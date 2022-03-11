import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LapDeNghiCapVonMuaVatTuThietBiComponent } from "./lap-de-nghi-cap-von-mua-vat-tu-thiet-bi.component";

const routes: Routes = [
    {
        path: '',
        component: LapDeNghiCapVonMuaVatTuThietBiComponent,
    },
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class LapDeNghiCapVonMuaVatTuThietBiRoutingModule {}