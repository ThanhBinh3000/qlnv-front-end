import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import 'rxjs/add/operator/filter';
import { Router } from '@angular/router';
import { ROUTES } from '../../sidebar/sidebar.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
    selector: 'master-layout',
    templateUrl: './master-layout.component.html',
    styleUrls: ['./master-layout.component.scss'],
})
export class MasterLayoutComponent implements OnInit {
    constructor(
        public location: Location, 
        private router: Router,
        private authService: AuthService,
    ) { }
    toggle: boolean = false;
    private listTitles: any[];
    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
    }
    toggleSidebar() {
        this.toggle = !this.toggle;
    }

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }

        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].url === titlee) {
                return this.listTitles[item].name;
            }
        }
        return 'Trang Chủ';
    }

    logout(){
        this.authService.logout();
    }
}
