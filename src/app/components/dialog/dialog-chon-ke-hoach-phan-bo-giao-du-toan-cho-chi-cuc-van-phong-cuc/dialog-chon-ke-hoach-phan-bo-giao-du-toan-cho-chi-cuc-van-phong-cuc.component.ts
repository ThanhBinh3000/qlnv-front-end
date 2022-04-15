import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService} from 'src/app/services/quanLyVonPhi.service'
import { TRANGTHAITIMKIEM } from 'src/app/Utility/utils';

@Component({
  selector: 'app-dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc',
  templateUrl: './dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component.html',
  styleUrls: ['./dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component.scss']
})
export class DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent implements OnInit {

  @Input() danhSachKhoanMuc:any;
  danhSachBaoCao: any;
  khoanMucs: any = [];
  trangThais: any = TRANGTHAITIMKIEM;

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
  ) { }

  async ngOnInit() {
    this.validateForm = this.fb.group({
      nam: [null, [Validators.required,Validators.pattern('^[12][0-9]{3}$')]],
    });
    console.log(this.danhSachKhoanMuc);
    console.log(this.trangThais);

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
     //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
     this.QuanLyVonPhiService.timDanhSachPhanBo(requestReport).toPromise().then(
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

    // this.QuanLyVonPhiService.timDanhSachBCGiaoBTCPD(requestReport).toPromise().then(
    //   (data) => {
    //     if (data.statusCode == 0) {
    //       var tempArr = data.data;
    //       tempArr.forEach(e =>{
    //         this.danhSachKhoanMuc.push(e);
    //         e.lstQlnvDmKhoachVonPhi.forEach( el => {
    //         this.danhSachKhoanMuc.push(el);
    //         })
    //       })
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, data?.msg);
    //     }
    //   },
    //   (err) => {
    //     this.notification.error(MESSAGE.ERROR, err?.msg);
    //   }
    // );
  }

  handleOk() {
    let req ={
      danhSachKhoanMuc : this.danhSachKhoanMuc,
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
