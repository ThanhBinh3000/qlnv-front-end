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
import {DanhSachXuatBanTrucTiep} from 'src/app/models/KeHoachBanDauGia';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {
  DeXuatKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import {AMOUNT_ONE_DECIMAL} from "../../../Utility/utils";
import {QuyetDinhGiaTCDTNNService} from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";

@Component({
  selector: 'app-dialog-them-moi-xuat-ban-truc-tiep',
  templateUrl: './dialog-them-moi-xuat-ban-truc-tiep.component.html',
  styleUrls: ['./dialog-them-moi-xuat-ban-truc-tiep.component.scss']
})
export class DialogThemMoiXuatBanTrucTiepComponent implements OnInit {
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_ONE_DECIMAL};
  thongTinXuatBanTrucTiep: DanhSachXuatBanTrucTiep;
  formData: FormGroup;
  dataOriginal: any;
  typeLoaiVthh: any;
  dataChiTieu: any;
  giaToiDa: any;
  dataEdit: any;
  listOfData: any[] = [];
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
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null, [Validators.required]],
      tenDvi: [null],
      diaChi: [null],
      soLuongChiCuc: [null],
      soLuongChiTieu: [null],
      soLuongKhDaDuyet: [null],
      donViTinh: [null],
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
    this.thongTinXuatBanTrucTiep = new DanhSachXuatBanTrucTiep();
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
    const body = {
      year: this.dataOriginal.namKh,
      loaiVthh: this.dataOriginal.loaiVthh,
      maDvi: event,
      lastest: 1,
    };
    const [soLuongDaLenKh, chiCuc, res] = await Promise.all([
      this.deXuatKhBanTrucTiepService.getSoLuongAdded(body),
      this.listChiCuc.find(item => item.maDvi === event),
      this.donViService.getDonVi({str: event}),
    ]);
    this.listDiemKho = [];
    if (res.msg !== MESSAGE.SUCCESS || !res.data) {
      return;
    }
    const soLuongChiTieu = chiCuc?.soLuongXuat;
    this.formData.patchValue({
      tenDvi: res.data.tenDvi,
      diaChi: res.data.diaChi,
      soLuongKhDaDuyet: soLuongDaLenKh.data,
      soLuongChiTieu: soLuongChiTieu,
    });
    if (isSlChiTieu) {
      await this.loadDsDiemKho(event);
    }
    this.thongTinXuatBanTrucTiep = new DanhSachXuatBanTrucTiep();
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
      const selectedKho = this.listDiemKho.find(item => item.key === this.thongTinXuatBanTrucTiep.maDiemKho);
      if (selectedKho) {
        this.listNhaKho = selectedKho.children || [];
        this.thongTinXuatBanTrucTiep.tenDiemKho = selectedKho.title;
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
      const selectedKho = this.listNhaKho.find(item => item.key === this.thongTinXuatBanTrucTiep.maNhaKho);
      if (selectedKho) {
        this.listNganKho = selectedKho.children || [];
        this.thongTinXuatBanTrucTiep.tenNhaKho = selectedKho.title;
      }
    }
  }

  async changeNganKho(index?, isboolean?) {
    const dataToUpdate = index >= 0 ? this.editCache[index].data : this.thongTinXuatBanTrucTiep;
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
          dataToUpdate.loaiVthh = selectedKho.loaiVthh;
          dataToUpdate.cloaiVthh = selectedKho.cloaiVthh;
          dataToUpdate.tenCloaiVthh = selectedKho.tenCloaiVthh;
          dataToUpdate.donViTinh = this.listHangHoaAll.find(s => s.ma == selectedKho.loaiVthh)?.maDviTinh;
        }
      }
    }
  }

  async changeLoKho(index?, isboolean?) {
    const dataToUpdate = index >= 0 ? this.editCache[index].data : this.thongTinXuatBanTrucTiep;
    if (index >= 0) {
      if (isboolean) await this.closeKho('loKho', index);
      const selectedKho = this.listLoKho.find(item => item.key === dataToUpdate.maLoKho);
      if (selectedKho) {
        dataToUpdate.tenLoKho = selectedKho.title;
        dataToUpdate.tonKho = selectedKho.slTon;
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
        dataToUpdate.loaiVthh = selectedKho.loaiVthh;
        dataToUpdate.cloaiVthh = selectedKho.cloaiVthh;
        dataToUpdate.tenCloaiVthh = selectedKho.tenCloaiVthh;
        dataToUpdate.donViTinh = this.listHangHoaAll.find(s => s.ma == selectedKho.loaiVthh)?.maDviTinh;
      }
    }
  }

  async closeKho(modalType: string, index?) {
    const dataToUpdate = index >= 0 ? this.editCache[index].data : this.thongTinXuatBanTrucTiep;
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
        dataToUpdate.loaiVthh = null;
        dataToUpdate.cloaiVthh = null;
        dataToUpdate.tenCloaiVthh = null;
        break;
      case 'nganKho':
        this.listLoKho = [];
        dataToUpdate.maLoKho = null;
        dataToUpdate.tenLoKho = null;
        dataToUpdate.tonKho = null;
        dataToUpdate.loaiVthh = null;
        dataToUpdate.cloaiVthh = null;
        dataToUpdate.tenCloaiVthh = null;
        break;
      case 'loKho':
        dataToUpdate.tonKho = null;
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
    const giaDuyet = await this.deXuatKhBanTrucTiepService.getDonGiaDuocDuyet(bodyPag);
    if (!giaDuyet.data) {
      return;
    }
    if (index >= 0) {
      this.editCache[index].data.donGiaDuocDuyet = giaDuyet.data;
    } else {
      this.thongTinXuatBanTrucTiep.donGiaDuocDuyet = giaDuyet.data;
    }
  }

  async addDiemKho() {
    if (this.validateDiemKho() && this.validateSoLuong()) {
      this.listOfData.push(this.thongTinXuatBanTrucTiep);
      this.thongTinXuatBanTrucTiep = new DanhSachXuatBanTrucTiep();
      this.updateEditCache();
      this.disableChiCuc();
      await this.updateSoLuongChiCuc();
      this.checkDisabledSave();
    }
  }

  async updateSoLuongChiCuc() {
    this.formData.patchValue({
      soLuongChiCuc: this.calcTong('soLuongDeXuat')
    });
  }

  validateDiemKho(): boolean {
    const {maDiemKho, maNhaKho, maNganKho, maDviTsan, soLuongDeXuat, donGiaDeXuat,} = this.thongTinXuatBanTrucTiep;
    if (maDiemKho && maNhaKho && maNganKho && maDviTsan && soLuongDeXuat && donGiaDeXuat) {
      const data = this.listOfData.find(
        item => item.maDiemKho === maDiemKho && item.maNhaKho === maNhaKho && item.maNganKho === maNganKho);
      if (data && (!this.thongTinXuatBanTrucTiep.maLoKho || !data.maLoKho)) {
        this.notification.error(MESSAGE.ERROR, "Điểm kho, ngăn kho, lô kho đã tồn tại. Xin vui lòng chọn lại");
        return false;
      }
      if (this.thongTinXuatBanTrucTiep.maLoKho && data) {
        const loKho = data.maLoKho === this.thongTinXuatBanTrucTiep.maLoKho;
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

  validateSoLuong(): boolean {
    const {soLuongChiTieu, soLuongKhDaDuyet} = this.formData.value;
    const {tonKho, soLuongDeXuat, donGiaDeXuat, maDviTsan} = this.thongTinXuatBanTrucTiep;
    const tongSoLuong = this.listOfData.reduce((total, item) => total + item.soLuongDeXuat, 0);
    // const maDonViTsan = this.listOfData.find(item => item.maDviTsan)?.maDviTsan;
    // if (maDonViTsan == maDviTsan) {
    //   this.notification.error(MESSAGE.ERROR, `Mã đơn vị tài sản (${maDonViTsan}) đã bị trùng với mã đơn vị tài sản trước đó vui lòng nhập lại`);
    //   return false;
    // } else
    if (soLuongDeXuat > tonKho) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đề xuất đã vượt quá số lượng tồn kho. Xin vui lòng nhập lại");
      return false;
    } else if (soLuongDeXuat > soLuongChiTieu - soLuongKhDaDuyet) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đề xuất đã vượt quá số lượng chỉ tiêu. Xin vui lòng nhập lại");
      return false;
    } else if (tongSoLuong > soLuongChiTieu - soLuongKhDaDuyet) {
      this.notification.error(MESSAGE.ERROR, "Tổng số lượng đã vượt quá số lượng chỉ tiêu. Xin vui lòng nhập lại");
      return false;
    } else if (donGiaDeXuat < this.giaToiDa) {
      this.notification.error(MESSAGE.ERROR, `Đơn giá đề xuất phải lớn hơn hoặc bằng giá bán tối thiểu (${this.giaToiDa.toLocaleString()} đ)`);
      return false;
    } else {
      return true;
    }
  }

  async clearDiemKho() {
    this.thongTinXuatBanTrucTiep = new DanhSachXuatBanTrucTiep();
    this.thongTinXuatBanTrucTiep.id = null;
  }

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  async startEdit(index: number) {
    this.editCache[index].edit = true
    await this.changeDiemKho(index);
  }

  async cancelEdit(index: number) {
    if (this.validateSoLuongEdit(index)) {
      this.editCache[index].edit = false
    }
  }

  async saveEdit(index: number) {
    if (this.validateSoLuongEdit(index)) {
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

  validateSoLuongEdit(index): boolean {
    const soLuongConLai = this.formData.value.soLuongChiTieu - this.formData.value.soLuongKhDaDuyet;
    if (this.listOfData[index].soLuongDeXuat !== this.editCache[index].data.soLuongDeXuat) {
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
      this.notification.error(MESSAGE.ERROR, `Đơn giá đề xuất phải lớn hơn hoặc bằng giá bán tối thiểu (${this.giaToiDa.toLocaleString()} đ)`);
      return false;
    } else {
      return true;
    }
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
      this.thongTinXuatBanTrucTiep.thanhTienDeXuat = this.thongTinXuatBanTrucTiep.donGiaDeXuat * this.thongTinXuatBanTrucTiep.soLuongDeXuat;
      this.thongTinXuatBanTrucTiep.thanhTienDuocDuyet = this.thongTinXuatBanTrucTiep.donGiaDuocDuyet * this.thongTinXuatBanTrucTiep.soLuongDeXuat;
    }
  }

  async onChangeTinhEdit(index) {
    if (index !== undefined && this.editCache[index]) {
      this.editCache[index].data.thanhTienDeXuat = this.editCache[index].data.donGiaDeXuat * this.editCache[index].data.soLuongDeXuat;
      this.editCache[index].data.thanhTienDuocDuyet = this.editCache[index].data.donGiaDuocDuyet * this.editCache[index].data.soLuongDeXuat;
    }
  }
}
