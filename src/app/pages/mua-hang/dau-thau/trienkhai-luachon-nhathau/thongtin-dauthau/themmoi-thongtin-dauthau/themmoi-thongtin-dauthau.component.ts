import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATEPICKER_CONFIG, LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { dauThauGoiThauService } from 'src/app/services/dauThauGoiThau.service';
import { DonviLienQuanService } from 'src/app/services/donviLienquan.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-themmoi-thongtin-dauthau',
  templateUrl: './themmoi-thongtin-dauthau.component.html',
  styleUrls: ['./themmoi-thongtin-dauthau.component.scss']
})
export class ThemmoiThongtinDauthauComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() idInput: number;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private danhSachDauThauService: DanhSachDauThauService,
    private modal: NzModalService,
    public userService: UserService,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private routerActive: ActivatedRoute,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private fb: FormBuilder,
    private dauThauGoiThauService: dauThauGoiThauService,
    private donviLienQuanService: DonviLienQuanService
  ) {
    this.formGoiThau = this.fb.group({
      idGoiThau: [''],
      tenGoiThau: [''],
      soQdPdKhlcnt: [''],
      ngayQdKhlcnt: [''],
      maDvi: [''],
      tenDvi: [''],
      loaiVthh: [''],
      tenVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      dViTinh: [''],
      soLuong: [''],
      donGia: [''],
      thanhTien: [''],
      tChuanCluong: [''],
      nguonVon: [''],
      hthucLcnt: [''],
      pthucLcnt: [''],
      loaiHdong: [''],
      tgianThienHd: [''],
      tgianDthau: [''],
      tgianMthau: [''],
      tgianNhang: [''],
      ngayKyBban: [''],
      idNhaThau: [''],
      ghiChu: [''],
      giaHdongTrcVAT: [''],
      VAT: [''],
      dgianHdongSauThue: [''],
      giaHdongSauThue: [''],
    });
  }

  itemRow: any = {};
  // timeDefaultValue = setHours(new Date(), 0);
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  visibleTab: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  id: number;
  listNthauNopHs: any[] = [];
  listDiaDiemNhapHang: any[] = [];
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  editDiaDiemCache: { [key: string]: { edit: boolean; data: any } } = {};
  i = 0;
  listNguonVon: any[] = []
  listPhuongThucDauThau: any[] = []
  listHinhThucDauThau: any[] = []
  listLoaiHopDong: any[] = []
  listNhaThau: any[] = []
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
      // this.id = +this.routerActive.snapshot.paramMap.get('id');
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
        this.loaiDonviLienquanAll(),
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
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetailGoiThau(this.idInput);
    if (res.msg == MESSAGE.SUCCESS) {
      const dataDetail = res.data;
      console.log(dataDetail);
      this.formGoiThau.patchValue({
        tenGoiThau: dataDetail.goiThau,
        loaiVthh: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.loaiVthh,
        tenVthh: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tenVthh,
        cloaiVthh: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.cloaiVthh,
        tenCloaiVthh: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tenCloaiVthh,
        soQdPdKhlcnt: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.soQd,
        ngayQdPdKhlcnt: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.ngayQd,
        maDvi: dataDetail.hhQdKhlcntDtl.maDvi,
        tenDvi: dataDetail.hhQdKhlcntDtl.tenDvi,
        dviTinh: dataDetail.dviTinh,
        tchuanCluong: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tchuanCluong,
        pthucLcnt: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.pthucLcnt,
        hthucLcnt: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.hthucLcnt,
        nguonVon: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.nguonVon,
        donGia: dataDetail.donGia,
        soLuong: dataDetail.soLuong,
        thanhTien: dataDetail.thanhTien,
        tgianThienHd: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianThienHd,
        loaiHdong: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.loaiHdong,
        tgianNhang: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianNhang,
        tgianDthau: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianDthau,
        tgianMthau: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianMthau,
      });
      let stringConcat = ''
      dataDetail.children.forEach(item => {
        stringConcat = stringConcat + item.tenDiemKho + "(" + item.soLuong + "), "
      });
      this.listDiaDiemNhapHang = [...this.listDiaDiemNhapHang, {
        tenDvi: dataDetail.tenDvi,
        noiDung: stringConcat.substring(0, stringConcat.length - 2)
      }]
      console.log(stringConcat);
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
      ten: '',
      soThue: '',
      diaChi: '',
      soDt: ''
    }]
    this.listDiaDiemNhapHang = [{
      maDvi: '',
      maDiemKho: '',
      maKho: '',
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

  async loaiDonviLienquanAll() {
    this.listNhaThau = [];
    const body = {
      "typeDvi": "NT"
    };
    let res = await this.donviLienQuanService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNhaThau = res.data;
    }
  }

  addRow(): void {
    this.listNthauNopHs = [
      ...this.listNthauNopHs,
      this.itemRow
    ];
    this.i++;
    this.listNthauNopHs.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
    this.editCache[this.i].edit = true;
    this.clearItemRow();
  }

  clearItemRow() {
    this.itemRow = {};
    this.itemRow.id = null;
  }

  updateEditCache(): void {
    this.listNthauNopHs.forEach((item, index) => {
      this.editCache[index] = {
        edit: true,
        data: { ...item }
      };
    });
    this.listDiaDiemNhapHang.forEach((item, index) => {
      this.editDiaDiemCache[index] = {
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
    body.children = this.listNthauNopHs;
    let res = await this.dauThauGoiThauService.create(body);
    console.log(res);
  }

  calendarGia() {
    let donGia = this.formGoiThau.get('donGia').value;
    let VAT = this.formGoiThau.get('VAT').value;
    let soLuong = this.formGoiThau.get('soLuong').value;
    if (donGia >= 0 && VAT >= 0) {
      this.formGoiThau.patchValue({
        dgianHdongSauThue: (donGia + (donGia * VAT / 100)),
        giaHdongTruocThue: donGia * soLuong,
        giaHdongSauThue: (donGia + (donGia * VAT / 100)) * soLuong,
      })
    }
  }

  changeNhaThau(event) {
    console.log(event);
    let data = this.listNhaThau.filter(item => item.id === event);
    this.itemRow.id = event.id;
    this.itemRow.tenDvi = data[0].tenDvi;
    this.itemRow.mst = data[0].mst;
    this.itemRow.diaChi = data[0].diaChi;
    this.itemRow.sdt = data[0].sdt;
  }

}
