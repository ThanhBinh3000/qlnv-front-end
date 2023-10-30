import {HttpClient} from '@angular/common/http';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import dayjs from 'dayjs';
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
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-thongtin-daugia',
  templateUrl: './thongtin-daugia.component.html',
})
export class ThongtinDaugiaComponent extends Base2Component implements OnInit, OnChanges {
  @Input() isView: boolean
  @Input() isModal: boolean
  @Input() dataDetail
  @Input() dataThongTin
  @Input() idInput
  soLanDauGia: number;
  rowItemKhach: any = {};
  rowItemDgv: any = {};
  rowItemToChuc: any = {};
  dataNguoiTgia: any[] = [];
  dataNguoiShow: any[] = [];
  listHinhThucBDG: any[] = [];
  listPhuongThucBDG: any[] = [];
  listHinhThucLucChonToChucBDG: any[] = [];
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "right",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }

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
      sdtToChuc: [''],
      diaChiToChuc: [''],
      taiKhoanToChuc: [''],
      soHd: [''],
      ngayKyHd: [''],
      hthucTchuc: [''],
      tgianDky: [''],
      tgianDkyTu: [''],
      tgianDkyDen: [''],
      ghiChuTgianDky: [''],
      diaDiemDky: [''],
      dieuKienDky: [''],
      tienMuaHoSo: [''],
      buocGia: [''],
      ghiChuBuocGia: [''],
      tgianXem: [''],
      tgianXemTu: [''],
      tgianXemDen: [''],
      ghiChuTgianXem: [''],
      diaDiemXem: [''],
      tgianNopTien: [''],
      tgianNopTienTu: [''],
      tgianNopTienDen: [''],
      pthucTtoan: [''],
      ghiChuTgianNopTien: [''],
      donViThuHuong: [''],
      stkThuHuong: [''],
      nganHangThuHuong: [''],
      chiNhanhNganHang: [''],
      tgianDauGia: [''],
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
      if (res.msg !== MESSAGE.SUCCESS) {
        throw new Error('Không tìm thấy dữ liệu');
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
        const tTinDthau = await this.thongTinDauGiaService.getDetail(tTinDthauLastest.id);
        this.dataTable = tTinDthau.data?.children;
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
        console.log('Không tìm thấy dữ liệu.');
        return;
      }
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        tgianDky: this.getDateRange(data.tgianDkyTu, data.tgianDkyDen),
        tgianXem: this.getDateRange(data.tgianXemTu, data.tgianXemDen),
        tgianNopTien: this.getDateRange(data.tgianNopTienTu, data.tgianNopTienDen),
        tgianDauGia: this.getDateRange(data.tgianDauGiaTu, data.tgianDauGiaDen),
        ketQua: data.ketQua.toString(),
      });
      this.dataTable = data.children;
      this.dataNguoiTgia = data.listNguoiTgia;
      this.dataNguoiShow = chain(this.dataNguoiTgia)
        .groupBy('loai')
        .map((value, key) => ({loai: key, dataChild: value}))
        .value();
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  getDateRange(start, end) {
    return (start && end) ? [start, end] : null;
  }

  async handleCancel() {
    this.modal.closeAll();
  }

  async handleOk() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      const body = this.prepareFormData();
      await this.createUpdate(body);
      await this.helperService.restoreRequiredForm(this.formData);
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async saveAndSend() {
    this.setValidForm();
    if (this.formData.value.ketQua == 1 && this.dataNguoiShow.length != 3) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng thêm các thành phần tham dự đấu giá");
      return;
    }
    const confirmed = await this.showConfirmationDialog();
    if (!confirmed) {
      return;
    }
    try {
      await this.spinner.show();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      const body = this.prepareFormData();
      const isUpdate = body.id && body.id > 0;
      const result = isUpdate
        ? await this.thongTinDauGiaService.update(body)
        : await this.thongTinDauGiaService.create(body);
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
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
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
    const dateFields = ['tgianDky', 'tgianXem', 'tgianNopTien', 'tgianDauGia'];
    dateFields.forEach((field) => {
      if (this.formData.get(field).value) {
        const [startDate, endDate] = this.formData.get(field).value.map((date) =>
          dayjs(date).format('YYYY-MM-DD')
        );
        formData[`${field}Tu`] = startDate;
        formData[`${field}Den`] = endDate;
      }
    });
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
    this.dataTable.forEach((item) => {
      item.children.forEach((child) => {
        if (this.formData.value.ketQua == 1) {
          if (child.soLanTraGia > 0 && child.toChucCaNhan != null) {
            totalMatching++;
          }
        } else {
          child.toChucCaNhan = null;
          child.soLanTraGia = null;
          if (child.soLanTraGia == null && child.toChucCaNhan == null) {
            totalNotMatching++;
          }
        }
        totalItems++;
      });
    });
    const ketQua = this.formData.value.ketQua == 1 ? 1 : 0;
    const ketQuaSl =
      this.formData.value.ketQua == 1
        ? `${totalMatching}/${totalItems}`
        : `${totalNotMatching}/${totalItems}`;
    const soDviTsan = this.formData.value.ketQua == 1 ? totalMatching : totalNotMatching;
    return {ketQua, ketQuaSl, soDviTsan};
  }

  addRow(item, name) {
    if (this.validateThanhPhanThamDu(item, name)) {
      const data = {...item, loai: name, idVirtual: new Date().getTime()};
      this.dataNguoiTgia.push(data);
      this.dataNguoiShow = _.chain(this.dataNguoiTgia)
        .groupBy('loai')
        .map((value, key) => ({loai: key, dataChild: value}))
        .value();
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
            .groupBy('loai')
            .map((value, key) => ({loai: key, dataChild: value}))
            .value();
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
    this.dataNguoiShow = _.chain(this.dataNguoiTgia)
      .groupBy('loai')
      .map((value, key) => ({loai: key, dataChild: value}))
      .value();
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

  setValidForm() {
    this.formData.controls["maThongBao"].setValidators([Validators.required]);
    this.formData.controls["soQdPd"].setValidators([Validators.required]);
    this.formData.controls["trichYeuTbao"].setValidators([Validators.required]);
    this.formData.controls["tenToChuc"].setValidators([Validators.required]);
    this.formData.controls["diaChiToChuc"].setValidators([Validators.required]);
    this.formData.controls["taiKhoanToChuc"].setValidators([Validators.required]);
    this.formData.controls["soHd"].setValidators([Validators.required]);
    this.formData.controls["hthucTchuc"].setValidators([Validators.required]);
    this.formData.controls["tgianDky"].setValidators([Validators.required]);
    this.formData.controls["diaDiemDky"].setValidators([Validators.required]);
    this.formData.controls["dieuKienDky"].setValidators([Validators.required]);
    this.formData.controls["tienMuaHoSo"].setValidators([Validators.required]);
    this.formData.controls["buocGia"].setValidators([Validators.required]);
    this.formData.controls["tgianXem"].setValidators([Validators.required]);
    this.formData.controls["diaDiemXem"].setValidators([Validators.required]);
    this.formData.controls["tgianNopTien"].setValidators([Validators.required]);
    this.formData.controls["pthucTtoan"].setValidators([Validators.required]);
    this.formData.controls["tgianDauGia"].setValidators([Validators.required]);
    this.formData.controls["diaDiemDauGia"].setValidators([Validators.required]);
    this.formData.controls["pthucTtoan"].setValidators([Validators.required]);
    this.formData.controls["pthucTtoan"].setValidators([Validators.required]);
    this.formData.controls["dkienCthuc"].setValidators([Validators.required]);
    this.formData.controls["soBienBan"].setValidators([Validators.required]);
    this.formData.controls["trichYeuBban"].setValidators([Validators.required]);
    this.formData.controls["ngayKyBban"].setValidators([Validators.required]);
    if (this.formData.get('ketQua').value != '1') {
      this.formData.controls["thongBaoKhongThanh"].setValidators([Validators.required]);
    }
  }
}
