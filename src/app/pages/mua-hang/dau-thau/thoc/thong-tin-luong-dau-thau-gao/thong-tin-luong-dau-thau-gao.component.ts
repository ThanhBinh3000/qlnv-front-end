import {
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
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
import { LEVEL, LOAI_HANG_DTQG } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';

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
  selector: 'thong-tin-luong-dau-thau-gao',
  templateUrl: './thong-tin-luong-dau-thau-gao.component.html',
  styleUrls: ['./thong-tin-luong-dau-thau-gao.component.scss'],
})
export class ThongTinLuongDauThauGaoComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soDeXuat: '',
  };
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  formData: FormGroup;
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
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
      } else if (this.router.url.includes(LEVEL.CHI_CUC)) {
        this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.lastBreadcrumb = LEVEL.CUC_SHOW;
      }
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

  validateGhiChu() {
    if (this.chiTiet.ghiChu && this.chiTiet.ghiChu != '') {
      this.errorGhiChu = false;
    }
    else {
      this.errorGhiChu = true;
    }
  }

  async loadChiTiet() {
    if (this.id > 0) {
      let res = await this.tongHopDeXuatKHLCNTService.loadChiTiet(this.id);
      if (res.msg == MESSAGE.SUCCESS) {
        this.chiTiet = res.data;

        if (res.data.namKhoach) {
          this.chiTiet.namKhoach = +res.data.namKhoach;
        }

        this.idPA = res.data.phuongAnId;

        this.startPH = dayjs(this.chiTiet.tuTgianMthau).toDate();
        this.endPH = dayjs(this.chiTiet.denTgianMthau).toDate();

        this.startDT = dayjs(this.chiTiet.tuTgianDthau).toDate();
        this.endDT = dayjs(this.chiTiet.denTgianDthau).toDate();

        this.startHS = dayjs(this.chiTiet.tuTgianTbao).toDate();
        this.endHS = dayjs(this.chiTiet.denTgianTbao).toDate();

        this.startHTN = dayjs(this.chiTiet.tuTgianNhang).toDate();
        this.endHTN = dayjs(this.chiTiet.denTgianNhang).toDate();
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

  async tongHopDeXuatTuCuc() {
    this.spinner.show();
    try {
      let body = {
        "hthucLcnt": this.hthucLcnt,
        "loaiHdong": this.loaiHdong,
        "loaiVthh": '00',
        "namKhoach": this.chiTiet.namKhoach,
        "nguonVon": this.nguonVon,
        "pthucLcnt": this.pthucLcnt,
      }
      let res = await this.tongHopDeXuatKHLCNTService.deXuatCuc(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.chiTiet = res.data;

        if (res.data.namKhoach) {
          this.chiTiet.namKhoach = +res.data.namKhoach;
        }

        this.startPH = dayjs(this.chiTiet.tuTgianMthau).toDate();
        this.endPH = dayjs(this.chiTiet.denTgianMthau).toDate();

        this.startDT = dayjs(this.chiTiet.tuTgianDthau).toDate();
        this.endDT = dayjs(this.chiTiet.denTgianDthau).toDate();

        this.startHS = dayjs(this.chiTiet.tuTgianTbao).toDate();
        this.endHS = dayjs(this.chiTiet.denTgianTbao).toDate();

        this.startHTN = dayjs(this.chiTiet.tuTgianNhang).toDate();
        this.endHTN = dayjs(this.chiTiet.denTgianNhang).toDate();
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

  back() {
    this.router.navigate([`/nhap/dau-thau/luong-dau-thau-gao`])
  }

  phuongAnTrinhTongCuc() {
    this.router.navigate([`/nhap/dau-thau/luong-dau-thau-gao/thong-tin-chung-phuong-an-trinh-tong-cuc/`, this.idPA], { queryParams: { idHdr: this.id } });
  }

  async save(isPhuongAn) {
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

  selectTabMenu(tab) {
    if (tab == this.selectedTab) {
      return;
    }
    if (tab == 'tong-hop') {
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc',
        ]);
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-cuc',
        ]);
      }
    } else if (tab == 'phuong-an') {
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/phuong-an-ke-hoach-lua-chon-nha-thau-tong-cuc',
        ]);
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/phuong-an-ke-hoach-lua-chon-nha-thau-cuc',
        ]);
      }
    } else if (tab == 'phe-duyet') {
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-tong-cuc',
        ]);
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-cuc',
        ]);
      }
    }
  }
}
