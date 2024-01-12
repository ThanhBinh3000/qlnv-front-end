import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DanhSachGoiThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { Globals } from 'src/app/shared/globals';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DonviService } from 'src/app/services/donvi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxuatKhLcntService } from "../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/dxuatKhLcnt.service";
import { UserLogin } from "../../../models/userlogin";
import { UserService } from "../../../services/user.service";
import { STATUS } from "../../../constants/status";
import { QuyetDinhGiaTCDTNNService } from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import { QuyetDinhGiaCuaBtcService } from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";

@Component({
  selector: 'dialog-them-moi-goi-thau',
  templateUrl: './dialog-them-moi-goi-thau.component.html',
  styleUrls: ['./dialog-them-moi-goi-thau.component.scss'],
})
export class DialogThemMoiGoiThauComponent implements OnInit {
  @ViewChild('donGiaInput') donGiaInput: ElementRef;
  dviTinh: any
  formGoiThau: FormGroup;
  data?: any;
  listVatTu?= [];
  loaiVthh?: any;
  isReadOnly?: boolean = false;
  showFromQd: boolean = false;
  listChungLoai = [];
  listCuc = [];
  listChiCuc = [];
  dataTable: any[] = [];
  thongTinCuc: DanhSachGoiThau = new DanhSachGoiThau();
  thongTinChiCuc: any[] = [];
  thongTinDiemKho: any[] = [];
  thongTinCucEdit: any[] = [];
  listChiCucMap = {};
  listDiemKhoMap = {};


  listPhuongThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listHinhThucDauThau: any[] = [];
  giaToiDa: any;
  userInfo: UserLogin;
  namKeHoach: any;
  dataChiTieu: any;
  ttCuc: {
    maDvi: string,
    tenDvi: string,
    soLuongTheoChiTieu: number,
    soLuongDaMua: number
  } = {
      maDvi: null,
      tenDvi: null,
      soLuongTheoChiTieu: null,
      soLuongDaMua: null
    }
  listGoiThau = [];
  disabledGoiThau: boolean = false;
  dataAll: any[] = [];
  trangThai: any;

  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private helperService: HelperService,
    private notification: NzNotificationService,
    private donviService: DonviService,
    private spinner: NgxSpinnerService,
    private dxuatKhLcntService: DxuatKhLcntService,
    private userService: UserService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
    private modal: NzModalService,
  ) {
    this.formGoiThau = this.fb.group({
      goiThau: [null, [Validators.required]],
      loaiVthh: [null],
      tenLoaiVthh: [null],
      cloaiVthh: [null],
      tenCloaiVthh: [null],
      dviTinh: [this.dviTinh],
      soLuong: [null],
      donGiaVat: [null],
      maDvi: [''],
      soQdPdGiaCuThe: [''],
      ngayKyQdPdGiaCuThe: [''],
      vat: [''],
    });
  }


  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    let res = await this.danhMucService.getDetail(this.loaiVthh);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChungLoai = res.data.child;
      this.formGoiThau.patchValue({
        loaiVthh: res.data.ma,
        tenVthh: res.data.ten,
        dviTinh: res.data.maDviTinh
      });
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.getGiaToiDa(null);
    let bodyPag = {
      namKeHoach: this.namKeHoach,
      loaiVthh: this.loaiVthh,
      loaiGia: "LG03"
    }
    let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
    if (pag.msg == MESSAGE.SUCCESS && pag.data.length > 0) {
      this.formGoiThau.patchValue({
        donGiaVat: (pag.data[0].giaQdDcTcdtVat && pag.data[0].giaQdDcTcdtVat > 0) ? pag.data[0].giaQdDcTcdtVat : pag.data[0].giaQdTcdtVat,
        soQdPdGiaCuThe: pag.data[0].soQdTcdt,
        ngayKyQdPdGiaCuThe: pag.data[0].ngayKyTcdt,
        vat: pag.data[0].vat * 100,
      })
    }
    await this.initForm(this.data)
    if (!this.data) {
      await this.loadListDonVi();
    }
  }

  async onChangeCloaiVthh($event) {
    let cloaiSelected = this.listChungLoai.filter(item => item.ma == $event);
    await this.getGiaToiDa($event);
    let bodyPag = {
      namKeHoach: this.namKeHoach,
      loaiVthh: this.loaiVthh,
      cloaiVthh: $event,
      loaiGia: "LG03"
    }
    let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
    if (pag.msg == MESSAGE.SUCCESS && pag.data.length > 0) {
      this.formGoiThau.patchValue({
        donGiaVat: (pag.data[0].giaQdDcTcdtVat && pag.data[0].giaQdDcTcdtVat > 0) ? pag.data[0].giaQdDcTcdtVat : pag.data[0].giaQdTcdtVat,
        soQdPdGiaCuThe: pag.data[0].soQdTcdt,
        ngayKyQdPdGiaCuThe: pag.data[0].ngayKyTcdt,
        vat: pag.data[0].vat * 100,
      })
    }
    this.formGoiThau.patchValue({
      tenCloaiVthh: cloaiSelected[0].ten,
      soLuong: 0
    })
    this.listCuc = [];
    this.dataTable = [];
    await this.loadListDonVi();
    this.thongTinCuc = new DanhSachGoiThau();
  }

  async loadListDonVi() {
    if (this.dataChiTieu) {
      for (let index = 0; index < this.dataChiTieu.khVatTuNhap.length; index++) {
        if (this.formGoiThau.get('cloaiVthh').value == null) {
          if (this.dataChiTieu.khVatTuNhap[index].maVatTuCha == this.loaiVthh && this.dataChiTieu.khVatTuNhap[index].maVatTu == null) {
            this.loadThongTinCuc(index);
          }
        } else {
          if (this.dataChiTieu.khVatTuNhap[index].maVatTu == this.formGoiThau.get('cloaiVthh').value
            || (this.dataChiTieu.khVatTuNhap[index].maVatTuCha == this.loaiVthh && this.dataChiTieu.khVatTuNhap[index].maVatTu == null)) {
            this.loadThongTinCuc(index);
          }
        }
      }
      for (let i = 0; i < this.listCuc.length; i++) {
        let body = {
          year: this.namKeHoach,
          loaiVthh: this.loaiVthh,
          maDvi: this.listCuc[i].maDvi
        }
        let soLuongDaLenKh = await this.dxuatKhLcntService.getSoLuongAdded(body);
        this.listCuc[i].soLuongDaMua = soLuongDaLenKh.data;
      }
    }
  }

  loadThongTinCuc(index) {
    this.ttCuc.maDvi = this.dataChiTieu.khVatTuNhap[index].maDvi;
    this.ttCuc.tenDvi = this.dataChiTieu.khVatTuNhap[index].tenDvi;
    if (this.dataChiTieu.khVatTuNhap[index].soLuongChuyenSang == null) {
      this.ttCuc.soLuongTheoChiTieu = this.nvl(this.dataChiTieu.khVatTuNhap[index].soLuongNhap)
    } else {
      this.ttCuc.soLuongTheoChiTieu = this.nvl(this.dataChiTieu.khVatTuNhap[index].soLuongNhap) + this.nvl(parseFloat(this.dataChiTieu.khVatTuNhap[index].soLuongChuyenSang));
    }

    this.listCuc.push(this.ttCuc);
    this.ttCuc = {
      maDvi: null,
      tenDvi: null,
      soLuongTheoChiTieu: null,
      soLuongDaMua: null
    }
  }

  async onChangeCuc($event) {
    let body = {
      "trangThai": "01",
      "maDviCha": $event
    };
    let res = await this.donviService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChiCucMap[$event] = res.data[0].children.filter(item => item.type != 'PB');
    }
    let cuc = this.listCuc.filter(item => item.maDvi == $event);
    this.thongTinCuc.soLuongTheoChiTieu = cuc[0].soLuongTheoChiTieu;
    this.thongTinCuc.soLuongDaMua = cuc[0].soLuongDaMua;
  }

  onChangeChiCuc($event, maCuc) {
    let chiCuc = this.listChiCucMap[maCuc].find(item => item.maDvi == $event);
    this.listDiemKhoMap[$event] = chiCuc.children.filter(item => item.type != 'PB');
  }

  async initForm(dataDetail) {
    if (dataDetail) {
      this.formGoiThau.patchValue({
        goiThau: dataDetail.goiThau,
        cloaiVthh: dataDetail.cloaiVthh,
        diaDiemNhap: dataDetail.diaDiemNhap,
        donGia: dataDetail.donGia,
        dviTinh: dataDetail.dviTinh,
        donGiaVat: dataDetail.donGiaVat,
        tenDvi: dataDetail.tenDvi,
        maDvi: dataDetail.maDvi,
        thanhTien: dataDetail.thanhTien,
        tenCloaiVthh: dataDetail.tenCloaiVthh
      })
      if (dataDetail.cloaiVthh != null) {
        await this.onChangeCloaiVthh(dataDetail.cloaiVthh)
      } else if (dataDetail.loaiVthh) {
        await this.onChangeCloaiVthh(dataDetail.loaiVthh)
      }
      this.formGoiThau.patchValue({
        soLuong: dataDetail.soLuong,
      })
      if (this.trangThai != STATUS.DU_THAO) {
        this.formGoiThau.get('donGiaVat').setValue(dataDetail.donGiaVat)
      }
      this.dataTable = dataDetail.children;
    }
  }

  handleOk() {
    this.helperService.markFormGroupTouched(this.formGoiThau);
    if (this.formGoiThau.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      return;
    }
    if (this.dataTable.length == 0) {
      this.notification.error(MESSAGE.ERROR, 'Danh sách địa điểm nhập không được để trống');
      return;
    }
    const body = this.formGoiThau.value;
    body.children = this.dataTable
    body.children.forEach(item => item.donGia = body.donGia);
    this._modalRef.close(body);
  }

  handleCancel() {
    this._modalRef.close();
  }


  calendarThanhTien() {
    let soLuong = this.formGoiThau.get('soLuong') ? this.formGoiThau.get('soLuong').value : null;
    let donGia = this.formGoiThau.get('donGia') ? this.formGoiThau.get('donGia').value : null;
    if (soLuong && donGia) {
      this.formGoiThau.get('thanhTien').setValue(soLuong * donGia);
    }
  }

  addCuc() {
    if (this.validateDataAddCuc('cuc') && this.validateSoLuongCuc()) {
      if (this.thongTinCuc.maDvi && this.thongTinCuc.soLuong) {
        let dataDvi = this.listCuc.filter(d => d.maDvi == this.thongTinCuc.maDvi)
        this.thongTinCuc.tenDvi = dataDvi[0].tenDvi;
        this.thongTinCuc.soLuongTheoChiTieu = dataDvi[0].soLuongTheoChiTieu;
        this.thongTinCuc.soLuongDaMua = dataDvi[0].soLuongDaMua;
        this.thongTinCuc.children = [];
        this.dataTable = [...this.dataTable, this.thongTinCuc];
        let soLuong: number = 0;
        this.dataTable.forEach(item => {
          soLuong = soLuong + item.soLuong
        });
        this.formGoiThau.patchValue({
          soLuong: soLuong
        });
        this.thongTinChiCuc[this.thongTinCuc.maDvi] = new DanhSachGoiThau();
        this.thongTinCuc = new DanhSachGoiThau();
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
  }

  addChiCuc(i, maCuc) {
    if (this.validateDataAdd(maCuc, 'chiCuc') && this.validateSoLuongChiCuc(i, maCuc)) {
      if (this.thongTinChiCuc[maCuc].maDvi && this.thongTinChiCuc[maCuc].soLuong) {
        let dataDvi = this.listChiCucMap[maCuc].filter(d => d.maDvi == this.thongTinChiCuc[maCuc].maDvi)
        this.thongTinChiCuc[maCuc].tenDvi = dataDvi[0].tenDvi;
        this.thongTinChiCuc[maCuc].children = [];
        this.dataTable[i].children = [...this.dataTable[i].children, this.thongTinChiCuc[maCuc]];
        this.thongTinDiemKho[this.thongTinChiCuc[maCuc].maDvi] = new DanhSachGoiThau();
        this.thongTinChiCuc[maCuc] = new DanhSachGoiThau();
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
  }

  addDiemKho(i, y, maChiCuc) {
    if (this.validateDataAdd(maChiCuc, 'diemKho') && this.validateSoLuongDiemKho(i, y, maChiCuc)) {
      if (this.thongTinDiemKho[maChiCuc].maDvi && this.thongTinDiemKho[maChiCuc].soLuong) {
        let dataDvi = this.listDiemKhoMap[maChiCuc].filter(d => d.maDvi == this.thongTinDiemKho[maChiCuc].maDvi);
        this.thongTinDiemKho[maChiCuc].tenDvi = dataDvi[0].tenDvi;
        this.dataTable[i].children[y].children = [...this.dataTable[i].children[y].children, this.thongTinDiemKho[maChiCuc]];
        this.thongTinDiemKho[maChiCuc] = new DanhSachGoiThau();
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      }
    }
  }

  validateSoLuongCuc() {
    if (this.thongTinCuc.soLuong > (this.thongTinCuc.soLuongTheoChiTieu - this.thongTinCuc.soLuongDaMua)) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu")
      return false;
    }
    return true;
  }

  validateSoLuongChiCuc(i, ma) {
    let soLuongChiCuc = 0
    this.dataTable[i].children.forEach(i => {
      soLuongChiCuc = soLuongChiCuc + i.soLuong
    })
    if (soLuongChiCuc + this.thongTinChiCuc[ma].soLuong > this.dataTable[i].soLuong) {
      this.notification.error(MESSAGE.ERROR, "Số lượng nhập của Chi cục không được vượt quá số lượng nhập của Cục.")
      return false
    }
    return true
  }
  validateSoLuongDiemKho(i, y, ma) {
    let soLuongDiemKho = 0
    this.dataTable[i].children[y].children.forEach(i => {
      soLuongDiemKho = soLuongDiemKho + i.soLuong
    })
    if (soLuongDiemKho + this.thongTinDiemKho[ma].soLuong > this.dataTable[i].children[y].soLuong) {
      this.notification.error(MESSAGE.ERROR, "Số lượng nhập của Điểm kho không được vượt quá số lượng nhập của Chi cục.")
      return false
    }
    return true
  }

  validateDataAddCuc(type: string): boolean {
    if (type == 'cuc') {
      let data = this.dataTable.filter(item => item.maDvi == this.thongTinCuc.maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      return true;
    }
  }

  validateDataAdd(ma: any, type: string, i?: any, y?: any): boolean {
    if (type == 'cuc') {
      let data = this.dataTable.filter(item => item.maDvi == this.thongTinCuc.maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      return true;
    }
    if (type == 'chiCuc') {
      let data = this.dataTable.filter(item => item.maDvi == this.thongTinChiCuc[ma].maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      return true;
    }
    if (type == 'diemKho') {
      let data = this.dataTable.filter(item => item.maDvi == this.thongTinDiemKho[ma].maDvi);
      if (data.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Đơn vị đã tồn tại, xin vui lòng thêm đơn vị khác")
        return false
      }
      return true;
    }
  }

  startEdit(i) {

  }

  deleteRow(i, y, z) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        if (i >= 0 && y >= 0 && z >= 0) {
          // this.dataTable[i].children[y].children = this.dataTable[i].children[y].children.splice(z, 1);
          this.dataTable[i].children[y].children = this.dataTable[i].children[y].children.filter((d, index) => index !== z);
        } else if (i >= 0 && y >= 0) {
          // this.dataTable[i].children = this.dataTable[i].children.splice(y, 1);
          this.dataTable[i].children = this.dataTable[i].children.filter((d, index) => index !== y);
        } else if (i >= 0) {
          this.dataTable = this.dataTable.filter((d, index) => index !== i);
          // this.dataTable = this.dataTable.splice(i, 1);
        }
      },
    });
  }

  clearCuc() {
    this.thongTinCuc.maDvi = null;
    this.thongTinCuc.soLuong = null;
  }
  clearChiCuc(i) {
    this.thongTinChiCuc[i].maDvi = null;
    this.thongTinChiCuc[i].soLuong = null;
  }
  clearDiemKho(y) {
    this.thongTinDiemKho[y].maDvi = null;
    this.thongTinDiemKho[y].soLuong = null;
  }

  // expandSet = new Set<number>();
  // onExpandChange(id: number, checked: boolean): void {
  //   if (checked) {
  //     this.expandSet.add(id);
  //   } else {
  //     this.expandSet.delete(id);
  //   }
  // }
  // expandSet2 = new Set<number>();
  // onExpandChange2(id: number, checked: boolean): void {
  //   if (checked) {
  //     this.expandSet2.add(id);
  //   } else {
  //     this.expandSet2.delete(id);
  //   }
  // }

  async getGiaToiDa(ma: string) {
    let body = {
      namKeHoach: this.namKeHoach,
      loaiVthh: this.loaiVthh,
      cloaiVthh: ma,
      loaiGia: "LG01"
    }
    let res = await this.quyetDinhGiaCuaBtcService.getQdGiaLastestBtc(body);
    if (res.msg === MESSAGE.SUCCESS) {
      if (res.data) {
        let giaToiDa = 0;
        res.data.forEach(i => {
          let giaQdBtc = 0;
          if (i.giaQdDcBtcVat != null && i.giaQdDcBtcVat > 0) {
            giaQdBtc = i.giaQdDcBtcVat
          } else {
            giaQdBtc = i.giaQdBtcVat
          }
          if (giaQdBtc > giaToiDa) {
            giaToiDa = giaQdBtc;
          }
        })
        this.giaToiDa = giaToiDa;
      }
    }
    // let res = await this.dxuatKhLcntService.getGiaBanToiDa(ma, this.userInfo.MA_DVI, this.namKeHoach);
    // if (res.msg === MESSAGE.SUCCESS) {
    //   this.giaToiDa = res.data;
    // }
  }

  async changeGoiThau(event?: any) {
    this.dataAll.forEach(item => {
      if (item.goiThau == event.nzValue) {
        this.data = item;
      }
    })
    await this.initForm(this.data)
  }

  nvl(item: number) {
    if (item == undefined || item == null) {
      return 0;
    }
    return item;
  }

  editRowCuc(i: number) {
    this.thongTinCucEdit[i] = this.dataTable[i].soLuong
    this.dataTable[i].edit = true;
  }
  saveEditCuc(i: number) {
    if (this.thongTinCucEdit[i] > (this.dataTable[i].soLuongTheoChiTieu - this.dataTable[i].soLuongDaMua)) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu")
      return false;
    }
    this.dataTable[i].soLuong = this.thongTinCucEdit[i]
    this.dataTable[i].edit = false;
    let soLuong: number = 0;
    this.dataTable.forEach(item => {
      soLuong = soLuong + item.soLuong
    });
    this.formGoiThau.patchValue({
      soLuong: soLuong
    });
  }
  cancelEditCuc(i: number) {
    this.dataTable[i].edit = false;
  }
}
