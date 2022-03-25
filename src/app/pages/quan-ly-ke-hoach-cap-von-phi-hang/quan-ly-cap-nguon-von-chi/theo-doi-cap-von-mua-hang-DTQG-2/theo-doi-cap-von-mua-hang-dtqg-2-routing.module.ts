import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TheoDoiCapVonMuaHangDtqg2Component } from "./theo-doi-cap-von-mua-hang-dtqg-2.component";

const routes: Routes = [
    {
        path: '',
        component: TheoDoiCapVonMuaHangDtqg2Component,
    },
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class TheoDoiCapVonMuaHangDtqg2RoutingModule {}