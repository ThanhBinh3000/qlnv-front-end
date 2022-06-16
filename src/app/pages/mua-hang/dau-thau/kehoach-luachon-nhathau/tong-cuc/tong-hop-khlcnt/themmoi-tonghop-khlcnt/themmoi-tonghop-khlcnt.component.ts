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
  isTongHop = false;
  isChiTiet = false;
  isDetailDxCuc: boolean = false;
  dataTableDanhSachDX: any[] = [];
  danhMucDonVi: any;
  searchValue = '';
  searchFilter = {
    soQdinh: '',
    namKh: dayjs().get('year'),
    ngayTongHop: '',
    loaiVthh: ''
  };
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  // formData: FormGroup;
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

  errorGhiChu: boolean = false;
  errorInputRequired: string = null;

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
    private helperService: HelperService
  ) {
    this.formTraCuu = this.fb.group(
      {
        loaiVthh: [convertVthhToId(this.loaiVthh), [Validators.required]],
        namKh: [dayjs().get('year'), [Validators.required]],
        hthucLcnt: ['', [Validators.required]],
        pthucLcnt: ['', [Validators.required]],
        loaiHdong: ['', [Validators.required]],
        nguonVon: ['', [Validators.required]],
      }
    );
    this.formData = this.fb.group({
      id: [],
      ngayTongHop: [, [Validators.required]],
      loaiVthh: ['', [Validators.required]],
      veViec: ['', [Validators.required]],
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
      tgianTbao: ['', [Validators.required]],
      tgianPhatHanh: ['', [Validators.required]],
      tgianDongthau: ['', [Validators.required]],
      tgianMoThau: ['', [Validators.required]],
      tgianNhapHang: ['', [Validators.required]],
      namKh: [''],
    })
    this.danhMucDonVi = JSON.parse(sessionStorage.getItem('danhMucDonVi'));
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
        this.isTongHop = true;
        this.isChiTiet = true;
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
      this.dataTableDanhSachDX = dataDetail.children;
      this.formData.patchValue({
        id: dataDetail.id,
        ngayTongHop: dataDetail.ngayTao ? dataDetail.ngayTao : dayjs().format("YYYY-MM-DD"),
        veViec: dataDetail.veViec,
        loaiVthh: dataDetail.loaiVthh,
        loaiHdong: dataDetail.loaiHdong,
        pthucLcnt: dataDetail.pthucLcnt,
        hthucLcnt: dataDetail.hthucLcnt,
        nguonVon: dataDetail.nguonVon,
        tgianTbao: [dataDetail.tuTgianTbao, dataDetail.denTgianTbao],
        tgianPhatHanh: [dataDetail.tuTgianPhanh, dataDetail.denTgianPhanh],
        tgianDongthau: [dataDetail.tuTgianDthau, dataDetail.denTgianDthau],
        tgianMoThau: [dataDetail.tuTgianMthau, dataDetail.denTgianMthau],
        tgianNhapHang: [dataDetail.tuTgianNhang, dataDetail.denTgianNhang],
        namKh: dataDetail.namKhoach
      })
    }
  }

  async tongHopDeXuatTuCuc() {
    this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formTraCuu);
      // this.helperService.markFormGroupTouched(this.formThongTinChung);
      if (this.formTraCuu.invalid) {
        this.spinner.hide();
        return;
      }
      let body = this.formTraCuu.value;
      let res = await this.tongHopDeXuatKHLCNTService.deXuatCuc(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.isTongHop = true;
        this.initForm(res.data);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
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
        this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      let res = await this.tongHopDeXuatKHLCNTService.create(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.quayLai();
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


  getTenDviTable(maDvi: string) {
    let donVi = this.danhMucDonVi?.filter(item => item.maDvi == maDvi);
    return donVi.length > 0 ? donVi[0].tenDvi : null
  }

  chiTietDxCuc(data?) {
    this.isDetailDxCuc = true;
    this.idDeXuat = data;
  }

  showList() {
    this.isDetailDxCuc = false;
  }

}
function VNnum2words(tien: number): string {
  throw new Error('Function not implemented.');
}

