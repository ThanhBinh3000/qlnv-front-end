import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { LOAI_HANG_DTQG } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';
import { UserLogin } from 'src/app/models/userlogin';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DanhSachXuatBanTrucTiep } from 'src/app/models/KeHoachBanDauGia';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { DeXuatKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-dialog-them-moi-xuat-ban-truc-tiep',
  templateUrl: './dialog-them-moi-xuat-ban-truc-tiep.component.html',
  styleUrls: ['./dialog-them-moi-xuat-ban-truc-tiep.component.scss']
})
export class DialogThemMoiXuatBanTrucTiepComponent implements OnInit {
  formData: FormGroup;
  thongTinXuatBanTrucTiep: DanhSachXuatBanTrucTiep;
  dataEdit: any;
  listOfData: any[] = [];
  tableExist: boolean = false;
  selectedChiCuc: boolean = false;
  isValid: boolean = false;
  userInfo: UserLogin;
  listDiemKhoEdit: any[] = [];

  dataChiTieu: any;
  loaiVthh: any;
  cloaiVthh: any;
  tenCloaiVthh: string;
  namKh: number;
  donViTinh: string;
  donGiaDuocDuyet: number;
  giaToiDa: any;

  listChiCuc: any[] = [];
  listNhaKho: any[] = [];
  listDiemKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = []

  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private userService: UserService,
    private donViService: DonviService,
    private modal: NzModalService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private helperService: HelperService,
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      soLuongChiCuc: [null],
      maDvi: [null, [Validators.required]],
      tenDvi: [null],
      diaChi: [null],
      soLuongChiTieu: [null],
      soLuongKhDaDuyet: [null],
      donViTinh: [null],
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.updateEditCache();
    this.disableChiCuc();
  }

  save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    if (this.listOfData.length == 0) {
      this.notification.error(MESSAGE.ERROR, "Danh sách điểm kho không được để trống")
      return;
    }
    let data = this.formData.value;
    data.children = this.listOfData;
    this._modalRef.close(data);
  }

  onCancel() {
    this._modalRef.destroy();
  }

  initForm() {
    this.userInfo = this.userService.getUserLogin();
    this.thongTinXuatBanTrucTiep = new DanhSachXuatBanTrucTiep();
    this.formData.patchValue({
      donViTinh: this.donViTinh,
      loaiVthh: this.loaiVthh,
    })
    this.loadDonVi();
    if (this.dataEdit) {
      this.helperService.bidingDataInFormGroup(this.formData, this.dataEdit);
      this.changeChiCuc(this.dataEdit.maDvi);
      this.listOfData = this.dataEdit.children;
    }
    this.checkDisabledSave();
  }

  async loadDonVi() {
    this.listChiCuc = [];
    if (this.dataChiTieu) {
      if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
        this.dataChiTieu.khLuongThuc?.forEach(item => {
          let body = {
            maDvi: item.maDonVi,
            tenDvi: item.tenDonvi,
            soLuongXuat: this.loaiVthh === LOAI_HANG_DTQG.GAO ? item.xtnTongGao : item.xtnTongThoc
          }

          this.listChiCuc.push(body)
        });
      }
      if (this.loaiVthh === LOAI_HANG_DTQG.MUOI) {
        this.dataChiTieu.khMuoiDuTru?.forEach(item => {
          let body = {
            maDvi: item.maDonVi,
            tenDvi: item.tenDonVi,
            soLuongXuat: item.xuatTrongNamMuoi
          }
          this.listChiCuc.push(body);
        });
      }
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
        let data = this.dataChiTieu.khVatTuXuat.filter(item => item.maVatTuCha == this.loaiVthh);
        data.forEach(item => {
          let body = {
            maDvi: item.maDvi,
            tenDvi: item.tenDonVi,
            soLuongXuat: item.soLuongNhap
          }
          this.listChiCuc.push(body);
        })
      }
    } else {
      let body = {
        trangThai: "01",
        maDviCha: this.userService.isCuc() ? this.userInfo.MA_DVI : this.dataEdit.maDvi.slice(0, 6),
      };
      let res = await this.donViService.getAll(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listChiCuc = res.data.filter(item => item.type == 'DV');
        this.listChiCuc.map(v => Object.assign(v, { tenDonVi: v.tenDvi }))
      }
    }
  }

  checkDisabledSave() {
    this.isValid = this.listOfData && this.listOfData.length > 0
  }

  async changeChiCuc(event) {
    let body = {
      year: this.namKh,
      loaiVthh: this.loaiVthh,
      maDvi: event,
      lastest: 1,
    }
    let soLuongDaLenKh = await this.deXuatKhBanTrucTiepService.getSoLuongAdded(body);
    let chiCuc = this.listChiCuc.filter(item => item.maDvi == event)[0];
    const res = await this.donViService.getDonVi({ str: event })
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (chiCuc.soLuongXuat) {
        if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.MUOI)) {
          this.formData.patchValue({
            tenDvi: res.data.tenDvi,
            diaChi: res.data.diaChi,
            soLuongKhDaDuyet: soLuongDaLenKh.data,
            soLuongChiTieu: chiCuc?.soLuongXuat,
          })
        } else {
          this.formData.patchValue({
            tenDvi: res.data.tenDvi,
            diaChi: res.data.diaChi,
            soLuongKhDaDuyet: soLuongDaLenKh.data,
            soLuongChiTieu: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? chiCuc?.soLuongXuat : chiCuc?.soLuongXuat * 1000,
          })
        }
      }
      this.listDiemKho = res.data.children.filter(item => item.type == 'MLK');
      this.thongTinXuatBanTrucTiep = new DanhSachXuatBanTrucTiep();
    }
  }

  changeDiemKho(index?) {
    if (index >= 0) {
      let diemKho = this.listDiemKho.filter(item => item.maDvi == this.editCache[index].data.maDiemKho);
      if (diemKho.length > 0) {
        this.editCache[index].data.tenDiemKho = diemKho[0].tenDvi;
        this.editCache[index].data.maDiemKho = diemKho[0].maDvi;
      }
      this.listNhaKho = [];
      for (let i = 0; i < diemKho[0].children?.length; i++) {
        const item = {
          'value': diemKho[0].children[i].maDvi,
          'text': diemKho[0].children[i].tenDvi,
          listNganKhoEdit: diemKho[0].children[i],
        };
        this.listNhaKho.push(item);
        this.editCache[index].data.maNhaKho = null;
        this.editCache[index].data.maNganKho = null;
        this.editCache[index].data.maLoKho = null;
      };
    } else {
      let diemKho = this.listDiemKho.filter(item => item.maDvi == this.thongTinXuatBanTrucTiep.maDiemKho)[0];
      this.listNhaKho = diemKho.children;
      this.thongTinXuatBanTrucTiep.tenDiemKho = diemKho.tenDvi;
      this.formDataPatchValue();
    }
  }

  formDataPatchValue() {
    this.thongTinXuatBanTrucTiep.donGiaDuocDuyet = this.donGiaDuocDuyet
    this.thongTinXuatBanTrucTiep.loaiVthh = this.loaiVthh;
    this.thongTinXuatBanTrucTiep.cloaiVthh = this.cloaiVthh;
    this.thongTinXuatBanTrucTiep.tenCloaiVthh = this.tenCloaiVthh;
    this.thongTinXuatBanTrucTiep.donViTinh = this.donViTinh;
    this.thongTinXuatBanTrucTiep.maNhaKho = null;
    this.thongTinXuatBanTrucTiep.maNganKho = null;
    this.thongTinXuatBanTrucTiep.maLoKho = null;
  }

  changeNhaKho(index?) {
    if (index >= 0) {
      let nhakho = this.listNhaKho.filter(item => item.value == this.editCache[index].data.maNhaKho);
      if (nhakho.length > 0) {
        this.editCache[index].data.tenNhaKho = nhakho[0].text;
        this.editCache[index].data.maNhaKho = nhakho[0].value;
        console.log(this.editCache[index].data.tenNhaKho, 111)
        console.log(this.editCache[index].data.maNhaKho, 222)
      }
      this.listNganKho = [];
      for (let i = 0; i < nhakho[0].listNganKhoEdit?.children.length; i++) {
        const item = {
          'value': nhakho[0].listNganKhoEdit.children[i].maDvi,
          'text': nhakho[0].listNganKhoEdit.children[i].tenDvi,
          listLoKhoEdit: nhakho[0].listNganKhoEdit.children[i],
        };
        this.listNganKho.push(item);
        this.editCache[index].data.maNganKho = null;
        this.editCache[index].data.maLoKho = null;
      };
      this.thongTinXuatBanTrucTiep = new DanhSachXuatBanTrucTiep();
    } else {
      let nhakho = this.listNhaKho.filter(item => item.maDvi == this.thongTinXuatBanTrucTiep.maNhaKho)[0];
      this.listNganKho = nhakho.children;
      this.thongTinXuatBanTrucTiep.tenNhaKho = nhakho.tenDvi;
      this.thongTinXuatBanTrucTiep.maNganKho = null;
      this.thongTinXuatBanTrucTiep.maLoKho = null;
    }
  }

  changeNganKho(index?) {
    if (index >= 0) {
      let nganKho = this.listNganKho.filter(item => item.value == this.editCache[index].data.maNganKho);
      if (nganKho.length > 0) {
        this.editCache[index].data.tenNganKho = nganKho[0].text;
        this.editCache[index].data.maNganKho = nganKho[0].value;
      }
      for (let i = 0; i < nganKho[0].listLoKhoEdit?.children.length; i++) {
        const item = {
          'value': nganKho[0].listLoKhoEdit.children[i].maDvi,
          'text': nganKho[0].listLoKhoEdit.children[i].tenDvi,
        };
        this.listLoKho.push(item);
        if (this.listLoKho && this.listLoKho.length == 0) {
          this.tonKho(nganKho)
        }
        this.editCache[index].data.maLoKho = null;
      };
      this.thongTinXuatBanTrucTiep = new DanhSachXuatBanTrucTiep();
    } else {
      let nganKho = this.listNganKho.filter(item => item.maDvi == this.thongTinXuatBanTrucTiep.maNganKho)[0];
      this.listLoKho = nganKho.children;
      if (this.listLoKho && this.listLoKho.length == 0) {
        this.tonKho(nganKho)
      }
      this.thongTinXuatBanTrucTiep.tenNganKho = nganKho.tenDvi;
      this.thongTinXuatBanTrucTiep.maLoKho = null;
    }
  }

  async changeLoKho(index?) {
    if (index >= 0) {
      let loKho = this.listLoKho.filter(item => item.value == this.editCache[index].data.maLoKho);
      if (loKho.length > 0) {
        this.editCache[index].data.tenLoKho = loKho[0].text;
        this.editCache[index].data.maLoKho = loKho[0].value
      }
      this.tonKho(loKho)
    } else {
      let loKho = this.listLoKho.filter(item => item.maDvi == this.thongTinXuatBanTrucTiep.maLoKho)[0];
      this.tonKho(loKho)
      this.thongTinXuatBanTrucTiep.tenLoKho = loKho.tenDvi;
    }
  }

  async tonKho(item) {
    let body = {
      'maDvi': item.maDvi,
      'loaiVthh': this.formData.value.loaiVthh
    }
    await this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data.length > 0) {
          let val = data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
          this.thongTinXuatBanTrucTiep.tonKho = cloneDeep(val)
        } else {
          this.thongTinXuatBanTrucTiep.tonKho = 0
        }
      }
    });
  }

  addDiemKho() {
    if (this.validateDiemKho() && this.validateSoLuong(true)) {
      this.listOfData = [...this.listOfData, this.thongTinXuatBanTrucTiep];
      this.thongTinXuatBanTrucTiep = new DanhSachXuatBanTrucTiep();
      this.formData.patchValue({
        soLuongChiCuc: this.calcTong('soLuongDeXuat')
      })
      this.updateEditCache();
      this.disableChiCuc();
      this.checkDisabledSave();
    }
  }

  validateDiemKho(): boolean {
    if (this.thongTinXuatBanTrucTiep.maDiemKho && this.thongTinXuatBanTrucTiep.maNhaKho && this.thongTinXuatBanTrucTiep.maNganKho && this.thongTinXuatBanTrucTiep.maDviTsan && this.thongTinXuatBanTrucTiep.soLuongDeXuat && this.thongTinXuatBanTrucTiep.donGiaDeXuat) {
      let data = this.listOfData.filter(item => item.maDiemKho == this.thongTinXuatBanTrucTiep.maDiemKho && item.maNhaKho == this.thongTinXuatBanTrucTiep.maNhaKho && item.maNganKho == this.thongTinXuatBanTrucTiep.maNganKho);
      if (data.length > 0) {
        if (this.thongTinXuatBanTrucTiep.maLoKho) {
          let loKho = data.filter(x => x.maLoKho == this.thongTinXuatBanTrucTiep.maLoKho);
          if (loKho.length > 0) {
            this.notification.error(MESSAGE.ERROR, "Điểm kho, ngăn kho, lô kho đã tồn tại. Xin vui lòng chọn lại")
            return false;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, "Điểm kho, ngăn kho, lô kho đã tồn tại. Xin vui lòng chọn lại")
          return false;
        }
      }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return false
    }

  }

  validateSoLuong(isAdd?) {
    const soLuongConLai = this.formData.value.soLuongChiTieu - this.formData.value.soLuongKhDaDuyet
    // const soLuong = this.thongTinXuatBanTrucTiep.tonKho
    let soLuongDeXuat = 0
    let tongSoLuong = 0
    if (isAdd) {
      soLuongDeXuat += this.thongTinXuatBanTrucTiep.soLuongDeXuat;
      tongSoLuong += this.thongTinXuatBanTrucTiep.soLuongDeXuat;
    }
    this.listOfData.forEach(item => {
      tongSoLuong += item.soLuongDeXuat
    })
    // if (soLuongDeXuat > soLuong) {
    //   this.notification.error(MESSAGE.ERROR, " Số lượng đã vượt quá số lượng tồn kho. Xin vui lòng nhập lại ")
    //   return false
    // }
    if (soLuongDeXuat > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, " Số lượng đã vượt quá chỉ tiêu. Xin vui lòng nhập lại ")
      return false
    } else if (tongSoLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, " Tổng số lượng đã vượt quá chỉ tiêu. Xin vui lòng nhập lại ")
      return false
    } else if (this.thongTinXuatBanTrucTiep.donGiaDeXuat < this.giaToiDa) {
      this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất phải lớn hơn hoặc bằng giá bán tối thiểu (" + this.giaToiDa + " đ)")
      return false
    } else {
      return true
    }
  }


  clearDiemKho() {
    this.thongTinXuatBanTrucTiep = new DanhSachXuatBanTrucTiep();
    this.thongTinXuatBanTrucTiep.id = null;
  }

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  startEdit(index: number): void {
    this.editCache[index].edit = true
  }

  cancelEdit(index: number): void {
    if (this.validateSoLuongEdit(index)) {
      this.editCache[index].edit = false
    }
  }

  saveEdit(index: number): void {
    if (this.validateSoLuongEdit(index)) {
      Object.assign(this.listOfData[index], this.editCache[index].data);
      this.editCache[index].edit = false;
      this.formData.patchValue({
        soLuongChiCuc: this.calcTong('soLuongDeXuat')
      })
    }
  }

  validateSoLuongEdit(index) {
    const soLuongConLai = this.formData.value.soLuongChiTieu - this.formData.value.soLuongKhDaDuyet
    let tongSoLuong = 0
    if (this.listOfData[index].soLuongDeXuat != this.editCache[index].data.soLuongDeXuat) {
      this.listOfData[index].soLuongDeXuat = this.editCache[index].data.soLuongDeXuat;
    }
    this.listOfData.forEach(item => {
      tongSoLuong += item.soLuongDeXuat
    })
    if (this.editCache[index].data.soLuongDeXuat > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, " Số lượng đã vượt quá chỉ tiêu. Xin vui lòng nhập lại ")
      return false
    } else if (tongSoLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, " Tổng số lượng đã vượt quá chỉ tiêu. Xin vui lòng nhập lại ")
      return false
    } else if (this.editCache[index].data.donGiaDeXuat < this.giaToiDa) {
      this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất phải lớn hơn hoặc bằng giá bán tối thiểu (" + this.giaToiDa + " đ)")
      return false
    } else {
      return true;
    }
  }

  deleteRow(i: number): void {
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
          this.listOfData = this.listOfData.filter((d, index) => index !== i);
          this.disableChiCuc();
          this.checkDisabledSave();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  updateEditCache(): void {
    this.listOfData.forEach((item, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  disableChiCuc() {
    if (this.listOfData.length > 0) {
      this.selectedChiCuc = true;
    } else {
      this.selectedChiCuc = false;
    }
  }

  calcTong(column) {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        prev += cur[column];
        return prev;
      }, 0);
      return sum;
    }
  }
}
