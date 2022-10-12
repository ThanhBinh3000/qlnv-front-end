import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-cap-von-nguon-chi',
    templateUrl: './cap-von-nguon-chi.component.html',
    styleUrls: ['./cap-von-nguon-chi.component.scss'],
})
export class CapVonNguonChiComponent implements OnInit {
    isVisibleChangeTab$ = new Subject();
    visibleTab: boolean = true;
    tabSelected: number = 0;

    constructor(
        public userService: UserService,
        public globals: Globals
    ) { }

    ngOnInit(): void {
        this.isVisibleChangeTab$.subscribe((value: boolean) => {
            this.visibleTab = value;
        });
    }

    selectTab(tab: number) {
        this.tabSelected = tab;
    }
}
