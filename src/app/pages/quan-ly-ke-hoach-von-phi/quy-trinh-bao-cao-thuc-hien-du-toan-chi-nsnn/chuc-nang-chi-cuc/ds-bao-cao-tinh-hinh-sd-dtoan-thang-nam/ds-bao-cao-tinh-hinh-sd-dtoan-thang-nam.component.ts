import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { LBCQUYTRINHTHUCHIENDUTOANCHI, Utils } from 'src/app/Utility/utils';
import { TRANGTHAITIMKIEM } from 'src/app/Utility/utils';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComponentsModule } from 'src/app/components/components.module';
@Component({
  selector: 'app-ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam',
  templateUrl: './ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam.component.html',
  styleUrls: ['./ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam.component.scss']
})

export class DsBaoCaoTinhHinhSdDtoanThangNamComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url: any = '/bao-cao/';

  trangThais: any = TRANGTHAITIMKIEM;
  trangThai!:string;
  listBcaoKqua: any[] = [];
  lenght: any = 0;


  searchFilter = {
    maPhanBcao: '0',
    maDvi: '',
    ngayTaoTu: '',
    ngayTaoDen: '',
    trangThais: [],
    maBcao: '',
    maLoaiBcao: '',
    namBcao: null,
    thangBCao: null,
    dotBcao: '',
    paggingReq: {
      limit: 10,
      page: 1
    },
    str: "",
    loaiTimKiem:'0',
  };

  donViTaos: any = [];
  baoCaos: any = LBCQUYTRINHTHUCHIENDUTOANCHI;
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private location: Location,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  // lay ten don vi tao
  getUnitName(dvitao: any) {
    return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
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


  async onSubmit() {
    this.spinner.show();
    this.searchFilter.trangThais= [];
    if(this.trangThai){
      this.searchFilter.trangThais.push(this.trangThai)
    }else{
      this.searchFilter.trangThais = [Utils.TT_BC_1,Utils.TT_BC_2,Utils.TT_BC_3,Utils.TT_BC_4,Utils.TT_BC_5,Utils.TT_BC_6,Utils.TT_BC_7,Utils.TT_BC_8,Utils.TT_BC_9]
    }
    await this.quanLyVonPhiService.timBaoCao(this.searchFilter).toPromise().then(res => {
      if (res.statusCode == 0) {
        this.listBcaoKqua = res.data.content;
        this.listBcaoKqua.forEach(e => {
          e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, 'dd/MM/yyyy');
          e.ngayTao = this.datePipe.transform(e.ngayTao, 'dd/MM/yyyy');
          e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, 'dd/MM/yyyy');
          e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, 'dd/MM/yyyy');
          e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, 'dd/MM/yyyy');
        })
        this.totalElements = res.data.totalElements;
        this.totalPages = res.data.totalPages;
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
  }
  themMoi() {
    if (!this.searchFilter.namBcao || !this.searchFilter.maLoaiBcao || (!this.searchFilter.thangBCao && this.searchFilter.maLoaiBcao == '526')) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (this.searchFilter.namBcao >= 3000 || this.searchFilter.namBcao < 1000) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      return;
    }

    this.router.navigate(["/qlkh-von-phi/quy-trinh-bc-thuc-hien-du-toan-chi-nsnn/" + this.url + '/' + this.searchFilter.maLoaiBcao + '/' + (this.searchFilter.thangBCao ? this.searchFilter.thangBCao : '0') + '/' + this.searchFilter.namBcao])
  }

  //doi so trang
  onPageIndexChange(page) {
    this.searchFilter.paggingReq.page = page;
    this.onSubmit();
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.searchFilter.paggingReq.limit = size;
    this.onSubmit();
  }

  close() {
    this.location.back();
  }

  deleteReport(id) {
		if (id) {
			this.quanLyVonPhiService.xoaBaoCao(id).toPromise().then(async res => {
				if (res.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
          this.onSubmit();
        } else {
					this.notification.error(MESSAGE.ERROR, res?.msg);
				}
			}, err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			})
		} else {
			this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
		}
	}

  // lay ten trang thai ban ghi
  getStatusName(id) {
    const utils = new Utils();
    return utils.getStatusName(id);
  }
}
