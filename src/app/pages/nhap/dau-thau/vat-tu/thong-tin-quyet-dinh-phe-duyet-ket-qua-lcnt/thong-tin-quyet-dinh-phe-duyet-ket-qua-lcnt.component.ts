import {
  Component,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogThongTinChiTietGoiThauComponent } from 'src/app/components/dialog/dialog-thong-tin-chi-tiet-goi-thau-vat-tu/dialog-thong-tin-chi-tiet-goi-thau-vat-tu.component';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';

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
  selector: 'thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt.component.scss'],
})
export class ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soDeXuat: '',
  };
  id: number;
  formData: FormGroup;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
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
        id: '1',
        stt: '1',
        tenGoiThau: 'Mua gạo dự trữ A',
        soHieuGoiThau: `Gói 1`,
        diaDiemNhapKho: 'Cục DTNN KV Vĩnh phú',
        soLuong: `120`,
        trungHuy: `Trúng`,
        donViTrungThau: `Công ty A`,
        giaTrungThau: `10.000.000`,
        lyDoHuyThau: `Mua gạo dự trữ A`,
      },
      {
        id: '2',
        stt: '2',
        tenGoiThau: 'Mua gạo dự trữ A',
        soHieuGoiThau: `Gói 1`,
        diaDiemNhapKho: 'Cục DTNN KV Vĩnh phú',
        soLuong: `120`,
        trungHuy: `Hủy`,
        donViTrungThau: `Công ty A`,
        giaTrungThau: `10.000.000`,
        lyDoHuyThau: `Mua gạo dự trữ A`,
      },
    ];
    this.id = +this.routerActive.snapshot.paramMap.get('id');
  }

  back() {
    this.router.navigate([`/nhap/dau-thau/vat-tu/quyet-dinh-phe-duyet-ket-qua-lcnt`])
  }

  openDialogThongTinChiTietGoiThau(data: any) {
    this.modal.create({
      nzTitle: 'Thông tin phụ lục KH LNCT cho các Cục DTNN KV',
      nzContent: DialogThongTinChiTietGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
  }

  themMoi() {

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
