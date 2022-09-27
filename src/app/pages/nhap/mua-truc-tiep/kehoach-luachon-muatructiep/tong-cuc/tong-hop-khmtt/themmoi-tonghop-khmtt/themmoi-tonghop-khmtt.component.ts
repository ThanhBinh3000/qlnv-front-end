import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinTongHopDeXuatLCNT } from 'src/app/models/ThongTinTongHopDeXuatLCNT';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { HelperService } from 'src/app/services/helper.service';
import { DanhSachGoiThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from 'src/app/constants/status';

@Component({
  selector: 'app-themmoi-tonghop-khmtt',
  templateUrl: './themmoi-tonghop-khmtt.component.html',
  styleUrls: ['./themmoi-tonghop-khmtt.component.scss']
})
export class ThemmoiTonghopKhmttComponent implements OnInit {
 
  @Input() loaiVthh: string
  @Input() id: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  formTraCuu: FormGroup;
  formData: FormGroup;
  isDetailDxCuc: boolean = false;
  dataTableDanhSachDX: any[] = [];
  danhMucDonVi: any;
  isTongHop: boolean = false;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  i = 0;
  editId: string | null = null;
  // loaiVTHH: number = 0;
  chiTiet: ThongTinTongHopDeXuatLCNT = new ThongTinTongHopDeXuatLCNT();
  listNam: any[] = [];
  yearNow: number = 0;
  idDeXuat: number = 0;
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listVthh: any[] = [];
  idPA: number = 0;
  selectedId: number = 0;
  errorInputRequired: string = null;
  isQuyetDinh: boolean = false;
  STATUS = STATUS;
  userInfo: UserLogin;
  dataDeXuat: any[] = [];
  mapOfExpandedData2: { [maDvi: string]: DanhSachGoiThau[] } = {};

  constructor(
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    public globals: Globals
  ) {
    this.formTraCuu = this.fb.group(
      {
        loaiVthh: [null, [Validators.required]],
        tenLoaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        tenCloaiVthh: [null, [Validators.required]],
        namKhoach: [dayjs().get('year'), [Validators.required]],
        hthucLcnt: ['', [Validators.required]],
        pthucLcnt: ['', [Validators.required]],
        loaiHdong: ['', [Validators.required]],
        nguonVon: ['', [Validators.required]],
      }
    );
    this.formData = this.fb.group({
      id: [],
      loaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      namKhoach: [, [Validators.required]],
      ngayThop: [, [Validators.required]],
      noiDung: ['', [Validators.required]],
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
      tgianBdauTchuc: ['', [Validators.required]],
      tgianMthau: ['', [Validators.required]],
      tgianDthau: ['', [Validators.required]],
      tgianNhang: ['', [Validators.required]],
      ghiChu: ['',],
      trangThai: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tchuanCluong: ['']
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
      await Promise.all([
        this.phuongThucDauThauGetAll(),
        this.nguonVonGetAll(),
        this.hinhThucDauThauGetAll(),
        this.loaiHopDongGetAll(),
        this.loadChiTiet(),
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadChiTiet() {
    if (this.id > 0) {
      let res = await this.tongHopDeXuatKHLCNTService.loadChiTiet(this.id);
      if (res.msg == MESSAGE.SUCCESS) {
        this.bindingDataDetail(res.data)
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async phuongThucDauThauGetAll() {
    this.listPhuongThucDauThau = [];
    let res = await this.danhMucService.phuongThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = res.data;
    }
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

  bindingDataTh(dataDetail?) {
    if (dataDetail) {
      this.formData.patchValue({
        namKhoach: +dataDetail.namKhoach,
        loaiVthh: dataDetail.loaiVthh,
        cloaiVthh: dataDetail.cloaiVthh,
        loaiHdong: dataDetail.loaiHdong,
        pthucLcnt: dataDetail.pthucLcnt,
        hthucLcnt: dataDetail.hthucLcnt,
        nguonVon: dataDetail.nguonVon,
        ngayThop: dayjs().format("YYYY-MM-DD"),
        tgianBdauTchuc: [dataDetail.tgianBdauTchucTu, dataDetail.tgianBdauTchucDen],
        tgianDthau: [dataDetail.tgianDthauTu, dataDetail.tgianDthauDen],
        tgianMthau: [dataDetail.tgianMthauTu, dataDetail.tgianMthauDen],
        tgianNhang: [dataDetail.tgianNhangTu, dataDetail.tgianNhangDen],
      })
      this.dataTableDanhSachDX = dataDetail.hhDxKhLcntThopDtlList;
    }
  }

  bindingDataDetail(dataDetail?) {
    if (dataDetail) {
      this.dataTableDanhSachDX = dataDetail.hhDxKhLcntThopDtlList;
      this.formData.patchValue({
        id: dataDetail.id,
        namKhoach: dataDetail.namKhoach,
        ngayThop: dataDetail.ngayTao,
        noiDung: dataDetail.noiDung,
        loaiVthh: dataDetail.loaiVthh,
        cloaiVthh: dataDetail.cloaiVthh,
        loaiHdong: dataDetail.loaiHdong,
        pthucLcnt: dataDetail.pthucLcnt,
        hthucLcnt: dataDetail.hthucLcnt,
        nguonVon: dataDetail.nguonVon,
        tgianBdauTchuc: [dataDetail.tgianBdauTchucTu, dataDetail.tgianBdauTchucDen],
        tgianDthau: [dataDetail.tgianDthauTu, dataDetail.tgianDthauDen],
        tgianMthau: [dataDetail.tgianMthauTu, dataDetail.tgianMthauDen],
        tgianNhang: [dataDetail.tgianNhangTu, dataDetail.tgianNhangDen],
        ghiChu: dataDetail.ghiChu,
        trangThai: dataDetail.trangThai == null ? '' : dataDetail.trangThai,
        tenLoaiVthh: dataDetail.tenLoaiVthh,
        tenCloaiVthh: dataDetail.tenCloaiVthh,
        tchuanCluong: dataDetail.tchuanCluong
      });
      this.formTraCuu.patchValue({
        namKhoach: +dataDetail.namKhoach,
        loaiVthh: dataDetail.loaiVthh,
        tenLoaiVthh: dataDetail.tenLoaiVthh,
        cloaiVthh: dataDetail.cloaiVthh,
        tenCloaiVthh: dataDetail.tenCloaiVthh,
        loaiHdong: dataDetail.loaiHdong,
        pthucLcnt: dataDetail.pthucLcnt,
        hthucLcnt: dataDetail.hthucLcnt,
        nguonVon: dataDetail.nguonVon,
      })
      this.isTongHop = true;
    }
  }

  async tongHopDeXuatTuCuc() {
    this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formTraCuu);
      if (this.formTraCuu.invalid) {
        this.spinner.hide();
        return;
      }
      let body = this.formTraCuu.value;
      let res = await this.tongHopDeXuatKHLCNTService.deXuatCuc(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.bindingDataTh(res.data);
        this.isTongHop = true;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.isTongHop = false;
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  isDetailPermission() {
    if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_SUA") && this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_TONGHOP_TONGHOP")) {
      return true;
    }
    return false;
  }

  async save() {
    if (!this.isDetailPermission()) {
      return;
    }
    this.helperService.markFormGroupTouched(this.formData);
    this.spinner.show();
    try {
      if (this.formData.invalid) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
        this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      let res = await this.tongHopDeXuatKHLCNTService.create(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  showList() {
    this.isDetailDxCuc = false;
  }

  selectHangHoa() {
    // let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    let cloaiVthh = null;
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      cloaiVthh = data.ma;
      this.formTraCuu.patchValue({
        maVtu: null,
        tenVtu: null,
        cloaiVthh: data.ma,
        tenCloaiVthh: data.ten,
        loaiVthh: data.parent.ma,
        tenLoaiVthh: data.parent.ten
      })
    }
    if (data.loaiHang == "VT") {
      if (data.cap == "3") {
        cloaiVthh = data
        this.formTraCuu.patchValue({
          maVtu: data.ma,
          tenVtu: data.ten,
          cloaiVthh: data.parent.ma,
          tenCloaiVthh: data.parent.ten,
          loaiVthh: data.parent.parent.ma,
          tenLoaiVthh: data.parent.parent.ten
        })
      }
      if (data.cap == "2") {
        this.formTraCuu.patchValue({
          maVtu: null,
          tenVtu: null,
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenLoaiVthh: data.parent.ten
        })
      }
    }
  }

  displayDialogPhuLuc(data: any): void {
    console.log(data);
    this.modal.create({
      nzTitle: 'Thông tin chi tiết đề xuất của cục DTNN KV',
      nzContent: DialogThongTinPhuLucQuyetDinhPheDuyetComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        isEdit: false
      },
    });
  }

  taoQdinh() {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
  }

  showTongHop() {
    this.loadChiTiet()
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[2];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[0];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = false;
  }
}



