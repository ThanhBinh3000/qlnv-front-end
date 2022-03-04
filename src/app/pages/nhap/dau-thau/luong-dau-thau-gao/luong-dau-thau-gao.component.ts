import { DialogThongTinPhuLucKHLCNTComponent } from './../../../../components/dialog/dialog-thong-tin-phu-luc-khlcnt/dialog-thong-tin-phu-luc-khlcnt.component';
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
  selector: 'luong-dau-thau-gao',
  templateUrl: './luong-dau-thau-gao.component.html',
  styleUrls: ['./luong-dau-thau-gao.component.scss'],
})
export class LuongDauThauGaoComponent implements OnInit {
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
  tabSelected: string = 'phuong-an-tong-hop'
  constructor(private router: Router, private modal: NzModalService) { }

  ngOnInit(): void { }

  redirectThongTinChiTieuKeHoachNam() {
    this.router.navigate([
      '/nhap/dau-thau/thong-tin-luong-dau-thau-gao/',
      0,
    ]);
  }

  redirectSuaThongTinChiTieuKeHoachNam(id) {
    this.router.navigate([
      '/nhap/dau-thau/thong-tin-luong-dau-thau-gao/',
      id,
    ]);
  }
}
