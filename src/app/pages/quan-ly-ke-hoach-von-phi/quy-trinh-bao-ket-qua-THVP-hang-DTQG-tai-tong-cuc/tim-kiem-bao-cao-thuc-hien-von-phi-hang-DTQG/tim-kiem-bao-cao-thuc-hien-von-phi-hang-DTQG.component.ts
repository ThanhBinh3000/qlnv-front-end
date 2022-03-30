import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';

@Component({
  selector: 'app-tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG',
  templateUrl: './tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component.html',
  styleUrls: ['./tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component.scss']
})
export class TimKiemBaoCaoThucHienVonPhiHangDTQGComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;

  // phan cu cua teca
  visible = false;
  nodes: any = [];
  nodeDetail: any;
  listDonViDuoi = [];
  cureentNodeParent: any = [];
  datasNguoiDung: any = [];
  nodeSelected: any = [];
  listHTDV: any = [];
  listKPB: any = [];
  noParent = true;
  searchValue = '';

  listTrangThai:any []=[
    {
      id:'1',
      tenDm:'Đang soạn'
    },
    {
      id:'2',
      tenDm:'Trình duyệt'
    },
    {
      id:'3',
      tenDm:'Trưởng BP từ chối'
    },
    {
      id:'4',
      tenDm:'Trưởng BP duyệt'
    },
    {
      id:'5',
      tenDm:'Lãnh đạo từ chối'
    },
    {
      id:'6',
      tenDm:'Lãnh đạo duyệt'
    },
    {
      id:'7',
      tenDm:'Gửi ĐV cấp trên'
    },
    {
      id:'8',
      tenDm:'ĐV cấp trên từ chối'
    },
    {
      id:'9',
      tenDm:'ĐV cấp trên duyệt'
    },
  ]

  listLoaiBcao:any[]=[
    {
      id:'1',
      tenDm:'Đợt'
    },
    {
      id:'2',
      tenDm:'Năm'
    }
  ]

  listBcaoKqua:any []=[];
  lenght:any=0;


  searchFilter = {
    maBaoCao:'',
    namBaoCao:'',
    dotBaoCao:'',
    ngayLap:'',
    denNgay:'',
    trangThai:'',
    loaiBaoCao:2,
    paggingReq: {
      limit: 20,
      page: 1
    },
    str: "",
  };


  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = [];
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notifi:NzNotificationService,
  ) {
  }

  ngOnInit(): void {
    //lay danh sach loai bao cao
    this.danhMuc.dMLoaiBaoCaoKetQuaThucHienHangDTQG().toPromise().then(
      data => {
        console.log(data);
        if (data.statusCode == 0) {
          this.baoCaos = data.data?.content;

        } else {
          this.notifi.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;

        } else {
          this.notifi.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  // lay ten don vi tao
  getUnitName(dvitao:any){
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


  timkiem(){
    console.log(this.searchFilter);
    // if(this.searchFilter.maLoaiBcao==''){
    //   this.notifi.error('Tìm kiếm','Bạn chưa chọn loại báo cáo!');
    //   return;
    // }
    // this.searchFilter.maLoaiBcao='91';
    this.quanLyVonPhiService.timBaoCao(this.searchFilter).subscribe(res => {
      if(res.statusCode==0){

        this.notifi.success(MESSAGE.SUCCESS, res?.msg);
        this.listBcaoKqua = res.data.content;
        if(this.listBcaoKqua.length!=0){
          this.lenght = this.listBcaoKqua.length;
        }
      }else{
        this.notifi.error(MESSAGE.ERROR, res?.msg);
      }
      console.log(res);
    },err =>{
      this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
  }


  //set url khi
  setUrl(lbaocao:any) {
      switch (lbaocao) {
        case '1':
          this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a-/'+lbaocao
          break;
        case '2':
          this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a-/'+lbaocao
          break;
        default:
          this.url = null;
          break;
      }
  }

  themmoi(){
    if(this.url==null){
      this.notifi.error(MESSAGE.ERROR, 'Bạn chưa chọn loại báo cáo');
      return;
    }else{
      this.router.navigate(['/qlkh-von-phi/quy-trinh-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-tong-cuc-dtnn/'+this.url]);
    }
  }

  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
  }

}
