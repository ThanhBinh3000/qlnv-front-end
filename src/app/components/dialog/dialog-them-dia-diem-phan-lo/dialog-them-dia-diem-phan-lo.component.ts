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
import { DanhSachPhanLo } from 'src/app/models/KeHoachBanDauGia';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { DeXuatKhBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
@Component({
  selector: 'app-dialog-them-dia-diem-phan-lo',
  templateUrl: './dialog-them-dia-diem-phan-lo.component.html',
  styleUrls: ['./dialog-them-dia-diem-phan-lo.component.scss']
})
export class DialogThemDiaDiemPhanLoComponent implements OnInit {
  formData: FormGroup;
  thongtinPhanLo: DanhSachPhanLo;
  loaiVthh: any;
  cloaiVthh: any;
  tenCloaiVthh: string;
  dataChiTieu: any;
  dviTinh: any;
  dataEdit: any;
  listOfData: any[] = [];
  tableExist: boolean = false;
  selectedChiCuc: boolean = false;
  isValid: boolean = false;
  userInfo: UserLogin;
  listDiemKhoEdit: any[] = [];
  khoanTienDatTruoc: number;
  namKh: any;
  giaToiDa: any;
  donGiaVat: number;

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
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      soLuongChiCuc: [null],
      donGiaChiCuc: [null],
      maDvi: [null, [Validators.required]],
      tenDvi: [null],
      diaChi: [null],
      slChiTieu: [null],
      slKeHoachDd: [null],
      donGiaVat: [null],
      loaiVthh: [null],
      dviTinh: [null]
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.updateEditCache();
    this.disableChiCuc();
    this.getGiaToiThieu();
  }

  async getGiaToiThieu() {
    let res = await this.deXuatKhBanDauGiaService.getGiaBanToiThieu(this.cloaiVthh, this.userInfo.MA_DVI, this.namKh);
    if (res.msg === MESSAGE.SUCCESS) {
      this.giaToiDa = res.data;
    }
  }

  save() {
    if (this.validateSoLuong(true)) {
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
  }

  onCancel() {
    this._modalRef.destroy();
  }

  initForm() {
    this.userInfo = this.userService.getUserLogin();
    this.thongtinPhanLo = new DanhSachPhanLo();
    this.formData.patchValue({
      dviTinh: this.dviTinh,
      loaiVthh: this.loaiVthh,
    })
    this.loadDonVi();
    if (this.dataEdit) {
      this.helperService.bidingDataInFormGroup(this.formData, this.dataEdit);
      this.changeChiCuc(this.dataEdit.maDvi);
      this.listOfData = this.dataEdit.children
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
    let soLuongDaLenKh = await this.deXuatKhBanDauGiaService.getSoLuongAdded(body);
    let chiCuc = this.listChiCuc.filter(item => item.maDvi == event)[0];
    const res = await this.donViService.getDonVi({ str: event })
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (chiCuc.soLuongXuat) {
        this.formData.patchValue({
          tenDvi: res.data.tenDvi,
          diaChi: res.data.diaChi,
          slKeHoachDd: soLuongDaLenKh.data,
          slChiTieu: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU || LOAI_HANG_DTQG.MUOI) ? chiCuc?.soLuongXuat : chiCuc?.soLuongXuat * 1000,
        })
      }
      this.listDiemKho = res.data.children.filter(item => item.type == 'MLK');
      this.thongtinPhanLo = new DanhSachPhanLo();
    }
  }

  changeDiemKho(index?) {
    if (index >= 0) {
      let diemKho = this.listDiemKho.filter(item => item.value == this.editCache[index].data.maDiemKho);
      if (diemKho.length > 0) {
        this.editCache[index].data.tenDiemKho = diemKho[0].text;
        this.editCache[index].data.diaDiemKho = diemKho[0].diaDiemKho
      }
      this.listNhaKho = [];
      for (let i = 0; i < diemKho[0].listDiemKhoEdit?.child.length; i++) {
        const item = {
          'value': diemKho[0].listDiemKhoEdit.child[i].maNhakho,
          'text': diemKho[0].listDiemKhoEdit.child[i].tenNhakho,
          listNganKhoEdit: diemKho[0].listDiemKhoEdit.child[i],
        };
        this.listNhaKho.push(item);
      };
    } else {
      let diemKho = this.listDiemKho.filter(item => item.maDvi == this.thongtinPhanLo.maDiemKho)[0];
      this.listNhaKho = diemKho.children;
      this.thongtinPhanLo.tenDiemKho = diemKho.tenDvi;
      this.thongtinPhanLo.diaDiemKho = diemKho.diaChi;
      this.formDataPatchValue();
    }
  }

  formDataPatchValue() {
    this.thongtinPhanLo.donGiaVat = this.donGiaVat;
    this.thongtinPhanLo.khoanTienDatTruoc = this.khoanTienDatTruoc;
    this.thongtinPhanLo.tenCloaiVthh = this.tenCloaiVthh
    this.thongtinPhanLo.dviTinh = this.dviTinh
    this.thongtinPhanLo.maNhaKho = null;
    this.thongtinPhanLo.maNganKho = null;
    this.thongtinPhanLo.maLoKho = null;
  }

  changeNhaKho(index?) {
    if (index >= 0) {
      let nhakho = this.listNhaKho.filter(item => item.value == this.editCache[index].data.maNhaKho);
      if (nhakho.length > 0) {
        this.editCache[index].data.tenNhakho = nhakho[0].text;
      }
      this.listNganKho = [];
      for (let i = 0; i < nhakho[0].listNganKhoEdit?.child.length; i++) {
        const item = {
          'value': nhakho[0].listNganKhoEdit.child[i].maNgankho,
          'text': nhakho[0].listNganKhoEdit.child[i].tenNgankho,
          listLoKhoEdit: nhakho[0].listNganKhoEdit.child[i],
        };
        this.listNganKho.push(item);
      }
      ;
      this.thongtinPhanLo = new DanhSachPhanLo();
    } else {
      let nhakho = this.listNhaKho.filter(item => item.maDvi == this.thongtinPhanLo.maNhaKho)[0];
      this.listNganKho = nhakho.children;
      this.thongtinPhanLo.tenNhaKho = nhakho.tenDvi;
    }
  }

  changeNganKho(index?) {
    if (index >= 0) {
      let nganKho = this.listNganKho.filter(item => item.value == this.editCache[index].data.maNganKho);
      if (nganKho.length > 0) {
        this.editCache[index].data.tenNganKho = nganKho[0].text;
      }
      for (let i = 0; i < nganKho[0].listLoKhoEdit?.child.length; i++) {
        const item = {
          'value': nganKho[0].listLoKhoEdit.child[i].maLokho,
          'text': nganKho[0].listLoKhoEdit.child[i].tenLokho,
        };
        this.listLoKho.push(item);
      }
      ;
      this.thongtinPhanLo = new DanhSachPhanLo();
    } else {
      let nganKho = this.listNganKho.filter(item => item.maDvi == this.thongtinPhanLo.maNganKho)[0];
      this.listLoKho = nganKho.children;
      this.thongtinPhanLo.tenNganKho = nganKho.tenDvi;

    }
  }

  async changeLoKho(index?) {
    if (index >= 0) {
      let loKho = this.listLoKho.filter(item => item.value == this.editCache[index].data.maLoKho);
      if (loKho.length > 0) {
        this.editCache[index].data.tenLoKho = loKho[0].text;
      }
    } else {
      let loKho = this.listLoKho.filter(item => item.maDvi == this.thongtinPhanLo.maLoKho)[0];
      this.thongtinPhanLo.tenLoKho = loKho.tenDvi;
    }
  }

  addDiemKho() {
    if (this.validateDiemKho() && this.validateSoLuong(true) && this.validateGiaDeXuat()) {
      this.thongtinPhanLo.khoanTienDatTruoc = this.khoanTienDatTruoc;
      this.listOfData = [...this.listOfData, this.thongtinPhanLo];
      this.thongtinPhanLo = new DanhSachPhanLo();
      this.formData.patchValue({
        soLuongChiCuc: this.calcTong('soLuong'),
        donGiaChiCuc: this.calcTong('donGiaDeXuat'),
      })
      this.updateEditCache();
      this.disableChiCuc();
      this.checkDisabledSave();
    }
  }

  validateDiemKho(): boolean {
    if (this.thongtinPhanLo.maDiemKho && this.thongtinPhanLo.maNhaKho && this.thongtinPhanLo.maNganKho && this.thongtinPhanLo.maDviTsan && this.thongtinPhanLo.soLuong && this.thongtinPhanLo.donGiaDeXuat) {
      let data = this.listOfData.filter(item => item.maDiemKho == this.thongtinPhanLo.maDiemKho && item.maNhaKho == this.thongtinPhanLo.maNhaKho && item.maNganKho == this.thongtinPhanLo.maNganKho);
      if (data.length > 0) {
        if (this.thongtinPhanLo.maLoKho) {
          let loKho = data.filter(x => x.maLoKho == this.thongtinPhanLo.maLoKho);
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
    const soLuongConLai = this.formData.value.slChiTieu - this.formData.value.slKeHoachDd
    const soLuong1 = this.thongtinPhanLo.duDau
    let soLuong = 0
    let tongSoLuong = 0
    if (isAdd) {
      soLuong += this.thongtinPhanLo.soLuong;
      tongSoLuong += this.thongtinPhanLo.soLuong;
    }
    this.listOfData.forEach(item => {
      tongSoLuong += item.soLuong
    })
    if (soLuong > soLuong1) {
      this.notification.error(MESSAGE.ERROR, " Số lượng đã vượt quá số lượng tồn kho. Xin vui lòng nhập lại ")
      return false
    }
    if (soLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, " Số lượng đã vượt quá chỉ tiêu. Xin vui lòng nhập lại ")
      return false
    }
    if (tongSoLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, " Tổng số lượng đã vượt quá chỉ tiêu. Xin vui lòng nhập lại ")
      return false
    } else {
      return true;
    }
  }

  validateGiaDeXuat() {
    if (this.giaToiDa == null) {
      this.notification.error(MESSAGE.ERROR, 'Bạn cần lập và trình duyệt phương án giá mua tối đa, giá bán tối thiểu trước. Chỉ sau khi có giá mua tối đa bạn mới thêm được địa điểm nhập kho vì giá mua đề xuất ở đây nhập vào phải >= giá bán tối thiểu.');
      return;
    } else if (this.thongtinPhanLo.donGiaDeXuat >= this.giaToiDa) {
      this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất phải lớn hơn hoặc bằng giá bán tối thiểu (" + this.giaToiDa + " đ)")
      return false
    } else {
      return true;
    }
  }

  clearDiemKho() {
    this.thongtinPhanLo = new DanhSachPhanLo();
    this.thongtinPhanLo.id = null;
  }

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  startEdit(index: number): void {
    if (this.validateSoLuong(true) && this.validateGiaDeXuat()) {
      this.thongtinPhanLo.khoanTienDatTruoc = this.khoanTienDatTruoc;
      this.listOfData[index].edit = true
    }

  }

  cancelEdit(index: number): void {
    if (this.validateSoLuong(true) && this.validateGiaDeXuat()) {
      this.listOfData[index].edit = false
      this.formData.patchValue({
        soLuongChiCuc: this.calcTong('soLuong'),
        donGiaChiCuc: this.calcTong('donGiaDeXuat'),
      })
    }
  }

  saveEdit(index: number): void {
    if (this.validateSoLuong(true) && this.validateGiaDeXuat()) {
      this.listOfData[index].edit = false
      this.formData.patchValue({
        soLuongChiCuc: this.calcTong('soLuong'),
        donGiaChiCuc: this.calcTong('donGiaDeXuat'),
      })
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
