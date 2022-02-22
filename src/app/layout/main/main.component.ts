import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Cleave from 'cleave.js';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {
      if (event) {
        const datesCollection = (<HTMLCollection>document.getElementsByClassName('input-date'));
        let dates = Array.from(datesCollection);
    
        dates.forEach(function (date) {
            new Cleave(date, {
          date: true,
          delimiter: '/',
          datePattern: ['d', 'm', 'Y'],
            })
        });
      }
    });
  }

  logOut() {
    this.authService.logout();
  }

  

}
