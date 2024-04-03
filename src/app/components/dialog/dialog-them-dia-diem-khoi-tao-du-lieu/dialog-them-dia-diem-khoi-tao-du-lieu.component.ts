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
import {AMOUNT_NO_DECIMAL} from "../../../Utility/utils";
import * as uuid from "uuid";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-dialog-them-dia-diem-phan-lo',
  templateUrl: './dialog-them-dia-diem-khoi-tao-du-lieu.component.html',
  styleUrls: ['./dialog-them-dia-diem-khoi-tao-du-lieu.component.scss']
})

export class DialogThemDiaDiemKhoiTaoDuLieuComponent implements OnInit {
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_NO_DECIMAL};
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
  listLoKho: any[] = [];
  loaiVthh: any;
  listCloaiVthh: any[] = [];


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
    await this.onChangeLoaiVthh(this.loaiVthh);
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
    if (res && res.msg === MESSAGE.SUCCESS || res.data) {
      this.listHangHoaAll = res.data;
    } else {
      this.listHangHoaAll = [];
    }
  }

  async loadDonVi() {
    this.listChiCuc = [];
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

  async onChangeLoaiVthh(event) {
    let body = {
      "str": event
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.listCloaiVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  checkDisabledSave() {
    this.isValid = !!(this.listOfData && this.listOfData.length);
  }

  async changeChiCuc(event, isSlChiTieu?) {
    if (isSlChiTieu) {
      this.formData.patchValue({
        tenDvi : this.listChiCuc.find(i => i.maDvi === event)?.tenDvi,
      })
      await this.loadDsDiemKho(event);
    }
    this.thongtinPhanLo = new DanhSachPhanLo();
  }
  changeCloai(event){
    this.thongtinPhanLo.donViTinh = this.listCloaiVthh.find(i => i.key === event)?.maDviTinh;
  }
  async loadDsDiemKho(maDvi) {
    this.listDiemKho = [];
    let body = {
      maDvi: maDvi,
    };
    let res = await this.donViService.getDonViHangTree(body);
    if (res && res.msg === MESSAGE.SUCCESS || res.data) {
      this.listDiemKho = res.data.children || [];
    }
  }

  async changeDiemKho(index?, isboolean?) {
    const dataToUpdate = index >= 0 ? this.editCache[index].data : this.thongtinPhanLo;
    if (index >= 0) {
      if (isboolean) {
        await this.closeKho('diemKho', index);
      }
      const selectedKho = this.listDiemKho.find(item => item.key === dataToUpdate.maDiemKho);
      if (selectedKho) {
        this.listNhaKho = selectedKho.children || [];
        dataToUpdate.tenDiemKho = selectedKho.title;
        await this.changeNhaKho(index);
      }
    } else {
      await this.closeKho('diemKho');
      const selectedKho = this.listDiemKho.find(item => item.key === dataToUpdate.maDiemKho);
      if (selectedKho) {
        this.listNhaKho = selectedKho.children || [];
        dataToUpdate.tenDiemKho = selectedKho.title;
      }
    }
  }

  async changeNhaKho(index?, isboolean?) {
    const dataToUpdate = index >= 0 ? this.editCache[index].data : this.thongtinPhanLo;
    if (index >= 0) {
      if (isboolean) {
        await this.closeKho('nhaKho', index);
      }
      const selectedKho = this.listNhaKho.find(item => item.key === dataToUpdate.maNhaKho);
      if (selectedKho) {
        this.listNganKho = selectedKho.children || [];
        dataToUpdate.tenNhaKho = selectedKho.title;
        await this.changeNganKho(index);
      }
    } else {
      await this.closeKho('nhaKho');
      const selectedKho = this.listNhaKho.find(item => item.key === dataToUpdate.maNhaKho);
      if (selectedKho) {
        this.listNganKho = selectedKho.children || [];
        dataToUpdate.tenNhaKho = selectedKho.title;
      }
    }
  }

  async changeNganKho(index?, isboolean?) {
    const dataToUpdate = index >= 0 ? this.editCache[index].data : this.thongtinPhanLo;
    if (index >= 0) {
      if (isboolean) {
        await this.closeKho('nganKho', index);
      }
      const selectedKho = this.listNganKho.find(item => item.key === dataToUpdate.maNganKho);
      if (selectedKho) {
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
      if (isboolean) {
        await this.closeKho('loKho', index);
      }
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

  async addDiemKho() {
    if (this.validateKho()) {
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
      const editedData = this.editCache[index].data;
      if (!this.isDataEqual(this.listOfData[index], editedData)) {
        Object.assign(this.listOfData[index], editedData);
      }
      this.editCache[index].edit = false;
      await this.updateSoLuongChiCuc();
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
    if (!this.listOfData) {
      return 0;
    }
    return this.listOfData.reduce((sum, cur) => sum + (cur?.[columnName] || 0), 0);
  }

  // async onChangeTinh(event) {
  //   if (event) {
  //     this.thongtinPhanLo.giaKhoiDiemDx = this.thongtinPhanLo.donGiaDeXuat * this.thongtinPhanLo.soLuongDeXuat;
  //     this.thongtinPhanLo.thanhTienDuocDuyet = this.thongtinPhanLo.donGiaDuocDuyet * this.thongtinPhanLo.soLuongDeXuat;
  //     this.thongtinPhanLo.soTienDtruocDx = this.thongtinPhanLo.soLuongDeXuat * this.thongtinPhanLo.donGiaDeXuat * this.dataOriginal.khoanTienDatTruoc / 100;
  //   }
  // }

  // async onChangeTinhEdit(index: number) {
  //   if (index !== undefined && this.editCache[index]) {
  //     const data = this.editCache[index].data;
  //     data.giaKhoiDiemDx = data.donGiaDeXuat * data.soLuongDeXuat;
  //     data.thanhTienDuocDuyet = data.donGiaDuocDuyet * data.soLuongDeXuat;
  //     data.soTienDtruocDx = data.soLuongDeXuat * data.donGiaDeXuat * this.dataOriginal.khoanTienDatTruoc / 100;
  //
  //   }
  // }
}
