import {Component, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {Globals} from "../../../shared/globals";
import {Router} from "@angular/router";

@Component({
    selector: 'app-hop-dong',
    templateUrl: './hop-dong.component.html',
    styleUrls: ['./hop-dong.component.scss']
})
export class HopDongComponent implements OnInit {

    isVisibleChangeTab$ = new Subject();
    visibleTab: boolean = true;
    constructor(
        public userService: UserService,
        public globals: Globals,
        private router : Router
    ) { }

    ngOnInit(): void {
        if (!this.userService.isAccessPermisson('QTDM')) {
            this.router.navigateByUrl('/error/401')
        }
        this.isVisibleChangeTab$.subscribe((value: boolean) => {
            this.visibleTab = value;
        });
    }
    tabSelected = '1';
    selectTab(tab) {
        this.tabSelected = tab;
    }
}
