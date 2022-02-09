import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth';
// import { CanDeactivateFormGuard } from '../shared/guards';
import { EmployeeAdminContainer } from './containers';
import { EmployeeLazyModule } from './employee-lazy.module';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        // canDeactivate: [CanDeactivateFormGuard],
        data: {
            pageTitle: 'Maintaining Nurse Accounts',
        },
        children: [
            {
                path: '',
                component: EmployeeAdminContainer,
            },
        ],
    },
];

@NgModule({
    imports: [EmployeeLazyModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EmployeeRoutingModule {}
