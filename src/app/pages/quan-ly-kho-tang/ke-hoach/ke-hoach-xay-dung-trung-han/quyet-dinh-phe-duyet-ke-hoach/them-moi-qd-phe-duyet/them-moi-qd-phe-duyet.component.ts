

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ThongTinQuyetDinh} from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UserService} from "../../../../../../services/user.service";
import {Globals} from "../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../../../services/helper.service";
import dayjs from "dayjs";
import {
  DialogSoQuyetDinhQlyKhoTangComponent
} from "../../../../../../components/dialog/dialog-so-quyet-dinh-qly-kho-tang/dialog-so-quyet-dinh-qly-kho-tang.component";
import {
  DialogQdXdTrungHanComponent
} from "../../../../../../components/dialog/dialog-qd-xd-trung-han/dialog-qd-xd-trung-han.component";
import {QuyetDinhKhTrungHanService} from "../../../../../../services/quyet-dinh-kh-trung-han.service";
import {MESSAGE} from "../../../../../../constants/message";
import {STATUS} from "../../../../../../constants/status";
import {UserLogin} from "../../../../../../models/userlogin";

@Component({
  selector: 'app-them-moi-qd-phe-duyet',
  templateUrl: './them-moi-qd-phe-duyet.component.html',
  styleUrls: ['./them-moi-qd-phe-duyet.component.scss']
})
export class ThemMoiQdPheDuyetComponent implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  formData: FormGroup
  maQd: string;
  dataTableTh: any[] = [];
  dataTable: any[] = [];

  listToTrinh : any[] = [];
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: ThongTinQuyetDinh = new ThongTinQuyetDinh();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinQuyetDinh } } = {};
  fileDinhKems: any[] = [];
  listNam: any[] = [];
  userInfo : UserLogin;

  STATUS = STATUS
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,

    private quyetDinhService: QuyetDinhKhTrungHanService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      phuongAnTc: [null],
      soCongVan: [null],
      ngayTrinhBtc: [null],
      ngayKyBtc: [null],
      trichYeu: [null],
      namBatDau: [null],
      namKetThuc:[null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
    });
  }

  async getListTt() {
    let result = await this.quyetDinhService.getListToTrinh();
    if (result.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = result.data;
    }
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.maQd = '/TCDT-TVQT'
    this.loadDsNam();
    await this.getDetail(this.idInput);
  }

  async getDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        phuongAnTc: data.phuongAnTc,
        soCongVan: data.soCongVan ? data.soCongVan.split("/")[0] : null,
        ngayTrinhBtc:data.ngayTrinhBtc,
        ngayKyBtc: data.ngayKyBtc,
        trichYeu: data.trichYeu,
        namBatDau: data.namBatDau,
        namKetThuc:data.namKetThuc,
        trangThai: data.trangThai,
        tenTrangThai:data.tenTrangThai,
      });
      this.fileDinhKems = data.fileDinhKems
      this.dataTable = data.ctiets;
      this.dataTableTh = data.ctietsTh;
    }
  }

  loadDsNam() {
    for (let i = -10; i < 10; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }


  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.removeValidators(this.formData);
    if (isGuiDuyet) {
      this.setValidators()
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soCongVan = body.soCongVan + this.maQd;
    body.ctiets = this.dataTable;
    body.fileDinhKems = this.fileDinhKems;
    body.maDvi = this.userInfo.MA_DVI;
    let res
    if (this.idInput > 0) {
      res = await this.quyetDinhService.update(body);
    } else {
      res = await this.quyetDinhService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.guiDuyet();
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

  setValidators() {
    this.formData.controls['phuongAnTc'].setValidators([Validators.required])
    this.formData.controls['soCongVan'].setValidators([Validators.required])
    this.formData.controls['ngayTrinhBtc'].setValidators([Validators.required])
    this.formData.controls['ngayKyBtc'].setValidators([Validators.required])
    this.formData.controls['trichYeu'].setValidators([Validators.required])
    this.formData.controls['namKetThuc'].setValidators([Validators.required])
    this.formData.controls['namBatDau'].setValidators([Validators.required])
  }


  guiDuyet() {
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
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.DU_THAO : {
              trangThai = STATUS.BAN_HANH;
              break;
            }
          }
          let body = {
            id: this.formData.get('id').value,
            lyDo: null,
            trangThai: trangThai,
          };
          let res =
            await this.quyetDinhService.approve(
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

  async openDialogToTrinh() {
    await this.getListTt();
    const modal = this.modal.create({
      nzTitle: 'Danh sách Phương án của Tổng cục',
      nzContent: DialogQdXdTrungHanComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dsPhuongAn : this.listToTrinh
      },
    });
    modal.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          phuongAnTc : data.maToTrinh
        })
        this.dataTable = data.ctiets;
        this.dataTableTh = data.ctiets;
      }
    });
  }
  calcTong(type) {
    let sum;
    if (this.dataTable && this.dataTable.length > 0) {
      sum = this.dataTable.reduce((prev, cur) => {
        switch (type) {
          case '1' : {
            prev += cur.tmdtDuKien;
            break;
          }
          case '2' : {
            prev += cur.nstwDuKien;
            break;
          }
          case '3' : {
            prev += cur.tongSoLuyKe;
            break;
          }
          case '4' : {
            prev += cur.luyKeNstw;
            break;
          }
          case '5' : {
            prev += cur.tmdtDuyet;
            break;
          }
          case '6' : {
            prev += cur.nstwDuyet;
            break;
          }
        }
        return prev;
      }, 0);
    }
    return sum;
  }

}


