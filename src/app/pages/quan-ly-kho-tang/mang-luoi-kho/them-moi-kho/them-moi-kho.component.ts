import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';
import { OldResponseData } from 'src/app/interfaces/response';
import { HelperService } from 'src/app/services/helper.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DonviService } from 'src/app/services/donvi.service';
import { LOAI_DON_VI, TrangThaiHoatDong } from 'src/app/constants/status';
import {UserLogin} from "../../../../models/userlogin";
import {UserService} from "../../../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
  selector: 'app-them-moi-kho',
  templateUrl: './them-moi-kho.component.html',
  styleUrls: ['./them-moi-kho.component.scss']
})

export class ThemMoiKhoComponent implements OnInit {
  @ViewChild('treeSelect', { static: false }) treeSelect!: NzTreeComponent;

  data: any;
  nodesTree: any = [];
  options = {
    useCheckbox: true
  };
  settings = {};
  formDonVi: FormGroup;
  isVisible = false;
  selectedNode: any;
  optionList: string[] = [];
  cureentNodeParent: any
  levelNode: number = 0;
  checkCreate : any;
  userInfo: UserLogin

  dataDetail: any;
   nodeSelected: any;
  constructor(
    private fb: FormBuilder,


    private notification: NzNotificationService,
    private helperService: HelperService,
    private donviService: DonviService,
    private modal: NzModalRef,
    private userService : UserService,
    private spinner : NgxSpinnerService
  ) {
    this.formDonVi = this.fb.group({
      maDviCha: [null],
      tenDvi: ['', Validators.required],
      maDvi: ['', Validators.required],
      diaChi: [''],
      tenVietTat: [''],
      sdt: [''],
      fax: [''],
      trangThai: [true],
      type: [true],
      ghiChu: [''],
    })
    this.formDonVi.controls['maDviCha'].valueChanges.subscribe(value => {
      let node = this.treeSelect.getTreeNodeByKey(value);
      this.levelNode = node.level
    });
  }
  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.userInfo = this.userService.getUserLogin(),
        this.loadDsDvi()
      ]);
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  enumToSelectList() {

  }

  nzClickNodeTree(event: any): void {
    if (event.keys.length > 0) {
      this.nodeSelected = event.node.origin;
    }
  }

  async loadDsDvi() {
      await this.donviService.layTatCaDviDmKho(LOAI_DON_VI.MLK, this.userInfo.MA_DVI).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
            this.nodesTree = res.data;
          }
          this.nodesTree[0].expanded = false;

      })
  }

  handleCancel(): void {
    this.modal.destroy();
  }

  add() {
    this.helperService.markFormGroupTouched(this.formDonVi);
    if (this.formDonVi.invalid) {
      return;
    }
    let body = this.formDonVi.value;
    body.trangThai = this.formDonVi.get('trangThai').value ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG;
    if (this.levelNode == 2) {
      body.type = this.formDonVi.get('type').value ? LOAI_DON_VI.PB : null;
    }
    if (this.levelNode > 2) {
      body.type = LOAI_DON_VI.PB
    }
    this.donviService.create(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.modal.close(true);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch((e) => {
      console.error('error: ', e);
      this.notification.error(
        MESSAGE.ERROR,
        e.error.errors[0].defaultMessage,
      );
    });
  }
}
