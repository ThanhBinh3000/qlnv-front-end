import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATEPICKER_CONFIG, LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { dauThauGoiThauService } from 'src/app/services/dauThauGoiThau.service';
import { DonviLienQuanService } from 'src/app/services/donviLienquan.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";
import { cloneDeep, chain } from 'lodash';

@Component({
  selector: 'app-themmoi-thongtin-dauthau',
  templateUrl: './themmoi-thongtin-dauthau.component.html',
  styleUrls: ['./themmoi-thongtin-dauthau.component.scss']
})
export class ThemmoiThongtinDauthauComponent implements OnInit {
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private fb: FormBuilder,
    private dauThauGoiThauService: dauThauGoiThauService,
    private donviLienQuanService: DonviLienQuanService,
  ) {
    this.formData = this.fb.group({
      id: [''],
      namKhoach: [''],
      soQd: [],
      soQdCc: [],
      soQdPdKq: [],


      tenDuAn: [],
      tenDvi: [],
      maDvi: [],

      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],

      tgianBdauTchuc: [null],

      tgianDthau: [null],
      tgianMthau: [null],

      idGoiThau: [''],
      tenGthau: [''],
      soQdPdKhlcnt: [''],
      ngayQdPdKhlcnt: [''],

      tenVthh: [''],
      dviTinh: [''],
      soLuong: [''],
      donGia: [''],
      tongTien: [''],
      tchuanCluong: [''],
      nguonVon: [''],
      hthucLcnt: [''],
      pthucLcnt: [''],
      loaiHdong: [''],
      tgianThienHd: [''],
      tgianNhang: [''],
      ngayKyBban: ['', [Validators.required]],
      idNhaThau: ['', [Validators.required]],
      donGiaTrcVat: ['', [Validators.required]],
      vat: ['', [Validators.required]],
      donGiaSauVat: [''],
      tongTienSauVat: [''],
      tongTienTrcVat: [''],
      ghiChu: ['',],
      diaDiemNhap: [],
      trangThai: ['']
    });
  }

  STATUS = STATUS
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
  formData: FormGroup
  isDetail = false;
  dataTable: any[] = [];
  dataDetail: any;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  listOfData: any[] = [];
  listDataGroup: any[] = [];


  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;

  async ngOnInit() {
    this.spinner.show();
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    try {
      this.userInfo = this.userService.getUserLogin();
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
    const res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(this.idInput);
    if (res.msg == MESSAGE.SUCCESS) {
      const dataDetail = res.data;
      const dataLogin = dataDetail.hhQdKhlcntDtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
      this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
      this.listOfData = dataLogin[0].dsGoiThau;
      this.convertListData()
      // const isVatTu = !!dataDetail.loaiVthh;
      // // Trang thái đã cập nhập thông tin gói thầu hoặc hoàn thành cập nhập tt gt
      // if (dataDetail.trangThai == STATUS.CHUA_CAP_NHAT) {
      //   this.formData.patchValue({
      //     idGoiThau: dataDetail.id,
      //     tenGthau: dataDetail.goiThau,
      //     loaiVthh: isVatTu ? dataDetail.loaiVthh : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.loaiVthh,
      //     tenVthh: isVatTu ? dataDetail.tenLoaiVthh : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tenLoaiVthh,
      //     cloaiVthh: isVatTu ? dataDetail.cloaiVthh : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.cloaiVthh,
      //     tenCloaiVthh: isVatTu ? dataDetail.tenCloaiVthh : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tenCloaiVthh,
      //     soQdPdKhlcnt: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.soQd,
      //     ngayQdPdKhlcnt: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.ngayQd,
      //     maDvi: dataDetail.hhQdKhlcntDtl.maDvi,
      //     tenDvi: dataDetail.hhQdKhlcntDtl.tenDvi,
      //     dviTinh: dataDetail.dviTinh,
      //     tchuanCluong: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tchuanCluong,
      //     pthucLcnt: isVatTu ? dataDetail.pthucLcnt : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.pthucLcnt,
      //     hthucLcnt: isVatTu ? dataDetail.hthucLcnt : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.hthucLcnt,
      //     nguonVon: isVatTu ? dataDetail.nguonVon : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.nguonVon,
      //     donGia: dataDetail.donGia,
      //     soLuong: dataDetail.soLuong,
      //     tongTien: dataDetail.thanhTien,
      //     tgianThienHd: isVatTu ? dataDetail.tgianThienHd : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianThienHd,
      //     loaiHdong: isVatTu ? dataDetail.loaiHdong : dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.loaiHdong,
      //     tgianNhang: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianNhang,
      //     tgianDthau: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianDthau,
      //     tgianMthau: dataDetail.hhQdKhlcntDtl.hhQdKhlcntHdr.tgianMthau,
      //     diaDiemNhap: dataDetail.children,
      //     trangThai: dataDetail.trangThai,
      //     ghiChu: dataDetail.ghiChu
      //   });
      // } else {
      //   const res = await this.dauThauGoiThauService.chiTietByGoiThauId(this.idInput);
      //   const dataThongTinGt = res.data;
      //   this.listNthauNopHs = dataThongTinGt.nthauDuThauList;
      //   this.formData.patchValue({
      //     id: dataThongTinGt.id,
      //     idGoiThau: dataThongTinGt.idGoiThau,
      //     tenGthau: dataThongTinGt.tenGthau,
      //     loaiVthh: dataThongTinGt.loaiVthh,
      //     tenVthh: dataThongTinGt.tenVthh,
      //     cloaiVthh: dataThongTinGt.cloaiVthh,
      //     tenCloaiVthh: dataThongTinGt.tenCloaiVthh,
      //     soQdPdKhlcnt: dataThongTinGt.soQdPdKhlcnt,
      //     ngayQdPdKhlcnt: dataThongTinGt.ngayQdPdKhlcnt,
      //     maDvi: dataDetail.hhQdKhlcntDtl.maDvi,
      //     tenDvi: dataDetail.hhQdKhlcntDtl.tenDvi,
      //     dviTinh: dataThongTinGt.dviTinh,
      //     tchuanCluong: dataThongTinGt.tchuanCluong,
      //     pthucLcnt: dataThongTinGt.pthucLcnt,
      //     hthucLcnt: dataThongTinGt.hthucLcnt,
      //     nguonVon: dataThongTinGt.nguonVon,
      //     donGia: dataThongTinGt.donGia,
      //     soLuong: dataThongTinGt.soLuong,
      //     tongTien: dataThongTinGt.tongTien,
      //     tgianThienHd: dataThongTinGt.tgianThienHd,
      //     loaiHdong: dataThongTinGt.loaiHdong,
      //     tgianNhang: dataThongTinGt.tgianNhang,
      //     tgianDthau: dataThongTinGt.tgianDthau,
      //     tgianMthau: dataThongTinGt.tgianMthau,
      //     trangThai: dataDetail.trangThai,
      //     ngayKyBban: dataThongTinGt.ngayKyBban,
      //     vat: dataThongTinGt.vat,
      //     donGiaTrcVat: dataThongTinGt.donGiaTrcVat,
      //     idNhaThau: dataThongTinGt.idNhaThau,
      //     diaDiemNhap: dataThongTinGt.diaDiemNhapList,
      //     ghiChu: dataThongTinGt.ghiChu
      //   });
      // }
      // if (isVatTu) {
      //   dataDetail.children.forEach(item => {
      //     this.listDiaDiemNhapHang = [...this.listDiaDiemNhapHang, {
      //       tenDvi: item.tenDvi,
      //       noiDung: item.soLuong
      //     }]
      //   });
      // } else {
      //   let stringConcat = ''
      //   dataDetail.children.forEach(item => {
      //     stringConcat = stringConcat + item.tenDiemKho + "(" + item.soLuong + "), "
      //   });
      //   this.listDiaDiemNhapHang = [...this.listDiaDiemNhapHang, {
      //     tenDvi: dataDetail.tenDvi,
      //     noiDung: stringConcat.substring(0, stringConcat.length - 2)
      //   }]
      // }
      // this.calendarGia();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  convertListData() {
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
  }


  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
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

  quayLai() {
    this.showListEvent.emit();
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
    this.listNthauNopHs.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
    console.log(this.listNthauNopHs);
    this.clearItemRow();
  }

  clearItemRow() {
    this.itemRow = {};
    this.itemRow.id = null;
  }

  // updateEditCache(): void {
  //   this.listNthauNopHs.forEach((item, index) => {
  //     this.editCache[index] = {
  //       edit: true,
  //       data: { ...item }
  //     };
  //   });
  //   this.listDiaDiemNhapHang.forEach((item, index) => {
  //     this.editDiaDiemCache[index] = {
  //       edit: true,
  //       data: { ...item }
  //     };
  //   });
  // }

  startEdit(index: number): void {
    this.editCache[index].edit = true;
  }

  deleteRow(i) {
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
  pipe = new DatePipe('en-US');

  async save(trangThaiLuu) {
    this.spinner.show()
    if (trangThaiLuu == STATUS.HOAN_THANH_CAP_NHAT) {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
        this.spinner.hide()
        return;
      }
    }
    let body = this.formData.value;
    body.tgianDthau = this.pipe.transform(body.tgianDthau, 'yyyy-MM-dd HH:mm')
    body.tgianMthau = this.pipe.transform(body.tgianMthau, 'yyyy-MM-dd HH:mm')
    body.nthauDuThauList = this.listNthauNopHs;
    body.trangThaiLuu = trangThaiLuu
    let res = await this.dauThauGoiThauService.create(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        this.spinner.hide()
        this.quayLai();
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.spinner.hide()
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  calendarGia() {
    let donGia = this.formData.get('donGiaTrcVat').value;
    let VAT = this.formData.get('vat').value;
    let soLuong = this.formData.get('soLuong').value;
    if (donGia >= 0 && VAT >= 0) {
      this.formData.patchValue({
        donGiaSauVat: (donGia + (donGia * VAT / 100)),
        tongTienTrcVat: donGia * soLuong,
        tongTienSauVat: (donGia + (donGia * VAT / 100)) * soLuong,
      })
    }
  }

  changeNhaThau(event) {
    let data = this.listNhaThau.filter(item => item.id === event);
    this.itemRow.idNhaThau = event;
    this.itemRow.tenDvi = data[0].tenDvi;
    this.itemRow.mst = data[0].mst;
    this.itemRow.diaChi = data[0].diaChi;
    this.itemRow.sdt = data[0].sdt;
    this.itemRow.version = data[0].version;
  }

  async showDetail($event, dataGoiThau : any) {
    await this.spinner.show();
    console.log(dataGoiThau);
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    await this.spinner.hide();
  }

}
