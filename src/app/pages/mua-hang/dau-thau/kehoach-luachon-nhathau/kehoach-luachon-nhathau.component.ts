import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-kehoach-luachon-nhathau',
  templateUrl: './kehoach-luachon-nhathau.component.html',
  styleUrls: ['./kehoach-luachon-nhathau.component.scss']
})
export class KeHoachLuachonNhathauComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { 
    
  }

  isTongCuc : boolean = false;
  isCuc : boolean = false;
  ngOnInit(): void {
    this.isTongCuc = this.userService.isTongCuc();
    this.isCuc = this.userService.isCuc();
  }

}
