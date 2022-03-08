import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeHoachLuongThuc } from 'src/app/models/KeHoachLuongThuc';
import { KeHoachMuoi } from 'src/app/models/KeHoachMuoi';
import { TAB_SELECTED } from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam.constant';
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
  selector: 'app-dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl:
    './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: [
    './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss',
  ],
})
export class DieuChinhThongTinChiTieuKeHoachNamComponent implements OnInit {
  listThoc: KeHoachLuongThuc[] = [];
  listMuoi: KeHoachMuoi[] = [];
  listVatTu = [];
  modals = {
    luaChonIn: false,
    thongTinLuongThuc: false,
    thongTinVatTuTrongNam: false,
    thongTinMuoi: false,
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
    const data = {
      data: {
        khluongthuc: [
          {
            stt: 1,
            cucId: null,
            cucDTNNKhuVuc: 'Hà Nội',
            tkdnTongSoQuyThoc: 14316,
            tkdnTongThoc: 6000,
            tkdnTongGao: null,
            tkdnThoc: [
              {
                nam: 2019,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2020,
                soLuong: 3000,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 3000,
                vatTuId: null,
              },
            ],
            tkdnGao: [
              {
                nam: 2020,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 4158,
                vatTuId: null,
              },
            ],
            ntnTongSoQuyThoc: 21000,
            ntnThoc: 3000,
            ntnGao: 9000,
            xtnTongSoQuyThoc: 11316,
            xtnTongThoc: 3000,
            xtnTongGao: 4158,
            xtnThoc: [
              {
                nam: 2019,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2020,
                soLuong: 3000,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 0,
                vatTuId: null,
              },
            ],
            xtnGao: [
              {
                nam: 2020,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 4158,
                vatTuId: null,
              },
            ],
            tkcnTongSoQuyThoc: 24000,
            tkcnTongThoc: 6000,
            tkcnTongGao: 9000,
          },
          {
            stt: null,
            cucId: null,
            cucDTNNKhuVuc: 'Cộng',
            tkdnTongSoQuyThoc: 14316,
            tkdnTongThoc: 6000,
            tkdnTongGao: null,
            tkdnThoc: [
              {
                nam: 2019,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2020,
                soLuong: 3000,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 3000,
                vatTuId: null,
              },
            ],
            tkdnGao: [
              {
                nam: 2020,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 4158,
                vatTuId: null,
              },
            ],
            ntnTongSoQuyThoc: 21000,
            ntnThoc: 3000,
            ntnGao: 9000,
            xtnTongSoQuyThoc: 11316,
            xtnTongThoc: 3000,
            xtnTongGao: 4158,
            xtnThoc: [
              {
                nam: 2019,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2020,
                soLuong: 3000,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 0,
                vatTuId: null,
              },
            ],
            xtnGao: [
              {
                nam: 2020,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 4158,
                vatTuId: null,
              },
            ],
            tkcnTongSoQuyThoc: 24000,
            tkcnTongThoc: 6000,
            tkcnTongGao: 9000,
          },
        ],
        khMuoi: [
          {
            stt: 1,
            cucId: null,
            cucDTNNKhuVuc: 'Hà Nội',
            tkdnTongSoMuoi: 14316,
            tkdnMuoi: [
              {
                nam: 2019,
                soLuong: 6000,
                vatTuId: null,
              },
              {
                nam: 2020,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 3000,
                vatTuId: null,
              },
            ],
            ntnTongSoMuoi: 21000,
            xtnTongSoMuoi: 11316,
            xtnMuoi: [
              {
                nam: 2019,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2020,
                soLuong: 3000,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 0,
                vatTuId: null,
              },
            ],
            tkcnTongSoMuoi: 24000,
          },
          {
            stt: null,
            cucId: null,
            cucDTNNKhuVuc: 'Cộng',
            tkdnTongSoMuoi: 14316,
            tkdnMuoi: [
              {
                nam: 2019,
                soLuong: 6000,
                vatTuId: null,
              },
              {
                nam: 2020,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 3000,
                vatTuId: null,
              },
            ],
            ntnTongSoMuoi: 21000,
            xtnTongSoMuoi: 11316,
            xtnMuoi: [
              {
                nam: 2019,
                soLuong: 0,
                vatTuId: null,
              },
              {
                nam: 2020,
                soLuong: 3000,
                vatTuId: null,
              },
              {
                nam: 2021,
                soLuong: 0,
                vatTuId: null,
              },
            ],
            tkcnTongSoMuoi: 24000,
          },
        ],
      },
      statusCode: 0,
      msg: 'Thành công',
      included: null,
    };
    this.listThoc = data.data.khluongthuc;
    this.listMuoi = data.data.khMuoi;
    this.id = +this.routerActive.snapshot.paramMap.get('id');
  }

  themMoi() {
    if (this.tabSelected == TAB_SELECTED.luongThuc) {
      this.handleOpenModal('thongTinLuongThuc');
    } else if (this.tabSelected == TAB_SELECTED.vatTu) {
      this.handleOpenModal('thongTinVatTuTrongNam');
    } else if (this.tabSelected == TAB_SELECTED.muoi) {
      this.handleOpenModal('thongTinMuoi');
    }
  }

  handleOpenModal(modalName: string) {
    this.modals[modalName] = true;
  }

  redirectChiTieuKeHoachNam() {
    this.router.navigate([
      '/kehoach/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc',
    ]);
  }
}
