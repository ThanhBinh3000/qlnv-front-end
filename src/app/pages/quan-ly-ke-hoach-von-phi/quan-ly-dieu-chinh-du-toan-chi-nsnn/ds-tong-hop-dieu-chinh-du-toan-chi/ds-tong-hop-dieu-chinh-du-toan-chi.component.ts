import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { LOAI_BAO_CAO, TRANG_THAI_TIM_KIEM } from 'src/app/Utility/utils';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-ds-tong-hop-dieu-chinh-du-toan-chi',
  templateUrl: './ds-tong-hop-dieu-chinh-du-toan-chi.component.html',
  styleUrls: ['./ds-tong-hop-dieu-chinh-du-toan-chi.component.scss']
})
export class DsTongHopDieuChinhDuToanChiComponent implements OnInit {

  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;
  messageValidate:any = MESSAGEVALIDATE

  trangThais: any = TRANG_THAI_TIM_KIEM;
  searchFilter = {
    nam: null,
    tuNgay: "",
    denNgay: "",
    maBaoCao: "",
    donViTao: "",
    LOAI_BAO_CAO: "",
    trangThai: "",
  };
  pages = {                           // page
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = [];

  validateForm!: FormGroup;           // form

  // submitForm(){

  //   if (this.validateForm.valid) {
  //     return true;
  //   } else {
  //     Object.values(this.validateForm.controls).forEach(control => {
  //       if (control.invalid) {
  //         control.markAsDirty();
  //         control.updateValueAndValidity({ onlySelf: true });
  //       }
  //     });
  //     if(!this.searchFilter.nam || !this.searchFilter.LOAI_BAO_CAO){
  //       this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
  //     }
  //     if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000){
  //       this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
  //     }
  //     return false;
  //   }
  // }
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      namhientai: [null, [Validators.pattern('^[12][0-9]{3}$')]],
      LOAI_BAO_CAO: [null, [Validators.required]],
      temp: [null],
    });

    //lay danh sach loai bao cao
    this.baoCaos = LOAI_BAO_CAO;
    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  redirectThongTinTimKiem() {
    this.router.navigate([
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      0,
    ]);
  }

  redirectSuaThongTinTimKiem(id) {
    this.router.navigate([
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      id,
    ]);
  }

  //search list bao cao theo tieu chi
  async onSubmit() {

    let requestReport = {
      maBcao: this.searchFilter.maBaoCao,
      maDvi: this.searchFilter.donViTao,
      maLoaiBcao: this.searchFilter.LOAI_BAO_CAO,
      namBcao: this.searchFilter.nam,
      ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, 'dd/MM/yyyy'),
      ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, 'dd/MM/yyyy'),
      paggingReq: {
        limit: this.pages.size,
        page: this.pages.page,
      },
      str: "",
      trangThai: this.searchFilter.trangThai,
    };
    this.spinner.show();
    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    await this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data.content;
          this.danhSachBaoCao.forEach( e=>{
            e.ngayTao = this.datePipe.transform(e.ngayTao, 'dd/MM/yyyy');
          })
          this.totalElements = data.data.totalElements;
          this.totalPages = data.data.totalPages;

        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.spinner.hide();
  }


  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
    this.onSubmit();
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
    this.onSubmit();
  }
  xoaDieuKien() {
    this.searchFilter.nam = null
    this.searchFilter.tuNgay = null
    this.searchFilter.denNgay = null
    this.searchFilter.maBaoCao = null
    this.searchFilter.donViTao = null
    this.searchFilter.LOAI_BAO_CAO = null
    this.searchFilter.trangThai = null
  }

  taoMoi() {
    // if (!this.submitForm()) {
    //   return;
    // }
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/tong-hop-dieu-chinh-du-toan-chi-NSNN'
    ]);
  }

  xemChiTiet(id: string) {
      this.router.navigate([
        '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/tong-hop-dieu-chinh-du-toan-chi-NSNN/' + id
      ]);
  }
}
