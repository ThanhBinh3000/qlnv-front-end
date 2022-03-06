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
import { DAU_GIA_LIST } from './dau-gia.constant';

@Component({
  selector: 'app-dau-gia',
  templateUrl: './dau-gia.component.html',
  styleUrls: ['./dau-gia.component.scss'],
})
export class DauGiaComponent implements OnInit {
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
  dauThauList = DAU_GIA_LIST;

  // search
  searchFilter = {
    soQD: '',
  };
  // modal
  isVisible = false;
  isVisible2 = false;

  constructor(
    private fb: FormBuilder,
    private donviService: DonviService,
    private helperService: HelperService,
    private _modalService: NzModalService,
    private notification: NzNotificationService,
    private nguoidungService: NguoiDungService,
  ) {}

  ngOnInit(): void {}

  // modal func
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  //
  // modal func
  showModal2(): void {
    this.isVisible2 = true;
  }

  handleOk2(): void {
    this.isVisible2 = false;
  }

  handleCancel2(isVisible): void {
    this.isVisible2 = isVisible;
  }
}
