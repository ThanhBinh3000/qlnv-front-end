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
  selector: 'app-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
})
export class ChiTieuKeHoachNamComponent implements OnInit {
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

  redirectThongTinChiTieuKeHoachNam() {
    this.router.navigate([
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      1,
    ]);
  }
}
