import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TAB_SELECTED } from './thong-tin-chi-tieu-ke-hoach-nam.constant';
interface DataItem {
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
  gender: string;
}
@Component({
  selector: 'app-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
})
export class ThongTinChiTieuKeHoachNamComponent implements OnInit {
  listOfData: DataItem[] = [];
  modals = {
    luaChonIn: false,
    thongTinLuongThuc: false,
    thongTinVatTuTrongNam: false,
  };
  xuongCaoTocCacLoais = new Array(4);
  id: number;
  tabSelected: string = TAB_SELECTED.luongThuc;
  detail = {
    soQD: null,
    ngayKy: null,
    ngayHieuLuc: null,
    namKeHoach: null,
    trichYeu: null,
  };
  tab = TAB_SELECTED;
  constructor(private router: Router, private routerActive: ActivatedRoute) {}

  ngOnInit(): void {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
      });
    }
    this.listOfData = data;
    this.id = +this.routerActive.snapshot.paramMap.get('id');
  }

  themMoi() {
    if (this.tabSelected == TAB_SELECTED.luongThuc) {
      this.handleOpenModal('thongTinLuongThuc');
    } else if (this.tabSelected == TAB_SELECTED.vatTu) {
      this.handleOpenModal('thongTinVatTuTrongNam');
    }
  }

  handleOpenModal(modalName: string) {
    this.modals[modalName] = true;
  }

  redirectChiTieuKeHoachNam() {
    this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
  }
}
