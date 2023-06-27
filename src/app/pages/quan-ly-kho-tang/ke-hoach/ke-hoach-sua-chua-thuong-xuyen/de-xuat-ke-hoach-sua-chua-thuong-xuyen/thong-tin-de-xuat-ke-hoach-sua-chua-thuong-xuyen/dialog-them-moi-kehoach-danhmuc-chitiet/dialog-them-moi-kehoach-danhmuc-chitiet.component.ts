import {Component, Input, OnInit} from '@angular/core';
import {UserLogin} from "../../../../../../../models/userlogin";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {UserService} from "../../../../../../../services/user.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Globals} from "../../../../../../../shared/globals";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {DanhMucKhoService} from "../../../../../../../services/danh-muc-kho.service";
import dayjs from "dayjs";
import {formatNumber} from "@angular/common";
import {MESSAGE} from "../../../../../../../constants/message";
import {STATUS} from "../../../../../../../constants/status";
import {KeHoachDmChiTiet} from "../thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen.component";
import {AMOUNT, AMOUNT_NO_DECIMAL} from "../../../../../../../Utility/utils";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {
  DeXuatScLonService
} from "../../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/de-xuat-sc-lon.service";
import {
  DanhMucSuaChuaService
} from "../../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/danh-muc-kho/danh-muc-sua-chua.service";
import {DonviService} from "../../../../../../../services/donvi.service";
import {Validators} from "@angular/forms";
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-dialog-them-moi-kehoach-danhmuc-chitiet',
  templateUrl: './dialog-them-moi-kehoach-danhmuc-chitiet.component.html',
  styleUrls: ['./dialog-them-moi-kehoach-danhmuc-chitiet.component.scss']
})
export class DialogThemMoiKehoachDanhmucChitietComponent extends Base2Component implements OnInit {
  @Input() dataInput: any
  @Input() type: string
  @Input() sum: number
  @Input() dataTable: any
  @Input() dataHeader: any
  @Input() listDmSuaChua: any[]
  listNguonKinhPhi: any[] = [];
  listLoaiNhuCauDx: any[] = [];
  userInfo: UserLogin
  infoDanhMucSuaChua: any = {};
  namKh: number
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 0,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 100000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }

  constructor(
    private httpClient: HttpClient,
    private _modalRef: NzModalRef,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private dmKhoService: DanhMucKhoService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dmKhoService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      idVirtual: [null],
      khoi: [null, Validators.required],
      tenKhoi: [null, Validators.required],
      maDm: [null, Validators.required],
      tenDm: [null, Validators.required],
      maChiCuc: [null],
      tenChiCuc: [null],
      maDiemKho: [null],
      tenDiemKho: [null],
      diaDiem: [null],
      ghiChu: [null],
      giaTriDn: [null],
      giaTriDuocDuyet: [null],
      giaTriUocTh: [null, Validators.required],
      giaTriDnBs: [null, Validators.required],
      soQdPdTmdt: [null],
      ngayKyQd: [null],
      ngayKyQdPdTmdt: [null],
      giaTriLuyKe: [null],
      giaTriTmdtDuocDuyet: [null],
      giaTriKbs: [null, Validators.required],
      giaTriChenhLech: [null],
      giaTriChuaDuocPheDuyet: [null],
      loaiDeXuat: [null, Validators.required],
      tenLoaiDeXuat: [null],
      thoiGianScTu: [null, Validators.required],
      thoiGianScDen: [null, Validators.required],
      nguonKinhPhi: [null, Validators.required],
      tenNguonKinhPhi: [null],
      namSuaChua: [null],
      lyDo: [null],
      tgHoanThanh: [null],
      tgSuaChua: [null],
      tgThucHien: [null],
      giaTriCtScHienTai: [null, Validators.required],
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    try {
      await this.getNguonKinhPhi();
      await this.getLoaiNhuCauDeXuat();
      this.formData.patchValue({
        khoi: this.dataInput.khoi,
        tenKhoi: this.dataInput.tenKhoi,
      })
      if (this.type == 'sua') {
        this.getDetail();
      }
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  handleOk() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    if (this.checkExitsData(this.formData.value.maDm, this.dataTable) && this.type == 'them') {
      this.notification.error(MESSAGE.ERROR, "Không được chọn trùng danh mục");
      this.spinner.hide();
      return;
    }
    this._modalRef.close(this.formData.value);
  }

  async getNguonKinhPhi() {
    let res = await this.danhMucService.danhMucChungGetAll("NGUON_VON");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonKinhPhi = res.data;
    }
  }

  async getLoaiNhuCauDeXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_NHU_CAU_DEXUAT_DTSC_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiNhuCauDx = res.data;
    }
  }

  onCancel() {
    this._modalRef.close();
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maDuAn == item.maDuAn) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }

  getDetail() {
    this.helperService.bidingDataInFormGroup(this.formData, this.dataInput);
  }

  changeDmucSuaChua(event: any) {
    if (this.type == 'them') {
      this.infoDanhMucSuaChua = {};
      if (event) {
        let result = this.listDmSuaChua.find(item => item.maCongTrinh == event)
        if (result) {
          this.formData.patchValue({
            maDm: result.maCongTrinh,
            tenDm: result.tenCongTrinh,
            maCNhiCuc: result.maChiCuc,
            tenChiCuc: result.tenChiCuc,
            maDiemKho: result.maDiemKho,
            tenDiemKho: result.tenDiemKho,
            tgHoanThanh: result.tgHoanThanh,
            diaDiem: result.diaDiem,
            giaTriDn: result.tmdt,
            giaTriDuocDuyet: result.keHoachCaiTao,
            giaTriChuaDuocPheDuyet: (result.tmdt - result.keHoachCaiTao > 0) ? (result.tmdt - result.keHoachCaiTao) : 0,
            tgThucHien: result.tgThucHien,
            tgSuaChua: result.tgSuaChua,
            soQdPdTmdt: result.soQdPheDuyet,
            ngayKyQdPdTmdt: result.ngayQdPd
          })
        }
      } else {
        this.formData.patchValue({
          maDm: null,
          tenDm: null,
          maChiCuc: null,
          tenChiCuc: null,
          maDiemKho: null,
          tenDiemKho: null,
          tgHoanThanh: null,
          diaDiem: null,
          giaTriDn: null,
          giaTriDuocDuyet: null,
          giaTriChuaDuocPheDuyet: null,
          tgThucHien: null,
          tgSuaChua: null,
          soQdPdTmdt: null,
          ngayKyQdPdTmdt: null,
        })
      }
    }
  }

  changGiaTriUocTh() {
    if (this.formData.value.giaTriUocTh) {
      this.formData.patchValue({
        giaTriChenhLech: (this.formData.value.giaTriDuocDuyet - this.formData.value.giaTriUocTh)
      })
    }
  }
}
