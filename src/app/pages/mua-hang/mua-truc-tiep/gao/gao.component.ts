// import { Component, OnInit } from '@angular/core';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-gao',
  templateUrl: './gao.component.html',
  styleUrls: ['./gao.component.scss']
})
export class GaoComponent implements OnInit {
  @ViewChild('myTab') myTab: ElementRef;
  isSuperAdmin: boolean = false;
  userLogin: UserLogin;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }
}
