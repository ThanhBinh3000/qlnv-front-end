import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService} from 'src/app/services/quanLyVonPhi.service'
import { TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';

@Component({
  selector: 'app-dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc',
  templateUrl: './dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component.html',
  styleUrls: ['./dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component.scss']
})
export class DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent implements OnInit {

  @Input() danhSachKhoanMuc:any;
  @Input() qDinhBTC: any;
  @Input() ngayQd: any;
  @Input() nam: any;
  @Input() nguoiKyBTC: any
  @Input() maQdCha: any;
  @Input() maDvi: any;
  @Input() soQdCha: any;
  @Input() ngayQdCha: any;
  @Input() namQdCha: any;
  @Input() matrangThaiPbo: any
  @Input() maNguoiKyBTC: any
  @Input() maDviTien: any
  danhSachBaoCao: any;
  khoanMucs: any = [];
  trangThais: any = TRANG_THAI_TIM_KIEM;
  radioValue!: any;
  options: []
  searchFilter = {
    trangThai: "",
    nam: "",
  };
  pages = {
    size: 10,
    page: 1,
  }
  totalElements = 0;

  url: string = "nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi/";
  totalPages = 0;
  messageValidate:any =MESSAGEVALIDATE;
  validateForm!: FormGroup;

  constructor(
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
    private QuanLyVonPhiService: QuanLyVonPhiService,
    private fb:FormBuilder,
    private datePipe: DatePipe,
  ) { }

  async ngOnInit() {
    this.validateForm = this.fb.group({
      nam: [null, [Validators.required,Validators.pattern('^[12][0-9]{3}$')]],
    });
    //get danh muc nhom chi
    this.danhMucService.dMKhoanMuc().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.khoanMucs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }


  timKiemBaoCaoGiao(){
    let requestReport = {
      trangThai: this.searchFilter.trangThai,
      nam: this.searchFilter.nam,
      paggingReq: {
        limit: this.pages.size,
        page: this.pages.page
      },
    };
     this.QuanLyVonPhiService.timDanhSachPhanBo1(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data.content;
          this.totalElements = data.data.totalElements;
          this.totalPages = data.data.totalPages;
          console.log(this.danhSachBaoCao);

        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  async handleOk() {
    await this.QuanLyVonPhiService.QDGiaoChiTiet1(this.radioValue).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          console.log(data);
          this.maQdCha = data.data.qdCha.id
          this.soQdCha = data.data.qdCha.soQd
          this.ngayQdCha =this.datePipe.transform( data.data.qdCha.ngayQd , Utils.FORMAT_DATE_STR,)
          this.namQdCha = data.data.nam
          this.ngayQd = data.data.ngayQd
          this.nam = data.data.nam
          this.maNguoiKyBTC = data.data.qdCha.maNguoiKy
          this.maDvi = data.data.maDvi
          this.danhSachKhoanMuc = data.data.lstCtiet
          this.matrangThaiPbo = data.data.trangThaiPbo
          this.maDviTien = data.data.maDviTien
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    let req = {
      danhSachKhoanMuc : this.danhSachKhoanMuc,
      maQdCha: this.maQdCha ,
      ngayQd: this.ngayQd ,
      nam: this.nam ,
      nguoiKyBTC:this.nguoiKyBTC ,
      maDvi: this.maDvi ,
      soQdCha: this.soQdCha ,
      ngayQdCha: this.ngayQdCha,
      namQdCha: this.namQdCha,
      matrangThaiPbo: this.matrangThaiPbo ,
      maNguoiKyBTC: this.maNguoiKyBTC,
      maDviTien: this.maDviTien,
      id: this.searchFilter.trangThai
    }
    this._modalRef.close(req);
  }

  handleCancel() {
    this._modalRef.close();
  }


  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
    this.timKiemBaoCaoGiao();
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
    this.timKiemBaoCaoGiao();
  }
}
