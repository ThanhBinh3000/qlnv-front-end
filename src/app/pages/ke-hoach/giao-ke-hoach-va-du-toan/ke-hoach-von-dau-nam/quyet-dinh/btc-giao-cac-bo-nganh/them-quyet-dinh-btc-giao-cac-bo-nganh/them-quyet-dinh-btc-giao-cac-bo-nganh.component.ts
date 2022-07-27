import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as dayjs from 'dayjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhTtcpService } from 'src/app/services/quyetDinhTtcp.service';
import { QuyetDinhBtcNganhService } from 'src/app/services/quyetDinhBtcNganh.service';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-them-quyet-dinh-btc-giao-cac-bo-nganh',
  templateUrl: './them-quyet-dinh-btc-giao-cac-bo-nganh.component.html',
  styleUrls: ['./them-quyet-dinh-btc-giao-cac-bo-nganh.component.scss'],
})
export class ThemQuyetDinhBtcGiaoCacBoNganhComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();

  formData: FormGroup;


  taiLieuDinhKemList = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];

  muaTangList: any[] = []
  xuatGiamList: any[] = []
  xuatBanList: any[] = []
  luanPhienList: any[] = []

  userInfo: UserLogin;
  maQd: string;

  dataTable: any[] = [];
  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private helperService: HelperService,
    private quyetDinhTtcpService: QuyetDinhTtcpService,
    private quyetDinhBtcNganhService: QuyetDinhBtcNganhService,
    private notification: NzNotificationService,

  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        ngayQd: [null, [Validators.required]],
        namQd: [dayjs().get('year'), [Validators.required]],
        trichYeu: [null],
        trangThai: ['00'],
        idBoNganh: [, [Validators.required]]
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
      this.onChangeNamQd(this.formData.get('namQd').value),
    ])
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhBtcNganhService.getDetail(id);
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

  async onChangeNamQd(namQd) {
    let body = {
      namQd: namQd,
      trangThai: "11"
    }
    let res = await this.quyetDinhTtcpService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content;
      if (data) {
        let detail = await this.quyetDinhTtcpService.getDetail(data[0].id);
        if (detail.msg == MESSAGE.SUCCESS) {
          this.dsBoNganh = detail.data.listBoNganh;
        }
      }
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

  quayLai() {
    this.onClose.emit();
  }

  banHanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: '11',
          };
          let res =
            await this.quyetDinhBtcNganhService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

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
      res = await this.quyetDinhBtcNganhService.update(body);
    } else {
      res = await this.quyetDinhBtcNganhService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.idInput > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  xoaKeHoach() { }

  themKeHoach() { }
}


