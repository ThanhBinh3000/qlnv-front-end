import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {Globals} from 'src/app/shared/globals';
import {UserService} from 'src/app/services/user.service';
import {DonviService} from 'src/app/services/donvi.service';
import {MESSAGE} from 'src/app/constants/message';
import {TinhTrangKhoHienThoiService} from 'src/app/services/tinhTrangKhoHienThoi.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {HelperService} from 'src/app/services/helper.service';
import {UserLogin} from 'src/app/models/userlogin';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {DanhSachPhanLo} from 'src/app/models/KeHoachBanDauGia';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {QuanLyHangTrongKhoService} from 'src/app/services/quanLyHangTrongKho.service';
import {
  DeXuatKhBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {cloneDeep} from 'lodash';
import {QuyetDinhGiaTCDTNNService} from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";

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
  dataDonGiaDuocDuyet: any;
  donViTinh: any;
  dataEdit: any;
  listOfData: any[] = [];
  selectedChiCuc: boolean = false;
  isValid: boolean = false;
  userInfo: UserLogin;
  khoanTienDatTruoc: number;
  namKh: any;
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
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null, [Validators.required]],
      tenDvi: [null],
      slChiTieu: [null],
      tongSlKeHoachDd: [null],
      tongSlXuatBanDx: [null],
      tongTienDatTruocDx: [null],
      donViTinh: [null],
      diaChi: [null],
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
    this.thongtinPhanLo = new DanhSachPhanLo();
    this.formData.patchValue({
      donViTinh: this.donViTinh,
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
        let data = this.dataChiTieu.khVatTuXuat.filter(item => item.maVatTuCha == this.loaiVthh && item.maVatTu == this.cloaiVthh);
        let soLuongXuat: number = 0;
        data.forEach((item) => {
          soLuongXuat += item.soLuongXuat
        })
        let body = {
          maDvi: data[0].maDvi,
          tenDvi: data[0].tenDvi,
          soLuongXuat: soLuongXuat
        }
        this.listChiCuc.push(body);
      }
    } else {
      let body = {
        trangThai: "01",
        maDviCha: this.userService.isCuc() ? this.userInfo.MA_DVI : this.dataEdit.maDvi.slice(0, 6),
      };
      let res = await this.donViService.getAll(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listChiCuc = res.data.filter(item => item.type == 'DV');
        this.listChiCuc.map(v => Object.assign(v, {tenDonVi: v.tenDvi}))
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
    const res = await this.donViService.getDonVi({str: event})
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (chiCuc.soLuongXuat) {
        if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.MUOI)) {
          this.formData.patchValue({
            tenDvi: res.data.tenDvi,
            diaChi: res.data.diaChi,
            tongSlKeHoachDd: soLuongDaLenKh.data,
            slChiTieu: chiCuc?.soLuongXuat,
          })
        } else
          this.formData.patchValue({
            tenDvi: res.data.tenDvi,
            diaChi: res.data.diaChi,
            tongSlKeHoachDd: soLuongDaLenKh.data,
            slChiTieu: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? chiCuc?.soLuongXuat : chiCuc?.soLuongXuat * 1000,
          })
      }
      this.listDiemKho = res.data.children.filter(item => item.type == 'MLK');
      this.thongtinPhanLo = new DanhSachPhanLo();
    }
    if (this.dataEdit){
      await this.getdonGiaDuocDuyet();
    }
    this.calcTinh();
  }

  async changeDiemKho(index?) {
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
          listNhaKhoEdit: diemKho[0].children[i],
        };
        this.listNhaKho.push(item);
        this.editCache[index].data.maNhaKho = null;
        this.editCache[index].data.maNganKho = null;
        this.editCache[index].data.maLoKho = null;
      }
    } else {
      let diemKho = this.listDiemKho.filter(item => item.maDvi == this.thongtinPhanLo.maDiemKho)[0];
      this.listNhaKho = diemKho.children;
      this.thongtinPhanLo.tenDiemKho = diemKho.tenDvi;
      this.formDataPatchValue();
      await this.getdonGiaDuocDuyet();
    }
  }

  async getdonGiaDuocDuyet() {
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      if (this.dataDonGiaDuocDuyet && this.dataDonGiaDuocDuyet.length > 0) {
        this.dataDonGiaDuocDuyet.forEach(item => {
          if (this.dataEdit){
            this.listOfData.forEach(s =>{
              s.donGiaDuocDuyet = item.giaQdTcdt
            })
          }else {
            this.thongtinPhanLo.donGiaDuocDuyet = item.giaQdTcdt
          }
        })
      } else {
        this.thongtinPhanLo.donGiaDuocDuyet = null;
      }
    } else {
      let donGiaDuocDuyet = this.dataDonGiaDuocDuyet?.filter(item => item.maChiCuc == this.formData.value.maDvi);
      if (donGiaDuocDuyet && donGiaDuocDuyet.length > 0) {
        donGiaDuocDuyet.forEach(item => {
          if (this.dataEdit){
            this.listOfData.forEach(s =>{
              s.donGiaDuocDuyet = item.giaQdTcdt
            })
          }else {
            this.thongtinPhanLo.donGiaDuocDuyet = item.giaQdTcdt
          }
        })
      } else {
        this.thongtinPhanLo.donGiaDuocDuyet = null;
      }
    }
  }

  formDataPatchValue() {
    this.thongtinPhanLo.loaiVthh = this.loaiVthh;
    this.thongtinPhanLo.cloaiVthh = this.cloaiVthh;
    this.thongtinPhanLo.tenCloaiVthh = this.tenCloaiVthh;
    this.thongtinPhanLo.donViTinh = this.donViTinh;
    this.thongtinPhanLo.maNhaKho = null;
    this.thongtinPhanLo.maNganKho = null;
    this.thongtinPhanLo.maLoKho = null;
  }

  async changeNhaKho(index?) {
    if (index >= 0) {
      let nhakho = this.listNhaKho.filter(item => item.value == this.editCache[index].data.maNhaKho);
      if (nhakho.length > 0) {
        this.editCache[index].data.tenNhaKho = nhakho[0].text;
        this.editCache[index].data.maNhaKho = nhakho[0].value;
      }
      this.listNganKho = [];
      for (let i = 0; i < nhakho[0].listNhaKhoEdit?.children.length; i++) {
        const item = {
          'value': nhakho[0].listNhaKhoEdit.children[i].maDvi,
          'text': nhakho[0].listNhaKhoEdit.children[i].tenDvi,
          listNganKhoEdit: nhakho[0].listNhaKhoEdit.children[i],
        };
        this.listNganKho.push(item);
        this.editCache[index].data.maNganKho = null;
        this.editCache[index].data.maLoKho = null;
      }
      this.thongtinPhanLo = new DanhSachPhanLo();
    } else {
      let nhakho = this.listNhaKho.filter(item => item.maDvi == this.thongtinPhanLo.maNhaKho)[0];
      this.listNganKho = nhakho.children;
      this.thongtinPhanLo.tenNhaKho = nhakho.tenDvi;
      this.thongtinPhanLo.maNganKho = null;
      this.thongtinPhanLo.maLoKho = null;
    }
  }

  async changeNganKho(index?) {
    if (index >= 0) {
      let nganKho = this.listNganKho.filter(item => item.value == this.editCache[index].data.maNganKho);
      if (nganKho.length > 0) {
        this.editCache[index].data.tenNganKho = nganKho[0].text;
        this.editCache[index].data.maNganKho = nganKho[0].value;
      }
      for (let i = 0; i < nganKho[0].listNganKhoEdit?.children.length; i++) {
        const item = {
          'value': nganKho[0].listNganKhoEdit.children[i].maDvi,
          'text': nganKho[0].listNganKhoEdit.children[i].tenDvi,
        };
        this.listLoKho.push(item);
        if (this.listLoKho && this.listLoKho.length == 0) {
          this.tonKho(nganKho, index)
        }
        this.editCache[index].data.maLoKho = null;
      }
      this.thongtinPhanLo = new DanhSachPhanLo();
    } else {
      let nganKho = this.listNganKho.filter(item => item.maDvi == this.thongtinPhanLo.maNganKho)[0];
      this.listLoKho = nganKho.children;
      if (this.listLoKho && this.listLoKho.length == 0) {
        this.tonKho(nganKho)
      }
      this.thongtinPhanLo.tenNganKho = nganKho.tenDvi;
      this.thongtinPhanLo.maLoKho = null;
    }
  }

  async changeLoKho(index?) {
    if (index >= 0) {
      let loKho = this.listLoKho.filter(item => item.value == this.editCache[index].data.maLoKho);
      if (loKho.length > 0) {
        this.editCache[index].data.tenLoKho = loKho[0].text;
        this.editCache[index].data.maLoKho = loKho[0].value
      }
      this.tonKho(loKho, index)
    } else {
      let loKho = this.listLoKho.filter(item => item.maDvi == this.thongtinPhanLo.maLoKho)[0];
      this.tonKho(loKho)
      this.thongtinPhanLo.tenLoKho = loKho.tenDvi;
    }
  }

  async tonKho(item, index?) {
    let body = {
      'maDvi': item.maDvi,
      'loaiVthh': this.loaiVthh,
      'cloaiVthh': this.cloaiVthh
    }
    await this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data.length > 0) {
          let val = data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
          if (index >= 0) {
            this.editCache[index].data.tonKho = cloneDeep(val)
          } else {
            this.thongtinPhanLo.tonKho = cloneDeep(val)
          }
        }
      } else {
        this.thongtinPhanLo.tonKho = null
      }
    });
  }

  addDiemKho() {
    if (this.validateDiemKho() && this.validateSoLuong(true)) {
      this.listOfData = [...this.listOfData, this.thongtinPhanLo];
      this.thongtinPhanLo = new DanhSachPhanLo();
      this.formData.patchValue({
        tongSlXuatBanDx: this.calcTong('soLuongDeXuat'),
      })
      this.calcTinh();
      this.updateEditCache();
      this.disableChiCuc();
      this.checkDisabledSave();
    }
  }

  validateDiemKho(): boolean {
    if (this.thongtinPhanLo.maDiemKho && this.thongtinPhanLo.maNhaKho && this.thongtinPhanLo.maNganKho && this.thongtinPhanLo.maDviTsan && this.thongtinPhanLo.soLuongDeXuat && this.thongtinPhanLo.donGiaDeXuat) {
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
    const soLuongConLai = this.formData.value.slChiTieu - this.formData.value.tongSlKeHoachDd
    const tonKho = this.thongtinPhanLo.tonKho
    let soLuongDeXuat = 0
    let tongSoLuong = 0
    let maDviTsan: string;
    if (isAdd) {
      soLuongDeXuat += this.thongtinPhanLo.soLuongDeXuat;
      tongSoLuong += this.thongtinPhanLo.soLuongDeXuat;
    }
    this.listOfData.forEach(item => {
      tongSoLuong += item.soLuongDeXuat
      maDviTsan = item.maDviTsan;
    })
    if (maDviTsan == this.thongtinPhanLo.maDviTsan) {
      this.notification.error(MESSAGE.ERROR, "Mã đơn vị tài sản (" + this.thongtinPhanLo.maDviTsan + " ) đã bị trùng với mã đơn vị tài sản trước đó vui lòng nhập lại")
      return false
    } else if (soLuongDeXuat > tonKho) {
      this.notification.error(MESSAGE.ERROR, " Số lượng đề xuất đã vượt quá số lượng tồn kho. Xin vui lòng nhập lại ")
      return false
    } else if (soLuongDeXuat > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, " Số lượng đã vượt quá chỉ tiêu. Xin vui lòng nhập lại ")
      return false
    } else if (tongSoLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, " Tổng số lượng đã vượt quá chỉ tiêu. Xin vui lòng nhập lại ")
      return false
    } else if (this.thongtinPhanLo.donGiaDeXuat < this.giaToiDa) {
      this.notification.error(MESSAGE.ERROR, "Đơn giá đề xuất phải lớn hơn hoặc bằng giá bán tối thiểu (" + this.giaToiDa + " đ)")
      return false
    } else {
      return true
    }
  }

  clearDiemKho() {
    this.thongtinPhanLo = new DanhSachPhanLo();
    this.thongtinPhanLo.id = null;
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
        tongSlXuatBanDx: this.calcTong('soLuongDeXuat')
      })
      this.calcTinh()
    }
  }

  validateSoLuongEdit(index) {
    const soLuongConLai = this.formData.value.slChiTieu - this.formData.value.tongSlKeHoachDd
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
        data: {...item}
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

  onChangeTinh() {
    this.thongtinPhanLo.giaKhoiDiemDx = this.thongtinPhanLo.donGiaDeXuat * this.thongtinPhanLo.soLuongDeXuat;
    this.thongtinPhanLo.giaKhoiDiemDd = this.thongtinPhanLo.donGiaDuocDuyet != null ? this.thongtinPhanLo.donGiaDuocDuyet * this.thongtinPhanLo.soLuongDeXuat : null;
    this.thongtinPhanLo.soTienDtruocDx = this.thongtinPhanLo.soLuongDeXuat * this.thongtinPhanLo.donGiaDeXuat * this.khoanTienDatTruoc / 100;
  }

  onChangeTinhEdit(index) {
    this.editCache[index].data.giaKhoiDiemDx = this.editCache[index].data.donGiaDeXuat * this.editCache[index].data.soLuongDeXuat;
    this.editCache[index].data.giaKhoiDiemDd = this.editCache[index].data.donGiaDuocDuyet != null ? this.editCache[index].data.donGiaDuocDuyet * this.editCache[index].data.soLuongDeXuat : null;
    this.editCache[index].data.soTienDtruocDx = this.editCache[index].data.soLuongDeXuat * this.editCache[index].data.donGiaDeXuat * this.khoanTienDatTruoc / 100;
  }

  calcTinh() {
    this.listOfData.forEach(item => {
      item.giaKhoiDiemDd = item.donGiaDuocDuyet != null ? item.donGiaDuocDuyet * item.soLuongDeXuat : null
    })
    this.formData.patchValue({
      tongTienDatTruocDx: this.listOfData.reduce((prev, cur) => prev + cur.soTienDtruocDx, 0),
    })
  }
}
