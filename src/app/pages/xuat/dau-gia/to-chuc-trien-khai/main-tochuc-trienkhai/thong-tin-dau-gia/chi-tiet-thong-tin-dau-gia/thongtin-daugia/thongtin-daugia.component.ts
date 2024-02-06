import {HttpClient} from '@angular/common/http';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {
  ThongTinDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import {StorageService} from 'src/app/services/storage.service';
import {chain} from 'lodash'
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {STATUS} from 'src/app/constants/status';
import {FileDinhKem} from "../../../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {Validators} from "@angular/forms";
import _ from 'lodash';
import {AMOUNT_ONE_DECIMAL} from "../../../../../../../../Utility/utils";

@Component({
  selector: 'app-thongtin-daugia',
  templateUrl: './thongtin-daugia.component.html',
  styleUrls: ['./thongtin-daugia.component.scss']
})
export class ThongtinDaugiaComponent extends Base2Component implements OnInit, OnChanges {
  @Input() isView: boolean
  @Input() isModal: boolean
  @Input() dataDetail
  @Input() dataThongTin
  @Input() idInput
  amount = {...AMOUNT_ONE_DECIMAL};
  soLanDauGia: number;
  rowItemKhach: any = {};
  rowItemDgv: any = {};
  rowItemToChuc: any = {};
  dataNguoiTgia: any[] = [];
  dataNguoiShow: any[] = [];
  listHinhThucBDG: any[] = [];
  listPhuongThucBDG: any[] = [];
  listHinhThucLucChonToChucBDG: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauGiaService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      nam: [],
      lanDauGia: [],
      maThongBao: [''],
      idQdPd: [],
      soQdPd: [''],
      idQdDc: [],
      soQdDc: [''],
      idQdPdDtl: [],
      trichYeuTbao: [''],
      tenToChuc: [''],
      sdtToChuc: ['', [this.validatePhoneNumber]],
      diaChiToChuc: [''],
      taiKhoanToChuc: [''],
      soHd: [''],
      ngayKyHd: [''],
      hthucTchuc: [''],
      tgianDkyTu: [''],
      tgianDkyDen: [''],
      ghiChuTgianDky: [''],
      diaDiemDky: [''],
      dieuKienDky: [''],
      tienMuaHoSo: [],
      buocGia: [],
      ghiChuBuocGia: [''],
      tgianXemTu: [''],
      tgianXemDen: [''],
      ghiChuTgianXem: [''],
      diaDiemXem: [''],
      tgianNopTienTu: [''],
      tgianNopTienDen: [''],
      pthucTtoan: [''],
      ghiChuTgianNopTien: [''],
      donViThuHuong: [''],
      stkThuHuong: [''],
      nganHangThuHuong: [''],
      chiNhanhNganHang: [''],
      tgianDauGiaTu: [''],
      tgianDauGiaDen: [''],
      diaDiemDauGia: [''],
      hthucDgia: [''],
      pthucDgia: [''],
      dkienCthuc: [''],
      ghiChu: [''],
      ketQua: ['1'], // 0 : Trượt 1 Trúng
      soBienBan: [''],
      trichYeuBban: [''],
      ngayKyBban: [''],
      ketQuaSl: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      khoanTienDatTruoc: [],
      thongBaoKhongThanh: [''],
      soDviTsan: [],
      qdLcTcBdg: [''],
      ngayQdBdg: [''],
      trangThai: [STATUS.DANG_THUC_HIEN],
      tenTrangThai: ['ĐANG THỰC HIỆN'],
      canCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      if (this.dataThongTin) {
        await this.getDetail(this.dataThongTin.id);
      } else if (!this.isView) {
        await this.initForm();
      }
      if (this.idInput > 0 && this.idInput) {
        await this.getDetail(this.idInput);
      }
      await this.loadDataComboBox();
      this.amount.align = "left";
    } catch (error) {
      console.log('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async initForm() {
    let idThongBao = await this.helperService.getId("XH_TC_TTIN_BDG_HDR_SEQ");
    const newMaThongBao = idThongBao + "/" + this.dataDetail.nam + "/TB-ĐG";
    const newSoBienBan = idThongBao + "/" + this.dataDetail.nam + "/BB-ĐG";
    this.formData.patchValue({
      nam: this.dataDetail.nam,
      idQdPd: this.dataDetail.idQdPd,
      soQdPd: this.dataDetail.soQdPd,
      idQdDc: this.dataDetail.idQdDc,
      soQdDc: this.dataDetail.soQdDc,
      idQdPdDtl: this.dataDetail.idQdPdDtl,
      lanDauGia: this.soLanDauGia + 1,
      maThongBao: newMaThongBao,
      soBienBan: newSoBienBan,
    });
    await this.onChangeQdKhBdgDtl(this.formData.value.idQdPdDtl);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.dataThongTin) {
      await this.getDetail(this.dataThongTin.id);
    }
  }

  async loadDataComboBox() {
    const fetchData = async (fieldName, targetArray, filterCondition) => {
      const res = await this.danhMucService.danhMucChungGetAll(fieldName);
      if (res.msg === MESSAGE.SUCCESS) {
        targetArray.push(...res.data.filter(filterCondition));
      }
    };
    await Promise.all([
      fetchData('HT_LCNT', this.listHinhThucLucChonToChucBDG, () => true),
      fetchData('HINH_THUC_DG', this.listHinhThucBDG, () => true),
      fetchData('PHUONG_THUC_DG', this.listPhuongThucBDG, () => true),
    ]);
  }

  async onChangeQdKhBdgDtl(id) {
    if (id <= 0) {
      return;
    }
    await this.spinner.show();
    try {
      const res = await this.quyetDinhPdKhBdgService.getDtlDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        khoanTienDatTruoc: data.khoanTienDatTruoc
      });
      if (data.listTtinDg && data.listTtinDg.length > 0) {
        const tTinDthauLastest = data.listTtinDg.pop();
        const tTinDthau = tTinDthauLastest.id > 0 ? await this.thongTinDauGiaService.getDetail(tTinDthauLastest.id) : null;
        if (tTinDthau && tTinDthau.data && tTinDthau.data.children) {
          this.dataTable = tTinDthau.data.children;
        }
      } else {
        this.dataTable = data.children;
      }
      this.dataTable = this.dataTable.map((item) => {
        const filteredChildren = item.children.filter(child => !child.soLanTraGia);
        return {
          ...item,
          soLuongChiCuc: 0,
          soTienDatTruocChiCuc: 0,
          children: filteredChildren,
        };
      }).filter(item => item.children.length > 0);
      await this.calculatorTable();
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async calculatorTable() {
    this.dataTable.forEach((item) => {
      item.soLuongXuatBan = item.children.reduce((total, child) => {
        child.soTienDatTruoc = child.soLuongDeXuat * child.donGiaDuocDuyet * this.formData.value.khoanTienDatTruoc / 100;
        return total + child.soLuongDeXuat;
      }, 0);
      item.tienDatTruoc = item.children.reduce((total, child) => {
        return total + child.soTienDatTruoc;
      }, 0);
    });
  }

  async getDetail(id) {
    try {
      await this.spinner.show();
      if (id <= 0) {
        return;
      }
      const res = await this.thongTinDauGiaService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        ketQua: data.ketQua.toString(),
      });
      this.dataTable = data.children.filter(s => s.children && s.children.length > 0);
      if (!this.isView) {
        await this.getSoLuongDieuChinh(this.dataDetail.idQdPdDtl);
        this.formData.patchValue({
          idQdPd: this.dataDetail.idQdPd,
          soQdPd: this.dataDetail.soQdPd,
          idQdDc: this.dataDetail.idQdDc,
          soQdDc: this.dataDetail.soQdDc,
          idQdPdDtl: this.dataDetail.idQdPdDtl,
        });
      }
      this.dataNguoiTgia = data.listNguoiTgia;
      this.dataNguoiShow = chain(this.dataNguoiTgia).groupBy('loai').map((value, key) => ({
        loai: key,
        dataChild: value
      })).value();
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async getSoLuongDieuChinh(id) {
    if (id <= 0) {
      return;
    }
    const res = await this.quyetDinhPdKhBdgService.getDtlDetail(id);
    if (res.msg === MESSAGE.SUCCESS || res.data) {
      this.dataTable.forEach(item => {
        item.children.forEach(child => {
          const matchedS1 = res.data.children
            .flatMap(s => s.children)
            .find(s1 => (
              child.maDiemKho === s1.maDiemKho &&
              child.maNhaKho === s1.maNhaKho &&
              child.maNganKho === s1.maNganKho &&
              child.maLoKho === s1.maLoKho &&
              child.maDviTsan === s1.maDviTsan
            ));
          if (matchedS1) {
            child.soLuongDeXuat = matchedS1.soLuongDeXuat;
            this.calculatorTable()
          }
        });
      });
    }
  }

  getDateRange(start, end) {
    return (start && end) ? [start, end] : null;
  }

  async handleCancel() {
    this.modal.closeAll();
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.formData.controls["maThongBao"].setValidators([Validators.required]);
      const body = this.prepareFormData();
      await this.createUpdate(body);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async saveAndSend() {
    try {
      this.setValidForm();
      if (this.formData.value.ketQua == 1 && this.dataNguoiShow.length != 3) {
        this.notification.error(MESSAGE.ERROR, "Vui lòng thêm các thành phần tham dự đấu giá");
        return;
      }
      const confirmed = await this.showConfirmationDialog();
      if (!confirmed) {
        return;
      }
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      const body = this.prepareFormData();
      const isUpdate = body.id && body.id > 0;
      const result = isUpdate ? await this.thongTinDauGiaService.update(body) : await this.thongTinDauGiaService.create(body);
      if (result && result.msg == MESSAGE.SUCCESS) {
        const approvalResult = await this.thongTinDauGiaService.approve({
          id: result.data.id,
          trangThai: STATUS.DA_HOAN_THANH
        });
        if (approvalResult && approvalResult.msg == MESSAGE.SUCCESS) {
          this.notification.success(MESSAGE.NOTIFICATION, 'Bạn đã hoàn thành thông tin đấu giá thành công!');
          this.modal.closeAll();
        } else {
          this.notification.error(MESSAGE.ERROR, approvalResult ? approvalResult.msg : MESSAGE.SYSTEM_ERROR);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, result ? result.msg : MESSAGE.SYSTEM_ERROR);
      }
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async showConfirmationDialog(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn hoàn thành thông tin đấu giá ?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: () => resolve(true),
        nzOnCancel: () => resolve(false),
      });
    });
  }

  prepareFormData() {
    const formData = this.formData.value;
    formData.listNguoiTgia = this.dataNguoiTgia;
    formData.children = this.dataTable;
    const {ketQua, ketQuaSl, soDviTsan} = this.calculateKetQua();
    formData.ketQua = ketQua;
    formData.ketQuaSl = ketQuaSl;
    formData.soDviTsan = soDviTsan;
    return formData;
  }

  calculateKetQua() {
    let totalItems = 0;
    let totalMatching = 0;
    let totalNotMatching = 0;
    let uniqueMaDviTsan = new Set();
    this.dataTable.forEach((item) => {
      item.children.forEach((child) => {
        if (!uniqueMaDviTsan.has(child.maDviTsan)) {
          uniqueMaDviTsan.add(child.maDviTsan);
          if (this.formData.value.ketQua == 1) {
            if (child.soLanTraGia > 0 && child.toChucCaNhan != null) {
              totalMatching++;
            }
          }
          if (this.formData.value.ketQua == 0) {
            if (child.soLanTraGia == null && child.toChucCaNhan == null) {
              totalNotMatching = 0;
            }
          }
          totalItems++;
        }
      });
    });
    const ketQua = this.formData.value.ketQua == 1 ? 1 : 0;
    const ketQuaSl = this.formData.value.ketQua == 1 ? `${totalMatching}/${totalItems}` : `${totalNotMatching}/${totalItems}`;
    const soDviTsan = totalItems;
    return {ketQua, ketQuaSl, soDviTsan};
  }

  addRow(item, name) {
    if (this.validateThanhPhanThamDu(item, name)) {
      const data = {...item, loai: name, idVirtual: new Date().getTime()};
      this.dataNguoiTgia.push(data);
      this.dataNguoiShow = _.chain(this.dataNguoiTgia)
        .groupBy('loai').map((value, key) => ({loai: key, dataChild: value})).value();
      const resetItems = {
        KM: 'rowItemKhach',
        DGV: 'rowItemDgv',
        NTG: 'rowItemToChuc',
      };
      if (resetItems[name]) {
        this[resetItems[name]] = {};
      }
    }
  }

  findTableName(name) {
    if (!this.dataNguoiShow) {
      return null;
    }
    return this.dataNguoiShow.find(({loai}) => loai === name) || null;
  }

  validateThanhPhanThamDu(data, name) {
    const requirements = {
      KM: {fields: ['hoVaTen', 'chucVu', 'diaChi'], errorMessage: "Vui lòng điền đủ thông tin khách mời chứng kiến"},
      DGV: {fields: ['hoVaTen', 'chucVu', 'diaChi'], errorMessage: "Vui lòng điền đủ thông tin đấu giá viên"},
      NTG: {
        fields: ['hoVaTen', 'soCccd', 'diaChi'],
        errorMessage: "Vui lòng điền đủ thông tin tổ chức cá nhân tham giá đấu giá"
      }
    };
    const requirement = requirements[name];
    if (!requirement) {
      return false;
    }
    for (const field of requirement.fields) {
      if (!data[field]) {
        this.notification.error(MESSAGE.ERROR, requirement.errorMessage);
        return false;
      }
    }
    return true;
  }

  clearRow(name) {
    const resetItems = {
      KM: 'rowItemKhach',
      DGV: 'rowItemDgv',
      NTG: 'rowItemToChuc',
    };
    const resetItem = resetItems[name];
    if (resetItem) {
      this[resetItem] = {};
    }
  }

  deleteRow(idVirtual) {
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
          this.dataNguoiTgia = this.dataNguoiTgia.filter(item => item.idVirtual != idVirtual);
          this.dataNguoiShow = _.chain(this.dataNguoiTgia)
            .groupBy('loai').map((value, key) => ({loai: key, dataChild: value})).value();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  editRow(data: any) {
    this.dataNguoiTgia.forEach(s => s.isEdit = false);
    let currentRow = this.dataNguoiTgia.find(s => s.idVirtual == data.idVirtual);
    currentRow.isEdit = true;
    this.dataNguoiShow = _.chain(this.dataNguoiTgia).groupBy('loai').map((value, key) => ({
      loai: key,
      dataChild: value
    })).value();
  }

  saveRow(data: any, index: number) {
    this.updateEditState(data, index, false);
  }

  cancelEdit(data: any, index: number) {
    this.updateEditState(data, index, false);
  }

  updateEditState(data: any, index: number, isEdit: boolean) {
    const rows = this.dataNguoiTgia.filter(s => s.loai == data.loai);
    if (rows[index]) {
      rows[index].isEdit = isEdit;
    }
  }

  changeNTG(index, indexLv2) {
    const row = this.dataTable[index].children[indexLv2];
    if (this.validateDonGiaCaoNhat(row)) {
      row.soLanTraGia ||= 1;
    }
  }

  validateDonGiaCaoNhat(row): boolean {
    if (row.donGiaTraGia >= row.donGiaDuocDuyet) {
      return true;
    } else {
      this.notification.error(MESSAGE.WARNING, "Đơn giá cao nhất phải lớn hơn hoặc bằng đơn giá chưa VAT");
      row.toChucCaNhan = null;
      return false;
    }
  }

  validatePhoneNumber(control: any) {
    const phoneNumber = control.value;
    if (!phoneNumber || phoneNumber[0] !== '0' || !/^[0-9]+$/.test(phoneNumber)) {
      return {invalidPhoneNumber: true};
    }
    return null;
  }

  disabledTgianDangKyTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.tgianDkyDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.tgianDkyDen.getFullYear(), this.formData.value.tgianDkyDen.getMonth(), this.formData.value.tgianDkyDen.getDate());
    return startDay > endDay;
  };

  disabledTgianDangKyDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tgianDkyTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.tgianDkyTu.getFullYear(), this.formData.value.tgianDkyTu.getMonth(), this.formData.value.tgianDkyTu.getDate());
    return endDay < startDay;
  };

  disabledTgianXemtaiSanTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.tgianXemDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.tgianXemDen.getFullYear(), this.formData.value.tgianXemDen.getMonth(), this.formData.value.tgianXemDen.getDate());
    return startDay > endDay;
  };

  disabledTgianXemtaiSanDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tgianXemTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.tgianXemTu.getFullYear(), this.formData.value.tgianXemTu.getMonth(), this.formData.value.tgianXemTu.getDate());
    return endDay < startDay;
  };

  disabledTgianNopTienTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.tgianNopTienDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.tgianNopTienDen.getFullYear(), this.formData.value.tgianNopTienDen.getMonth(), this.formData.value.tgianNopTienDen.getDate());
    return startDay > endDay;
  };

  disabledTgianNopTienDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tgianNopTienTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.tgianNopTienTu.getFullYear(), this.formData.value.tgianNopTienTu.getMonth(), this.formData.value.tgianNopTienTu.getDate());
    return endDay < startDay;
  };

  disabledTgianDauGiaTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.tgianDauGiaDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.tgianDauGiaDen.getFullYear(), this.formData.value.tgianDauGiaDen.getMonth(), this.formData.value.tgianDauGiaDen.getDate());
    return startDay > endDay;
  };

  disabledTgianDauGiaDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tgianDauGiaTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.tgianDauGiaTu.getFullYear(), this.formData.value.tgianDauGiaTu.getMonth(), this.formData.value.tgianDauGiaTu.getDate());
    return endDay < startDay;
  };

  setValidForm() {
    const fieldsToValidate = [
      "maThongBao",
      "soQdPd",
      "trichYeuTbao",
      "tenToChuc",
      "diaChiToChuc",
      "taiKhoanToChuc",
      "soHd",
      "hthucTchuc",
      "tgianDkyTu",
      "tgianXemTu",
      "tgianNopTienTu",
      "tgianDauGiaTu",
      "diaDiemDky",
      "dieuKienDky",
      "tienMuaHoSo",
      "buocGia",
      "diaDiemXem",
      "pthucTtoan",
      "diaDiemDauGia",
      "hthucDgia",
      "pthucDgia",
      "dkienCthuc",
      "soBienBan",
      "trichYeuBban",
      "ngayKyBban",
    ];
    if (this.formData.value.ketQua === '0') {
      fieldsToValidate.push("thongBaoKhongThanh");
    }
    fieldsToValidate.forEach(field => {
      this.formData.controls[field].setValidators([Validators.required]);
    });
  }
}
