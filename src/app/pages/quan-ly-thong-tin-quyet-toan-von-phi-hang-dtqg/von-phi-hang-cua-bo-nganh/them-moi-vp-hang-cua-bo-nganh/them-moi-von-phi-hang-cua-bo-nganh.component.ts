import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {cloneDeep} from 'lodash';
import {NgxSpinnerService} from "ngx-spinner";
import * as dayjs from "dayjs";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {STATUS} from 'src/app/constants/status';
import {DinhMucPhiNxBq} from "../../../../models/DinhMucPhi";
import {KeHoachVonPhiBNCT} from "../../../../models/KeHoachVonPhiBNCT";
import {MESSAGE} from "../../../../constants/message";
import {DonviService} from "../../../../services/donvi.service";
import {ThongTinKhaoSatGia} from "../../../../models/DeXuatPhuongAnGia";
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../services/helper.service";
import {QuyetToanVonPhiService} from "../../../../services/ke-hoach/von-phi/quyetToanVonPhi.service";

@Component({
  selector: 'app-them-moi-von-phi-hang-cua-bo-nganh',
  templateUrl: './them-moi-von-phi-hang-cua-bo-nganh.component.html',
  styleUrls: ['./them-moi-von-phi-hang-cua-bo-nganh.component.scss']
})
export class ThemMoiVonPhiHangCuaBoNganhComponent implements OnInit {
  formData: FormGroup;
  dataTable: any[] = [];
  @Output()
  showListEvent = new EventEmitter<any>();
  page: number = 1;
  dsNam: any[] = [];
  @Input()
  idInput: number;
  dataTableAll: any[] = [];
  dsQtNsChiTw: any[] = [];
  dsQtNsKpChiNvDtqg: any[] = [];
  listBoNganh: any[] = [];
  allChecked = false;
  totalRecord: number = 10;
  STATUS = STATUS;
  isAdddsQtNsChiTw: boolean = false;
  isAdddsQtNsKpChiNvDtqg: boolean = false;
  dataQtNsChiTwEdit: { [key: string]: { edit: boolean; data: KeHoachVonPhiBNCT } } = {};
  dataQtNsKpChiNvDtqgEdit: { [key: string]: { edit: boolean; data: KeHoachVonPhiBNCT } } = {};
  rowItemQtNsChiTw: KeHoachVonPhiBNCT = new KeHoachVonPhiBNCT();
  rowItemQtNsKpChiNvDtqg: KeHoachVonPhiBNCT = new KeHoachVonPhiBNCT();
  taiLieuDinhKemList: any[] = [];
  setOfCheckedId = new Set<number>();
  indeterminate = false;
  filterTable: any = {
    namQuyetToan: '',
    ngayNhap: '',
    ngayCapNhat: '',
    qdCtKhNam: '',
    trangThai: '',
    trangThaiPdBtc: '',
  };

  constructor(
    private readonly fb: FormBuilder,
    public globals: Globals,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    private donviService: DonviService,
    private vonPhiService: QuyetToanVonPhiService,
    public modal: NzModalService,
    private helperService: HelperService,
    private notification: NzNotificationService,
  ) {
    this.formData = this.fb.group({
      namQuyetToan: [dayjs().get('year'), [Validators.required]],
      ngayNhap: ['', [Validators.required]],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo']
    });
  }

  ngOnInit() {
    this.loadDsNam();
    this.loadBoNganh();
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    }
    let body = {
      "id": null,
      "namQt": this.formData.value.namQuyetToan,
      "trangThai": this.formData.value.trangThai,
      "ngayNhap": this.formData.get("ngayNhap").value ? dayjs(this.formData.get("ngayNhap").value).format("YYYY-MM-DD") : null,
      "dsQtNsChiTw": this.dsQtNsChiTw,
      "dsQtNsKpChiNvDtqg": this.dsQtNsKpChiNvDtqg,
      "taiLieuDinhKems": this.taiLieuDinhKemList
    };
    this.spinner.show();
    try {
      if (this.idInput > 0) {
        body.id = this.idInput;
        let res = await this.vonPhiService.update(body);
        if (res.msg == MESSAGE.SUCCESS) {
          console.log(res.data)
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.vonPhiService.create(body);
        if (res.msg == MESSAGE.SUCCESS) {
          console.log(res.data)
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(
        MESSAGE.ERROR,
        e?.error?.message ?? MESSAGE.SYSTEM_ERROR,
      );
    }
    console.log(body);
  }

  changeBN() {
    if (this.rowItemQtNsChiTw.maBoNganh) {
      this.isAdddsQtNsChiTw = true;
      this.rowItemQtNsChiTw.tenBoNganh = this.listBoNganh.find(item => item.key == this.rowItemQtNsChiTw.maBoNganh).title;
    }
    if (this.rowItemQtNsKpChiNvDtqg.maBoNganh) {
      this.isAdddsQtNsKpChiNvDtqg = true;
      this.rowItemQtNsKpChiNvDtqg.tenBoNganh = this.listBoNganh.find(item => item.key == this.rowItemQtNsKpChiNvDtqg.maBoNganh).title;
    }
  }

  addQtNsChiTw() {
    if (!this.isAdddsQtNsChiTw) {
      return;
    }
    this.dsQtNsChiTw = [...this.dsQtNsChiTw, this.rowItemQtNsChiTw];
    this.rowItemQtNsChiTw = new KeHoachVonPhiBNCT();
    this.updateEditQtNsChiTwCache();
  }

  addQtNsKpChiNvDtqg() {
    if (!this.isAdddsQtNsKpChiNvDtqg) {
      return;
    }
    this.dsQtNsKpChiNvDtqg = [...this.dsQtNsKpChiNvDtqg, this.rowItemQtNsKpChiNvDtqg];
    this.rowItemQtNsKpChiNvDtqg = new KeHoachVonPhiBNCT();
    this.updateEditQtNsKpChiNvDtqgCache();
  }

  updateEditQtNsChiTwCache(): void {
    if (this.dsQtNsChiTw) {
      this.dsQtNsChiTw.forEach((item, index) => {
        this.dataQtNsChiTwEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  updateEditQtNsKpChiNvDtqgCache(): void {
    if (this.dsQtNsKpChiNvDtqg) {
      this.dsQtNsKpChiNvDtqg.forEach((item, index) => {
        this.dataQtNsKpChiNvDtqgEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  editQtNsChiTw(index) {
    this.dataQtNsChiTwEdit[index].edit = true;
  }

  editQtNsKpChiNvDtqg(index) {
    this.dataQtNsKpChiNvDtqgEdit[index].edit = true;
  }

  deleteQtNsChiTw(index) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dsQtNsChiTw.splice(index, 1);
          this.updateEditQtNsChiTwCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  deleteQtNsKpChiNvDtqg(index) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dsQtNsKpChiNvDtqg.splice(index, 1);
          this.updateEditQtNsKpChiNvDtqgCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveEditQtNsChiTw(idx) {
    Object.assign(this.dsQtNsChiTw[idx], this.dataQtNsChiTwEdit[idx].data);
    this.dataQtNsChiTwEdit[idx].edit = false;
  }

  saveEditQtNsKpChiNvDtqg(idx) {
    Object.assign(this.dsQtNsKpChiNvDtqg[idx], this.dataQtNsKpChiNvDtqgEdit[idx].data);
    this.dataQtNsKpChiNvDtqgEdit[idx].edit = false;
  }

  cancelEditQtNsChiTw(idx) {
    this.dataQtNsChiTwEdit[idx] = {
      data: {...this.dsQtNsChiTw[idx]},
      edit: false
    };
  }

  cancelEditQtNsKpChiNvDtqg(idx) {
    this.dataQtNsKpChiNvDtqgEdit[idx] = {
      data: {...this.dsQtNsKpChiNvDtqg[idx]},
      edit: false
    };
  }

  refreshQtNsChiTw() {
    this.rowItemQtNsChiTw = new KeHoachVonPhiBNCT();
    this.isAdddsQtNsChiTw = false;
  }

  refreshQtNsKpChiNvDtqg() {
    this.rowItemQtNsKpChiNvDtqg = new KeHoachVonPhiBNCT();
    this.isAdddsQtNsKpChiNvDtqg = false;
  }

  async loadBoNganh() {
    this.listBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listBoNganh = res.data.filter(item => item.key != '01');
    }
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: thisYear + i,
        text: thisYear + i,
      });
    }
  }

}
