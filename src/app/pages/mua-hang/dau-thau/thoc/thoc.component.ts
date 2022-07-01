// import { Component, OnInit } from '@angular/core';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-thoc',
  templateUrl: './thoc.component.html',
  styleUrls: ['./thoc.component.scss']
})
export class ThocComponent implements OnInit {
  @ViewChild('myTab') myTab: ElementRef;
  userLogin: UserLogin;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    console.log("vào thóc");
    
  }
}
