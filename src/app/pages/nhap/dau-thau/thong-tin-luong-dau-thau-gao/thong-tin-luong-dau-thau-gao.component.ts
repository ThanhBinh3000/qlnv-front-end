import {
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
  editId: string | null = null;
  listOfData: ItemData[] = [];

  constructor(private router: Router) { }

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

  tongHopDeXuatTuCuc(id: string): void {
    this.router.navigate([`/nhap/dau-thau/thong-tin-chung-phuong-an-trinh-tong-cuc/`, id])
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
  back() {
    this.router.navigate([`/nhap/dau-thau/luong-dau-thau-gao`])
  }
}
