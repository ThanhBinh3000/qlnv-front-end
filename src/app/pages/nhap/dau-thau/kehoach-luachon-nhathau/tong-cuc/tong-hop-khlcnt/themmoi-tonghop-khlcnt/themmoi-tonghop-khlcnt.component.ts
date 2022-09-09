import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinTongHopDeXuatLCNT } from 'src/app/models/ThongTinTongHopDeXuatLCNT';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { LEVEL, LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { convertVthhToId } from 'src/app/shared/commonFunction';
import { HelperService } from 'src/app/services/helper.service';
import { DanhSachGoiThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-themmoi-tonghop-khlcnt',
  templateUrl: './themmoi-tonghop-khlcnt.component.html',
  styleUrls: ['./themmoi-tonghop-khlcnt.component.scss']
})
export class ThemmoiTonghopKhlcntComponent implements OnInit {

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
  tabSelected: string = 'thongTinChung';
  selectedId: number = 0;
  errorInputRequired: string = null;
  isQuyetDinh: boolean = false;

  userInfo: UserLogin;
  dataDeXuat: any[] = [];
  mapOfExpandedData2: { [maDvi: string]: DanhSachGoiThau[] } = {};

  constructor(
    private modal: NzModalService,
    private router: Router,
    private routerActive: ActivatedRoute,
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
        tenVthh: [null, [Validators.required]],
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
      ghiChu: ['', [Validators.required]],
      trangThai: [''],
      tenVthh: [''],
      tenCloaiVthh: [''],
      tchuanCluong: ['']
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.formTraCuu.patchValue({
        loaiVthh: convertVthhToId(this.loaiVthh)
      })
      this.userInfo = this.userService.getUserLogin();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
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

  collapse2(array: DanhSachGoiThau[], data: DanhSachGoiThau, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.idVirtual === d.idVirtual)!;
          target.expand = false;
          this.collapse2(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTienTobangChu(tien: number): string {
    return VNnum2words(tien);
  }

  async loadChiTiet() {
    if (this.id > 0) {
      let res = await this.tongHopDeXuatKHLCNTService.loadChiTiet(this.id);
      if (res.msg == MESSAGE.SUCCESS) {
        this.initForm(res.data)
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

  initForm(dataDetail?) {
    if (dataDetail) {
      this.dataTableDanhSachDX = dataDetail.hhDxKhLcntThopDtlList;
      this.formData.patchValue({
        id: dataDetail.id,
        namKhoach: dataDetail.namKhoach,
        ngayThop: dataDetail.ngayTao ? dataDetail.ngayTao : dayjs().format("YYYY-MM-DD"),
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
        tenVthh: dataDetail.tenVthh,
        tenCloaiVthh: dataDetail.tenCloaiVthh,
        tchuanCluong: dataDetail.tchuanCluong
      })
      console.log(this.formData.get('trangThai').value);
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
        this.initForm(res.data);
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

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    this.spinner.show();
    try {
      if (this.formData.invalid) {
        console.log(this.formData.value);
        this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      let res = await this.tongHopDeXuatKHLCNTService.create(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        let tongHop = await this.tongHopDeXuatKHLCNTService.loadChiTiet(res.data.id);
        this.initForm(tongHop.data)
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
        tenVthh: data.parent.ten
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
          tenVthh: data.parent.parent.ten
        })
      }
      if (data.cap == "2") {
        this.formTraCuu.patchValue({
          maVtu: null,
          tenVtu: null,
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenVthh: data.parent.ten
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
    let elem = document.getElementById('selectedTab');
    let tabActive = elem.getElementsByClassName('ant-tabs-tab-active')[0];
    tabActive.classList.remove('ant-tabs-tab-active')
    let setActive = elem.getElementsByClassName('ant-tabs-tab')[2];
    setActive.classList.add('ant-tabs-tab-active');
    this.isQuyetDinh = true;
  }

  showTongHop() {
    this.isQuyetDinh = false;
  }
}

function VNnum2words(tien: number): string {
  throw new Error('Function not implemented.');
}

