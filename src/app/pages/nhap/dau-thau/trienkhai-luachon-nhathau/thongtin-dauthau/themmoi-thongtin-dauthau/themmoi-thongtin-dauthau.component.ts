import { DatePipe, formatDate } from '@angular/common';
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
import {
  DialogThongBaoThongTinDauThauComponent
} from "../../../../../../components/dialog/dialog-thong-bao-thong-tin-dau-thau/dialog-thong-bao-thong-tin-dau-thau.component";
import {PREVIEW} from "../../../../../../constants/fileType";
import { saveAs } from "file-saver";
import printJS from "print-js";
import {CurrencyMaskInputMode} from "ngx-currency";
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
  @Input() isView: boolean;
  @Input() isKqDaBh: boolean;
  @Input() titleThongTinChung: string = 'THÔNG TIN CHUNG';
  @Input() listIdGthau: any[] = [];
  reportTemplate: any = {
    typeFile: "",
    fileName: "thong_tin_dau_thau_lt.docx",
    tenBaoCao: "",
    trangThai: ""
  };
  showDlgPreview = false;
  daCoKqLcnt = false;
  pdfSrc: any;
  wordSrc: any;
  printSrc: any;
  fileDinhKems: any[] = [];
  itemRowQd: any[] = [];

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
      tenTrangThai: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      // tgianTrinhKqTcg: [''],
      // tgianTrinhTtd: [''],
      ghiChuTtdt: [''],
    });
  }
  idGoiThau: number = 0;
  acceptSave: boolean = false;
  STATUS = STATUS
  itemRow: any = {};
  itemRowUpdate: any = {};
  soLuongTheoChiTieu: any[] = [];
  soLuongDaMua: any[] = [];
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
  sumDataSoLuong: any[] = [];

  danhsachDx: any[] = [];
  listOfData: any[] = [];
  listDataDetail: any[] = [];
  listData: any[] = [];
  listDataCuc: any[] = [];
  listDataChiCuc: any[] = [];
  listDataDiemKho: any[] = [];
  donGiaVatObject: any;
  selected: boolean = false;
  dsTrangThai: any[] = [
    {
      value: this.STATUS.THANH_CONG,
      text: 'Thành công'
    }, {
      value: this.STATUS.THAT_BAI,
      text: 'Thất bại'
    }, {
      value: this.STATUS.HUY_THAU,
      text: 'Hủy thầu'
    }
  ];
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
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
    let resHd = await this.danhMucService.danhMucChungGetAll('HINH_THUC_HOP_DONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
    this.listNhaThau = [];
    let resNt = await this.thongTinDauThauService.getDanhSachNhaThau();
    if (resNt.msg == MESSAGE.SUCCESS) {
      const uniqueKeyMap = new Map();
      for (const obj of resNt.data) {
        const key = `${obj.tenNhaThau}`;
        if (uniqueKeyMap.has(key)) {
          const existingObj = uniqueKeyMap.get(key);
          existingObj.someProperty += obj.someProperty;
        } else {
          uniqueKeyMap.set(key, obj);
        }
      }
      this.listNhaThau = Array.from(uniqueKeyMap.values());
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
    await this.detailLuongThuc();
    this.spinner.hide();
  }

  async detailLuongThuc() {
    const res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetailDtlCuc(this.idInput);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.donGiaVatObject = res.data
      let tongMucDtTrung = 0
      let tongMucDt = 0
      let slGthauTrung  = 0
      let indexGthau = 0
      if (this.isShowFromKq) {
        if (this.listIdGthau != null && this.listIdGthau.length > 0) {
          this.listOfData = data.children.filter(item => this.listIdGthau.includes(item.id))
        }
      } else {
        this.listOfData = data.children;
      }
      for (let i = 0; i < this.listOfData.length; i++) {
        if (this.idGoiThau > 0 && this.idGoiThau == this.listOfData[i].id) {
          indexGthau = i;
        }
        if ( this.listOfData[i].trangThaiDt == STATUS.THANH_CONG) {
          slGthauTrung += 1
          tongMucDtTrung +=  this.listOfData[i].soLuong *  this.listOfData[i].donGiaNhaThau
        }
        let tongThanhTien = 0;
        for (let j = 0; j < this.listOfData[i].children.length; j++) {
          tongThanhTien += this.listOfData[i].children[j].soLuong * this.listOfData[i].children[j].donGia
          tongMucDt += this.listOfData[i].children[j].soLuong * this.listOfData[i].children[j].donGia
          this.expandSet2.add(j)
        }
        this.listOfData[i].thanhTien = tongThanhTien * 1000
        this.expandSet.add(i)
      }
      this.formData.patchValue({
        namKhoach: data.hhQdKhlcntHdr?.namKhoach,
        soQdPdKhlcnt: data.hhQdKhlcntHdr?.soQd,
        soQdPdKqLcnt: data.soQdPdKqLcnt,
        tenDuAn: data.tenDuAn,
        tenDvi: data.tenDvi,
        tongMucDt: tongMucDt * 1000,
        tongMucDtGoiTrung: tongMucDtTrung * 1000,
        tenNguonVon: data.dxuatKhLcntHdr?.tenNguonVon,
        tenHthucLcnt: data.dxuatKhLcntHdr?.tenHthucLcnt,
        tenPthucLcnt: data.dxuatKhLcntHdr?.tenPthucLcnt,
        tenLoaiHdong: data.dxuatKhLcntHdr?.tenLoaiHdong,
        hthucLcnt: data.dxuatKhLcntHdr?.hthucLcnt,
        pthucLcnt: data.dxuatKhLcntHdr?.pthucLcnt,
        loaiHdong: data.dxuatKhLcntHdr?.loaiHdong,
        gtriDthau: data.dxuatKhLcntHdr?.gtriDthau,
        gtriHdong: data.dxuatKhLcntHdr?.gtriHdong,
        donGiaVat: data.dxuatKhLcntHdr?.donGiaVat,
        soLuong: data.soLuong,
        soGthau: data.soGthau,
        soGthauTrung: slGthauTrung,
        loaiVthh: data.hhQdKhlcntHdr?.loaiVthh,
        tenLoaiVthh: data.hhQdKhlcntHdr?.tenLoaiVthh,
        cloaiVthh: data.hhQdKhlcntHdr?.cloaiVthh,
        tenCloaiVthh: data.hhQdKhlcntHdr?.tenCloaiVthh,
        tgianBdauTchuc: formatDate(data.tgianBdauTchuc, "dd/MM/yyyy", 'en-US'),
        tgianDthau: formatDate(data.tgianDthau, "HH:mm dd/MM/yyyy", 'en-US'),
        tgianMthau: formatDate(data.tgianMthau, "HH:mm dd/MM/yyyy", 'en-US'),
        tgianNhang: formatDate(data.tgianNhang, "dd/MM/yyyy", 'en-US'),
        tenLoaiHinhNx: data.dxuatKhLcntHdr?.tenLoaiHinhNx,
        tenKieuNx: data.dxuatKhLcntHdr?.tenKieuNx,
      });
      this.formData.patchValue({
        trangThai: data.trangThai,
        tenTrangThai: data.tenTrangThai
      })
      this.showDetail(event, this.listOfData[indexGthau])
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  convertListData() {
    this.listDataChiCuc = [];
    this.listDataCuc = [];
    this.listDataDetail = [];
    this.listDataDiemKho = [];
    this.listData = [];
    this.listOfData.forEach(item => {
      this.listDataCuc.push(item)
      item.children.forEach(i => {
        this.listDataChiCuc.push(i)
      })
    })
    this.listDataChiCuc = chain(this.listDataChiCuc).groupBy('idGoiThau').value()
    let filteredChildren = null;
    this.listDataCuc.forEach(item => {
      if (this.listDataChiCuc[item.id] != undefined) {
        for (let i = 0; i < this.listDataChiCuc[item.id].length; i++) {
          if (item.id == this.listDataChiCuc[item.id][i].idGoiThau) {
            this.soLuongTheoChiTieu.push(this.listDataChiCuc[item.id][i].soLuongTheoChiTieu);
            this.soLuongDaMua.push(this.listDataChiCuc[item.id][i].soLuongDaMua);
            this.listData.push({ tenDvi: this.listDataChiCuc[item.id][i].tenDvi, dataChild: item })
          }
        }
      }
    })
    const groupedData = chain(this.listData)
      .groupBy('tenDvi')
      .value();
    console.log("groupedData - ", groupedData)
    this.listDataDetail = Object.keys(groupedData).map(tenDvi => ({
      tenDvi: tenDvi,
      dataChild: groupedData[tenDvi].flatMap(item => item.dataChild),
      soLuongTheoChiTieu: this.soLuongTheoChiTieu,
      soLuongDaMua: this.soLuongDaMua
    }));
    this.listDataDetail.forEach(item => {
      item.dataChild = item.dataChild.filter((value, index, self) => {
        return self.findIndex(v => v.id === value.id) === index;
      });
      // item.dataChild.forEach(res =>{
      //   filteredChildren = res.children.filter(child => child.tenDvi === item.tenDvi);
      //   item.dataChild[res.index]
      //   res.children = filteredChildren
      // })
    });
    console.log(this.listDataDetail)
  }


  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  sumSluong(data: any) {
    this.sumDataSoLuong = []
    data.forEach(item => {
      if (item.soLuong) {

      }
    })
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
    for (const data of this.listOfData) {{
      let res = await this.thongTinDauThauService.getDetailThongTin(data.id, this.loaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data.dsNhaThauDthau == null || res.data.dsNhaThauDthau.length == 0) {
          this.notification.error(MESSAGE.ERROR, data.goiThau + ' chưa cập nhật danh sách nhà thầu.');
          return;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, 'Lấy danh sách nhà thầu nộp hồ sơ thất bại.');
        return;
      }
    }}
    await this.spinner.show();
    this.pheDuyet()
    await this.spinner.hide()
  }


  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn hoàn thành cập nhật ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: STATUS.HOAN_THANH_CAP_NHAT,
            loaiVthh: this.loaiVthh
          }

          let res = await this.thongTinDauThauService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async saveGoiThauPopup() {
    await this.spinner.show()
    if (!this.acceptSave) {
      this.notification.warning(MESSAGE.WARNING, 'Bạn cần tạo và ban hành QĐ Phê duyệt HSMT cho gói thầu trước.')
      await this.spinner.hide()
      return;
    }
    let body = {
      idGoiThau: this.idGoiThau,
      ghiChuTtdt: this.formData.value.ghiChuTtdt,
      // tgianTrinhKqTcg: this.formData.value.tgianTrinhKqTcg,
      // tgianTrinhTtd: this.formData.value.tgianTrinhTtd,
      fileDinhKems: this.fileDinhKems,
      loaiVthh: this.loaiVthh
    }
    let res = await this.thongTinDauThauService.updateGoiThau(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    if (this.listNthauNopHs.length > 0) {
      await this.saveGoiThau();
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
      this.listNthauNopHs = res.data
      // await this.getDetail()
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide()
  }

  async showDetail($event, dataGoiThau: any) {
    await this.spinner.show();
    this.listNthauNopHs = [];
    if ($event.type == 'click') {
      if ($event.target.nodeName.toUpperCase() == 'TR') {
        $event.target.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
        $event.target.classList.add('selectedRow')
      } else {
        $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
        $event.target.parentElement.classList.add('selectedRow')
      }
      this.selected = false;
      this.idGoiThau = dataGoiThau.id;
    } else {
      this.selected = true;
      this.idGoiThau = dataGoiThau.id;
    }
    if (dataGoiThau.qdPdHsmt != null && dataGoiThau.qdPdHsmt.trangThai == STATUS.BAN_HANH) {
      this.acceptSave = true;
    } else {
      this.acceptSave = false;
    }
    if (dataGoiThau.idNhaThau != null) {
      this.daCoKqLcnt = true;
    } else {
      this.daCoKqLcnt = false;
    }
    let res = await this.thongTinDauThauService.getDetailThongTin(this.idGoiThau, this.loaiVthh);
    this.itemRow = {};
    // this.itemRow.soLuong = dataGoiThau.soLuong
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        // tgianTrinhKqTcg: res.data.tgianTrinhKqTcg,
        // tgianTrinhTtd: res.data.tgianTrinhTtd,
        ghiChuTtdt: res.data.ghiChuTtdt,
        tgianBdauTchuc: 'Quý ' + res.data.quy + ' ' + formatDate(res.data.tgianBdauTchuc, "dd/MM/yyyy", 'en-US'),
        tgianMthau: formatDate(res.data.tgianMthau, "dd/MM/yyyy", 'en-US'),
        tgianDthau: formatDate(res.data.tgianDthau, "dd/MM/yyyy", 'en-US'),
      })
      this.fileDinhKems = res.data.fileDinhKems
      this.listNthauNopHs = res.data.dsNhaThauDthau;
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

  async addRow() {
    if (!this.acceptSave) {
      this.notification.warning(MESSAGE.WARNING, 'Bạn cần tạo và ban hành QĐ Phê duyệt HSMT cho gói thầu trước.')
      return;
    }
    if (this.validateItemSave(this.itemRow)) {
      this.listNthauNopHs = [
        ...this.listNthauNopHs,
        this.itemRow
      ];
      await this.saveGt();
      this.clearItemRow();
    }
  }

  async saveGt(){
    if (this.listNthauNopHs.length > 0) {
      await this.saveGoiThau();
    } else {
      const modalThongBao = this.modal.create({
        nzTitle: 'Thông báo',
        nzContent: DialogThongBaoThongTinDauThauComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {},
      });
      modalThongBao.afterClose.toPromise().then((data) => {
        if (data) {
          this.saveGoiThau();
        }
      });
    }
  }

  clearItemRow() {
    let soLuong = this.itemRow.soLuong;
    this.itemRow = {};
    this.itemRow.soLuong = soLuong;
    this.itemRow.id = null;
  }

  deleteRow(i, data) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async() => {
        this.spinner.show();
        try {
          let res = await this.thongTinDauThauService.delete({ id: data.id });
          if (res.msg == MESSAGE.SUCCESS) {
            this.listNthauNopHs.splice(i, 1)
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            // await this.getDetail()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
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

  async saveEdit(dataUpdate, index: any) {
    if (this.validateItemSave(this.itemRowUpdate, index)) {
      this.listNthauNopHs[index] = this.itemRowUpdate;
      this.listNthauNopHs[index].edit = false;
      await this.saveGt();
    };

  }

  validateItemSave(dataSave, index?): boolean {
    if (dataSave.tenNhaThau) {
      return true
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

  sumslKho(column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    let arr = [];
    this.listDataDetail.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data)
        })
      }
    })
    if (arr && arr.length > 0) {
      if (type) {
        const sum = arr.reduce((prev, cur) => {
          prev += cur[column];
          return prev;
        }, 0);
        result = sum
      } else {
        let list = arr.filter(item => item.tenDonVi == tenDvi)
        if (list && list.length > 0) {
          const sum = list.reduce((prev, cur) => {
            prev += cur[column];
            return prev;
          }, 0);
          result = sum
        }
      }
    }
    return result;
  }

  sumThanhTien(column?: string) {
    let result = 0;
    let arr = [];
    this.listDataDetail.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data)
        })
      }
      if (arr && arr.length > 0) {
        const sum = arr.reduce((prev, cur) => {
          if (cur['trangThai'] == 40 && column == 'chenhLech') {
            prev += Math.abs((cur['donGiaNhaThau'] - (cur['donGiaVat'] != null ? cur['donGiaVat'] : cur['donGiaTamTinh'])) * cur['soLuong'] * 1000);
          } else if(column == 'donGiaVat') {
            prev += cur['donGiaVat'] != null ? cur['donGiaVat'] * cur['soLuong'] * 1000 : (cur['donGiaTamTinh'] != null ? cur['donGiaTamTinh'] * cur['soLuong'] * 1000 : 0);
          }else{
            if(column != 'chenhLech'){
              prev += cur[column] * cur['soLuong'] * 1000;
            }
          }
          return prev ? prev : 0;
        }, 0);
        result = sum
      }
    })
    return result;
  }

  abs(value: number): number {
    return parseFloat(Math.abs(value).toFixed(2));
  }

  async preview() {
    let body = {
      id : this.idInput,
      reportTemplateRequest : this.reportTemplate,
      loaiVthh: this.loaiVthh
    }
    await this.thongTinDauThauService.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }
  downloadPdf() {
    saveAs(this.pdfSrc, "thong_tin_dau_thau_lt.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "thong_tin_dau_thau_lt.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
  printPreview(){
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }
  calcTongSl() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum;
    }
  }

  calcTongThanhTien() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * cur.donGia;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * 1000;
    }
  }

  calcTongThanhTienKq() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.thanhTienNhaThau;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum;
    }
  }

  calcTongChenhLech(i) {
    if (this.listOfData) {
      let sum = 0
        if (this.isShowFromKq) {
          const sumChild = this.listOfData[i].children.reduce((prev, cur) => {
            if (this.listOfData[i].kqlcntDtl?.donGiaVat != null) {
              prev += cur.soLuong * this.abs(this.listOfData[i].kqlcntDtl?.donGiaVat - cur.donGia)
              return prev;
            }
          }, 0);
          sum += sumChild;
        } else {
          const sumChild = this.listOfData[i].children.reduce((prev, cur) => {
            if (this.listOfData[i].kqlcntDtl?.donGiaVat != null) {
              prev += cur.soLuong * this.abs(this.listOfData[i].donGiaNhaThau - cur.donGia);
              return prev;
            }
          }, 0);
          sum += sumChild;
        }
      return sum * 1000;
    }
  }

  async startEditRowNt(i) {
    let res = await this.thongTinDauThauService.getDetailThongTin(this.listOfData[i].id, this.loaiVthh);
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        // tgianTrinhKqTcg: res.data.tgianTrinhKqTcg,
        // tgianTrinhTtd: res.data.tgianTrinhTtd,
        ghiChuTtdt: res.data.ghiChuTtdt,
      })
      this.fileDinhKems = res.data.fileDinhKems
      this.listNthauNopHs = res.data.dsNhaThauDthau;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.listOfData.forEach(item => {
      item.edit = false;
    })
    this.listOfData[i].edit = true;
    if (this.listOfData[i].kqlcntDtl) {
      this.itemRowQd[i] = cloneDeep(this.listOfData[i].kqlcntDtl);
    } else {
      this.itemRowQd[i] = {}
    }
  }

  cancelEditRowNt(i) {
    this.listOfData[i].edit = false;
  }
  async saveEditRowNt(i) {
    this.itemRowQd[i].donGiaVat = parseFloat((this.itemRowQd[i].thanhTienNhaThau/(this.listOfData[i].soLuong*1000)).toFixed(2));
    this.listOfData[i].kqlcntDtl = this.itemRowQd[i];
    if (this.itemRowQd[i].trangThai != null) {
      this.listOfData[i].kqlcntDtl.tenTrangThai = this.dsTrangThai.find(item => item.value == this.itemRowQd[i].trangThai).text;
    }
    if (this.itemRowQd[i].idNhaThau != null) {
      this.listOfData[i].kqlcntDtl.tenNhaThau = this.listNthauNopHs.find(item => item.id == this.itemRowQd[i].idNhaThau)?.tenNhaThau;
    }
    this.listOfData[i].edit = false;
  }

  changeNhaThau(event?: any) {
    if (event.nzValue != '') {
      this.listNhaThau.forEach(item => {
        if (item.tenNhaThau == event.nzValue) {
          this.itemRow.donGia = item.donGia
          this.itemRow.mst = item.mst
          this.itemRow.diaChi = item.diaChi
          this.itemRow.sdt = item.sdt
        }
      })
    }
  }

  selectNhaThau(i, event) {
    this.listNthauNopHs.forEach(item => {
      if (item.id == event) {
        this.itemRowQd[i].thanhTienNhaThau = item.donGia
      }
    })
  }
}
