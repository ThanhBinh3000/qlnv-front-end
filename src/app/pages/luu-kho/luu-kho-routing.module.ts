import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LuuKhoComponent } from './luu-kho.component';

const routes: Routes = [
	{
		path: '',
		component: LuuKhoComponent,
		children: [
			{
				path: '',
				redirectTo: 'quan-ly-so-kho-the-kho',
				pathMatch: 'full'
			},
			{
				path: 'quan-ly-so-kho-the-kho',
				loadChildren: () =>
					import(
						'../luu-kho/quan-ly-so-the-kho/quan-ly-so-the-kho.module'
					).then((m) => m.QuanLySoTheKhoModule),
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LuuKhoRoutingModule { }
