import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {Validators} from "@angular/forms";
import dayjs from "dayjs";
import {MmDxChiCucService} from "../../../../../services/mm-dx-chi-cuc.service";
import {STATUS} from "../../../../../constants/status";
import {ChiTieuKeHoachNamCapTongCucService} from "../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import {MmHienTrangMmService} from "../../../../../services/mm-hien-trang-mm.service";
import {MangLuoiKhoService} from "../../../../../services/qlnv-kho/mangLuoiKho.service";

// @ts-ignore
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
  maQd: string;
  qdGiaoChiTieu: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: MmDxChiCucService,
    private ctieuKhService: ChiTieuKeHoachNamCapTongCucService,
    private hienTrangSv: MmHienTrangMmService,
    private mangLuoiKhoService: MangLuoiKhoService,
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
      slGaoXuat: [0],
      slThocXuat: [0],
      slGaoNhap: [0],
      slThocNhap: [0],
      slGaoDangBaoQuan: [0, Validators.required],
      slThocDangBaoQuan: [0, Validators.required],
      trichYeu: [null, Validators.required],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      trangThaiTh: [],
      tenTrangThai: ['Đang nhập dữ liệu'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      listQlDinhMucDxTbmmTbcdDtl: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = "/" + (this.userInfo.DON_VI && this.userInfo.DON_VI.tenVietTat ? this.userInfo.DON_VI.tenVietTat : "") + '-TCKT'
      this.getAllDmTaiSan();
      if (this.id) {
        this.detail(this.id)
      } else {
        let body = {maDvi: this.userInfo.DON_VI.maDvi, maVthh: "0101"};
        let res = await this.mangLuoiKhoService.slTon(body);
        if (res.msg === MESSAGE.SUCCESS) {
          this.formData.patchValue({slGaoDangBaoQuan: (res.data / 1000)});
        }
        body = {maDvi: this.userInfo.DON_VI.maDvi, maVthh: "0102"};
        res = await this.mangLuoiKhoService.slTon(body);
        if (res.msg === MESSAGE.SUCCESS) {
          this.formData.patchValue({slThocDangBaoQuan: (res.data / 1000)});
        }
        this.changeNamKh(this.formData.value.namKeHoach)
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
    let result = this.listDmTaiSan.find(item => item.maTaiSan == event)
    if (result) {
      let itemQdGiaoChiTieuChiCuc = this.qdGiaoChiTieu.khLuongThuc.find(it => it.maDonVi === this.userInfo.MA_DVI);
      let body = {
        maCcdc: result.maTaiSan,
        namKeHoach: this.formData.value.namKeHoach,
        maDvi: this.userInfo.MA_DVI,
        paggingReq: {limit: 999, page: 0}
      }
      let res = await this.hienTrangSv.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data.content;
        if (data && data.length > 0) {
          this.rowItem.slHienCo = data[0].soDuNamTruoc + data[0].slNhap + data[0].dieuChinhTang - data[0].dieuChinhGiam - data[0].slCanThanhLy;
        }
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      if (!type) {
        this.rowItem.tenTaiSan = result.tenTaiSan;
        this.rowItem.donViTinh = result.dviTinh;
        this.rowItem.donGiaTd = result.donGiaTd;
        if (itemQdGiaoChiTieuChiCuc) {
          this.rowItem.slChiTieuGao = itemQdGiaoChiTieuChiCuc.ntnGao;
          this.rowItem.slChiTieuThoc = itemQdGiaoChiTieuChiCuc.ntnThoc;
        }
      } else {
        type.tenTaiSan = result.tenTaiSan
        type.donViTinh = result.dviTinh;
        type.donGiaTd = result.donGiaTd;
      }
    }
    await this.getSLHienCo(event)
    await this.getSlNhapThem(event)
    if (type) {
      await this.getDinhMuc(event,type )
      await this.loadSlThuaThieu(type);
    } else {
      await this.getDinhMuc(event,this.rowItem )
      await this.loadSlThuaThieu(this.rowItem);
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
      case STATUS.DANG_NHAP_DU_LIEU:
      case STATUS.TUCHOI_CB_CUC: {
        trangThai = STATUS.DA_KY;
        break;
      }
      case STATUS.DA_DUYET_LDCC: {
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
          data: {...item},
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
      data: {...this.dataTable[stt]},
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

  async saveAndSend(status: string, msg: string, msgSuccess?: string) {
    try {
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
      this.formData.value.soCv = this.formData.value.soCv + this.maQd;
      await super.saveAndSend(this.formData.value, status, msg, msgSuccess);
    } catch (error) {
      console.error("Lỗi khi lưu và gửi dữ liệu:", error);
    }
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
    this.formData.value.soCv = this.formData.value.soCv + this.maQd;
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
          this.maQd = data.soCv ? "/" + data.soCv.split("/")[1] : this.userInfo.DON_VI && this.userInfo.DON_VI.tenVietTat ? this.userInfo.DON_VI.tenVietTat : "" + '-TCKT'
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soCv: data.soCv ? data.soCv.split("/")[0] : ""
          })
          this.fileDinhKem = data.listFileDinhKems;
          this.dataTable = data.listQlDinhMucDxTbmmTbcdDtl;
          if (this.dataTable && this.dataTable.length > 0) {
            this.dataTable.forEach(item => {
              this.loadSlThuaThieu(item)
              let result = this.listDmTaiSan.find(p => p.maTaiSan == item.maTaiSan)
              if (result) {
                item.tenTaiSan = result.tenTaiSan
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
    if (event && !this.isView && this.userService.isChiCuc()) {
      let res = await this.ctieuKhService.loadThongTinChiTieuKeHoachTheoNamVaDonVi(event, this.userInfo.MA_DVI.substring(0, 6));
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.qdGiaoChiTieu = res.data;
          if (this.qdGiaoChiTieu && this.qdGiaoChiTieu.khLuongThuc) {
            let detailLt = this.qdGiaoChiTieu.khLuongThuc.find(item => item.maDonVi == this.userInfo.MA_DVI)
            if (detailLt) {
              this.formData.patchValue({
                slGaoNhap: detailLt.ntnGao,
                slThocNhap: detailLt.ntnThoc,
                slGaoXuat: detailLt.xtnTongThoc,
                slThocXuat: detailLt.xtnTongGao,
                soQdGiaoCt: this.qdGiaoChiTieu.soQuyetDinh,
              })
            }
          }
        }
      }
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


  async getDinhMuc(maHH, item: MmThongTinNcChiCuc) {
    let body = {
      maHangHoa: maHH
    }
    if (!this.formData.value.slGaoDangBaoQuan || !this.formData.value.slThocDangBaoQuan) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng nhập khối lượng bảo quản hiện tại!');
      return
    }
    let res = await this.dxChiCucService.getDinhMuc(body);
    if (res.data) {
      let detail = res.data;
      item.isCanCu = detail.isCanCu;
      item.slVpCucKv = detail.slVpCucKv;
      item.slChiCuc = detail.slChiCuc;
      item.klChiCuc = detail.klChiCuc;
      item.tenLoaiHinh = this.getStrTenLoaiHinh(detail.loaiHinh);
      let tongKl = 0;
      let listLoaiHinh = detail.loaiHinh ? detail.loaiHinh.split(",") : null;
      if (listLoaiHinh && listLoaiHinh.length > 0) {
        if (listLoaiHinh.includes("00")) {
          tongKl = tongKl + this.formData.value.slGaoNhap * 2 + this.formData.value.slThocNhap
        }
        if (listLoaiHinh.includes("01")) {
          tongKl = tongKl + this.formData.value.slGaoXuat * 2 + this.formData.value.slThocXuat
        }
        if (listLoaiHinh.includes("02")) {
          tongKl = tongKl + this.formData.value.slGaoDangBaoQuan * 2 + this.formData.value.slThocDangBaoQuan
        }
        item.slTieuChuan = tongKl * detail.slChiCuc / detail.klChiCuc
      } else {
        item.slTieuChuan =detail.slChiCuc
      }
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
  slChiTieuGao?: number;
  slChiTieuThoc?: number;
  isCanCu : boolean = false
  tenLoaiHinh: string;
  klChiCuc: number = 0;
  slChiCuc: number = 0;
  slVpCucKv: number = 0;
}

