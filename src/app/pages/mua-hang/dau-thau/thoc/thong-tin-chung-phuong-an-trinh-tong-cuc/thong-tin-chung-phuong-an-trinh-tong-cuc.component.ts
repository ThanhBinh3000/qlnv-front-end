import { filter } from 'rxjs/operators';
import { ThongTinPhuongAnTrinhTongCuc } from './../../../../../models/ThongTinPhuongAnTrinhTongCuc';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogThongTinPhuLucKHLCNTComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-khlcnt/dialog-thong-tin-phu-luc-khlcnt.component';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { ThongTinTongHopDeXuatLCNT } from 'src/app/models/ThongTinTongHopDeXuatLCNT';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { PhuongAnKeHoachLCNTService } from 'src/app/services/phuongAnKeHoachLCNT.service';
import { LEVEL, LOAI_HANG_DTQG } from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import { ChiTietDuAn } from 'src/app/models/ChiTietDuAn';
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
  selector: 'thong-tin-chung-phuong-an-trinh-tong-cuc',
  templateUrl: './thong-tin-chung-phuong-an-trinh-tong-cuc.component.html',
  styleUrls: ['./thong-tin-chung-phuong-an-trinh-tong-cuc.component.scss'],
})
export class ThongTinChungPhuongAnTrinhTongCucComponent implements OnInit {
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
  listOfData: ItemData[] = [];
  loaiVTHH: number = 0;
  tabSelected: string = 'thong-tin-chung';

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  isFromTongHop: boolean = false;
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];

  chiTiet: ThongTinPhuongAnTrinhTongCuc = new ThongTinPhuongAnTrinhTongCuc();

  startPH: Date | null = null;
  startDT: Date | null = null;
  startHS: Date | null = null;
  startHTN: Date | null = null;

  errorGhiChu: boolean = false;
  errorInputRequired: string = null;

  thongTinChung: any;
  idHdr: number = 0;
  chiTietTongHop: ThongTinTongHopDeXuatLCNT = new ThongTinTongHopDeXuatLCNT();

  lastBreadcrumb: string;
  userInfo: UserLogin;

  selectedTab: string = 'phuong-an';

  constructor(
    private modal: NzModalService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private phuongAnKeHoachLCNTService: PhuongAnKeHoachLCNTService,
    private userService: UserService,
  ) {
    this.isFromTongHop = false;
    if (this.router.url.indexOf('luong-dau-thau-gao') != -1) {
      this.isFromTongHop = true;
    }
    this.routerActive.queryParams.subscribe(params => {
      this.idHdr = +params['idHdr'];
    });
  }

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

  async loadChiTiet() {
    if (this.id > 0) {
      let res = await this.phuongAnKeHoachLCNTService.loadChiTiet(this.id);
      if (res.msg == MESSAGE.SUCCESS) {
        this.chiTiet = res.data;
        if (res.data.children1 && res.data.children1.length > 0) {
          res.data.children1.forEach((item: any) => {
            item.detail = item.children;
          });
        }
        this.chiTiet.detail = res.data.children1;

        this.startPH = dayjs(this.chiTiet.tgianMthau).toDate();
        this.startDT = dayjs(this.chiTiet.tgianDthau).toDate();
        this.startHS = dayjs(this.chiTiet.tgianTbao).toDate();
        this.startHTN = dayjs(this.chiTiet.tgianNhang).toDate();
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    else {
      this.chiTiet.idThHdr = this.idHdr;
    }
    await this.loadChiTietTongHop();
  }

  async loadChiTietTongHop() {
    if (this.chiTiet.idThHdr > 0) {
      let res = await this.tongHopDeXuatKHLCNTService.loadChiTiet(this.chiTiet.idThHdr);
      if (res.msg == MESSAGE.SUCCESS) {
        this.chiTietTongHop = res.data;
        this.chiTiet.namKhoach = +this.chiTietTongHop.namKhoach;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  validateGhiChu() {
    if (this.chiTiet.ghiChu && this.chiTiet.ghiChu != '') {
      this.errorGhiChu = false;
    }
    else {
      this.errorGhiChu = true;
    }
  }

  async save() {
    this.spinner.show();
    try {
      if (this.chiTiet.ghiChu && this.chiTiet.ghiChu != '') {
        this.errorGhiChu = false;
      }
      else {
        this.errorGhiChu = true;
      }
      if (!this.errorGhiChu) {
        if (this.id > 0) {
          let res = await this.phuongAnKeHoachLCNTService.sua(this.chiTiet);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back(this.idHdr);
          }
          else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
        else {
          let res = await this.phuongAnKeHoachLCNTService.them(this.chiTiet);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back(this.idHdr);
          }
          else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  addRow(): void {
    this.i++;
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        stt: `${this.i}`,
        cuc: '',
        soGoiThau: '',
        soDeXuat: '',
        ngayDeXuat: '',
        tenDuAn: '',
        soLuong: '',
        tongTien: ''
      },
    ];
  }

  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter((d) => d.id !== id);
  }

  back(id: number) {
    if (this.router.url.includes(LEVEL.TONG_CUC)) {
      if (this.isFromTongHop) {
        this.router.navigate([`/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc/thong-tin-tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc`, id]);
      }
      else {
        this.router.navigate([`/mua-hang/dau-thau/thoc/phuong-an-ke-hoach-lua-chon-nha-thau-tong-cuc`]);
      }
    } else if (this.router.url.includes(LEVEL.CUC)) {
      if (this.isFromTongHop) {
        this.router.navigate([`/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-cuc/thong-tin-tong-hop-ke-hoach-lua-chon-nha-thau-cuc`, id]);
      }
      else {
        this.router.navigate([`/mua-hang/dau-thau/thoc/phuong-an-ke-hoach-lua-chon-nha-thau-cuc`]);
      }
    }
  }

  openDialogThongTinPhuLucKLCNT(data?: any) {
    const modalPhuLuc = this.modal.create({
      nzTitle: 'Thông tin phụ lục KH LCNT cho các Cục DTNN KV',
      nzContent: DialogThongTinPhuLucKHLCNTComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalPhuLuc.afterClose.subscribe((res) => {
      if (res) {
        this.checkDataExistPhuLuc(res);
      }
    });
  }

  deleteItem(data: any) {
    if (this.chiTiet.detail && this.chiTiet.detail.length > 0) {
      this.chiTiet.detail = this.chiTiet.detail.filter(x => x.maDvi != data.maDvi);
    }
    else {
      this.chiTiet.detail = [];
    }
  }

  checkDataExistPhuLuc(data: any) {
    if (this.chiTiet.detail) {
      let indexExist =
        this.chiTiet.detail.findIndex(
          (x) => x.maDvi == data.maDvi,
        );
      if (indexExist != -1) {
        this.chiTiet.detail.splice(
          indexExist,
          1,
        );
      }
    } else {
      this.chiTiet.detail = [];
    }
    this.chiTiet.detail = [
      ...this.chiTiet.detail,
      data,
    ];
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
