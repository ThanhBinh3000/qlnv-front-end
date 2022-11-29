import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATEPICKER_CONFIG, LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { dauThauGoiThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import { DonviLienQuanService } from 'src/app/services/donviLienquan.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";
import { cloneDeep, chain } from 'lodash';
import {
  ThongTinDauThauService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service";
import { NzModalService } from "ng-zorro-antd/modal";

@Component({
  selector: 'app-themmoi-thongtin-dauthau',
  templateUrl: './themmoi-thongtin-dauthau.component.html',
  styleUrls: ['./themmoi-thongtin-dauthau.component.scss']
})
export class ThemmoiThongtinDauthauComponent implements OnInit, OnChanges {
  @Input() idInput: number;
  @Input() loaiVthh: String;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isShowFromKq: boolean;


  constructor(
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private fb: FormBuilder,
    // private dauThauGoiThauService: dauThauGoiThauService,
    private thongTinDauThauService: ThongTinDauThauService,
    private donviLienQuanService: DonviLienQuanService,
  ) {
    this.formData = this.fb.group({
      namKhoach: [''],
      soQdPdKhlcnt: [],
      soQdPdKqLcnt: [],
      tenDuAn: [],
      tenDvi: [],
      tongMucDt: [],
      tongMucDtGoiTrung: [],
      nguonVon: [''],
      tenNguonVon: [''],
      hthucLcnt: [''],
      tenHthucLcnt: [],
      pthucLcnt: [''],
      tenPthucLcnt: [],
      loaiHdong: [''],
      tenLoaiHdong: [''],
      tgianBdauTchuc: [],
      tgianDthau: [],
      tgianMthau: [],
      tgianNhang: [''],
      gtriDthau: [],
      gtriHdong: [],
      donGiaVat: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      soGthau: [],
      soGthauTrung: [],
      soGthauTruot: [],
      soLuong: [''],
      donGia: [''],
      tongTien: [''],
      vat: ['5'],
      ghiChu: ['',],
      trangThai: [''],
      tenTrangThai: ['']
    });
  }
  idGoiThau: number = 0;
  STATUS = STATUS
  itemRow: any = {};
  itemRowUpdate: any = {};

  listNthauNopHs: any[] = [];
  i = 0;
  listNguonVon: any[] = []
  listPhuongThucDauThau: any[] = []
  listHinhThucDauThau: any[] = []
  listLoaiHopDong: any[] = []
  listNhaThau: any[] = []
  listStatusNhaThau: any[] = []
  listVthh: any[] = [];
  formData: FormGroup
  dataTable: any[] = [];
  dataDetail: any;

  danhsachDx: any[] = [];
  listOfData: any[] = [];
  listDataGroup: any[] = [];


  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;

  async ngOnInit() {
    this.spinner.show();
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadDataComboBox(),
        // Đã có hàm onchange r
        // this.getDetail(),
      ]);
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (this.idInput) {
        this.getDetail()
      }
    }
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // phương thức đấu thầu
    this.listPhuongThucDauThau = [];
    let resPt = await this.danhMucService.danhMucChungGetAll('PT_DTHAU');
    if (resPt.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = resPt.data;
    }
    // hình thức đấu thầu
    this.listHinhThucDauThau = [];
    let resPtdt = await this.danhMucService.danhMucChungGetAll('HT_LCNT');
    if (resPtdt.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = resPtdt.data;
    }
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
    this.listNhaThau = [];
    let resNt = await this.donviLienQuanService.getAll({ "typeDvi": "NT" });
    if (resNt.msg == MESSAGE.SUCCESS) {
      this.listNhaThau = resNt.data;
    }
    this.listStatusNhaThau = [
      {
        value: STATUS.TRUNG_THAU,
        text: 'Trúng thầu'
      }, {
        value: STATUS.HUY_THAU,
        text: 'Hủy thầu'
      }, {
        value: STATUS.TRUOT_THAU,
        text: 'Trượt thầu'
      }
    ];
  }

  async getDetail() {
    this.spinner.show();
    if (this.loaiVthh.startsWith('02')) {
      await this.detailVatTu();
    } else {
      await this.detailLuongThuc();
    }

    this.spinner.hide();
  }

  async detailVatTu() {
    const res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(this.idInput);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.formData.patchValue({
        trangThai: data.trangThaiDt,
        tenTrangThai: data.tenTrangThaiDt,
      })
      this.danhsachDx = data.children;
    }
  }

  async detailLuongThuc() {
    const res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetailDtlCuc(this.idInput);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      let tongMucDtTrung = 0
      data.children.forEach(item => {
        if (item.trangThai == STATUS.THANH_CONG) {
          tongMucDtTrung += item.soLuong * item.donGiaNhaThau * 1000
        }
      })
      this.formData.patchValue({
        namKhoach: data.hhQdKhlcntHdr.namKhoach,
        soQdPdKhlcnt: data.hhQdKhlcntHdr.soQd,
        soQdPdKqLcnt: data.soQdPdKqLcnt,
        tenDuAn: data.tenDuAn,
        tenDvi: data.tenDvi,
        tongMucDt: '',
        tongMucDtGoiTrung: tongMucDtTrung,
        tenNguonVon: data.hhQdKhlcntHdr.tenNguonVon,
        tenHthucLcnt: data.hhQdKhlcntHdr.tenHthucLcnt,
        tenPthucLcnt: data.hhQdKhlcntHdr.tenPthucLcnt,
        tenLoaiHdong: data.hhQdKhlcntHdr.tenLoaiHdong,
        hthucLcnt: data.dxuatKhLcntHdr.hthucLcnt,
        pthucLcnt: data.dxuatKhLcntHdr.pthucLcnt,
        loaiHdong: data.dxuatKhLcntHdr.loaiHdong,
        gtriDthau: data.dxuatKhLcntHdr.gtriDthau,
        gtriHdong: data.dxuatKhLcntHdr.gtriHdong,
        donGiaVat: data.dxuatKhLcntHdr.donGiaVat,
        soLuong: data.soLuong,
        soGthau: data.soGthau,
        soGthauTrung: data.soGthauTrung,
        loaiVthh: data.hhQdKhlcntHdr.loaiVthh,
        tenLoaiVthh: data.hhQdKhlcntHdr.tenLoaiVthh,
        tenCloaiVthh: data.hhQdKhlcntHdr.tenCloaiVthh,
        tgianBdauTchuc: data.dxuatKhLcntHdr.tgianBdauTchuc,
        tgianDthau: data.dxuatKhLcntHdr.tgianDthau,
        tgianMthau: data.dxuatKhLcntHdr.tgianMthau,
        tgianNhang: data.dxuatKhLcntHdr.tgianNhang,
      });
      this.formData.patchValue({
        trangThai: data.trangThai,
        tenTrangThai: data.tenTrangThai
      })
      this.listOfData = data.children;
      this.convertListData()
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


  pipe = new DatePipe('en-US');
  async save() {
    await this.spinner.show();
    if (this.loaiVthh.startsWith("02")) {
      let filter = this.danhsachDx.filter(item => item.trangThai == STATUS.CHUA_CAP_NHAT);
      if (filter.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Vui lòng cập nhật thông tin các gói thầu");
        await this.spinner.hide();
        return
      }
    } else {
      let filter = this.listOfData.filter(item => item.trangThai == STATUS.CHUA_CAP_NHAT);
      if (filter.length > 0) {
        this.notification.error(MESSAGE.ERROR, "Vui lòng cập nhật thông tin các gói thầu");
        await this.spinner.hide();
        return
      }
    }

    let body = {
      id: this.idInput,
      trangThai: STATUS.HOAN_THANH_CAP_NHAT,
      loaiVthh: this.loaiVthh
    }
    let res = await this.thongTinDauThauService.approve(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      await this.spinner.hide()
      this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide()
  }



  async saveGoiThau() {
    await this.spinner.show()
    let body = {
      idGoiThau: this.idGoiThau,
      nthauDuThauList: this.listNthauNopHs,
      loaiVthh: this.loaiVthh
    }
    let res = await this.thongTinDauThauService.create(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      await this.getDetail()
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide()
  }

  async showDetail($event, dataGoiThau: any) {
    await this.spinner.show();
    this.listNthauNopHs = [];
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')

    this.idGoiThau = dataGoiThau.id;
    let res = await this.thongTinDauThauService.getDetailThongTin(this.idGoiThau, this.loaiVthh);
    if (res.msg == MESSAGE.SUCCESS) {
      this.itemRow.soLuong = dataGoiThau.soLuong;
      this.listNthauNopHs = res.data;
      this.listNthauNopHs.forEach(item => {
        item.edit = false;
      })
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    await this.spinner.hide();
  }

  changeTrangThai($event) {
    let trangThai = this.listStatusNhaThau.filter(item => item.value == $event);
    this.itemRow.tenTrangThai = trangThai[0].text;
    this.itemRowUpdate.tenTrangThai = trangThai[0].text;
  }

  addRow(): void {
    if (this.validateItemSave(this.itemRow)) {
      this.listNthauNopHs = [
        ...this.listNthauNopHs,
        this.itemRow
      ];
      this.clearItemRow();
    }
  }

  clearItemRow() {
    let soLuong = this.itemRow.soLuong;
    this.itemRow = {};
    this.itemRow.soLuong = soLuong;
    this.itemRow.id = null;
  }

  deleteRow(i) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.listNthauNopHs.splice(i, 1)
      },
    });
  }

  startEdit(index: number): void {
    this.listNthauNopHs[index].edit = true;
    this.itemRowUpdate = cloneDeep(this.listNthauNopHs[index]);
  }

  cancelEdit(index: number): void {
    this.listNthauNopHs[index].edit = false;
  }

  saveEdit(dataUpdate, index: any): void {
    if (this.validateItemSave(this.itemRowUpdate, index)) {
      this.listNthauNopHs[index] = this.itemRowUpdate;
      this.listNthauNopHs[index].edit = false;
    };

  }

  validateItemSave(dataSave, index?): boolean {
    if (dataSave.tenNhaThau && dataSave.mst && dataSave.diaChi && dataSave.sdt && dataSave.donGia && dataSave.trangThai) {
      if (dataSave.trangThai == STATUS.TRUNG_THAU) {
        let filter = this.listNthauNopHs.filter(item => item.trangThai == STATUS.TRUNG_THAU);
        if (filter.length > 0) {
          if (index) {
            let indexFilter = this.listNthauNopHs.indexOf(filter[0]);
            if (index != indexFilter) {
              this.notification.error(MESSAGE.ERROR, "Trạng thái trúng thầu đã tồn tại, xin vui lòng thay đổi trạng thái bản ghi")
              return false
            }
            return true
          } else {
            this.notification.error(MESSAGE.ERROR, "Trạng thái trúng thầu đã tồn tại, xin vui lòng thay đổi trạng thái bản ghi")
            return false
          }

        }
        return true;
      }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, "Xin vui lòng điền đủ thông tin");
      return false;
    }
  }

  checkRoleData() {
    if (this.userService.isCuc() && !this.loaiVthh.startsWith('02')) {
      return true;
    }
    if (this.userService.isTongCuc() && this.loaiVthh.startsWith('02')) {
      return true
    }
  }

  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }


  expandSet3 = new Set<number>();
  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
    }
  }

}
