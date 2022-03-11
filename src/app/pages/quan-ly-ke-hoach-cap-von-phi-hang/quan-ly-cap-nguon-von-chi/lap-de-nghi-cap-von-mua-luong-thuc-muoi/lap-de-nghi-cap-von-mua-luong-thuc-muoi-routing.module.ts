import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LapDeNghiCapVonMuaLuongThucMuoiComponent } from "./lap-de-nghi-cap-von-mua-luong-thuc-muoi.component";

const routes: Routes = [
    {
        path: '',
        component: LapDeNghiCapVonMuaLuongThucMuoiComponent,
    },
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class LapDeNghiCapVonMuaLuongThucMuoiRoutingModule {}