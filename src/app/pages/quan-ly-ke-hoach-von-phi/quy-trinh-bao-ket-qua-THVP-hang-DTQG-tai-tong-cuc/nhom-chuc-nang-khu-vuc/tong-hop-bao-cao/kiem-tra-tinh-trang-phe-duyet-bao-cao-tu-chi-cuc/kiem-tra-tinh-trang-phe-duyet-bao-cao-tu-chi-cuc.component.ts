import { DatePipe, Location} from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { TRANG_THAI_GUI_DVCT, LBC_KET_QUA_THUC_HIEN_HANG_DTQG, Utils, TRANG_THAI_KIEM_TRA_BAO_CAO } from 'src/app/Utility/utils';

@Component({
  selector: 'app-kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc',
  templateUrl: './kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc.component.html',
  styleUrls: ['./kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc.component.scss']
})
export class KiemTraTinhTrangPheDuyetBaoCaoTuChiCucComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false })
  
  totalElements = 0;
  totalPages = 0;

  listBcaoKqua:any []=[];

  trangThais: any = TRANG_THAI_KIEM_TRA_BAO_CAO;                          // danh muc loai bao cao
  trangThai!:string;
  searchFilter = {
    dotBcao:'',
    maBcao:'',
    maDvi:'',
    maDviCha: '',
    maLoaiBcao:'',
    maPhanBcao:'1',
    namBcao:'',
    ngayTaoDen:'',
    ngayTaoTu:'',
    paggingReq: {
      limit: 10,
      page: 1
    },
    str: '',
    thangBCao: '',
    trangThais:[],
    loaiTimKiem:'1',
  };
  donViTaos: any = [];
  baoCaos: any = LBC_KET_QUA_THUC_HIEN_HANG_DTQG;
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification:NzNotificationService,
    private location: Location,
    private spinner: NgxSpinnerService,
  ) {
  }

  async ngOnInit(): Promise<void> {

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
  getUnitName(dvitao:any){
    return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
  }

  async onSubmit(){
    this.spinner.show();
    this.searchFilter.trangThais= [];
    if(this.trangThai){
      this.searchFilter.trangThais.push(this.trangThai)
    }else{
      this.searchFilter.trangThais = [Utils.TT_BC_KT,Utils.TT_BC_7,Utils.TT_BC_8,Utils.TT_BC_9]
    }
    await this.quanLyVonPhiService.timBaoCao(this.searchFilter).toPromise().then(res => {
      if(res.statusCode==0){
        this.listBcaoKqua = res.data.content;
        this.listBcaoKqua.forEach(e => {
          e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, 'dd/MM/yyyy');
          e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, 'dd/MM/yyyy');
          e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, 'dd/MM/yyyy');
          e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, 'dd/MM/yyyy');
          e.ngayTao = this.datePipe.transform(e.ngayTao, 'dd/MM/yyyy');
        })
        this.totalElements = res.data?.totalElements;
        this.totalPages = res.data?.totalPages;
      }else{
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    },err =>{
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
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

  // lay ten trang thai ban ghi
  getStatusName(id) {
    const utils = new Utils();
    return utils.getStatusName(id);
  }
}
