import { Component, OnInit } from '@angular/core';
import { Location, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from 'jquery';

@Component({
    selector: 'master-layout',
    templateUrl: './master-layout.component.html',
    styleUrls: ['./master-layout.component.scss'],
})
export class MasterLayoutComponent implements OnInit {
    constructor(public location: Location, private router: Router) {}
    toggle:boolean = false;
    ngOnInit() {
    }
    toggleSidebar(){
        this.toggle = !this.toggle;
    }
}
