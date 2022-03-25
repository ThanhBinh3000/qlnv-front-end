import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TheoDoiCapVonMuaHangDtqgComponent } from "./theo-doi-cap-von-mua-hang-dtqg.component";

const routes: Routes = [
    {
        path: '',
        component: TheoDoiCapVonMuaHangDtqgComponent,
    },
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class TheoDoiCapVonMuaHangDtqgRoutingModule {}