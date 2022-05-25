import {
  Component,
  OnInit,
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

interface ItemData {
  id: string;
  stt: string;
  cuc: string;
  soGoiThau: string;
  soDeXuat: string;
  ngayDeXuat: string;
  tenDuAn: string;
  soLuong: string;
  tongTien: string;
}
@Component({
  selector: 'app-themmoi-tonghop-khlcnt',
  templateUrl: './themmoi-tonghop-khlcnt.component.html',
  styleUrls: ['./themmoi-tonghop-khlcnt.component.scss']
})
export class ThemmoiTonghopKhlcntComponent implements OnInit {
  formTraCuu: FormGroup;
  formData: FormGroup;
  isTongHop = false;
  isChiTiet = false;
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
  id: number;
  editId: string | null = null;
  loaiVTHH: number = 0;
  chiTiet: ThongTinTongHopDeXuatLCNT = new ThongTinTongHopDeXuatLCNT();
  listNam: any[] = [];
  yearNow: number = 0;

  loaiVthh: string = "";
  hthucLcnt: string = "";
  pthucLcnt: string = "";
  loaiHdong: string = "";
  nguonVon: string = "";

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listVthh: any[] = [];
  startPH: Date | null = null;
  endPH: Date | null = null;

  startDT: Date | null = null;
  endDT: Date | null = null;

  startHS: Date | null = null;
  endHS: Date | null = null;

  startHTN: Date | null = null;
  endHTN: Date | null = null;

  idPA: number = 0;

  errorGhiChu: boolean = false;
  errorInputRequired: string = null;

  lastBreadcrumb: string;
  userInfo: UserLogin;

  selectedTab: string = 'tong-hop';

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
        loaiVthh: [convertVthhToId(this.router.url.split('/')[4]), [Validators.required]],
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
      this.userInfo = this.userService.getUserLogin();
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      this.isVisibleChangeTab$.subscribe((value: boolean) => {
        this.visibleTab = value;
      });
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

  disabledStartPH = (startValue: Date): boolean => {
    if (!startValue || !this.endPH) {
      return false;
    }
    return startValue.getTime() > this.endPH.getTime();
  };

  disabledEndPH = (endValue: Date): boolean => {
    if (!endValue || !this.startPH) {
      return false;
    }
    return endValue.getTime() <= this.startPH.getTime();
  };

  disabledStartDT = (startValue: Date): boolean => {
    if (!startValue || !this.endDT) {
      return false;
    }
    return startValue.getTime() > this.endDT.getTime();
  };

  disabledEndDT = (endValue: Date): boolean => {
    if (!endValue || !this.startDT) {
      return false;
    }
    return endValue.getTime() <= this.startDT.getTime();
  };

  disabledStartHS = (startValue: Date): boolean => {
    if (!startValue || !this.endHS) {
      return false;
    }
    return startValue.getTime() > this.endHS.getTime();
  };

  disabledEndHS = (endValue: Date): boolean => {
    if (!endValue || !this.startHS) {
      return false;
    }
    return endValue.getTime() <= this.startHS.getTime();
  };

  disabledStartHTN = (startValue: Date): boolean => {
    if (!startValue || !this.endHTN) {
      return false;
    }
    return startValue.getTime() > this.endHTN.getTime();
  };

  disabledEndHTN = (endValue: Date): boolean => {
    if (!endValue || !this.startHTN) {
      return false;
    }
    return endValue.getTime() <= this.startHTN.getTime();
  };

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
        tgianPhatHanh: [dataDetail.tuTgianTbao, dataDetail.denTgianTbao],
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
    let loatVthh = this.router.url.split('/')[4]
    this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + loatVthh + '/tong-hop']);
  }

  // calendarData(list, column) {
  //   let tongSL = 0;
  //   let tongTien = 0;
  //   if (list.length > 0) {
  //     list.forEach(function (value) {
  //       tongSL += value.soLuong;
  //       tongTien += value.thanhTien;
  //     })
  //     return column == 'tong-tien' ? tongTien : tongSL;
  //   }
  //   return tongSL;
  // }

  getTenDviTable(maDvi: string) {
    let donVi = this.danhMucDonVi?.filter(item => item.maDvi == maDvi);
    return donVi.length > 0 ? donVi[0].tenDvi : null
  }

  back() {
    this.router.navigate([`/nhap/dau-thau/luong-dau-thau-gao`])
  }

  phuongAnTrinhTongCuc() {
    this.router.navigate([`/nhap/dau-thau/luong-dau-thau-gao/thong-tin-chung-phuong-an-trinh-tong-cuc/`, this.idPA], { queryParams: { idHdr: this.id } });
  }

  async save2(isPhuongAn) {
    this.spinner.show();
    try {
      let body = {
        "hthucLcnt": this.chiTiet.hthucLcnt,
        "id": this.id,
        "loaiHdong": this.chiTiet.loaiHdong,
        "loaiVthh": this.chiTiet.loaiVthh,
        "namKhoach": this.chiTiet.namKhoach,
        "nguonVon": this.chiTiet.nguonVon,
        "pthucLcnt": this.chiTiet.pthucLcnt,
        "veViec": this.chiTiet.veViec,
      }
      if (this.id > 0) {
        let res = await this.tongHopDeXuatKHLCNTService.sua(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (isPhuongAn) {
            this.router.navigate([`/nhap/dau-thau/luong-dau-thau-gao/thong-tin-chung-phuong-an-trinh-tong-cuc/`, this.id]);
          }
          else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          }
        }
        else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      else {
        let res = await this.tongHopDeXuatKHLCNTService.them(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (isPhuongAn) {
            console.log(res);
            this.router.navigate([`/nhap/dau-thau/luong-dau-thau-gao/thong-tin-chung-phuong-an-trinh-tong-cuc/`, this.id]);
          }
          else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
        }
        else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

}
