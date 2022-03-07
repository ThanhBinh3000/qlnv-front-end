import {
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { DialogThongTinPhuLucKHLCNTComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-khlcnt/dialog-thong-tin-phu-luc-khlcnt.component';
import { Subject } from 'rxjs';

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
  editId: string | null = null;
  listOfData: ItemData[] = [];

  constructor(private modal: NzModalService, private router: Router) { }

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

  ngOnInit(): void {
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
  }
  back(id: string) {
    this.router.navigate([`/nhap/dau-thau/thong-tin-luong-dau-thau-gao/`, id])
  }
  openDialogThongTinPhuLucKLCNT() {
    this.modal.create({
      nzTitle: 'Thông tin phụ lục KH LCNT cho các Cục DTNN KV',
      nzContent: DialogThongTinPhuLucKHLCNTComponent,
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
}
