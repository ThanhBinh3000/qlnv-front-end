import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { TongHopDeNghiCapVonService } from 'src/app/services/tongHopDeNghiCapVon.service';
import { DeNghiCapVonBoNganhService } from 'src/app/services/deNghiCapVanBoNganh.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import {
  PAGE_SIZE_DEFAULT,
} from 'src/app/constants/config';
@Component({
  selector: 'app-thong-tin-tong-hop',
  templateUrl: './thong-tin-tong-hop.component.html',
  styleUrls: ['./thong-tin-tong-hop.component.scss']
})
export class ThongTinTonghopComponent implements OnInit {
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  formData: FormGroup;
  detail: any = {};
  pageSize: number = PAGE_SIZE_DEFAULT;
  page: number = 1;
  dataTableAll: any[] = [];
  date: any = new Date();
  userLogin: UserLogin;
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  noiDung: string = "";
  khDnCapVonIds: any[] = [];
  listMaTongHop: any[] = [];
  listNguonTongHop: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  listFileDinhKem: any[] = [];
  listThongTinChiTiet: any[] = []
  totalRecord: number = 0;
  isTonghop: boolean = false
  dayNow: any

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  filePA: any
  constructor(
    private modal: NzModalService,
    private tongHopDeNghiCapVonService: TongHopDeNghiCapVonService,
    private deNghiCapVonBoNganhService: DeNghiCapVonBoNganhService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private helperService: HelperService,
  ) {
  }
  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.dayNow = dayjs().format('DD/MM/YYYY')
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.initForm();
    await this.loadAllDeNghiCapVonBoNganh()
    this.loadChiTiet(this.idInput);
    this.spinner.hide();
  }
  initForm() {
    this.formData = this.fb.group({
      "nam": [null, [Validators.required]],
      "nguonTongHop": [null, [Validators.required]],
      "maTongHop": [null],
      "ngayTongHop": [null],
      "maToTrinh": [null],
      "noiDung": [null],
      "khDnCapVonIds": [null],
    });
    this.formData.patchValue({ id: this.idInput })
    this.formData.patchValue({ maDonVi: this.userInfo.MA_DVI })
    this.formData.patchValue({ capDvi: this.userInfo.CAP_DVI })

  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.tongHopDeNghiCapVonService.loadChiTiet(id);

      if (res.msg == MESSAGE.SUCCESS && res.data) {

        if (res.data) {
          this.formData.patchValue({
          });
        }
      }
    }
  }
  async save(isOther?: boolean) {
    console.log(this.detail);
    // chờ API và body request
    let body = {
      "capDvi": this.userInfo.CAP_DVI,
      "ct1s": [
        ...this.detail.tCThem
      ],
      "fileDinhKem": [...this.listFileDinhKem],
      "id": 0,
      "khDnCapVonIds": [
        0
      ],
      "maDvi": this.userInfo.MA_DVI,
      "maTongHop": this.formData.value.maTongHop ? this.formData.value.maTongHop : "",
      "nam": this.formData.value.nam ? this.formData.value.nam : "",
      "ngayTongHop": this.formData.value.ngayTongHop ? this.formData.value.ngayTongHop : "",
      "nguonTongHop": this.formData.value.nguonTongHop ? this.formData.value.nguonTongHop : "",
      "noiDung": this.formData.value.noiDung ? this.formData.value.noiDung : ""
    }
    console.log(body);

    // this.helperService.markFormGroupTouched(this.formData);
    // if (this.formData.invalid) {
    //   this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
    //   console.log(this.formData);
    //   return;
    // }
    // this.spinner.show();

    // try {

    //   let body = {
    //     "id": this.idInput,
    //     "maTongHop": this.formData.value.maTongHop,
    //     "khDnCapVonIds": this.formData.value.khDnCapVonIds,
    //     "maDonVi": this.formData.value.maDonVi,
    //     "nguonTongHop": this.formData.value.nguonTongHop,
    //     "nam": this.formData.value.nam,
    //     "noiDung": this.formData.value.noiDung,
    //     "capDvi": this.formData.value.capDvi,
    //     "ct1s": this.formData.value.ct1s,
    //     "fileDinhKem": this.listFileDinhKem.length > 0 ? [...this.listFileDinhKem] : [null],
    //     "ngayTongHop": this.formData.value.ngayTongHop ? dayjs(this.formData.value.ngayTongHop).format('YYYY-MM-DD') : null,
    //   };
    //   if (this.idInput > 0) {
    //     let res = await this.tongHopDeNghiCapVonService.sua(body);
    //     if (res.msg == MESSAGE.SUCCESS) {
    //       if (!isOther) {
    //         this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
    //         this.back();
    //       } else {
    //         return res.data.id;
    //       }
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, res.msg);
    //     }
    //   } else {
    //     let res = await this.tongHopDeNghiCapVonService.them(body);
    //     if (res.msg == MESSAGE.SUCCESS) {
    //       if (!isOther) {
    //         this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    //         this.back();
    //       } else {
    //         return res.data.id;
    //       }
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, res.msg);
    //     }
    //   }
    //   this.spinner.hide();
    // } catch (e) {
    //   console.log('error: ', e);
    //   this.spinner.hide();
    //   this.notification.error(
    //     MESSAGE.ERROR,
    //     e?.error?.message ?? MESSAGE.SYSTEM_ERROR,
    //   );
    // }
  }
  back() {
    this.showListEvent.emit();
  }
  async guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: "",
            lyDoTuChoi: ""
          };
          let res = await this.tongHopDeNghiCapVonService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.GUI_DUYET_SUCCESS,
            );
            this.back();
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

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThaiId: this.globals.prop.NHAP_TU_CHOI_TP,
          };


          const res = await this.tongHopDeNghiCapVonService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }
  async loadAllDeNghiCapVonBoNganh() {
    let body = {
      soDeNghi: '',
      maBoNganh: '',
      nam: '',
      ngayDeNghiTuNgay: '',
      ngayDeNghiDenNgay: '',
      pageNumber: this.page,
      pageSize: this.pageSize,
    };
    let res = await this.deNghiCapVonBoNganhService.timKiem(body);
    console.log(res);

    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonTongHop = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }
  banHanh() {

  }
  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;

      await this.loadThongTinChiTiet();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      await this.loadThongTinChiTiet();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async loadThongTinChiTiet() {

    this.spinner.show();
    this.isTonghop = true;
    let body = {
      // soDeNghi: null,
      // maBoNganh: null,
      // nam: ,
      // ngayDeNghiTuNgay: null,
      // ngayDeNghiDenNgay: null,
      // pageNumber: this.page,
      // pageSize: this.pageSize,
    };
    let res = await this.deNghiCapVonBoNganhService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listThongTinChiTiet = data.content;
      this.khDnCapVonIds = data.content.map(item => item.id)
      this.formData.patchValue({ khDnCapVonIds: this.khDnCapVonIds })
      this.dataTableAll = cloneDeep(this.listThongTinChiTiet);
      this.totalRecord = data.totalElements;
    } else {
      this.listThongTinChiTiet = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }
  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }
  clearFilter() {
    // this.isTonghop = false
    this.formData = this.fb.group({
      "nam": [null, [Validators.required]],
      "nguonTongHop": [null, [Validators.required]],
      "maTongHop": [null],
      "ngayTongHop": [null],
      "maToTrinh": [null],
      "noiDung": [null],
      "khDnCapVonIds": [null],
      "ct1s": [null, [Validators.required]],
    })
    this.listFileDinhKem = []
  }
  cancelEdit(stt: number): void {
    const index = this.detail?.tCThem.findIndex(item => item.stt === stt);
    this.editDataCache[stt] = {
      data: { ...this.detail?.tCThem[index] },
      edit: false
    };
  }

  saveEdit(stt: number): void {
    const index = this.detail?.tCThem.findIndex(item => item.stt === stt);
    Object.assign(this.detail?.tCThem[index], this.editDataCache[stt].data);
    this.editDataCache[stt].edit = false;
  }

  updateEditCache(): void {
    if (this.detail?.tCThem && this.detail?.tCThem.length > 0) {
      this.detail?.tCThem.forEach((item) => {
        this.editDataCache[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }
  sortTableId() {
    this.detail?.tCThem.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }
  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  deleteRow(data: any) {
    this.detail.tCThem = this.detail?.tCThem.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(stt: number) {
    this.editDataCache[stt].edit = true;
  }

  addRow() {
    if (!this.detail?.tCThem) {
      this.detail.tCThem = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.create);
    item.stt = this.detail?.tCThem.length + 1;
    this.detail.tCThem = [
      ...this.detail?.tCThem,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.create = {};
  }
  changeSoDeNghi(item) {
    if (item) {
      let getSoDeNghi = this.listNguonTongHop.filter(x => x.soDeNghi == item.soDeNghi);
      if (getSoDeNghi && getSoDeNghi.length > 0) {
        item.nam = getSoDeNghi[0].nam;
        item.ngayDeNghi = getSoDeNghi[0].ngayDeNghi;
        item.tenBoNganh = getSoDeNghi[0].tenBoNganh;
        item.tongTien = getSoDeNghi[0].tongTien;
        item.kinhPhiDaCap = getSoDeNghi[0].kinhPhiDaCap;
      }
    }
  }
}
