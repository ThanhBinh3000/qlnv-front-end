import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATEPICKER_CONFIG, LEVEL, LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { dauThauGoiThauService } from 'src/app/services/dauThauGoiThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai, convertVthhToId } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-themmoi-thongtin-dauthau',
  templateUrl: './themmoi-thongtin-dauthau.component.html',
  styleUrls: ['./themmoi-thongtin-dauthau.component.scss']
})
export class ThemmoiThongtinDauthauComponent implements OnInit {

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private danhSachDauThauService: DanhSachDauThauService,
    private modal: NzModalService,
    private userService: UserService,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private routerActive: ActivatedRoute,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private fb: FormBuilder,
    private dauThauGoiThauService: dauThauGoiThauService
  ) {
    this.formGoiThau = this.fb.group({
      idGoiThau: [''],
      tenGoiThau: [''],
      soQdPD: [''],
      ngayQd: [''],
      maDvi: [''],
      tenDvi: [''],
      loaiVthh: [''],
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
      tgianPhanh: ['', [Validators.required]],
      tgianTbao: ['', [Validators.required]],
      tgianDthau: ['', [Validators.required]],
      tgianMthau: ['', [Validators.required]],
      tgianNhang: ['', [Validators.required]],
      soLuong: [''],
      dViTinh: ['Tấn'],
      tgianDongThau: [''],
      tgianMoThau: [''],
      tgianThien: [''],
      giaGoiThau: [''],
      donGia: [''],
      tongTien: [''],
      tChuanCluong: [''],
      ghiChu: [''],
      dgiaHdong: [''],
      VAT: [''],
      dgianHdongSauThue: [''],
      giaHdongSauThue: [''],
      giaHdongTruocThue: ['']
    });
    this.formDauThau = this.fb.group({
      tenDvi: [''],
      soQdPD: [''],
      loaiVthh: ['']
    })
  }
  // timeDefaultValue = setHours(new Date(), 0);
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  visibleTab: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  id: number;
  listNthauNopHs: any[] = [];
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  i = 0;
  listNguonVon: any[] = []
  listPhuongThucDauThau: any[] = []
  listHinhThucDauThau: any[] = []
  listLoaiHopDong: any[] = []
  listVthh: any[] = [];
  formGoiThau: FormGroup
  formDauThau: FormGroup
  isDetail = false;
  dataTable: any[] = [];
  dataDetail: any;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  lastBreadcrumb: string;
  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;

  async ngOnInit() {
    this.spinner.show();
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    try {
      this.userInfo = this.userService.getUserLogin();
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await Promise.all([
        this.phuongThucDauThauGetAll(),
        this.nguonVonGetAll(),
        this.hinhThucDauThauGetAll(),
        this.loaiHopDongGetAll(),
        this.getDetail(),
      ]);
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getDetail() {
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(this.id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dataDetail = res.data;
      this.dataTable = res.data.children1;
      this.formDauThau.patchValue({
        loaiVthh: res.data.loaiVthh,
        soQdPD: res.data.soQd,
        tenDvi: res.data.maDvi
      });
      this.formGoiThau.patchValue({
        loaiVthh: res.data.loaiVthh,
        soQdPD: res.data.soQd,
        pthucLcnt: res.data.pthucLcnt,
        hthucLcnt: res.data.hthucLcnt,
        nguonVon: res.data.nguonVon,
        loaiHdong: res.data.loaiHdong,
        ngayQd: res.data.ngayQd,
        tgianNhang: res.data.tgianNhang,
      });
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  redirectToChiTiet(data) {
    console.log(data);
    this.isDetail = true;
    this.formGoiThau.patchValue({
      idGoiThau: data.id,
      tenGoiThau: data.tenDuAn,
      tenDvi: data.tenDvi,
      maDvi: data.maDvi,
      donGia: data.donGia,
      soLuong: data.soLuong,
      tongTien: data.tongTien,
    });
    this.listNthauNopHs = [{
      tenNhaThau: '',
      maSoThue: '',
      diaChi: '',
      soDt: ''
    }]
    this.updateEditCache();
  }

  quayLaiSearch() {
    let loatVthh = this.router.url.split('/')[4]
    this.router.navigate(['/mua-hang/dau-thau/trienkhai-luachon-nhathau/' + loatVthh + '/thongtin-dauthau']);
  }

  quayLaiDauThau() {
    this.isDetail = false;
  }

  async phuongThucDauThauGetAll() {
    this.listPhuongThucDauThau = [];
    let res = await this.danhMucService.phuongThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = res.data;
    }
  }

  themMoiGoiThau() {
    this.listNthauNopHs.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
  }

  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

  async hinhThucDauThauGetAll() {
    this.listHinhThucDauThau = [];
    let res = await this.danhMucService.hinhThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = res.data;
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  addRow(): void {
    this.listNthauNopHs = [
      ...this.listNthauNopHs,
      {}
    ];
    this.i++;
    this.listNthauNopHs.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
    this.editCache[this.i].edit = true;
  }

  updateEditCache(): void {
    this.listNthauNopHs.forEach((item, index) => {
      this.editCache[index] = {
        edit: true,
        data: { ...item }
      };
    });
  }

  startEdit(index: number): void {
    console.log(index);
    this.editCache[index].edit = true;
  }

  deleteRow(index: number) {
    this.listNthauNopHs = this.listNthauNopHs.filter((d, index) => index !== index);
  }

  cancelEdit(id: any): void {
    const index = this.listNthauNopHs.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listNthauNopHs[index] },
      edit: false
    };
  }

  saveEdit(index: any): void {
    Object.assign(
      this.listNthauNopHs[index],
      this.editCache[index].data,
    );
    this.editCache[index].edit = false;
  }

  async saveDthauGthau() {
    let body = this.formGoiThau.value;
    console.log(body)
    body.detail = this.listNthauNopHs;
    let res = await this.dauThauGoiThauService.create(body);
    console.log(res);
  }

}
