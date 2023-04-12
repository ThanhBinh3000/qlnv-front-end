import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/components/base/base.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { KhCnCongTrinhNghienCuu } from 'src/app/services/kh-cn-bao-quan/khCnCongTrinhNghienCuu';
import { Globals } from 'src/app/shared/globals';
import * as dayjs from 'dayjs';
import { NghiemThuThanhLy, TienDoThucHien } from 'src/app/models/KhoaHocCongNgheBaoQuan';
import { UserService } from 'src/app/services/user.service';
import { cloneDeep } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from './../../../../components/base2/base2.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CurrencyMaskInputMode } from 'ngx-currency';

@Component({
  selector: 'app-thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan',
  templateUrl: './thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan.component.html',
  styleUrls: ['./thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan.component.scss']
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
  dataTable1: any[] = []
  listCapDt: any[] = []
  listNguonVon: any[] = [];
  fileDinhKem: any[] = [];
  fileTienDoTh: any[] = [];
  fileNghiemThuTl: any[] = [];
  options = {
    allowZero: true,
    allowNegative: true,
    precision: 1,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "right",
    nullable: false,
    inputMode: CurrencyMaskInputMode.FINANCIAL
  }
  listTrangThai1: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' },
  ];
  trangThaiSave: string = this.STATUS.DU_THAO;
  hasError: boolean = false;
  dataTable: any[] = []
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
      nguonVon: ['', [Validators.required]],
      soQdPd: [''],
      suCanThiet: [null],
      mucTieu: [null],
      phamVi: [null],

      trangThai: [null, [Validators.required]],
      tenTrangThai: [null,],
      tongChiPhi: [null, [Validators.required]],
      phuongPhap: [null],
      noiDung: [null],
      ngayNghiemThu: ['', [Validators.required]],
      diaDiem: ['', [Validators.required]],
      danhGia: ['', [Validators.required]],
      tongDiem: ['', [Validators.required]],
      xepLoai: ['', [Validators.required]]
    });
  }

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    // { ma: this.STATUS.DA_DUYET, giaTri: 'Đã duyệt' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_NGHIEM_THU, giaTri: 'Đã nghiệm thu' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      console.log(changes);
    }
  }

  ngOnInit() {
    console.log(this.formThongTinChung);
    if (this.id) {
      this.getDetail(this.id);
    } else {
      this.initForm()
    }
    this.getListCapDt();
  }

  async getDetail(id) {
    let res = await this.khCnCongTrinhNghienCuu.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.trangThaiSave = data.trangThai;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        ngayKy: data.ngayKyTu && data.ngayKyDen ? [data.ngayKyTu, data.ngayKyDen] : null
      })
      this.fileDinhKem = data.fileDinhKem;
      this.fileTienDoTh = data.fileTienDoTh;
      this.fileNghiemThuTl = data.fileNghiemThuTl;
      this.dataTable = data.tienDoThucHien;
      this.dataTable.forEach(item => {
        const tt = this.listTrangThai1.filter(d => d.ma == item.trangThaiTd)
        if (tt.length > 0) {
          item.tenTrangThaiTd = tt[0].giaTri;
        }
      })
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
      return false
    } else {
      return true
    }
  }

  async initForm() {
    this.formData.patchValue({
      trangThai: "00",
      tenTrangThai: "Dự Thảo"
    })
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

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    this.helperService.markFormGroupTouched(this.formData)
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
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {

      if (this.formData.value.trangThai == this.STATUS.DA_NGHIEM_THU) {
        this.formData.controls["ngayNghiemThu"].setValidators([Validators.required]);
        this.formData.controls["diaDiem"].setValidators([Validators.required]);
        this.formData.controls["danhGia"].setValidators([Validators.required]);
        this.formData.controls["tongDiem"].setValidators([Validators.required]);
        this.formData.controls["xepLoai"].setValidators([Validators.required]);
      } else {

        this.formData.controls["ngayNghiemThu"].clearValidators();
        this.formData.controls["diaDiem"].clearValidators();
        this.formData.controls["danhGia"].clearValidators();
        this.formData.controls["tongDiem"].clearValidators();
        this.formData.controls["xepLoai"].clearValidators();
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
      ]

      this.rowItem = new TienDoThucHien();
      this.updateEditCache();
      this.emitDataTable();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }

  onChangeTrangThai(trangThai, typeData?) {
    const tt = this.listTrangThai1.filter(d => d.ma == trangThai)
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
      ]

      this.rowItem1 = new NghiemThuThanhLy();
      this.updateEditCache1();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
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

}
