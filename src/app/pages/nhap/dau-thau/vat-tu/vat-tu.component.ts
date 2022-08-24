// import { Component, OnInit } from '@angular/core';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-vat-tu',
  templateUrl: './vat-tu.component.html',
  styleUrls: ['./vat-tu.component.scss']
})
export class VatTuComponent implements OnInit {
  @ViewChild('myTab') myTab: ElementRef;
  userLogin: UserLogin;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }
}
