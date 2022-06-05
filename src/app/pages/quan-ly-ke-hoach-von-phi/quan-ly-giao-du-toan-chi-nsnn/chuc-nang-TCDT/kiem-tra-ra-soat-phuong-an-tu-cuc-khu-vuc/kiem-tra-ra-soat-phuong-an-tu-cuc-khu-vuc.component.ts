import { DatePipe,Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI, TRANG_THAI_GUI_DVCT, TRANG_THAI_KIEM_TRA_BAO_CAO, Utils } from 'src/app/Utility/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

// loai trang thai kiem tra
export const TRANG_THAI_KIEM_TRA_BAO_CAO_GIAO= [
  {
      id: '9',
      ten: 'Tiếp nhận'
  },
  {
      id: '7',
      ten: 'Chưa nhận'
  },

]
@Component({
  selector: 'app-kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc',
  templateUrl: './kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc.component.html',
  styleUrls: ['./kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc.component.scss']
})

export class KiemTraRaSoatPhuongAnTuCucKhuVucComponent implements OnInit {
  totalElements = 0;
  totalPages = 0;
  listBcaoKqua:any []=[];
  trangThais: any = TRANG_THAI_KIEM_TRA_BAO_CAO_GIAO;                          // danh muc loai bao cao
  trangThai!:string;
  searchFilter = {
    loaiTimKiem: "1",
    maPhanGiao: '2',
    maLoai: '2',
    maDvi:'',
    ngayTaoTu:'',
    ngayTaoDen:'',
    trangThais:[],
    maBcao:'',
    maLoaiDuAn:'',
    namBcao:'',
    thangBcao: '',
    dotBcao:'',
    paggingReq: {
      limit: 10,
      page: 1
    },
    str: '',
    donVi:'',
  };

  donViTaos: any = [];
  loaiDuAns: any[] = [
    {
      id: '1',
      tenDm: 'Giao dự toán'
    },
    {
      id: '2',
      tenDm: 'Giao, diều chỉnh dự toán'
    }
  ];
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
    this.listBcaoKqua = []
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
      this.searchFilter.trangThais = [Utils.TT_BC_7,Utils.TT_BC_9]
    }
    await this.quanLyVonPhiService.timBaoCaoGiao1(this.searchFilter).toPromise().then(res => {
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

  getStatusName(id) {

    return this.getStatusName1(id);
  }

  // lay ten trang thai theo ma trang thai
  public getStatusName1(id: string) {
    let statusName;
    switch (id) {
        case Utils.TT_BC_0:
            statusName = "Đã xóa";
            break;
        case Utils.TT_BC_1:
            statusName = "Đang soạn"
            break;
        case Utils.TT_BC_2:
            statusName = "Trình duyệt"
            break;
        case Utils.TT_BC_3:
            statusName = "Trưởng BP từ chối"
            break;
        case Utils.TT_BC_4:
            statusName = "Trưởng BP duyệt"
            break;
        case Utils.TT_BC_5:
            statusName = "Lãnh đạo từ chối"
            break;
        case Utils.TT_BC_6:
            statusName = "Lãnh đạo duyệt"
            break;
        case Utils.TT_BC_7:
            statusName = "chưa nhận"
            break;
        case Utils.TT_BC_8:
            statusName = "Từ chối"
            break;
        case Utils.TT_BC_9:
            statusName = "Tiếp nhận"
            break;
        case Utils.TT_BC_10:
            statusName = "Điều chỉnh theo số kiểm tra"
            break;
        case Utils.TT_BC_11:
            statusName = "Đã giao"
            break;
        case Utils.TT_BC_KT:
            statusName = "Chưa có"
            break;
        default:
            statusName = id;
            break;
    }
    return statusName;
}

xemChiTiet(id: string, maLoaiDan: string) {
  if(maLoaiDan == "1"){
    this.router.navigate([
        '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/' + id ,
    ])
  }else if(maLoaiDan == "2"){
    this.router.navigate([
        '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/' + id ,
    ])
  }else{
    this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
  }
}
}
