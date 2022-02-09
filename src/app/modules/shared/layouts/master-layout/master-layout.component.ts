import { Component, OnInit } from '@angular/core';
import { Location, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from 'jquery';
import { ROUTES } from '../../sidebar/sidebar.component';

@Component({
    selector: 'master-layout',
    templateUrl: './master-layout.component.html',
    styleUrls: ['./master-layout.component.scss'],
})
export class MasterLayoutComponent implements OnInit {
    constructor(public location: Location, private router: Router) {}
    toggle:boolean = false;
    private listTitles: any[];
    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
    }
    toggleSidebar(){
        this.toggle = !this.toggle;
    }

    getTitle(){
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if(titlee.charAt(0) === '#'){
            titlee = titlee.slice( 1 );
        }
  
        for(var item = 0; item < this.listTitles.length; item++){
            if(this.listTitles[item].path === titlee){
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
      }
}
