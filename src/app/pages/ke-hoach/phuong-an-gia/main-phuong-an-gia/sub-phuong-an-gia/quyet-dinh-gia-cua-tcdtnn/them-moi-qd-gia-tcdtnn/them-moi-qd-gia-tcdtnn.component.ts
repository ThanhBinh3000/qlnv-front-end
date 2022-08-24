import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhGiaTCDTNNService } from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-them-moi-qd-gia-tcdtnn',
  templateUrl: './them-moi-qd-gia-tcdtnn.component.html',
  styleUrls: ['./them-moi-qd-gia-tcdtnn.component.scss']
})
export class ThemMoiQdGiaTcdtnnComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  formData: FormGroup;
  @Input() type: string;
  userInfo: UserLogin;
  maQd: String;
  dsNam: any[] = [];
  dataTable: any[] = [];
  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    public globals: Globals,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year'), [Validators.required]],
        soQd: [, [Validators.required]],
        soToTrinh: ['123'],
        ngayKy: [null, [Validators.required]],
        ngayHieuLuc: [null, [Validators.required]],
        loaiGia: [null],
        trichYeu: [null],
        trangThai: ['00'],
        ghiChu: [],
        loaiVthh: ['01'],
        cloaiVthh: [],
        tchuanCluong: [],
        gia: [],
        giaVat: [],
        thongTinGia: [[]]
      }
    );
  }

  async ngOnInit() {
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      // this.loadDsLoaiGia(),
      // this.loadDsVthh(),
      this.maQd = "/" + this.userInfo.MA_QD,
      this.getDataDetail(this.idInput),
      // this.onChangeNamQd(this.formData.get('namKeHoach').value),
    ])
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhGiaTCDTNNService.getDetail(id);
      const data = res.data;
      console.log(data);
      this.formData.patchValue({
        namKeHoach: data.namKeHoach,
        soQd: data.soQd,
        ngayKy: data.ngayKy,
        ngayHieuLuc: data.ngayHieuLuc,
        trichYeu: data.trichYeu,
      });
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
          let res = await this.quyetDinhGiaTCDTNNService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.BAN_HANH_SUCCESS,
            );
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
      console.log(this.formData.value);
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.type = this.type;
    let res;
    if (this.idInput > 0) {
      res = await this.quyetDinhGiaTCDTNNService.update(body);
    } else {
      res = await this.quyetDinhGiaTCDTNNService.create(body);
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

  onChangeNamQd($event) {
  }

}
