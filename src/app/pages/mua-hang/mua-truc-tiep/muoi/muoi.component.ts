// import { Component, OnInit } from '@angular/core';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-muoi',
  templateUrl: './muoi.component.html',
  styleUrls: ['./muoi.component.scss']
})
export class MuoiComponent implements OnInit {
  @ViewChild('myTab') myTab: ElementRef;
  isSuperAdmin: boolean = false;
  userLogin: UserLogin;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }
}
