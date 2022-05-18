import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-luong-thuc',
  templateUrl: './luong-thuc.component.html',
  styleUrls: ['./luong-thuc.component.scss']
})
export class LuongThucComponent implements OnInit {
  constructor(
    private userService: UserService
  ) { }
  isTongCuc : boolean = false;
  isCuc : boolean = false;
  ngOnInit(): void {
    this.isTongCuc = this.userService.isTongCuc();
    this.isCuc = this.userService.isCuc();
  }
}
