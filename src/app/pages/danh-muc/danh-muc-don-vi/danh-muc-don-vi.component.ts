import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY_ID, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';
import { MESSAGE } from 'src/app/constants/message';
import { OldResponseData } from 'src/app/interfaces/response';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { NguoiDungService } from 'src/app/services/nguoidung.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-danh-muc-don-vi',
  templateUrl: './danh-muc-don-vi.component.html',
  styleUrls: ['./danh-muc-don-vi.component.scss'],
})
export class DanhMucDonViComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  visible = false;
  nodes: any = [];
  nodeDetail: any;
  listDonViDuoi = [];
  cureentNodeParent: any = [];
  datasNguoiDung: any = [];
  nodeSelected: any = [];
  listHTDV: any = [];
  listKPB: any = [];
  detailDonVi: FormGroup;
  noParent = true;
  searchValue = '';
  searchFilter = {
    soQD: '',
  };
  constructor(
    private fb: FormBuilder,
    private donviService: DonviService,
    private helperService: HelperService,
    private _modalService: NzModalService,
    private notification: NzNotificationService,
    private nguoidungService: NguoiDungService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  redirectThongTinDanhMucDonVi() {
    this.router.navigate([
      '/kehoach/thong-tin-danh-muc-don-vi',
      0,
    ]);
  }

  redirectSuaThongTinDanhMucDonVi(id) {
    this.router.navigate([
      '/kehoach/thong-tin-danh-muc-don-vi',
      id,
    ]);
  }
}
