import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Globals } from 'src/app/shared/globals';
import { MESSAGE } from 'src/app/constants/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { HelperService } from 'src/app/services/helper.service';
import {
  DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent,
} from '../../../../../../../components/dialog/dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung/dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung.component';
import {
  QuyetDinhUbtvqhMuaBuBoSungService,
} from '../../../../../../../services/quyet-dinh-ubtvqh-mua-bu-bo-sung.service';
import { STATUS } from '../../../../../../../constants/status';
import { DanhMucService } from '../../../../../../../services/danhmuc.service';

@Component({
  selector: 'app-them-moi-ubtvqh',
  templateUrl: './them-moi-ubtvqh.component.html',
  styleUrls: ['./them-moi-ubtvqh.component.scss'],
})
export class ThemMoiUbtvqhComponent implements OnInit {

  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();

  formData: FormGroup;

  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  // maQd: string
  userInfo: UserLogin;
  dataTable: any[] = [];
  listKinhPhiBs: any[] = [];
  STATUS = STATUS;

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    public globals: Globals,
    private quyetDinhUbtvqhMuBuBoSung: QuyetDinhUbtvqhMuaBuBoSungService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
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
        nguonKpBs : [null],
        trangThai: [STATUS.DANG_NHAP_DU_LIEU],
        listBoNganh: [],
      },
    );
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.getListKinhPhiBs(),
      this.getDataDetail(this.idInput),
    ]);
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhUbtvqhMuBuBoSung.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namQd: data.namQd,
        ngayQd: data.ngayQd,
        soQd: data.soQd,
        nguonKpBs: data.nguonKpBs,
        trangThai: data.trangThai,
        trichYeu: data.trichYeu,
      });
      this.dataTable = data.listBoNganh;
      this.taiLieuDinhKemList = data.fileDinhkems;
    }
  }


  loadDsNam() {
    for (let i = -3; i <= 5; i++) {
      this.dsNam.push({
        value: dayjs().get('year') + i,
        text: dayjs().get('year') + i,
      });
    }
  }

  async getListKinhPhiBs() {
    this.listKinhPhiBs = [];
    let res = await this.danhMucService.danhMucChungGetAll('NGUON_KINH_PHI_BS');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKinhPhiBs = res.data;
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


  xoaItem(id: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.dataTable.splice(id, 1);
      },
    });
  }

  quayLai() {
    this.onClose.emit();
  }

  pheDuyet() {
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
            id: this.formData.get('id').value,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH,
          };
          let res =
            await this.quyetDinhUbtvqhMuBuBoSung.approve(
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
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    if (this.dataTable.length == 0) {
      this.notification.error(MESSAGE.ERROR, 'Danh sách kế hoạch không được để trống');
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd;
    body.listBoNganh = this.dataTable;
    body.fileDinhKems = this.taiLieuDinhKemList;
    let res;
    if (this.idInput > 0) {
      res = await this.quyetDinhUbtvqhMuBuBoSung.update(body);
    } else {
      res = await this.quyetDinhUbtvqhMuBuBoSung.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: STATUS.BAN_HANH,
        });
        this.pheDuyet();
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

  exportData() {
  }

  themKeHoach(data?: any, index?, isView?: boolean) {
    const modalQD = this.modal.create({
      nzTitle: 'Thêm chi tiết kế hoạch giao Bộ/Ngành',
      nzContent: DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        isView: isView,
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        if (index >= 0) {
          this.dataTable[index] = data;
        } else {
          this.dataTable.push(data);
        }
      }
    });
    this.formData.get('listBoNganh').setValue(this.dataTable);
  }

}
