import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeHoachLuongThuc } from 'src/app/models/KeHoachLuongThuc';
import { KeHoachMuoi } from 'src/app/models/KeHoachMuoi';
import { TAB_SELECTED } from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam.constant';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
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
  listNam: any[] = [];
  firstDayOfYear: string = "";
  lastDayOfYear: string = "";
  yearNow: number = 0;
  startValue: Date | null = null;
  endValue: Date | null = null;
  formData: FormGroup;
  errorInputRequired: string = "Dữ liệu không được để trống.";

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.yearNow = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: this.yearNow - i,
        text: this.yearNow - i,
      });
    }
    this.firstDayOfYear = '01/01/' + (this.yearNow - 1).toString();
    this.lastDayOfYear = '31/12/' + (this.yearNow - 1).toString();
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    this.formData = this.fb.group({
      soQD: [null, [Validators.required]],
      ngayKy: [null, [Validators.required]],
      ngayHieuLuc: [null, [Validators.required]],
      namKeHoach: [null, [Validators.required]],
      trichYeu: [null],
    });
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

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.formData.controls['ngayHieuLuc'].value) {
      return false;
    }
    return startValue.getTime() > this.formData.controls['ngayHieuLuc'].value.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.formData.controls['ngayKy'].value) {
      return false;
    }
    return endValue.getTime() <= this.formData.controls['ngayKy'].value.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }
}
