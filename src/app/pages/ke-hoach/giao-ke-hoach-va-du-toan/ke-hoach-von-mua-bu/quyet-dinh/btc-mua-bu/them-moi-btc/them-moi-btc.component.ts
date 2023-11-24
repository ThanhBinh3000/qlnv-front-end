import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import {
  DialogChiTietKeHoachGiaoBoNganhComponent,
} from 'src/app/components/dialog/dialog-chi-tiet-ke-hoach-giao-bo-nganh/dialog-chi-tiet-ke-hoach-giao-bo-nganh.component';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Globals } from 'src/app/shared/globals';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhTtcpService } from 'src/app/services/quyetDinhTtcp.service';
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
import {
  DialogQdMuabubosungTtcpComponent,
} from '../../../../../../../components/dialog/dialog-qd-muabubosung-ttcp/dialog-qd-muabubosung-ttcp.component';
import { MuaBuBoSungTtcpServiceService } from '../../../../../../../services/mua-bu-bo-sung-ttcp-service.service';
import { MuaBuBoSungBtcService } from '../../../../../../../services/mua-bu-bo-sung-btc.service';
import {
  DialogMuabuBosungBtcComponent,
} from '../../../../../../../components/dialog/dialog-muabu-bosung-btc/dialog-muabu-bosung-btc.component';
import { STATUS } from '../../../../../../../constants/status';

@Component({
  selector: 'app-them-moi-btc',
  templateUrl: './them-moi-btc.component.html',
  styleUrls: ['./them-moi-btc.component.scss'],
})
export class ThemMoiBtcComponent implements OnInit {

  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();

  formData: FormGroup;

  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  maQd: string;
  userInfo: UserLogin;
  dataTable: any[] = [];
  listTtcp: any[] = [];
  STATUS = STATUS;

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    public globals: Globals,
    private qdBtcService: MuaBuBoSungBtcService,
    private quyetDinhTtcpMuBuBoSung: MuaBuBoSungTtcpServiceService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namQd: [dayjs().get('year'), [Validators.required]],
        soQd: [, [Validators.required]],
        soQdTtcp: [, [Validators.required]],
        ngayQd: [null, [Validators.required]],
        trichYeu: [null],
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
      this.maQd = '/QĐ-BTC',
      await this.getDataDetail(this.idInput),
    ]);
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.qdBtcService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namQd: data.namQd,
        // soQdTtcp: data.soQdTtcp,
        ngayQd: data.ngayQd,
        soQd: data.soQd.split('/')[0],
        trangThai: data.trangThai,
        trichYeu: data.trichYeu,
      });
      this.onChangeNamQd(this.formData.get('namQd').value, data);
      this.dataTable = data.listBoNganh;
      this.taiLieuDinhKemList = data.fileDinhkems;
      this.formData.patchValue({
        soQdTtcp: data.soQdTtcp,
      });
    } else {
      this.onChangeNamQd(this.formData.get('namQd').value);
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
            await this.qdBtcService.approve(
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
    body.soQd = body.soQd + this.maQd;
    body.listBoNganh = this.dataTable;
    body.fileDinhKems = this.taiLieuDinhKemList;
    let res;
    if (this.idInput > 0) {
      res = await this.qdBtcService.update(body);
    } else {
      res = await this.qdBtcService.create(body);
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
      nzContent: DialogMuabuBosungBtcComponent,
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

  async onChangeNamQd(namQd, dataQdBtc?) {
    this.formData.get('soQdTtcp').setValue(null);
    let body = {
      namQd: namQd,
      trangThai: STATUS.BAN_HANH,
    };
    let res = await this.quyetDinhTtcpMuBuBoSung.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = [];
      if (dataQdBtc) {
        data = res.data.content;
      } else {
        data = res.data.content.filter(item => !item.soQdBtc);
      }
      this.listTtcp = data;
      if (this.listTtcp && this.listTtcp.length > 0 && !dataQdBtc) {
        this.formData.patchValue({
          soQdTtcp: this.listTtcp[0].soQd,
        });
        let res = await this.quyetDinhTtcpMuBuBoSung.getDetail(this.listTtcp[0].id);
        if (res.msg == MESSAGE.SUCCESS) {
          this.dataTable = res.data.listBoNganh;
        } else {
          this.notification.error(MESSAGE.ERROR, 'Không tìm thấy thông tin chi tiết quyết định của TTCP');
        }
      }
    }
  }

}
