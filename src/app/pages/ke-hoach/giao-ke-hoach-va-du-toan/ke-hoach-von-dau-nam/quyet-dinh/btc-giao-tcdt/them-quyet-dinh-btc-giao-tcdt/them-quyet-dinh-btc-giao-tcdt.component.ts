import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as dayjs from 'dayjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { HelperService } from 'src/app/services/helper.service';
import { UserLogin } from 'src/app/models/userlogin';
import { QuyetDinhBtcTcdtService } from 'src/app/services/quyetDinhBtcTcdt.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-them-quyet-dinh-btc-giao-tcdt',
  templateUrl: './them-quyet-dinh-btc-giao-tcdt.component.html',
  styleUrls: ['./them-quyet-dinh-btc-giao-tcdt.component.scss'],
})
export class ThemQuyetDinhBtcGiaoTcdtComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();

  formData: FormGroup;

  taiLieuDinhKemList = [];
  dsNam: any[] = [];
  maQd: string
  userInfo: UserLogin;
  dataTable: any[] = [];

  muaTangList: any[] = []
  xuatGiamList: any[] = []
  xuatBanList: any[] = []
  luanPhienList: any[] = []

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    public globals: Globals,
    private quyetDinhBtcTcdtService: QuyetDinhBtcTcdtService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        ngayQd: [null, [Validators.required]],
        namQd: [dayjs().get('year'), [Validators.required]],
        trichYeu: [null],
        trangThai: ['00'],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.maQd = '/' + this.userInfo.MA_QD,
      this.getDataDetail(this.idInput),
    ])
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhBtcTcdtService.getDetail(id);
      const data = res.data;
      console.log(data);
      this.formData.patchValue({
        id: data.id,
        namQd: data.namQd,
        ngayQd: data.ngayQd,
        soQd: data.soQd.split('/')[0],
        trangThai: data.trangThai,
        trichYeu: data.trichYeu
      })
      this.dataTable = data.listBoNganh
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  openFile(event) {
    // if (!this.isView) {
    //   let item = {
    //     id: new Date().getTime(),
    //     text: event.name,
    //   };
    //   if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
    //     this.uploadFileService
    //       .uploadFile(event.file, event.name)
    //       .then((resUpload) => {
    //         if (!this.deXuatDieuChinh.fileDinhKemReqs) {
    //           this.deXuatDieuChinh.fileDinhKemReqs = [];
    //         }
    //         const fileDinhKem = new FileDinhKem();
    //         fileDinhKem.fileName = resUpload.filename;
    //         fileDinhKem.fileSize = resUpload.size;
    //         fileDinhKem.fileUrl = resUpload.url;
    //         fileDinhKem.idVirtual = item.id;
    //         this.deXuatDieuChinh.fileDinhKemReqs.push(fileDinhKem);
    //         this.taiLieuDinhKemList.push(item);
    //       });
    //   }
    // }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
    }
  }

  downloadFileKeHoach(event) { }

  huy() {
    this.onClose.emit();
  }

  banHanh() { }

  async save() {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      console.log(this.formData.value)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    body.muaTangList = this.muaTangList;
    body.xuatGiamList = this.xuatGiamList;
    body.xuatBanList = this.xuatBanList;
    body.luanPhienList = this.luanPhienList;
    let res
    if (this.idInput > 0) {
      res = await this.quyetDinhBtcTcdtService.update(body);
    } else {
      res = await this.quyetDinhBtcTcdtService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.idInput > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.huy();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  exportData() { }

  changePageIndex(event) { }

  changePageSize(event) { }

  xoaKeHoach() { }

  themKeHoach() { }
}


