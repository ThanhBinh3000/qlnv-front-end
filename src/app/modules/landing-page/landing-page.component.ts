import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
@Component({
    selector: 'app-landing-page',
    template: '',
})
export class LandingPageComponent implements OnInit {
    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
        this.router.navigateByUrl('/');
    }
}
