import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
} from '@angular/core';
import { UserLogin } from 'src/app/models/userlogin';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ROUTE_LIST_CAP_VON } from './quan-ly-ke-hoach-von-phi-hang.constant';

@Component({
	selector: 'app-quan-ly-ke-hoach-von-phi-hang',
	templateUrl: './quan-ly-ke-hoach-von-phi-hang.component.html',
	styleUrls: ['./quan-ly-ke-hoach-von-phi-hang.component.scss'],
})
export class QuanLyKeHoachVonPhiHangComponent implements OnInit, AfterViewInit {
	@ViewChild('myTab') myTab: ElementRef;
	userLogin: UserLogin;
	routes = ROUTE_LIST_CAP_VON;
	routerUrl: string = '';
	defaultUrl: string = '/cap-von/';
	listRouter: any[] = [];
	lastRouter: any = {};

	constructor(public userService: UserService, private router: Router) { }

	ngOnInit(): void {
		this.userLogin = this.userService.getUserLogin();
		if (this.router.url) {
			this.routerUrl = this.router.url;
		}
	}

	filterRole(url) {
	}

	ngAfterViewInit() {
		if (
			this.myTab.nativeElement.scrollWidth >
			this.myTab.nativeElement.clientWidth
		) {
			this.myTab.nativeElement.className =
				'nav nav-tabs expand-sidebar next-an';
		} else {
			this.myTab.nativeElement.className = 'nav nav-tabs';
		}
	}

	endSlide() {
		if (
			this.myTab.nativeElement.scrollWidth >
			this.myTab.nativeElement.clientWidth
		) {
			this.myTab.nativeElement.scrollTo({
				left: this.myTab.nativeElement.scrollWidth,
				top: 0,
				behavior: 'smooth',
			});
			this.myTab.nativeElement.className =
				'nav nav-tabs expand-sidebar prev-an';
		}
	}

	startSlide() {
		if (
			this.myTab.nativeElement.scrollWidth >
			this.myTab.nativeElement.clientWidth
		) {
			this.myTab.nativeElement.scrollTo({
				left: 0,
				top: 0,
				behavior: 'smooth',
			});
			this.myTab.nativeElement.className =
				'nav nav-tabs expand-sidebar next-an';
		}
	}

	// updateCssOverlay() {
	// 	setTimeout(() => {
	// 		let child = document.getElementsByClassName('dau-thau-tab');
	// 		if (child && child.length > 0) {
	// 			child[0].parentElement.classList.add('left-0');
	// 		}
	// 	}, 200);
	// }

	// redirect(url: string) {
	// 	this.routerUrl = url;
	// 	this.router.navigate([url]);
	// }
}






