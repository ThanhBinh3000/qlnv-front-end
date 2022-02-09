import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContainerComponent } from "./container/container.component";
import { DashboardLazyModule } from "./dashboard-lazy.module";

const routes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Dashboard',
            pageDes: '',
        },
        children: [
            {
                path: '',
                component: ContainerComponent,
            },
        ],
    },
];

@NgModule({
    imports: [DashboardLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
