import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/components/base/base.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { KhCnCongTrinhNghienCuu } from 'src/app/services/kh-cn-bao-quan/khCnCongTrinhNghienCuu';
import { Globals } from 'src/app/shared/globals';
import { NghiemThuThanhLyComponent } from './nghiem-thu-thanh-ly/nghiem-thu-thanh-ly.component';
import { ThongTinChungComponent } from './thong-tin-chung/thong-tin-chung.component';
import { TienDoThucHienComponent } from './tien-do-thuc-hien/tien-do-thuc-hien.component';
import * as dayjs from 'dayjs';
@Component({
  selector: 'app-thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan',
  templateUrl: './thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan.component.html',
  styleUrls: ['./thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan.component.scss']
})
export class ThongTinQuanLyCongTrinhNghienCuuBaoQuanComponent extends BaseComponent implements OnInit, OnChanges {

  @ViewChild('thongTinChung') thongTinChungComponent: ThongTinChungComponent;

  @ViewChild('tienDo') tienDoThucHienComponent: TienDoThucHienComponent;

  @ViewChild('nghiemThu') nghiemThuThanhLyComponent: NghiemThuThanhLyComponent;


  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  formThongTinChung: any = {};
  tabSelected: number = 0;

  dataTableTienDo: any[] = []
  dataTable: any[] = []
  listCapDt: any[] = []
  rowItem: any = {};
  listNguonVon: any[] = [];
  fileDinhKem: any[] = [];
  constructor(
    private fb: FormBuilder,
    private danhMucService: DanhMucService,
    private helperService: HelperService,
    public globals: Globals,
    private khCnCongTrinhNghienCuu: KhCnCongTrinhNghienCuu,
    private notification: NzNotificationService,
  ) {
    super();
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [''],
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
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        ngayKy: data.ngayKyTu && data.ngayKyDen ? [data.ngayKyTu, data.ngayKyDen] : null
      })
      this.fileDinhKem = data.fileDinhKems;
      this.dataTableTienDo = data.tienDoThucHien;
      this.dataTable = data.children;
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

  async save() {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;

    body.tienDoThucHien = this.dataTableTienDo;
    body.children = this.dataTable;
    body.ngayKyDen = this.formData.get('ngayKy').value
      ? dayjs(this.formData.get('ngayKy').value[0]).format(
        'YYYY-MM-DD',
      )
      : null,
      body.ngayKyTu = this.formData.get('ngayKy').value
        ? dayjs(this.formData.get('ngayKy').value[1]).format(
          'YYYY-MM-DD',
        )
        : null,
      body.fileDinhKemReq = this.fileDinhKem;
    console.log(body);
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.khCnCongTrinhNghienCuu.update(body);
    } else {
      res = await this.khCnCongTrinhNghienCuu.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        this.quayLai();
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  addRow() {
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = {}
  }

}
