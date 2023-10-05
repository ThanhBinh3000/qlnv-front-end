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
import {DanhSachPhanLo, DanhSachXuatBanTrucTiep} from 'src/app/models/KeHoachBanDauGia';
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
    private helperService: HelperService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
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
    if (this.formData.invalid) return;
    if (this.listOfData.length === 0) {
      this.notification.error(MESSAGE.ERROR, "Danh sách điểm kho không được để trống");
      return;
    }
    const data = {
      ...this.formData.value,
      children: this.listOfData
    };
    this._modalRef.close(data);
  }

  onCancel() {
    this._modalRef.destroy();
  }

  initForm() {
    this.userInfo = this.userService.getUserLogin();
    this.thongtinPhanLo = new DanhSachPhanLo();
    this.formData.patchValue({donViTinh: this.donViTinh});
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
      await this.loadDonViFromDataChiTieu();
    } else {
      await this.loadDonViFromDonViService();
    }
  }

  async loadDonViFromDataChiTieu() {
    const itemsToAdd = [];
    if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
      itemsToAdd.push(
        ...this.dataChiTieu.khLuongThuc?.map(item => ({
          maDvi: item.maDonVi,
          tenDvi: item.tenDonvi,
          soLuongXuat: this.loaiVthh === LOAI_HANG_DTQG.GAO ? item.xtnTongGao : item.xtnTongThoc
        })) || []
      );
    } else if (this.loaiVthh === LOAI_HANG_DTQG.MUOI) {
      itemsToAdd.push(
        ...this.dataChiTieu.khMuoiDuTru?.map(item => ({
          maDvi: item.maDonVi,
          tenDvi: item.tenDonVi,
          soLuongXuat: item.xuatTrongNamMuoi
        })) || []
      );
    } else if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      const data = this.dataChiTieu.khVatTuXuat.filter(item => item.maVatTuCha == this.loaiVthh && item.maVatTu == this.cloaiVthh);
      const soLuongXuat = data.reduce((acc, item) => acc + item.soLuongXuat, 0);
      itemsToAdd.push({
        maDvi: data[0].maDvi,
        tenDvi: data[0].tenDvi,
        soLuongXuat: soLuongXuat
      });
    }
    this.listChiCuc.push(...itemsToAdd);
  }

  async loadDonViFromDonViService() {
    const body = {
      trangThai: "01",
      maDviCha: this.userService.isCuc() ? this.userInfo.MA_DVI : this.dataEdit.maDvi.slice(0, 6),
    };
    const res = await this.donViService.getAll(body);
    if (res && res.data && res.msg === MESSAGE.SUCCESS) {
      this.listChiCuc = res.data.filter(item => item.type == 'DV');
      this.listChiCuc.forEach(v => v.tenDonVi = v.tenDvi);
    }
  }

  checkDisabledSave() {
    this.isValid = !!(this.listOfData && this.listOfData.length);
  }

  async changeChiCuc(event, isSlChiTieu?) {
    if (isSlChiTieu) {
      this.formData.patchValue({
        slChiTieu: null
      })
    }
    let body = {
      year: this.namKh,
      loaiVthh: this.loaiVthh,
      maDvi: event,
      lastest: 1,
    }
    const [soLuongDaLenKh, chiCuc, res] = await Promise.all([
      this.deXuatKhBanDauGiaService.getSoLuongAdded(body),
      this.listChiCuc.find(item => item.maDvi === event),
      this.donViService.getDonVi({str: event}),
    ]);
    this.listDiemKho = [];
    if (res.msg === MESSAGE.SUCCESS && chiCuc?.soLuongXuat) {
      const soLuongChiTieu = this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? chiCuc.soLuongXuat : chiCuc.soLuongXuat;
      this.formData.patchValue({
        tenDvi: res.data.tenDvi,
        diaChi: res.data.diaChi,
        tongSlKeHoachDd: soLuongDaLenKh.data,
        slChiTieu: this.loaiVthh.startsWith(LOAI_HANG_DTQG.MUOI) ? soLuongChiTieu : soLuongChiTieu,
      });
      this.listDiemKho = res.data.children.filter(item => item.type === 'MLK');
      this.thongtinPhanLo = new DanhSachPhanLo();
    }
    if (this.dataEdit) {
      await this.getdonGiaDuocDuyet();
    }
    this.calcTinh();
  }

  async changeDiemKho(index?) {
    if (index >= 0) {
      const diemKho = this.listDiemKho.find(item => item.maDvi === this.editCache[index].data.maDiemKho);
      if (diemKho) {
        this.editCache[index].data.tenDiemKho = diemKho.tenDvi;
        this.editCache[index].data.maDiemKho = diemKho.maDvi;
        this.listNhaKho = diemKho.children?.map(child => ({
          value: child.maDvi,
          text: child.tenDvi,
          listNganKhoEdit: child,
        })) || [];
        this.editCache[index].data.maNhaKho = null;
        this.editCache[index].data.maNganKho = null;
        this.editCache[index].data.maLoKho = null;
      }
    } else {
      const diemKho = this.listDiemKho.find(item => item.maDvi === this.thongtinPhanLo.maDiemKho);
      if (diemKho) {
        this.listNhaKho = diemKho.children || [];
        this.thongtinPhanLo.tenDiemKho = diemKho.tenDvi;
        this.formDataPatchValue();
        await this.getdonGiaDuocDuyet();
      }
    }
  }

  async getdonGiaDuocDuyet() {
    if (!this.dataDonGiaDuocDuyet || this.dataDonGiaDuocDuyet.length === 0) {
      return;
    }
    const donGiaDuocDuyet = this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)
      ? this.dataDonGiaDuocDuyet
      : this.dataDonGiaDuocDuyet.filter(item => item.maChiCuc === this.formData.value.maDvi);

    if (!donGiaDuocDuyet || donGiaDuocDuyet.length === 0) {
      this.thongtinPhanLo.donGiaDuocDuyet = null;
      return;
    }
    const giaQdTcdt = donGiaDuocDuyet[0].giaQdTcdt;
    if (this.dataEdit) {
      this.listOfData.forEach(s => s.donGiaDuocDuyet = giaQdTcdt);
    } else {
      this.thongtinPhanLo.donGiaDuocDuyet = giaQdTcdt;
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
      const nhakho = this.listNhaKho.find(item => item.value === this.editCache[index].data.maNhaKho);
      if (nhakho) {
        this.editCache[index].data.tenNhaKho = nhakho.text;
        this.editCache[index].data.maNhaKho = nhakho.value;
        this.listNganKho = (nhakho.listNganKhoEdit?.children || []).map(child => ({
          value: child.maDvi,
          text: child.tenDvi,
          listLoKhoEdit: child,
        }));
        this.editCache[index].data.maNganKho = null;
        this.editCache[index].data.maLoKho = null;
      }
      this.thongtinPhanLo = new DanhSachPhanLo();
    } else {
      const nhakho = this.listNhaKho.find(item => item.maDvi === this.thongtinPhanLo.maNhaKho);
      if (nhakho) {
        this.listNganKho = nhakho.children || [];
        this.thongtinPhanLo.tenNhaKho = nhakho.tenDvi;
        this.thongtinPhanLo.maNganKho = null;
        this.thongtinPhanLo.maLoKho = null;
      }
    }
  }

  async changeNganKho(index?) {
    if (index >= 0) {
      const nganKho = this.listNganKho.find(item => item.value === this.editCache[index].data.maNganKho);
      if (nganKho) {
        this.editCache[index].data.tenNganKho = nganKho.text;
        this.editCache[index].data.maNganKho = nganKho.value;
        for (const child of (nganKho.listLoKhoEdit?.children || [])) {
          const item = {
            value: child.maDvi,
            text: child.tenDvi,
          };
          this.listLoKho.push(item);
          if (!this.listLoKho.length) {
            await this.tonKho(nganKho, index);
          }
          this.editCache[index].data.maLoKho = null;
        }
      }
      this.thongtinPhanLo = new DanhSachPhanLo();
    } else {
      const nganKho = this.listNganKho.find(item => item.maDvi === this.thongtinPhanLo.maNganKho);
      if (nganKho) {
        this.listLoKho = nganKho.children || [];
        if (!this.listLoKho.length) {
          await this.tonKho(nganKho);
        }
        this.thongtinPhanLo.tenNganKho = nganKho.tenDvi;
        this.thongtinPhanLo.maLoKho = null;
      }
    }
  }

  async changeLoKho(index?) {
    if (index >= 0) {
      const loKho = this.listLoKho.find(item => item.value === this.editCache[index].data.maLoKho);
      if (loKho) {
        this.editCache[index].data.tenLoKho = loKho.text;
        this.editCache[index].data.maLoKho = loKho.value;
        await this.tonKho(loKho, index);
      }
    } else {
      const loKho = this.listLoKho.find(item => item.maDvi === this.thongtinPhanLo.maLoKho);
      if (loKho) {
        await this.tonKho(loKho);
        this.thongtinPhanLo.tenLoKho = loKho.tenDvi;
      }
    }
  }

  async tonKho(item, index?) {
    const body = {
      maDvi: item.maDvi,
      loaiVthh: LOAI_HANG_DTQG.MUOI ? this.cloaiVthh : this.loaiVthh,
      ...(LOAI_HANG_DTQG.MUOI ? {} : { cloaiVthh: this.cloaiVthh }),
    };
    try {
      const res = await this.quanLyHangTrongKhoService.getTrangThaiHt(body);
      if (res && res.msg === MESSAGE.SUCCESS) {
        const data = res.data;
        const val = data && data.length > 0 ? data.reduce((prev, cur) => prev + cur.slHienThoi, 0) : 0;
        if (index >= 0) {
          this.editCache[index].data.tonKho = cloneDeep(val);
        } else {
          this.thongtinPhanLo.tonKho = cloneDeep(val);
        }
      } else {
        console.error('Lỗi trong quá trình lấy dữ liệu trạng thái hàng tồn kho');
      }
    } catch (error) {
      console.error('Lỗi trong quá trình lấy dữ liệu trạng thái hàng tồn kho', error);
    }
  }

  addDiemKho() {
    if (this.validateDiemKho() && this.validateSoLuong()) {
      this.listOfData.push(this.thongtinPhanLo);
      this.thongtinPhanLo = new DanhSachPhanLo();
      this.updateEditCache();
      this.disableChiCuc();
      this.updateSoLuongChiCuc();
      this.checkDisabledSave();
    }
  }

  updateSoLuongChiCuc() {
    this.formData.patchValue({
      tongSlXuatBanDx: this.calcTong('soLuongDeXuat'),
    });
  }

  validateDiemKho(): boolean {
    const {maDiemKho, maNhaKho, maNganKho, maDviTsan, soLuongDeXuat, donGiaDeXuat,} = this.thongtinPhanLo;
    if (maDiemKho && maNhaKho && maNganKho && maDviTsan && soLuongDeXuat && donGiaDeXuat) {
      const data = this.listOfData.find(
        item => item.maDiemKho === maDiemKho && item.maNhaKho === maNhaKho && item.maNganKho === maNganKho);
      if (data && (!this.thongtinPhanLo.maLoKho || !data.maLoKho)) {
        this.notification.error(MESSAGE.ERROR, "Điểm kho, ngăn kho, lô kho đã tồn tại. Xin vui lòng chọn lại");
        return false;
      }
      if (this.thongtinPhanLo.maLoKho && data) {
        const loKho = data.maLoKho === this.thongtinPhanLo.maLoKho;
        if (loKho) {
          this.notification.error(MESSAGE.ERROR, "Điểm kho, ngăn kho, lô kho đã tồn tại. Xin vui lòng chọn lại");
          return false;
        }
      }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return false;
    }
  }

  validateSoLuong() {
    const {slChiTieu, tongSlKeHoachDd} = this.formData.value;
    const {tonKho, soLuongDeXuat, donGiaDeXuat, maDviTsan} = this.thongtinPhanLo;
    const tongSoLuong = this.listOfData.reduce((total, item) => total + item.soLuongDeXuat, 0);
    const maDonViTsan = this.listOfData.find(item => item.maDviTsan)?.maDviTsan;
    if (maDonViTsan == maDviTsan) {
      this.notification.error(MESSAGE.ERROR, `Mã đơn vị tài sản (${maDonViTsan}) đã bị trùng với mã đơn vị tài sản trước đó vui lòng nhập lại`);
      return false;
    } else if (soLuongDeXuat > tonKho) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đề xuất đã vượt quá số lượng tồn kho. Xin vui lòng nhập lại");
      return false;
    } else if (soLuongDeXuat > slChiTieu - tongSlKeHoachDd) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đề xuất đã vượt quá số lượng chỉ tiêu. Xin vui lòng nhập lại");
      return false;
    } else if (tongSoLuong > slChiTieu - tongSlKeHoachDd) {
      this.notification.error(MESSAGE.ERROR, "Tổng số lượng đã vượt quá số lượng chỉ tiêu. Xin vui lòng nhập lại");
      return false;
    } else if (donGiaDeXuat < this.giaToiDa) {
      this.notification.error(MESSAGE.ERROR, `Đơn giá đề xuất phải lớn hơn hoặc bằng giá bán tối thiểu (${this.giaToiDa} đ)`);
      return false;
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
    this.editCache[index].edit = true
  }

  cancelEdit(index: number): void {
    if (this.validateSoLuongEdit(index)) {
      this.editCache[index].edit = false
    }
  }

  saveEdit(index: number): void {
    if (this.validateSoLuongEdit(index)) {
      const editedData = this.editCache[index].data;
      if (!this.isDataEqual(this.listOfData[index], editedData)) {
        Object.assign(this.listOfData[index], editedData);
      }
      this.editCache[index].edit = false;
      this.updateSoLuongChiCuc();
    }
  }

  isDataEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  validateSoLuongEdit(index) {
    const soLuongConLai = this.formData.value.slChiTieu - this.formData.value.tongSlKeHoachDd
    if (this.listOfData[index].soLuongDeXuat != this.editCache[index].data.soLuongDeXuat) {
      this.listOfData[index].soLuongDeXuat = this.editCache[index].data.soLuongDeXuat;
    }
    const tongSoLuong = this.listOfData.reduce((total, item) => total + item.soLuongDeXuat, 0);
    if (this.editCache[index].data.soLuongDeXuat > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu. Xin vui lòng nhập lại.");
      return false;
    } else if (tongSoLuong > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Tổng số lượng đã vượt quá chỉ tiêu. Xin vui lòng nhập lại.");
      return false;
    } else if (this.editCache[index].data.donGiaDeXuat < this.giaToiDa) {
      this.notification.error(MESSAGE.ERROR, `Đơn giá đề xuất phải lớn hơn hoặc bằng giá bán tối thiểu (${this.giaToiDa} đ)`);
      return false;
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
          this.listOfData.splice(i, 1);
          this.disableChiCuc();
          this.checkDisabledSave();
          this.updateSoLuongChiCuc()
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
    this.selectedChiCuc = this.listOfData.length > 0;
  }

  calcTong(columnName) {
    if (!this.listOfData) return 0;
    return this.listOfData.reduce((sum, cur) => sum + (cur[columnName] || 0), 0);
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
      item.giaKhoiDiemDd = item.donGiaDuocDuyet != null ? item.donGiaDuocDuyet * item.soLuongDeXuat : null;
    });
    this.formData.patchValue({
      tongTienDatTruocDx: this.listOfData.reduce((prev, cur) => prev + cur.soTienDtruocDx, 0)
    });
  }
}
