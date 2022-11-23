import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhTtcpService } from 'src/app/services/quyetDinhTtcp.service';
import { QuyetDinhBtcNganhService } from 'src/app/services/quyetDinhBtcNganh.service';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { STATUS } from "../../../../../../../constants/status";

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
  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];
  dsBoNganhTtcp: any[] = [];
  userInfo: UserLogin;
  maQd: string;
  muaTangList: any[] = []
  xuatGiamList: any[] = []
  xuatBanList: any[] = []
  luanPhienList: any[] = []
  hasError: boolean = false;
  dataTable: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
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
        idTtcpBoNganh: [, [Validators.required]],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.getListBoNganh(),
      this.maQd = '/QĐ-BTC',
      this.getDataDetail(this.idInput),

    ])
    await this.onChangeNamQd(this.formData.get('namQd').value);
    await this.onChangeBoNganh(this.formData.get('idTtcpBoNganh').value);
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhBtcNganhService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namQd: data.namQd,
        ngayQd: data.ngayQd,
        soQd: data.soQd.split('/')[0],
        trangThai: data.trangThai,
        trichYeu: data.trichYeu,
        idTtcpBoNganh: data.idTtcpBoNganh,
      })
      this.taiLieuDinhKemList = data.fileDinhkems;
      this.muaTangList = data.muaTangList ? data.muaTangList : [];
      this.xuatGiamList = data.xuatGiamList ? data.xuatGiamList : [];
      this.xuatBanList = data.xuatBanList ? data.xuatBanList : [];
      this.luanPhienList = data.luanPhienList ? data.luanPhienList : [];
    }
  }

  async onChangeNamQd(namQd) {
    let body = {
      namQd: namQd,
      trangThai: STATUS.BAN_HANH
    }
    let res = await this.quyetDinhTtcpService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content;
      if (data.length > 0) {
        let dataTtcp = await this.quyetDinhTtcpService.getDetail(data[0].id);
        if (dataTtcp.msg == MESSAGE.SUCCESS) {
          this.dsBoNganhTtcp = dataTtcp.data.listBoNganh;
        }
      } else {
        this.dsBoNganhTtcp = [];
      }
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
    }
  }

  loadDsNam() {
    for (let i = 0; i < 5; i++) {
      this.dsNam.push({
        value: dayjs().get('year') + i,
        text: dayjs().get('year') + i,
      });
    }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
    }
  }

  downloadFileKeHoach(event) {
  }

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
        if (this.muaTangList.length == 0) {
          this.notification.error(
            MESSAGE.ERROR,
            'Chưa nhập nội dung dự toán',
          );
          this.spinner.hide();
          return;
        }
        try {
          let body = {
            id: this.formData.get('id').value,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH,
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

  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (this.hasError) {
      this.notification.error(MESSAGE.ERROR, 'Nội dung dự toán không hợp lệ.')
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    body.fileDinhKems = this.taiLieuDinhKemList;
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
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.banHanh();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  xoaKeHoach() {
  }

  themKeHoach() {
  }

  tongGiaTri: number = 0;

  onChangeBoNganh($event) {
    let data = this.dsBoNganhTtcp.filter(item => item.maBoNganh == $event);
    if (data.length > 0) {
      this.tongGiaTri = data[0].tongTien;
    } else {
      this.tongGiaTri = 0;
    }
  }

  takeError($event) {
    this.hasError = $event;
  }
}


