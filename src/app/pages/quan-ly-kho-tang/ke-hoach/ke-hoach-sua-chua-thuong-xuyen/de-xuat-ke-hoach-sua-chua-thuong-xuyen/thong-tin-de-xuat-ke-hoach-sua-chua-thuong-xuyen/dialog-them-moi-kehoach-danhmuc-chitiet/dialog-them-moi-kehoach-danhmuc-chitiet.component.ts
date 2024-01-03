import {Component, Input, OnInit} from '@angular/core';
import {UserLogin} from "../../../../../../../models/userlogin";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {DanhMucKhoService} from "../../../../../../../services/danh-muc-kho.service";
import {MESSAGE} from "../../../../../../../constants/message";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {Validators} from "@angular/forms";
import {CurrencyMaskInputMode} from "ngx-currency";
import {
  DeXuatScThuongXuyenService
} from "../../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/de-xuat-sc-thuong-xuyen.service";
import {STATUS} from "../../../../../../../constants/status";

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
  @Input() typeKh: any
  @Input() trangThaiTh: any
  listNguonKinhPhi: any[] = [];
  listLoaiNhuCauDx: any[] = [];
  radioValue: string = '01';
  userInfo: UserLogin
  infoDanhMucSuaChua: any = {};
  namKh: number
  isUsing: boolean = false
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
    private deXuatScThuongXuyenService: DeXuatScThuongXuyenService,
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
      maDvi: [null],
      tenChiCuc: [null],
      maDiemKho: [null],
      tenDiemKho: [null],
      diaDiem: [null],
      ghiChu: [null],
      giaTriDn: [null],
      giaTriDuocDuyet: [null],
      giaTriUocTh: [null],
      giaTriDnBs: [null],
      soQdPdTmdt: [null],
      ngayKyQd: [null],
      ngayKyQdPdTmdt: [null],
      giaTriLuyKe: [null],
      giaTriTmdtDuocDuyet: [null],
      giaTriKbs: [null],
      giaTriChenhLech: [null],
      giaTriChuaDuocPheDuyet: [null],
      loaiDeXuat: [null, Validators.required],
      tenLoaiDeXuat: [null],
      thoiGianScTu: [null, Validators.required],
      thoiGianScDen: [null, Validators.required],
      nguonKinhPhi: [null, Validators.required],
      tenNguonKinhPhi: [null],
      namSuaChua: [null],
      idDanhMuc: [null],
      loaiDx: [null],
      lyDo: [null],
      tgHoanThanh: [null],
      tgSuaChua: [null],
      tgThucHien: [null],
      giaTriCtScHienTai: [null],
      tongMucDtuCvien: [null],
      tongMucDtuLdVu: [null],
      tongMucDtuLdTc: [null],
      khVonCvien: [null],
      khVonLdVu: [null],
      khVonLdTc: [null],
      loaiNhuCau: [null],
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    try {
      console.log(this.dataTable, "dataTable")
      console.log(this.dataInput, "dataInput")
      console.log(this.type, "type")
      console.log(this.listDmSuaChua, "listDmSuaChua")
      console.log(this.trangThaiTh, "trangThaiTh")
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
      console.log(this.listLoaiNhuCauDx, 'listLoaiNhuCauDx')
    }
  }

  onCancel() {
    this._modalRef.close();
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maDm == item) {
          rs = true;
        }
      });
    }
    return rs;
  }

  getDetail() {
    this.helperService.bidingDataInFormGroup(this.formData, this.dataInput);
    this.radioValue = this.dataInput.loaiDx
  }

  // isDisable(): boolean {
  //   if (this.isUsing) {
  //     return true
  //   } else {
  //     return true
  //   }
  // }

  async changeDmucSuaChua(event: any) {
    if (this.type == 'them') {
      this.infoDanhMucSuaChua = {};
      if (event) {
        let result = this.listDmSuaChua.find(item => item.maCongTrinh == event)
        console.log(result, "resultresultresult")
        if (result) {
          let danhMuc;
          await this.deXuatScThuongXuyenService.getDanhMuc(result.id).then(res => {
            danhMuc = res.data
          })
          console.log(danhMuc, "44444")
          if(danhMuc){
            this.isUsing = true
            this.radioValue = '02'
            this.formData.patchValue({
              tenDm: danhMuc.tenDm,
              maChiCuc: danhMuc.maChiCuc,
              tenChiCuc: danhMuc.tenChiCuc,
              maDiemKho: danhMuc.maDiemKho,
              tenDiemKho: danhMuc.tenDiemKho,
              tgHoanThanh: danhMuc.tgHoanThanh,
              diaDiem: danhMuc.diaDiem,
              giaTriDn: danhMuc.giaTriDn,
              giaTriDuocDuyet: danhMuc.giaTriDuocDuyet,
              giaTriChuaDuocPheDuyet: (danhMuc.giaTriDn - danhMuc.giaTriDuocDuyet > 0) ? (danhMuc.giaTriDn - danhMuc.giaTriDuocDuyet) : 0,
              tgThucHien: danhMuc.tgThucHien,
              tgSuaChua: danhMuc.tgSuaChua,
              soQdPdTmdt: danhMuc.soQdPdTmdt,
              idDanhMuc: danhMuc.idDanhMuc,
              loaiDx: this.radioValue,
              loaiDeXuat: danhMuc.loaiDeXuat,
              nguonKinhPhi: danhMuc.nguonKinhPhi,
              ngayKyQdPdTmdt: danhMuc.ngayQdPd
            })
          }else{
            this.radioValue = '01'
            this.formData.patchValue({
              tenDm: result.tenCongTrinh,
              maChiCuc: result.maChiCuc,
              tenChiCuc: result.tenChiCuc,
              maDiemKho: result.maDiemKho,
              tenDiemKho: result.tenDiemKho,
              tgHoanThanh: result.tgHoanThanh,
              diaDiem: result.diaDiem,
              // giaTriDn: result.tmdt,
              giaTriDuocDuyet: result.keHoachCaiTao,
              giaTriChuaDuocPheDuyet: (result.tmdt - result.keHoachCaiTao > 0) ? (result.tmdt - result.keHoachCaiTao) : 0,
              tgThucHien: result.tgThucHien,
              tgSuaChua: result.tgSuaChua,
              soQdPdTmdt: result.soQdPheDuyet,
              idDanhMuc: result.id,
              loaiDeXuat: result.loaiDeXuat,
              nguonKinhPhi: result.nguonKinhPhi,
              loaiDx: this.radioValue,
              ngayKyQdPdTmdt: result.ngayQdPd
            })
          }
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

  calDmChuaPd(){
    let num = this.formData.get('giaTriDn').value - this.formData.get('giaTriDuocDuyet').value > 0 ? this.formData.get('giaTriDn').value - this.formData.get('giaTriDuocDuyet').value : 0;
    this.formData.patchValue({
      giaTriChuaDuocPheDuyet: num
    })
  }

  changGiaTriUocTh() {
    if (this.formData.value.giaTriUocTh) {
      this.formData.patchValue({
        giaTriChenhLech: (this.formData.value.giaTriDuocDuyet - this.formData.value.giaTriUocTh)
      })
    }
  }
}
