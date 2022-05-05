import { DatePipe,Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { LBCQUYTRINHTHUCHIENDUTOANCHI, TRANGTHAIGUIDVCT } from 'src/app/Utility/utils';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC',
  templateUrl: './ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC.component.html',
  styleUrls: ['./ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC.component.scss']
})

export class DsBaoCaoTinhHinhSdDtoanThangNamTuCCComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;

  listBcaoKqua:any []=[];
  lenght:any=0;

  trangThais: any = TRANGTHAIGUIDVCT;                          // danh muc loai bao cao

  searchFilter = {
    ngayTaoTu:'',
    ngayTaoDen:'',
    trangThai:'',
    maBcao:'',
    maLoaiBcao:'',
    namBcao:'',
    thangBCao: '',
    dotBcao:'',
    paggingReq: {
      limit: 10,
      page: 1
    },
    str: '',
    donVi:'',
    maPhanBcao:'0'
  };

  donViTaos: any = [];
  baoCaos: any = LBCQUYTRINHTHUCHIENDUTOANCHI;
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification:NzNotificationService,
    private location:Location,
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
  getUnitName(dvitao:any){
    return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
  }

  async onSubmit(){
    this.spinner.show();
    await this.quanLyVonPhiService.timKiemDuyetBaoCao(this.searchFilter).toPromise().then(res => {
      if(res.statusCode==0){
        this.listBcaoKqua = res.data.content;
        this.listBcaoKqua.forEach(e => {
          e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, 'dd/MM/yyyy');
          e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, 'dd/MM/yyyy');
        })
        this.totalElements = res.data.totalElements;
        this.totalPages = res.data.totalPages;
      }else{
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    },err =>{
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
  }

  //set url khi
  setUrl(lbaocao:any) {
    this.url = '/bao-cao/'
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
}
