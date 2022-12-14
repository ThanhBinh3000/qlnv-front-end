import {Component, Input, OnInit} from '@angular/core';
import dayjs from 'dayjs';
import {saveAs} from 'file-saver';
import {cloneDeep} from 'lodash';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT
} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {DonviService} from 'src/app/services/donvi.service';
import {DeNghiCapPhiBoNganhService} from 'src/app/services/ke-hoach/von-phi/deNghiCapPhiBoNganh.service';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {STATUS} from "../../../../constants/status";

@Component({
  selector: 'app-du-lieu-tong-hop-tcdt',
  templateUrl: './du-lieu-tong-hop-tcdt.component.html',
  styleUrls: ['./du-lieu-tong-hop-tcdt.component.scss']
})
export class DuLieuTongHopTcdtComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private donviService: DonviService,
    public globals: Globals,
    private danhMucService: DanhMucService,
  ) {
  }

  async ngOnInit() {
    console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  }


}
