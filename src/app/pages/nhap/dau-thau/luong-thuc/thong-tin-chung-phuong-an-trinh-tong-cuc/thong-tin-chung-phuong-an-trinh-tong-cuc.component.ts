import { ThongTinPhuongAnTrinhTongCuc } from './../../../../../models/ThongTinPhuongAnTrinhTongCuc';
import {
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

  thocIdDefault: number = 2;
  gaoIdDefault: number = 6;
  muoiIdDefault: number = 78;

  isFromTongHop: boolean = false;
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];

  chiTiet: ThongTinPhuongAnTrinhTongCuc = new ThongTinPhuongAnTrinhTongCuc();

  startPH: Date | null = null;
  endPH: Date | null = null;

  startDT: Date | null = null;
  endDT: Date | null = null;

  startHS: Date | null = null;
  endHS: Date | null = null;

  startHTN: Date | null = null;
  endHTN: Date | null = null;

  errorGhiChu: boolean = false;
  errorInputRequired: string = null;

  constructor(
    private modal: NzModalService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
  ) {
    this.isFromTongHop = false;
    if (this.router.url.indexOf('luong-dau-thau-gao') != -1) {
      this.isFromTongHop = true;
    }
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      this.isVisibleChangeTab$.subscribe((value: boolean) => {
        this.visibleTab = value;
      });
      this.listOfData = [
        ...this.listOfData,
        {
          id: `${this.i}`,
          stt: `${this.i}`,
          cuc: 'Cục DTNN KV Vĩnh phú',
          soGoiThau: `4`,
          soDeXuat: 'DX_KHCNT_01',
          ngayDeXuat: `10/03/2022`,
          tenDuAn: `Mua gạo dự trữ A`,
          soLuong: `2000`,
          tongTien: `42.000.000`,
        },
      ];
      await Promise.all([
        this.phuongThucDauThauGetAll(),
        this.nguonVonGetAll(),
        this.hinhThucDauThauGetAll(),
        this.loaiHopDongGetAll(),
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

  async save() {
    if (this.chiTiet.ghiChu && this.chiTiet.ghiChu != '') {
      this.errorGhiChu = false;
    }
    else {
      this.errorGhiChu = true;
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
    if (this.isFromTongHop) {
      this.router.navigate([`/nhap/dau-thau/luong-dau-thau-gao/thong-tin-luong-dau-thau-gao/`, id]);
    }
    else {
      this.router.navigate([`/nhap/dau-thau/phuong-an-trinh-tong-cuc`]);
    }
  }

  openDialogThongTinPhuLucKLCNT(data: any) {
    this.modal.create({
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
  }
}
