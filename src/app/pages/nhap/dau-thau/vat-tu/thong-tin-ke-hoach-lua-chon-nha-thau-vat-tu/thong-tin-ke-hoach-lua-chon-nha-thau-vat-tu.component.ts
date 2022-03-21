import {
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogThongTinPhuLucKHLCNTComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-khlcnt/dialog-thong-tin-phu-luc-khlcnt.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThongTinPhuLucKHLCNTChoCacCucDTNNKVComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv/dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv.component';
import { Subject } from 'rxjs';
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

interface ItemData {
  id: string;
  stt: string;
  tenGoiThau: string;
  soHieuGoiThau: string;
  diaDiemNhapKho: string;
  soLuong: string;
  trungHuy: string;
  donViTrungThau: string;
  giaTrungThau: string;
  lyDoHuyThau: string;
}
@Component({
  selector: 'thong-tin-ke-hoach-lua-chon-nha-thau-vat-tu',
  templateUrl: './thong-tin-ke-hoach-lua-chon-nha-thau-vat-tu.component.html',
  styleUrls: ['./thong-tin-ke-hoach-lua-chon-nha-thau-vat-tu.component.scss'],
})
export class ThongTinKeHoachLuaChonNhaThauVatTuComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soDeXuat: '',
  };
  id: number;
  formData: FormGroup;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  i = 0;
  editId: string | null = null;
  listOfData: ItemData[] = [];
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  constructor(
    private modal: NzModalService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        stt: `${this.i}`,
        tenGoiThau: 'Mua gạo dự trữ A',
        soHieuGoiThau: `Gói 1`,
        diaDiemNhapKho: 'Cục DTNN KV Vĩnh phú',
        soLuong: `120`,
        trungHuy: `Trúng`,
        donViTrungThau: `Công ty A`,
        giaTrungThau: `10.000.000`,
        lyDoHuyThau: `Mua gạo dự trữ A`,
      },
    ];
    this.id = +this.routerActive.snapshot.paramMap.get('id');
  }

  back() {
    this.router.navigate([`/nhap/dau-thau/vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu`])
  }

  openDialogThongTinPhuLucKLCNT() {
    this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800px',
      nzFooter: null,
      nzComponentParams: {
        // totalRecord: this.totalRecord,
        // date: event,
      },
    });
  }

  themMoi() {
    this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800px',
      nzFooter: null,
      nzComponentParams: {
        // totalRecord: this.totalRecord,
        // date: event,
      },
    });
  }

  redirectToDuThao() {
    this.router.navigate([`/nhap/dau-thau/vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu/du-thao-quyet-dinh`, 0])
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}
