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
  fileNghiemThuTl: any[] = [];
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
  listTrangThai1: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' },
  ];
  trangThaiSave: string = this.STATUS.DU_THAO;
  hasError: boolean = false;
  dataTable: any[] = [];
  rowItem: TienDoThucHien = new TienDoThucHien;
  dataEdit: { [key: string]: { edit: boolean; data: TienDoThucHien } } = {};

  rowItem1: NghiemThuThanhLy = new NghiemThuThanhLy;
  dataEdit1: { [key: string]: { edit: boolean; data: NghiemThuThanhLy } } = {};

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
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
      chucVu: ['', [Validators.required]],
      email: [null],
      sdt: [null],
      dviPhoiHop: ['', [Validators.required]],
      dviChuTri: ['', [Validators.required]],
      dviThucHien: [''],
      nguonVon: ['', [Validators.required]],
      soQdPd: [''],
      suCanThiet: [null],
      mucTieu: [null],
      phamVi: [null],
      trangThai: [null, [Validators.required]],
      tenTrangThai: [null],
      tongChiPhi: [null, [Validators.required]],
      phuongPhap: [null],
      noiDung: [null],
      ngayNghiemThu: ['', [Validators.required]],
      diaDiem: ['', [Validators.required]],
      danhGia: ['', [Validators.required]],
      tongDiem: ['', [Validators.required]],
      xepLoai: ['', [Validators.required]],
    });
  }

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    // { ma: this.STATUS.DA_DUYET, giaTri: 'Đã duyệt' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_NGHIEM_THU, giaTri: 'Đã nghiệm thu' },
  ];

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
  }

  async getDetail(id) {
    let res = await this.khCnCongTrinhNghienCuu.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.trangThaiSave = data.trangThai;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        ngayKy: data.ngayKyTu && data.ngayKyDen ? [data.ngayKyTu, data.ngayKyDen] : null,
      });
      this.fileDinhKem = data.fileDinhKem;
      this.fileTienDoTh = data.fileTienDoTh;
      this.fileNghiemThuTl = data.fileNghiemThuTl;
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
    if (this.trangThaiSave == this.STATUS.DU_THAO || this.trangThaiSave == this.STATUS.DANG_THUC_HIEN) {
      return false;
    } else {
      return true;
    }
  }

  async initForm() {
    this.formData.patchValue({
      trangThai: '00',
      tenTrangThai: 'Dự Thảo',
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

  async getListXepLoai() {
    this.listXepLoai = [];
    let res = await this.danhMucService.danhMucChungGetAll('XEP_LOAI');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listXepLoai = res.data;
    }
  }

  calculateXepLoai() {
    if (this.formData.value.tongDiem) {
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
    this.setValidator(isGuiDuyet);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;
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
    body.fileNghiemThuTl = this.fileNghiemThuTl;
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

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {

      if (this.formData.value.trangThai == this.STATUS.DA_NGHIEM_THU) {
        this.formData.controls['ngayNghiemThu'].setValidators([Validators.required]);
        this.formData.controls['diaDiem'].setValidators([Validators.required]);
        this.formData.controls['danhGia'].setValidators([Validators.required]);
        this.formData.controls['tongDiem'].setValidators([Validators.required]);
        this.formData.controls['xepLoai'].setValidators([Validators.required]);
      } else {

        this.formData.controls['ngayNghiemThu'].clearValidators();
        this.formData.controls['diaDiem'].clearValidators();
        this.formData.controls['danhGia'].clearValidators();
        this.formData.controls['tongDiem'].clearValidators();
        this.formData.controls['xepLoai'].clearValidators();
      }
    } else {

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
    this.dataTable = [];
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
    this.dataTable1 = [];
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
}
