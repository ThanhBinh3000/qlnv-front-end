import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {Globals} from 'src/app/shared/globals';
import {UserService} from 'src/app/services/user.service';
import {DonviService} from 'src/app/services/donvi.service';
import {MESSAGE} from 'src/app/constants/message';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {HelperService} from 'src/app/services/helper.service';
import {UserLogin} from 'src/app/models/userlogin';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {DanhSachPhanLo} from 'src/app/models/KeHoachBanDauGia';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {
  DeXuatKhBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {QuyetDinhGiaTCDTNNService} from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import {AMOUNT_ONE_DECIMAL} from "../../../Utility/utils";
import * as uuid from "uuid";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-dialog-them-dia-diem-phan-lo',
  templateUrl: './dialog-them-dia-diem-phan-lo.component.html',
  styleUrls: ['./dialog-them-dia-diem-phan-lo.component.scss']
})

export class DialogThemDiaDiemPhanLoComponent implements OnInit {
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_ONE_DECIMAL};
  thongtinPhanLo: DanhSachPhanLo;
  formData: FormGroup;
  dataOriginal: any;
  typeLoaiVthh: any;
  dataChiTieu: any;
  giaToiDa: any;
  dataEdit: any;
  listOfData: any[] = [];
  listOfDataClone: any[] = [];
  selectedChiCuc: boolean = false;
  isValid: boolean = false;
  userInfo: UserLogin;
  listHangHoaAll: any[] = [];
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
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
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

  async ngOnInit() {
    await this.initForm();
    this.updateEditCache();
    this.disableChiCuc();
    this.formData.patchValue({donViTinh: this.dataOriginal.donViTinh});
  }

  async save() {
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

  async onCancel() {
    this._modalRef.destroy();
  }

  async initForm() {
    this.userInfo = this.userService.getUserLogin();
    this.thongtinPhanLo = new DanhSachPhanLo();
    await this.loadDonVi();
    await this.loadDsVthh();
    if (this.dataEdit) {
      this.helperService.bidingDataInFormGroup(this.formData, this.dataEdit);
      await this.changeChiCuc(this.dataEdit.maDvi);
      await this.loadDsDiemKho(this.dataEdit.maDvi)
      this.listOfData = this.dataEdit.children;
    }
    this.checkDisabledSave();
  }

  async loadDsVthh() {
    const res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg !== MESSAGE.SUCCESS || !res.data) {
      return;
    }
    this.listHangHoaAll = res.data;
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
    if (this.typeLoaiVthh.startsWith(LOAI_HANG_DTQG.GAO) || this.typeLoaiVthh.startsWith(LOAI_HANG_DTQG.THOC)) {
      itemsToAdd.push(
        ...this.dataChiTieu.khLuongThuc?.map(item => ({
          maDvi: item.maDonVi,
          tenDvi: item.tenDonvi,
          soLuongXuat: this.typeLoaiVthh.startsWith(LOAI_HANG_DTQG.GAO) ? item.xtnTongGao * 1000 : item.xtnTongThoc * 1000
        })) || []
      );
    } else if (this.typeLoaiVthh.startsWith(LOAI_HANG_DTQG.MUOI)) {
      itemsToAdd.push(
        ...this.dataChiTieu.khMuoiDuTru?.map(item => ({
          maDvi: item.maDonVi,
          tenDvi: item.tenDonVi,
          soLuongXuat: item.xuatTrongNamMuoi
        })) || []
      );
    } else if (this.typeLoaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      const data = this.dataChiTieu.khVatTuXuat.filter(item => {
        if (item.maVatTu === null) {
          return item.maVatTuCha == this.dataOriginal.loaiVthh;
        } else {
          return item.maVatTu == this.dataOriginal.cloaiVthh && item.maVatTuCha == this.dataOriginal.loaiVthh;
        }
      });
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
        tongSlKeHoachDd: null,
        slChiTieu: null,
      });
    }
    let body = {
      year: this.dataOriginal.namKh,
      loaiVthh: this.dataOriginal.loaiVthh,
      maDvi: event,
      lastest: 1,
    }
    const [soLuongDaLenKh, chiCuc, res] = await Promise.all([
      this.deXuatKhBanDauGiaService.getSoLuongAdded(body),
      this.listChiCuc.find(item => item.maDvi === event),
      this.donViService.getDonVi({str: event}),
    ]);
    this.listDiemKho = [];
    if (res.msg !== MESSAGE.SUCCESS || !res.data) {
      return;
    }
    const slChiTieu = chiCuc?.soLuongXuat;
    this.formData.patchValue({
      tenDvi: res.data.tenDvi,
      diaChi: res.data.diaChi,
      tongSlKeHoachDd: soLuongDaLenKh.data,
      slChiTieu: slChiTieu,
    });
    if (isSlChiTieu) {
      await this.loadDsDiemKho(event);
    }
    this.thongtinPhanLo = new DanhSachPhanLo();
  }

  async loadDsDiemKho(maDvi) {
    this.listDiemKho = [];
    let body = {
      maDvi: maDvi,
      loaiVthh: this.dataOriginal.loaiVthh,
      cloaiVthh: this.dataOriginal.cloaiVthh,
    };
    let res = await this.donViService.getDonViHangTree(body);
    if (res.msg !== MESSAGE.SUCCESS || !res.data) {
      return;
    }
    console.log(res.data, 999);
    this.listDiemKho = res.data.children || [];
  }

  async changeDiemKho(index?, isboolean?) {
    if (index >= 0) {
      if (isboolean) await this.closeKho('diemKho', index);
      const selectedKho = this.listDiemKho.find(item => item.key === this.editCache[index].data.maDiemKho);
      if (selectedKho) {
        this.listNhaKho = selectedKho.children || [];
        this.editCache[index].data.tenDiemKho = selectedKho.title;
        await this.changeNhaKho(index);
        await this.getdonGiaDuocDuyet(index);
      }
    } else {
      await this.closeKho('diemKho');
      const selectedKho = this.listDiemKho.find(item => item.key === this.thongtinPhanLo.maDiemKho);
      if (selectedKho) {
        this.listNhaKho = selectedKho.children || [];
        this.thongtinPhanLo.tenDiemKho = selectedKho.title;
      }
      await this.getdonGiaDuocDuyet();
    }
  }

  async changeNhaKho(index?, isboolean?) {
    if (index >= 0) {
      if (isboolean) await this.closeKho('nhaKho', index);
      const selectedKho = this.listNhaKho.find(item => item.key === this.editCache[index].data.maNhaKho);
      if (selectedKho) {
        this.listNganKho = selectedKho.children || [];
        this.editCache[index].data.tenNhaKho = selectedKho.title;
        await this.changeNganKho(index);
      }
    } else {
      await this.closeKho('nhaKho');
      const selectedKho = this.listNhaKho.find(item => item.key === this.thongtinPhanLo.maNhaKho);
      if (selectedKho) {
        this.listNganKho = selectedKho.children || [];
        this.thongtinPhanLo.tenNhaKho = selectedKho.title;
      }
    }
  }

  async changeNganKho(index?, isboolean?) {
    const dataToUpdate = index >= 0 ? this.editCache[index].data : this.thongtinPhanLo;
    if (index >= 0) {
      if (isboolean) await this.closeKho('nganKho', index);
      const selectedKho = this.listNganKho.find(item => item.key === dataToUpdate.maNganKho);
      if (selectedKho) {
        this.listLoKho = selectedKho.children?.filter(item => {
          return (item.cloaiVthh === null) ? (item.loaiVthh === this.dataOriginal.loaiVthh) : (item.cloaiVthh === this.dataOriginal.cloaiVthh && item.loaiVthh === this.dataOriginal.loaiVthh);
        });
        dataToUpdate.tenNganKho = selectedKho.title;
        if (this.listLoKho.length === 0) {
          dataToUpdate.tonKho = selectedKho.slTon;
          dataToUpdate.namNhap = selectedKho.namNhap;
          dataToUpdate.loaiVthh = selectedKho.loaiVthh;
          dataToUpdate.cloaiVthh = selectedKho.cloaiVthh;
          dataToUpdate.tenCloaiVthh = selectedKho.tenCloaiVthh;
          dataToUpdate.donViTinh = this.listHangHoaAll.find(s => s.ma == selectedKho.loaiVthh)?.maDviTinh;
        }
        await this.changeLoKho(index);
      }
    } else {
      await this.closeKho('nganKho');
      const selectedKho = this.listNganKho.find(item => item.key === dataToUpdate.maNganKho);
      if (selectedKho) {
        this.listLoKho = selectedKho.children?.filter(item => {
          return (item.cloaiVthh === null) ? (item.loaiVthh === this.dataOriginal.loaiVthh) : (item.cloaiVthh === this.dataOriginal.cloaiVthh && item.loaiVthh === this.dataOriginal.loaiVthh);
        });
        dataToUpdate.tenNganKho = selectedKho.title;
        if (this.listLoKho.length === 0) {
          dataToUpdate.tonKho = selectedKho.slTon;
          dataToUpdate.namNhap = selectedKho.namNhap;
          dataToUpdate.loaiVthh = selectedKho.loaiVthh;
          dataToUpdate.cloaiVthh = selectedKho.cloaiVthh;
          dataToUpdate.tenCloaiVthh = selectedKho.tenCloaiVthh;
          dataToUpdate.donViTinh = this.listHangHoaAll.find(s => s.ma == selectedKho.loaiVthh)?.maDviTinh;
        }
      }
    }
  }

  async changeLoKho(index?, isboolean?) {
    const dataToUpdate = index >= 0 ? this.editCache[index].data : this.thongtinPhanLo;
    if (index >= 0) {
      if (isboolean) await this.closeKho('loKho', index);
      const selectedKho = this.listLoKho.find(item => item.key === dataToUpdate.maLoKho);
      if (selectedKho) {
        dataToUpdate.tenLoKho = selectedKho.title;
        dataToUpdate.tonKho = selectedKho.slTon;
        dataToUpdate.namNhap = selectedKho.namNhap;
        dataToUpdate.loaiVthh = selectedKho.loaiVthh;
        dataToUpdate.cloaiVthh = selectedKho.cloaiVthh;
        dataToUpdate.tenCloaiVthh = selectedKho.tenCloaiVthh;
        dataToUpdate.donViTinh = this.listHangHoaAll.find(s => s.ma == selectedKho.loaiVthh)?.maDviTinh;
      }
    } else {
      await this.closeKho('loKho');
      const selectedKho = this.listLoKho.find(item => item.key === dataToUpdate.maLoKho);
      if (selectedKho) {
        dataToUpdate.tenLoKho = selectedKho.title;
        dataToUpdate.tonKho = selectedKho.slTon;
        dataToUpdate.namNhap = selectedKho.namNhap;
        dataToUpdate.loaiVthh = selectedKho.loaiVthh;
        dataToUpdate.cloaiVthh = selectedKho.cloaiVthh;
        dataToUpdate.tenCloaiVthh = selectedKho.tenCloaiVthh;
        dataToUpdate.donViTinh = this.listHangHoaAll.find(s => s.ma == selectedKho.loaiVthh)?.maDviTinh;
      }
    }
  }

  async closeKho(modalType: string, index?) {
    const dataToUpdate = index >= 0 ? this.editCache[index].data : this.thongtinPhanLo;
    switch (modalType) {
      case 'diemKho':
        this.listNhaKho = [];
        dataToUpdate.maNhaKho = null;
        dataToUpdate.tenNhaKho = null;
        dataToUpdate.maNganKho = null;
        dataToUpdate.tenNganKho = null;
        dataToUpdate.maLoKho = null;
        dataToUpdate.tenLoKho = null;
        dataToUpdate.tonKho = null;
        dataToUpdate.namNhap = null;
        dataToUpdate.loaiVthh = null;
        dataToUpdate.cloaiVthh = null;
        dataToUpdate.tenCloaiVthh = null;
        break;
      case 'nhaKho':
        this.listNganKho = [];
        dataToUpdate.maNganKho = null;
        dataToUpdate.tenNganKho = null;
        dataToUpdate.maLoKho = null;
        dataToUpdate.tenLoKho = null;
        dataToUpdate.tonKho = null;
        dataToUpdate.namNhap = null;
        dataToUpdate.loaiVthh = null;
        dataToUpdate.cloaiVthh = null;
        dataToUpdate.tenCloaiVthh = null;
        break;
      case 'nganKho':
        this.listLoKho = [];
        dataToUpdate.maLoKho = null;
        dataToUpdate.tenLoKho = null;
        dataToUpdate.tonKho = null;
        dataToUpdate.namNhap = null;
        dataToUpdate.loaiVthh = null;
        dataToUpdate.cloaiVthh = null;
        dataToUpdate.tenCloaiVthh = null;
        break;
      case 'loKho':
        dataToUpdate.tonKho = null;
        dataToUpdate.namNhap = null;
        dataToUpdate.loaiVthh = null;
        dataToUpdate.cloaiVthh = null;
        dataToUpdate.tenCloaiVthh = null;
        break;
      default:
        break;
    }
  }

  async getdonGiaDuocDuyet(index?) {
    const bodyPag = {
      nam: this.dataOriginal.namKh,
      loaiVthh: this.dataOriginal.loaiVthh,
      cloaiVthh: this.dataOriginal.cloaiVthh,
      maDvi: this.formData.value.maDvi,
      typeLoaiVthh: this.typeLoaiVthh,
    };
    const giaDuyet = await this.deXuatKhBanDauGiaService.getDonGiaDuocDuyet(bodyPag);
    if (!giaDuyet.data) {
      return;
    }
    if (index >= 0) {
      this.editCache[index].data.donGiaDuocDuyet = giaDuyet.data;
    } else {
      this.thongtinPhanLo.donGiaDuocDuyet = giaDuyet.data;
    }
  }

  async addDiemKho() {
    if (this.validateKho() && this.validate()) {
      this.listOfData.push(this.thongtinPhanLo);
      this.thongtinPhanLo = new DanhSachPhanLo();
      this.updateEditCache();
      this.disableChiCuc();
      await this.updateSoLuongChiCuc();
      this.checkDisabledSave();
    }
  }

  async updateSoLuongChiCuc() {
    this.formData.patchValue({
      tongSlXuatBanDx: this.calcTong('soLuongDeXuat'),
    });
  }

  validateKho() {
    const data = this.thongtinPhanLo;
    if (data.maDiemKho && data.maNhaKho && data.maNganKho && data.maDviTsan && data.soLuongDeXuat && data.donGiaDeXuat) {
      const {maDiemKho, maNhaKho, maNganKho, maLoKho} = data;
      const existingData = this.listOfData.find(item => item.maDiemKho === maDiemKho && item.maNhaKho === maNhaKho && item.maNganKho === maNganKho);
      if (existingData && (!maLoKho || !existingData.maLoKho || existingData.maLoKho === maLoKho)) {
        this.notification.error(MESSAGE.ERROR, "Điểm kho, nhà kho, ngăn kho, lô kho đã tồn tại. Xin vui lòng chọn lại!");
        return false;
      }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return false;
    }
  }

  validate(index?: number) {
    const {slChiTieu, tongSlKeHoachDd} = this.formData.value;
    if (index !== undefined && index >= 0) {
      this.listOfDataClone = cloneDeep(this.listOfData)
      const data = this.listOfDataClone[index];
      const dataEdit = this.editCache[index].data;
      if (data.soLuongDeXuat !== dataEdit.soLuongDeXuat) {
        data.soLuongDeXuat = dataEdit.soLuongDeXuat;
      }
      const totalSoLuongDeXuat = this.listOfDataClone.reduce((prev, cur) => prev + cur.soLuongDeXuat, 0);
      if (dataEdit.soLuongDeXuat > dataEdit.tonKho || dataEdit.soLuongDeXuat > slChiTieu - tongSlKeHoachDd || totalSoLuongDeXuat > slChiTieu - tongSlKeHoachDd || dataEdit.donGiaDeXuat < this.giaToiDa) {
        this.notification.error(MESSAGE.ERROR, this.getErrorNotificationMessage(dataEdit, slChiTieu, tongSlKeHoachDd, totalSoLuongDeXuat));
        return false;
      }
    } else {
      this.thongtinPhanLo.idVirtual = uuid.v4();
      const exists = this.listOfDataClone.find(item => item.idVirtual === this.thongtinPhanLo.idVirtual);
      if (!exists) {
        this.listOfDataClone.push(this.thongtinPhanLo);
      }
      const totalSoLuongDeXuat = this.listOfDataClone.reduce((prev, cur) => prev + cur.soLuongDeXuat, 0);
      if (this.thongtinPhanLo.soLuongDeXuat > this.thongtinPhanLo.tonKho || this.thongtinPhanLo.soLuongDeXuat > slChiTieu - tongSlKeHoachDd || totalSoLuongDeXuat > slChiTieu - tongSlKeHoachDd || this.thongtinPhanLo.donGiaDeXuat < this.giaToiDa) {
        this.notification.error(MESSAGE.ERROR, this.getErrorNotificationMessage(this.thongtinPhanLo, slChiTieu, tongSlKeHoachDd, totalSoLuongDeXuat));
        return false;
      }
    }
    return true;
  }

  getErrorNotificationMessage(data: any, slChiTieu: number, tongSlKeHoachDd: number, totalSoLuongDeXuat: number): string {
    if (data.soLuongDeXuat > data.tonKho) {
      return "Số lượng đề xuất đã vượt quá số lượng tồn kho. Xin vui lòng nhập lại!";
    } else if (data.soLuongDeXuat > slChiTieu - tongSlKeHoachDd) {
      return "Số lượng đề xuất đã vượt quá số lượng chỉ tiêu. Xin vui lòng nhập lại!";
    } else if (totalSoLuongDeXuat > slChiTieu - tongSlKeHoachDd) {
      return "Tổng số lượng đã vượt quá số lượng chỉ tiêu. Xin vui lòng nhập lại!";
    } else if (data.donGiaDeXuat < this.giaToiDa) {
      return `Đơn giá đề xuất phải lớn hơn hoặc bằng giá bán tối thiểu (${this.giaToiDa.toLocaleString()} đ)`;
    }
    return "";
  }

  async clearDiemKho() {
    this.thongtinPhanLo = new DanhSachPhanLo();
    this.thongtinPhanLo.id = null;
  }

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  async startEdit(index: number) {
    this.editCache[index].edit = true
    await this.changeDiemKho(index);
  }

  async cancelEdit(index: number) {
    this.editCache[index].edit = false
  }

  async saveEdit(index: number) {
    if (this.validate(index)) {
      const editedData = this.editCache[index].data;
      if (!this.isDataEqual(this.listOfData[index], editedData)) {
        Object.assign(this.listOfData[index], editedData);
      }
      this.editCache[index].edit = false;
      await this.updateSoLuongChiCuc();
    }
  }

  isDataEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  async deleteRow(i: number) {
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
          await this.updateSoLuongChiCuc()
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

  async onChangeTinh(event) {
    if (event) {
      this.thongtinPhanLo.giaKhoiDiemDx = this.thongtinPhanLo.donGiaDeXuat * this.thongtinPhanLo.soLuongDeXuat;
      this.thongtinPhanLo.thanhTienDuocDuyet = this.thongtinPhanLo.donGiaDuocDuyet * this.thongtinPhanLo.soLuongDeXuat;
      this.thongtinPhanLo.soTienDtruocDx = this.thongtinPhanLo.soLuongDeXuat * this.thongtinPhanLo.donGiaDeXuat * this.dataOriginal.khoanTienDatTruoc / 100;
    }
  }

  async onChangeTinhEdit(index: number) {
    if (index !== undefined && this.editCache[index]) {
      const data = this.editCache[index].data;
      data.giaKhoiDiemDx = data.donGiaDeXuat * data.soLuongDeXuat;
      data.thanhTienDuocDuyet = data.donGiaDuocDuyet * data.soLuongDeXuat;
      data.soTienDtruocDx = data.soLuongDeXuat * data.donGiaDeXuat * this.dataOriginal.khoanTienDatTruoc / 100;
    }
  }
}
