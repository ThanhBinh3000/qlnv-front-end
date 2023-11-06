import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { Validators } from "@angular/forms";
import dayjs from "dayjs";
import { MmDxChiCucService } from "../../../../../services/mm-dx-chi-cuc.service";
import { STATUS } from "../../../../../constants/status";
import { ChiTieuKeHoachNamCapTongCucService } from "../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import { of } from "rxjs";

@Component({
  selector: 'app-thong-tin-de-xuat-nhu-cau-chi-cuc',
  templateUrl: './thong-tin-de-xuat-nhu-cau-chi-cuc.component.html',
  styleUrls: ['./thong-tin-de-xuat-nhu-cau-chi-cuc.component.scss']
})
export class ThongTinDeXuatNhuCauChiCucComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  rowItem: MmThongTinNcChiCuc = new MmThongTinNcChiCuc();
  dataEdit: { [key: string]: { edit: boolean; data: MmThongTinNcChiCuc } } = {};
  listDmTaiSan: any[] = [];
  listCtieuKh: any[] = []

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: MmDxChiCucService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      capDvi: [null],
      soCv: [null, Validators.required],
      ngayKy: [null, Validators.required],
      namKeHoach: [dayjs().get('year'), Validators.required],
      soQdGiaoCt: [null],
      klLtBaoQuan: [0, Validators.required],
      klLtNhap: [0, Validators.required],
      klLtXuat: [0, Validators.required],
      trichYeu: [null,],
      trangThai: ['00'],
      trangThaiTh: [],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucDxTbmmTbcdDtl: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.getAllDmTaiSan(),
        this.changeNamKh(this.formData.value.namKeHoach)
      ]);
      if (this.id) {
        this.detail(this.id)
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getAllDmTaiSan() {
    let body = {
      loai: '02',
      trangThai: STATUS.BAN_HANH
    };
    let res = await this.dxChiCucService.searchDsChuaSuDung(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.listDmTaiSan = res.data
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeDm(event, type?: any) {
    let result = this.listDmTaiSan.filter(item => item.maTaiSan == event)
    if (result && result.length > 0) {
      if (!type) {
        this.rowItem.tenTaiSan = result[0].tenTaiSan
        this.rowItem.donViTinh = result[0].dviTinh;
        this.rowItem.donGiaTd = result[0].donGiaTd
      } else {
        type.tenTaiSan = result[0].tenTaiSan
        type.donViTinh = result[0].dviTinh;
        type.donGiaTd = result[0].donGiaTd;
      }
    }
    await this.getSLHienCo(event)
    await this.getSlNhapThem(event)
    await this.getDinhMuc(event)
    if (type) {
      await this.loadSlThuaThieu(type)
    } else {
      await this.loadSlThuaThieu(this.rowItem)
    }
  }

  async loadSlThuaThieu(item: MmThongTinNcChiCuc) {
    if ((item.slTieuChuan - item.slNhapThem - item.slHienCo) >= 0) {
      item.chenhLechThieu = item.slTieuChuan - item.slNhapThem - item.slHienCo
    } else {
      item.chenhLechThieu = 0
    }
    if ((item.slNhapThem + item.slHienCo - item.slTieuChuan) >= 0) {
      item.chenhLechThua = item.slNhapThem + item.slHienCo - item.slTieuChuan
    } else {
      item.chenhLechThua = 0
    }
  }

  async pheDuyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.DU_THAO:
      case STATUS.TUCHOI_CB_CUC: {
        trangThai = STATUS.DA_KY;
        break;
      }
      case STATUS.DA_KY: {
        trangThai = STATUS.DADUYET_CB_CUC
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }

  async themMoiCtiet() {
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.rowItem, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Dữ liệu trùng lặp, đề nghị nhập lại.");
      this.spinner.hide();
      return;
    }
    this.rowItem.maDvi = this.userInfo.MA_DVI;
    this.rowItem.thanhTienNc = this.rowItem.soLuong * this.rowItem.donGiaTd
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new MmThongTinNcChiCuc();
    this.updateEditCache();
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maTaiSan == item.maTaiSan) {
          rs = true;
          return;
        }
      })
    }
    return rs;
  }

  required(item: MmThongTinNcChiCuc) {
    let msgRequired = '';
    //validator
    if (!item.maTaiSan) {
      msgRequired = "Loại tài sản không được để trống";
    } else if (!item.soLuong) {
      msgRequired = "Số lượng không được để trống";
    }
    return msgRequired;
  }

  updateEditCache() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  refresh() {
    this.rowItem = new MmThongTinNcChiCuc();
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTable[stt] },
      edit: false
    };
  }

  async saveDinhMuc(idx: number) {
    let msgRequired = this.required(this.dataEdit[idx].data)
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.dataEdit[idx].data.thanhTienNc = this.dataEdit[idx].data.donGiaTd * this.dataEdit[idx].data.soLuong
    this.dataEdit[idx].edit = false;
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.updateEditCache();
  }

  deleteItem(index: any) {
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
          this.dataTable.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async save() {
    if (this.dataTable.length <= 0) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập chi tiết đề xuất");
      return;
    }
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucDxTbmmTbcdDtl = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this.goBack()
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.dxChiCucService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxTbmmTbcdDtl;
          if (this.dataTable && this.dataTable.length > 0) {
            this.dataTable.forEach(item => {
              this.loadSlThuaThieu(item)
              let result = this.listDmTaiSan.filter(p => p.maTaiSan == item.maTaiSan)
              if (result && result.length > 0) {
                item.tenTaiSan = result[0].tenTaiSan
              }
            })
          }
          this.updateEditCache();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async changeNamKh(event) {
    let res = await this.dxChiCucService.getCtieuKhoach(event);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listCtieuKh = []
        this.listCtieuKh.push(res.data)
      }
    } else {
      this.notification.warning(MESSAGE.WARNING, res.msg);
      return;
    }
  }

  changeSoQdGiaoCt(event) {
    let ctieuKhNhap = 0
    let ctieuKhXuat = 0
    let ctieuTkdn = 0
    let ctieuKhBq = 0
    let list = this.listCtieuKh.filter(item => item.id = event);
    if (list && list.length > 0) {
      let detail = list[0];
      if (detail.khLuongThuc && detail.khLuongThuc.length > 0) {
        let listLt = detail.khLuongThuc.filter(item => item.maDonVi = this.userInfo.MA_DVI)
        if (listLt && listLt.length > 0) {
          let detailLt = listLt[0]
          ctieuKhNhap = detailLt.ntnTongSoQuyThoc ? detailLt.ntnTongSoQuyThoc : 0
          ctieuKhXuat = detailLt.xtnTongSoQuyThoc ? detailLt.xtnTongSoQuyThoc : 0
          ctieuTkdn = detailLt.tkdnTongSoQuyThoc ? detailLt.tkdnTongSoQuyThoc : 0
          ctieuKhBq = ctieuTkdn + ctieuKhNhap - ctieuKhXuat
        }
      }

      this.formData.patchValue({
        klLtBaoQuan: ctieuKhBq,
        klLtNhap: ctieuKhNhap,
        klLtXuat: ctieuKhXuat,
      })
    }
  }

  async getSLHienCo(maHH) {
    let body = {
      maDvi: this.userInfo.MA_DVI,
      namKeHoach: this.formData.value.namKeHoach,
      maHangHoa: maHH
    }
    let res = await this.dxChiCucService.getSlHienCo(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data != 0) {
        this.rowItem.slHienCo = res.data
      } else {
        this.rowItem.slHienCo = 0
      }
    }
  }

  async getSlNhapThem(maHH) {
    let body = {
      maDvi: this.userInfo.MA_DVI,
      namKeHoach: Number(this.formData.value.namKeHoach) - 1,
      maHangHoa: maHH
    }
    let res = await this.dxChiCucService.getSlNhapThem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data != 0) {
        this.rowItem.slNhapThem = res.data
      } else {
        this.rowItem.slNhapThem = 0
      }
    }
  }


  async getDinhMuc(maHH) {
    let body = {
      maHangHoa: maHH
    }
    if (!this.formData.value.klLtNhap || !this.formData.value.klLtXuat || !this.formData.value.klLtBaoQuan) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng nhập khối lượng nhập, xuất, bảo quản!');
      return
    }
    let res = await this.dxChiCucService.getDinhMuc(body);
    if (res.data) {
      let detail = res.data;
      let tongKl = 0;
      let listLoaiHinh = detail.loaiHinh.split(",")
      if (listLoaiHinh && listLoaiHinh.length > 0) {
        if (listLoaiHinh.includes("00")) {
          tongKl = tongKl + this.formData.value.klLtNhap
        }
        if (listLoaiHinh.includes("01")) {
          tongKl = tongKl + this.formData.value.klLtXuat
        }
        if (listLoaiHinh.includes("02")) {
          tongKl = tongKl + this.formData.value.klLtBaoQuan
        }
      }

      this.rowItem.slTieuChuan = tongKl * detail.slChiCuc / detail.klChiCuc
    }
  }
}

export class MmThongTinNcChiCuc {
  id: number;
  maDvi: string;
  tenDvi: string;
  tenTaiSan: string;
  maTaiSan: string;
  donViTinh: string;
  slHienCo: number = 0;
  slNhapThem: number = 0;
  tongCong: number = 0;
  slTieuChuan: number = 0;
  slTieuChuanTc: number = 0;
  chenhLechThieu: number = 0;
  chenhLechThieuTc: number = 0;
  chenhLechThua: number = 0;
  chenhLechThuaTc: number = 0;
  soLuong: number = 0;
  soLuongTc: number = 0;
  donGiaTd: number = 0;
  thanhTienNc: number = 0;
  ghiChu: number;
}

