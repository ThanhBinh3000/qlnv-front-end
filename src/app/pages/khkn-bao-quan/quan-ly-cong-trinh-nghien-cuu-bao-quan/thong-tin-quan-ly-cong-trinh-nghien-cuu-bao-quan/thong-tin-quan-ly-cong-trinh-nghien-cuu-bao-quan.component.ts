import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { KhCnCongTrinhNghienCuu } from 'src/app/services/kh-cn-bao-quan/khCnCongTrinhNghienCuu';
import * as dayjs from 'dayjs';
import { NghiemThuThanhLy, TienDoThucHien } from 'src/app/models/KhoaHocCongNgheBaoQuan';
import { cloneDeep } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from './../../../../components/base2/base2.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { saveAs } from 'file-saver';
import { PREVIEW } from '../../../../constants/fileType';
import printJS from 'print-js';
import { TRANG_THAI_CTNC } from '../../../../constants/status';
import { DonviService } from '../../../../services/donvi.service';

@Component({
  selector: 'app-thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan',
  templateUrl: './thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan.component.html',
  styleUrls: ['./thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan.component.scss'],
})
export class ThongTinQuanLyCongTrinhNghienCuuBaoQuanComponent extends Base2Component implements OnInit, OnChanges {

  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  formThongTinChung: any = {};
  tabSelected: number = 0;
  dataTable1: any[] = [];
  listCapDt: any[] = [];
  listXepLoai: any[] = [];
  listNguonVon: any[] = [];
  fileDinhKem: any[] = [];
  fileTienDoTh: any[] = [];
  fileNghiemThu: any[] = [];
  fileThanhLy: any[] = [];
  listDonVi: any[] = [];
  listDviChuTri: any[] = [];
  listDviThucHien: any[] = [];
  options = {
    allowZero: true,
    allowNegative: true,
    precision: 0,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: 'right',
    nullable: false,
    inputMode: CurrencyMaskInputMode.FINANCIAL,
  };
  templateName = 'thong_tin_cong_trinh_nghien_cuu';
  STATUS_KHCN = TRANG_THAI_CTNC;
  listTrangThai1: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' },
  ];
  trangThaiSave: string = this.STATUS_KHCN.PHE_DUYET_NV_KHCN;
  hasError: boolean = false;
  dataTable: any[] = [];
  rowItem: TienDoThucHien = new TienDoThucHien;
  dataEdit: { [key: string]: { edit: boolean; data: TienDoThucHien } } = {};

  rowItem1: NghiemThuThanhLy = new NghiemThuThanhLy;
  dataEdit1: { [key: string]: { edit: boolean; data: NghiemThuThanhLy } } = {};
  pdfSrc: any;
  wordSrc: any;
  printSrc: any;


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private donviService: DonviService,
    private khCnCongTrinhNghienCuu: KhCnCongTrinhNghienCuu,
  ) {
    super(httpClient, storageService, notification, spinner, modal, khCnCongTrinhNghienCuu);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [''],
      nam: [''],
      maDeTai: ['', [Validators.required]],
      tenDeTai: ['', [Validators.required]],
      capDeTai: ['', [Validators.required]],
      ngayKy: ['', [Validators.required]],
      ngayKyTu: [],
      ngayKyDen: [],
      chuNhiem: ['', [Validators.required]],
      chucVu: [''],
      email: [null],
      sdt: [null],
      dviPhoiHop: [null],
      dviChuTri: [null, [Validators.required]],
      dviThucHien: [null, [Validators.required]],
      tenDviThucHien: [null],
      tenDviChuTri: [null],
      nguonVon: [null, [Validators.required]],
      soQdPd: [null],
      suCanThiet: [null],
      mucTieu: [null],
      phamVi: [null],
      trangThai: [null, [Validators.required]],
      tenTrangThai: [null],
      tongChiPhi: [null, [Validators.required]],
      phuongPhap: [null],
      noiDung: [null],
      ngayNghiemThu: [null],
      diaDiem: [null],
      danhGia: [null],
      tongDiem: [null],
      xepLoai: [null],
      dkThanhLy: [null],
      hsThanhLy: [null],
      tnCnNvKhcn: [null],
    });
  }

  listTrangThai: any[] = [];
  listDkThanhLy: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      console.log(changes);
    }
  }

  ngOnInit() {
    if (this.id) {
      this.getDetail(this.id);
    } else {
      this.initForm();
    }
    this.getListCapDt();
    this.getListXepLoai();
    this.getListTrangThai();
    this.getListDonViTheoCap();
    this.getListDkThanhLy();
  }

  async getDetail(id) {
    let res = await this.khCnCongTrinhNghienCuu.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.trangThaiSave = data.trangThai;
      data.dkThanhLy = data.dkThanhLy ? data.dkThanhLy.split(',') : [];
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        ngayKy: data.ngayKyTu && data.ngayKyDen ? [data.ngayKyTu, data.ngayKyDen] : null,
      });
      this.fileDinhKem = data.fileDinhKem;
      this.fileTienDoTh = data.fileTienDoTh;
      this.fileNghiemThu = data.fileNghiemThu;
      this.fileThanhLy = data.fileThanhLy;
      this.dataTable = data.tienDoThucHien;
      this.dataTable.forEach(item => {
        const tt = this.listTrangThai1.filter(d => d.ma == item.trangThaiTd);
        if (tt.length > 0) {
          item.tenTrangThaiTd = tt[0].giaTri;
        }
      });
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
      this.dataTable1 = data.children;
      this.dataTable1.forEach((item, index) => {
        this.dataEdit1[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  isDisable(): boolean {
    if (this.trangThaiSave == this.STATUS_KHCN.PHE_DUYET_NV_KHCN || this.trangThaiSave == this.STATUS_KHCN.DANG_THUC_HIEN_NV_KHCN) {
      return false;
    } else {
      return true;
    }
  }

  async initForm() {
    this.formData.patchValue({
      trangThai: '01',
      tenTrangThai: 'Phê duyệt Nhiệm vụ KHCN',
    });
  }

  async getListCapDt() {
    this.listCapDt = [];
    let res = await this.danhMucService.danhMucChungGetAll('CAP_DE_TAI');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCapDt = res.data;
    }
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
  }

  async getListTrangThai() {
    this.listTrangThai = [];
    let res = await this.danhMucService.danhMucChungGetAll('TRANG_THAI_CTNC');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listTrangThai = res.data;
    }
  }

  async getListDkThanhLy() {
    this.listDkThanhLy = [];
    let res = await this.danhMucService.danhMucChungGetAll('DIEU_KIEN_THANH_LY');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDkThanhLy = res.data;
    }
  }

  async getListDonViTheoCap() {
    let res = await this.donviService.layTatCaDonViByLevel(2);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDonVi = res.data;
      this.listDonVi.forEach(item => {
        item.fullname = item.key + ' - ' + item.title;
      });
      this.listDviChuTri = this.listDonVi.filter(item => item.fullname && (!item.fullname.includes("Vụ") && ! item.fullname.includes("BLĐ Tổng cục DTNN")) );
      this.listDviThucHien = this.listDonVi.filter(item => item.fullname && ! item.fullname.includes("BLĐ Tổng cục DTNN"));
    }
  }

  async getListXepLoai() {
    this.listXepLoai = [];
    let res = await this.danhMucService.danhMucChungGetAll('XEP_LOAI');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listXepLoai = res.data;
    }
  }

  calculateXepLoai() {
    if (this.formData.value.tongDiem >= 0) {
      let tongDiem = this.formData.value.tongDiem;
      if (tongDiem < 60) {
        this.formData.patchValue({
          xepLoai: '0',
        });
      } else if (tongDiem >= 60 && tongDiem <= 69) {
        this.formData.patchValue({
          xepLoai: '1',
        });
      } else if (tongDiem >= 70 && tongDiem <= 79) {
        this.formData.patchValue({
          xepLoai: '2',
        });
      } else if (tongDiem >= 80 && tongDiem <= 89) {
        this.formData.patchValue({
          xepLoai: '3',
        });
      } else if (tongDiem >= 90 && tongDiem <= 100) {
        this.formData.patchValue({
          xepLoai: '4',
        });
      }
    }
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet?) {
    this.setValidator();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;
    body.tenDviThucHien = this.listDonVi.find(item => item.key == body.dviThucHien)?.title;
    body.tenDviChuTri = this.listDonVi.find(item => item.key == body.dviChuTri)?.title;
    body.tienDoThucHien = this.dataTable;
    body.children = this.dataTable1;
    body.nam = dayjs().get('year');
    body.ngayKyTu = this.formData.get('ngayKy').value
      ? dayjs(this.formData.get('ngayKy').value[0]).format(
        'YYYY-MM-01',
      )
      : null;
    body.ngayKyDen = this.formData.get('ngayKy').value
      ? dayjs(this.formData.get('ngayKy').value[1]).format(
        'YYYY-MM-01',
      )
      : null;
    body.fileDinhKem = this.fileDinhKem;
    body.fileTienDoTh = this.fileTienDoTh;
    body.fileNghiemThu = this.fileNghiemThu;
    body.fileThanhLy = this.fileThanhLy;
    body.dkThanhLy = (body.dkThanhLy && body.dkThanhLy.length > 0) ? body.dkThanhLy.toString() : null;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.khCnCongTrinhNghienCuu.update(body);
    } else {
      res = await this.khCnCongTrinhNghienCuu.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.idInput = res.data.id;
        this.formData.patchValue({
          id: res.data.id,
        });
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  setValidator() {
    if (this.formData.value.trangThai == this.STATUS_KHCN.DA_NGHIEM_THU_NV_KHCN) {
      // this.formData.controls['ngayNghiemThu'].setValidators([Validators.required]);
      // this.formData.controls['diaDiem'].setValidators([Validators.required]);
      this.formData.controls['danhGia'].setValidators([Validators.required]);
      this.formData.controls['tongDiem'].setValidators([Validators.required]);
      this.formData.controls['xepLoai'].setValidators([Validators.required]);
    } else if (this.formData.value.trangThai == this.STATUS_KHCN.DA_THANH_LY_NV_KHCN) {
      this.formData.controls['dkThanhLy'].setValidators([Validators.required]);
      this.formData.controls['hsThanhLy'].setValidators([Validators.required]);
      this.formData.controls['tnCnNvKhcn'].setValidators([Validators.required]);
    } else {
      // this.formData.controls['ngayNghiemThu'].clearValidators();
      // this.formData.controls['diaDiem'].clearValidators();
      this.formData.controls['danhGia'].clearValidators();
      this.formData.controls['tongDiem'].clearValidators();
      this.formData.controls['xepLoai'].clearValidators();
      this.formData.controls['dkThanhLy'].clearValidators();
      this.formData.controls['hsThanhLy'].clearValidators();
      this.formData.controls['tnCnNvKhcn'].clearValidators();
    }
  }


  // tiến độ thực hiện
  themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    if (this.rowItem.noiDung && this.rowItem.sanPham != null) {
      this.sortTableId();
      let item = cloneDeep(this.rowItem);
      item.stt = this.dataTable.length + 1;
      item.edit = false;
      this.dataTable = [
        ...this.dataTable,
        item,
      ];

      this.rowItem = new TienDoThucHien();
      this.updateEditCache();
      this.emitDataTable();
    } else {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đầy đủ thông tin');
    }
  }

  onChangeTrangThai(trangThai, typeData?) {
    const tt = this.listTrangThai1.filter(d => d.ma == trangThai);
    if (typeData) {
      if (tt.length > 0) {
        typeData.tenTrangThaiTd = tt[0].giaTri;
      }
    }
    if (tt.length > 0) {
      this.rowItem.tenTrangThaiTd = tt[0].giaTri;
    }
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  editItem(index: number): void {
    this.dataEdit[index].edit = true;
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }

  luuEdit(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.emitDataTable();
    this.dataEdit[index].edit = false;
  }


  xoaItem(index: number) {
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
          this.dataTable.splice(index, 1);
          this.updateEditCache();
          this.dataTable;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  clearData() {
    this.rowItem = new TienDoThucHien();
  }

  emitDataTable() {

  }

  //Nghiệm thu
  themMoiItem1() {
    if (!this.dataTable1) {
      this.dataTable1 = [];
    }
    if (this.rowItem1.hoTen && this.rowItem1.donVi != null) {
      this.sortTableId1();
      let item = cloneDeep(this.rowItem1);
      item.stt = this.dataTable1.length + 1;
      item.edit = false;
      this.dataTable1 = [
        ...this.dataTable1,
        item,
      ];

      this.rowItem1 = new NghiemThuThanhLy();
      this.updateEditCache1();
    } else {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đầy đủ thông tin');
    }
  }

  clearData1() {
    this.rowItem1 = new NghiemThuThanhLy();
  }

  sortTableId1() {
    this.dataTable1.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  editItem1(index: number): void {
    this.dataEdit1[index].edit = true;
  }

  updateEditCache1(): void {
    if (this.dataTable1) {
      this.dataTable1.forEach((item, index) => {
        this.dataEdit1[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  huyEdit1(id: number): void {
    const index = this.dataTable1.findIndex((item) => item.idVirtual == id);
    this.dataEdit1[id] = {
      data: { ...this.dataTable1[index] },
      edit: false,
    };
  }

  luuEdit1(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable1[index], this.dataEdit1[index].data);
    this.dataEdit1[index].edit = false;
  }


  xoaItem1(index: number) {
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
          this.dataTable1.splice(index, 1);
          this.updateEditCache1();
          this.dataTable1;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async preview(id) {
    this.spinner.show();
    await this.khCnCongTrinhNghienCuu.preview({
      tenBaoCao: this.templateName,
      id: id,
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.printSrc = res.data.pdfSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, 'Lỗi trong quá trình tải file.');
      }
    });
    this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfSrc, this.templateName + '.pdf');
  }

  downloadWord() {
    saveAs(this.wordSrc, this.templateName + '.docx');
  }

  doPrint() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true });
  }

  changeCapDeTai(val) {
    if (val) {
      if (val == '02') {
        if (this.listDonVi && !this.listDonVi.find(item => item.key == '0101')) {
          this.listDonVi.push({ key: '0101', title: 'Tổng cục DTNN', fullname: '0101 - Tổng cục DTNN' });
          this.listDviChuTri.push({ key: '0101', title: 'Tổng cục DTNN', fullname: '0101 - Tổng cục DTNN' });
          this.listDviThucHien.push({ key: '0101', title: 'Tổng cục DTNN', fullname: '0101 - Tổng cục DTNN' });
        }
        this.formData.patchValue({
          dviChuTri: '0101',
          tenDviChuTri: 'Tổng cục DTNN',
        });
      } else {
        this.formData.patchValue({
          dviChuTri: null,
        });
        let indexTc = this.listDonVi.findIndex(item => item.key == '0101');
        if (indexTc != -1) {
          this.listDonVi.splice(indexTc, 1);
          this.listDviThucHien.splice(indexTc, 1);
          this.listDviChuTri.splice(indexTc, 1);
        }
      }
    }
  }
}
