import { Component, OnInit } from '@angular/core';
import dayjs from "dayjs";
import { UserService } from "../../../../services/user.service";
import { STATUS } from 'src/app/constants/status';
import { DANH_MUC_LEVEL } from "../../../luu-kho/luu-kho.constant";
import { UserLogin } from "../../../../models/userlogin";
import { DonviService } from "../../../../services/donvi.service";

@Component({
  selector: 'app-ke-hoach-nhap-khac',
  templateUrl: './ke-hoach-nhap-khac.component.html',
  styleUrls: ['./ke-hoach-nhap-khac.component.scss']
})
export class KeHoachNhapKhacComponent implements OnInit {
  listNam: any[] = [];
  searchFilter = {
    namKh: '',
    soDx: '',
    dviDexuat: '',
    trangThai: '',
  };
  danhSachCuc: any[] = [];
  STATUS = STATUS;
  userInfo: UserLogin;
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' }
  ];
  constructor(
    public userService: UserService,
    private dviService: DonviService,
  ) { }
  tuNgayDx: Date | null = null;
  denNgayDx: Date | null = null;
  tuNgayDuyet: Date | null = null;
  denNgayDuyet: Date | null = null;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayDx) {
      return false;
    }
    return startValue.getTime() > this.denNgayDx.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayDx) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayDx.getTime();
  };

  disabledTuNgayDuyet = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayDuyet) {
      return false;
    }
    return startValue.getTime() > this.denNgayDuyet.getTime();
  };

  disabledDenNgayDuyet = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayDuyet) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayDuyet.getTime();
  };
  ngOnInit(): void {
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }
  async loadDanhSachCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: "01"
    };

    const dsTong = await this.dviService.layDonViTheoCapDo(body);
    this.danhSachCuc = dsTong[DANH_MUC_LEVEL.CUC];
    this.danhSachCuc = this.danhSachCuc.filter(item => item.type != "PB");
    if (this.userService.isCuc()) {
      this.searchFilter.dviDexuat = this.userInfo.MA_DVI;
    }
  }
  clearFilter() {
    this.searchFilter.namKh = null;
    this.searchFilter.soDx = null;

    this.search();
  }
  search(){};
  deleteSelect(){};
  exportData(){};
  themMoi(){};
}
