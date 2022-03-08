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
  i = 0;
  editId: string | null = null;
  listOfData: ItemData[] = [];

  constructor(
    private modal: NzModalService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
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
    this.router.navigate([`/nhap/dau-thau/quyet-dinh-phe-duyet-ket-qua-lcnt`])
  }

  openDialogThongTinPhuLucKLCNT() {
    this.modal.create({
      nzTitle: 'Thông tin phụ lục KH LNCT cho các Cục DTNN KV',
      nzContent: DialogThongTinPhuLucKHLCNTChoCacCucDTNNKVComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        // totalRecord: this.totalRecord,
        // date: event,
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
    catch (err) {
      this.spinner.hide();
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      this.spinner.hide();
    }
    catch (err) {
      this.spinner.hide();
    }
  }
}
