import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { LBC_KET_QUA_THUC_HIEN_HANG_DTQG, ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { TRANG_THAI } from 'src/app/Utility/utils';
import { UserService } from 'src/app/services/user.service';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG',
  templateUrl: './tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component.html',
  styleUrls: ['./tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component.scss']
})
export class TimKiemBaoCaoThucHienVonPhiHangDTQGComponent implements OnInit {
  listBcaoKqua: any[] = [];

  searchFilter = {
    maPhanBcao: '1',
    maDvi: '',
    ngayTaoTu: '',
    ngayTaoDen: '',
    trangThais: [],
    maBcao: '',
    maLoaiBcao: '',
    namBcao: null,
    thangBcao: null,
    dotBcao: '',
    paggingReq: {
      limit: 10,
      page: 1
    },
    str: "",
    loaiTimKiem: '0',
  }
  trangThais: any = TRANG_THAI_TIM_KIEM;
  trangThai!: string;
  totalElements = 0;
  totalPages = 0;

  donViTaos: any = [];
  userInfo: any;
  baoCaos: any = LBC_KET_QUA_THUC_HIEN_HANG_DTQG;

  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private location: Location,
    private spinner: NgxSpinnerService,
    private userService: UserService,
  ) {
  }

  async ngOnInit() {
    let userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info
    if (ROLE_CAN_BO.includes(this.userInfo?.roles[0]?.code)) {
      this.trangThai = '1';
    } else if (ROLE_TRUONG_BO_PHAN.includes(this.userInfo?.roles[0]?.code)) {
      this.trangThai = '2';
    } else if (ROLE_LANH_DAO.includes(this.userInfo?.roles[0]?.code)) {
      this.trangThai = '4';
    }
    let date = new Date();
    this.searchFilter.ngayTaoDen = date.toDateString();
    this.searchFilter.namBcao = date.getFullYear();
    date.setMonth(date.getMonth() - 1);
    this.searchFilter.ngayTaoTu = date.toDateString();

    this.searchFilter.maLoaiBcao = '1';
    this.onSubmit();
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

  //get user info
  async getUserInfo(username: string) {
    let userInfo = await this.userService.getUserInfo(username).toPromise().then(
      (data) => {
        if (data?.statusCode == 0) {
          this.userInfo = data?.data
          return data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
    return userInfo;
  }

  // lay ten don vi tao
  getUnitName(dvitao: any) {
    return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
  }

  async onSubmit() {
    this.spinner.show();
    let searchFilterTemp = Object.assign({}, this.searchFilter);
    searchFilterTemp.trangThais = [];
    searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, 'dd/MM/yyyy') || searchFilterTemp.ngayTaoTu;
    searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, 'dd/MM/yyyy') || searchFilterTemp.ngayTaoDen;
    if (this.trangThai) {
      searchFilterTemp.trangThais.push(this.trangThai)
    } else {
      searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
    }
    await this.quanLyVonPhiService.timBaoCao(searchFilterTemp).toPromise().then(res => {
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
    if (!this.searchFilter.namBcao || !this.searchFilter.maLoaiBcao || (!this.searchFilter.dotBcao && this.searchFilter.maLoaiBcao == '1')) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (this.searchFilter.namBcao >= 3000 || this.searchFilter.namBcao < 1000) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      return;
    }
    this.router.navigate(["/qlkh-von-phi/quy-trinh-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-tong-cuc-dtnn/bao-cao/" + this.searchFilter.maLoaiBcao + '/' + (this.searchFilter.maLoaiBcao == '1' ? this.searchFilter.dotBcao : '0') + '/' + this.searchFilter.namBcao])
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
