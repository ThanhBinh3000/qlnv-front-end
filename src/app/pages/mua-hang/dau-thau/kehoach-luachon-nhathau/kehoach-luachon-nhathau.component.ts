import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LIST_VAT_TU_HANG_HOA } from 'src/app/constants/config';
import { UserService } from 'src/app/services/user.service';
import { convertIdToLoaiVthh } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-kehoach-luachon-nhathau',
  templateUrl: './kehoach-luachon-nhathau.component.html',
  styleUrls: ['./kehoach-luachon-nhathau.component.scss']
})
export class KeHoachLuachonNhathauComponent implements OnInit {

  listVthh: any = LIST_VAT_TU_HANG_HOA;
  constructor(
    private userService: UserService,
    private router: Router
  ) {

  }

  isTongCuc: boolean = false;
  isCuc: boolean = false;
  ngOnInit(): void {
    this.isTongCuc = this.userService.isTongCuc();
    this.isCuc = this.userService.isCuc();
  }


}
