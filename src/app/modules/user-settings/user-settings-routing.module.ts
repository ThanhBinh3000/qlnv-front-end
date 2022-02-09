import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth";
import { MasterLayoutComponent } from "../shared/layouts";
import { UserSettingsContainerComponent } from "./container/user-settings.container";
import { UserSettingsLazyModule } from "./user-settings-lazy.module";

const routes: Routes = [
    {
        path: '',
        // component: MasterLayoutComponent,
        canActivate: [AuthGuard],
        data: {
            pageTitle: 'Account Settings',
            pageDes: '',
        },
        children: [
            {
                path: '',
                component: UserSettingsContainerComponent,
            },
        ],
    },
    // {
    //     path: '',
    //     component: CommonLayoutComponent,
    //     data: {
    //         pageTitle: '',
    //         pageDes: '',
    //     },
    //     children: [
    //         {
    //             path: 'link-to-hotel/:id/response/:response',
    //             component: OnboardingEmployerContainer,
    //         },
    //     ],
    // },
];

@NgModule({
    imports: [UserSettingsLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserSettingsRoutingModule {}
