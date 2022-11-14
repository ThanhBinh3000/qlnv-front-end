import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';
import { DonviService } from 'src/app/services/donvi.service';
import { ResponseData, OldResponseData } from 'src/app/interfaces/response';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { HelperService } from 'src/app/services/helper.service';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import { LOAI_DON_VI, TrangThaiHoatDong } from 'src/app/constants/status';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import {NewHangHoaComponent} from "./new-hang-hoa/new-hang-hoa.component";
import {DanhMucService} from "../../../services/danhmuc.service";
import {UserService} from "../../../services/user.service";
import {DanhMucTieuChuanService} from "../../../services/quantri-danhmuc/danhMucTieuChuan.service";



@Component({
  selector: 'app-danh-muc-hang-hoa',
  templateUrl: './danh-muc-hang-hoa.component.html',
  styleUrls: ['./danh-muc-hang-hoa.component.scss']
})
export class DanhMucHangHoaComponent implements OnInit {
  @ViewChild('nzTreeSelectComponent', { static: false }) nzTreeSelectComponent!: NzTreeSelectComponent;
  searchValue = '';
  searchFilter = {
    soQD: '',
    maDonVi: ''
  };
  keySelected: any;
  res: any
  nodes: any = [];
  nodeDetail: any;
  defaultExpandedKeys: any = [];
  nodeSelected: any;
  detailHangHoa: FormGroup;
  levelNode: number = 0;
  isEditData: boolean = false;
  listLhbq: any[] = [];
  listPpbq: any[] = [];
  listHtbq: any[] = [];
  listLoaiHang: any[] = [];
  listDviQly : any[] = [];
  listDviTinh: any[] = [];


  constructor(
    private router: Router,
    private dmHangService: DanhMucService,
    private dmDonVi: DonviService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private _modalService: NzModalService,
    private spinner: NgxSpinnerService,
    public userSerivce: UserService,
    private tieuChuanService : DanhMucTieuChuanService,
  ) {
    this.detailHangHoa = this.formBuilder.group({
      id: [''],
      maCha: [''],
      tenHhCha: ['', ],
      tenHangHoa: ['', ],
      maDviTinh: ['', Validators.required],
      dviQly: ['', Validators.required],
      tchuanCluong: ['', ],
      thoiHanLk: ['', ],
      loaiHang: ['', Validators.required],
      kyHieu: ['', ],
      ma: ['', Validators.required],
      ghiChu: ['',],
      trangThai: ["01"],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.loadDviTinh(),
      this.layTatCaDonViTheoTree(),
      this.loadListLhBq(),
      this.loadListPpbq(),
      this.loadListHtbq(),
      this.loadListLoaiHang(),
      this.loadListDviQly(),
    ]);
    this.spinner.hide();
  }

  /**
   * call api init
   */

  async layTatCaDonViTheoTree(id?) {
    await this.dmHangService.layTatCaHangHoaDviQly().then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.nodes = res.data;
        if (id) {
          this.showdetailHangHoa(id)
        } else {
          this.showdetailHangHoa(res.data[0].id)
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    })
  }

  async loadListLhBq() {
    this.listLhbq = [];
    let res = await this.dmHangService.danhMucChungGetAll('LOAI_HINH_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLhbq = res.data;
      if (this.listLhbq) {
        this.listLhbq.forEach(item => {
          item.type = 'lhbq'
        })
      }
    }
  }

  async loadTieuChuanCluong(maHH) {
    let res = await this.tieuChuanService.getDetailByMaHh(maHH);
    this.detailHangHoa.patchValue({
      tchuanCluong : res.data ? res.data.tenQchuan : null
    })
  }

  async loadListPpbq() {
    this.listPpbq = [];
    let res = await this.dmHangService.danhMucChungGetAll('PT_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPpbq = res.data;
      if (this.listPpbq) {
        this.listPpbq.forEach(item => {
          item.type = 'ppbq'
        })
      }
    }
  }

  async loadListHtbq() {
    this.listHtbq = [];
    let res = await this.dmHangService.danhMucChungGetAll('HINH_THUC_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHtbq = res.data;
      if (this.listHtbq) {
        this.listHtbq.forEach(item => {
          item.type = 'htbq'
        })
      }
    }
  }

  async loadListDviQly() {
    this.listDviQly = [];
    let res = await this.dmHangService.layTatCaDviQly();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDviQly = res.data;
      }
    }

  async loadListLoaiHang() {
    this.listLoaiHang = [];
    let res = await this.dmHangService.danhMucChungGetAll('LOAI_HANG_DTQG');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHang = res.data;
    }
  }

  async loadDviTinh() {
    this.listDviTinh = [];
    let res = await this.dmHangService.danhMucChungGetAll('DON_VI_TINH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDviTinh = res.data;
    }
  }

  parentNodeSelected: any = [];

  nzClickNodeTree(event: any): void {
    if (event.keys.length > 0) {
      this.nodeSelected = event.node.origin;
      this.parentNodeSelected = event?.parentNode?.origin
      if (this.nodeSelected.ma != null) {
        this.showdetailHangHoa(this.nodeSelected.id)
      }
    }
  }

  showdetailHangHoa(id?: any) {
    if (id) {
      this.dmHangService.getDetail(id).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.nodeDetail = res.data;
          // gán giá trị vào form
          this.levelNode = +res.data.cap;
          this.listLhbq.forEach(item => {
            item.checked = true
          })
          let dviTinh;
          if (this.nodeDetail.maDviTinh) {
             dviTinh = this.listDviTinh.filter(item => item.giaTri == this.nodeDetail.maDviTinh);
          }
          let detaiParent = this.nodeDetail.detailParent;
          this.detailHangHoa.patchValue({
            maCha:detaiParent ? detaiParent.ma : null,
            id: this.nodeDetail.id,
            tenHhCha: detaiParent ? detaiParent.ten : null,
            tenHangHoa: this.nodeDetail.ten,
            dviQly: this.nodeDetail.dviQly,
            maDviTinh: dviTinh ? dviTinh[0].ma : null,
            tchuanCluong: this.nodeDetail.tchuanCluong,
            thoiHanLk: this.nodeDetail.thoiHanLk,
            loaiHang: this.nodeDetail.loaiHang,
            kyHieu: this.nodeDetail.kyHieu,
            ma: this.nodeDetail.ma,
            ghiChu: this.nodeDetail.ghiChu,
            trangThai: res.data.trangThai == TrangThaiHoatDong.HOAT_DONG,
          })
          this.loadTieuChuanCluong(this.detailHangHoa.value.ma);
          this.loadDetailBq(this.nodeDetail.loaiHinhBq, this.nodeDetail.phuongPhapBq, this.nodeDetail.hinhThucBq  );
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
    }
  }

  loadDetailBq(listLh, listPp, listHt) {
    if (listHt) {
      this.listLhbq.forEach(item => {
        item.checked = undefined
        listLh.forEach(bq => {
          if (item.ma == bq.ma) {
            item.checked = true;
          }
        })
      })
    }
    if (listPp) {
      this.listPpbq.forEach(item => {
        item.checked = undefined
        listPp.forEach(bq => {
          if (item.ma == bq.ma) {
            item.checked = true;
          }
        })
      })
    }
  if (listHt) {
    this.listHtbq.forEach(item => {
      item.checked = undefined
      listHt.forEach(bq => {
        if (item.ma == bq.ma) {
          item.checked = true;
        }
      })
    })
  }
  }

  showEdit(editData: boolean) {
    this.isEditData = editData
  }

  update() {
    this.helperService.markFormGroupTouched(this.detailHangHoa);
    if (this.detailHangHoa.invalid) {
      return;
    }
    let body = this.detailHangHoa.value;
    body.trangThai = this.detailHangHoa.get('trangThai').value ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG;
    body.loaiHinhBq = this.listLhbq.filter(item => item.checked === true)
    body.phuongPhapBq = this.listPpbq.filter(item => item.checked === true)
    body.hinhThucBq = this.listHtbq.filter(item => item.checked === true)
    body.loaiHang = this.convertLoaiHh(this.detailHangHoa.value.loaiHang)
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn sửa ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.dmHangService.update(body).then((res: OldResponseData) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.isEditData = false;
            this.showdetailHangHoa(this.detailHangHoa.value.id);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
      }
    });
  }

  delete() {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.dmHangService.delete(this.nodeSelected?.id == undefined ? this.nodeSelected : this.nodeSelected?.id).then((res: OldResponseData) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            // xét node về không
            this.nodeSelected = []
            this.layTatCaDonViTheoTree()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
      }
    });
  }

  convertLoaiHh(loaiVthh) {
    let loaiHh = loaiVthh
    switch (loaiHh) {
      case "3":
      case "2" : {
        loaiHh = 'VT'
        break;
      }
      case "1": {
        loaiHh = 'LT';
        break;
      }
      case "4" : {
        loaiHh = 'M';
        break;
      }
    }
    return loaiHh;
  }


  create() {
    var nodesTree = this.nodes;
    let modal = this._modalService.create({
      nzTitle: 'Thêm mới danh mục hàng hóa',
      nzContent: NewHangHoaComponent,
      nzClosable: true,
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzWidth: 1200,
      nzComponentParams: { nodesTree },
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        this.ngOnInit()
      }
    });
  }
}
