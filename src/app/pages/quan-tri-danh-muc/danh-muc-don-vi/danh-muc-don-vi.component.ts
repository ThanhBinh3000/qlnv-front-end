import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DonviService} from 'src/app/services/donvi.service';
import {OldResponseData} from 'src/app/interfaces/response';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {HelperService} from 'src/app/services/helper.service';
import {NzTreeSelectComponent} from 'ng-zorro-antd/tree-select';
import {LOAI_DON_VI, TrangThaiHoatDong} from 'src/app/constants/status';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NewDonViComponent} from './new-don-vi/new-don-vi.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserLogin} from "../../../models/userlogin";
import {UserService} from "../../../services/user.service";
import { DanhMucService } from "../../../services/danhmuc.service";


@Component({
  selector: 'app-danh-muc-don-vi',
  templateUrl: './danh-muc-don-vi.component.html',
  styleUrls: ['./danh-muc-don-vi.component.scss'],
})
export class DanhMucDonViComponent implements OnInit {
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
  nodeSelected: any = []
  detailDonVi: FormGroup;
  levelNode: number = 0;
  isEditData: boolean = false;
  userInfo : UserLogin
  listTinhThanh: any[] = [];
  listQuanHuyen: any[] = [];
  listPhuongXa: any[] = [];

  constructor(
    private router: Router,
    private donviService: DonviService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private _modalService: NzModalService,
    private spinner: NgxSpinnerService,
    private danhMucService: DanhMucService,
    public userService : UserService
  ) {
    this.detailDonVi = this.formBuilder.group({
      id: [''],
      maDviCha: [''],
      tenDvi: ['', Validators.required],
      maDvi: [''],
      tenVietTat: [''],
      diaChi: [''],
      capDvi: [''],
      fax: [''],
      sdt: [''],
      trangThai: [''],
      type: [],
      ghiChu: [''],
      vungMien: [''],
      tinhThanh: [''],
      quanHuyen: [''],
      phuongXa: [''],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    await Promise.all([
      this.layTatCaDonViTheoTree(),
      this.loadDsKhuVuc()
    ]);
    this.spinner.hide();
  }

  /**
   * call api init
   */

  listType = ["PB", "DV"]

  async layTatCaDonViTheoTree(id?) {
    let body = {
      type : this.listType
    }
    await this.donviService.layTatCaDonViCha(body).then((res: OldResponseData) => {
    // let body = {
    //   maDviCha: this.userInfo.MA_DVI,
    //   trangThai: '01',
    // }
    // await this.donviService.layTatCaDangTree(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.nodes = res.data;
        this.nodes[0].expanded = true;
        //  lúc đầu mắc định lấy node gốc to nhất
        this.nodeSelected = res.data[0].id;
        // lấy detail đon vị hiện tại
        if (id) {
          this.showDetailDonVi(id)
        } else {
          this.showDetailDonVi(res.data[0].id)
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    })
  }

  async loadDsKhuVuc() {
    let res = await this.danhMucService.loadDsDiaDanh();
    if (res.msg == MESSAGE.SUCCESS) {
      let listKv = res.data;
      if (listKv && listKv.length > 0) {
        this.listTinhThanh = listKv.filter(item => item.capDiaDanh === 1);
      }
    }
  }

  parentNodeSelected: any = [];

  nzClickNodeTree(event: any): void {
    if (event.keys.length > 0) {
      this.nodeSelected = event.node.origin.id;
      this.parentNodeSelected = event?.parentNode?.origin
      this.showDetailDonVi(event.node.origin.id)
    }
  }

  showDetailDonVi(id?: any) {
    this.spinner.show();
    if (id) {
      this.donviService.getDetail(id).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.nodeDetail = res.data;
          // gán giá trị vào form
          this.levelNode = +res.data.capDvi;
          this.detailDonVi.patchValue({
            id: res.data.id,
            maDviCha: res.data.maDviCha,
            tenVietTat: res.data.tenVietTat,
            tenDvi: res.data.tenDvi,
            maDvi: res.data.maDvi,
            capDvi: res.data.capDvi,
            diaChi: res.data.diaChi,
            sdt: res.data.sdt,
            fax: res.data.fax,
            trangThai: res.data.trangThai == TrangThaiHoatDong.HOAT_DONG,
            type: res.data.type == LOAI_DON_VI.PB,
            ghiChu: res.data.ghiChu,
            vaiTro: res.data.vaiTro,
            vungMien : res.data.vungMien,
            tinhThanh : res.data.capDvi == 2 && res.data.tinhThanh ? res.data.tinhThanh.split(',') : res.data.tinhThanh,
            quanHuyen: res.data.quanHuyen,
            phuongXa: res.data.phuongXa,
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
    }
    this.spinner.hide();
  }

  showEdit(editData: boolean) {
    this.isEditData = editData
  }

  update() {
    this.helperService.markFormGroupTouched(this.detailDonVi);
    if (this.detailDonVi.invalid) {
      return;
    }
    let body = {
      ...this.detailDonVi.value,
      trangThai: this.detailDonVi.value.trangThai ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG,
      type: this.detailDonVi.value.type ? LOAI_DON_VI.PB  : LOAI_DON_VI.DV
    };
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn sửa ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.donviService.update(body).then((res: OldResponseData) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.isEditData = false;
            this.ngOnInit();
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
        this.donviService.delete(this.nodeSelected?.id == undefined ? this.nodeSelected : this.nodeSelected?.id).then((res: OldResponseData) => {
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

  create() {
    var nodesTree = this.nodes;
    let modal = this._modalService.create({
      nzTitle: 'Thêm mới đơn vị',
      nzContent: NewDonViComponent,
      nzClosable: true,
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzWidth: 900,
      nzComponentParams: { nodesTree },
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        this.ngOnInit()
      }
    });
  }

  changeTinhThanh(event) {
    if (event) {
      if (this.listTinhThanh && this.listTinhThanh.length > 0) {
        this.listQuanHuyen = this.listTinhThanh.filter(item => item.maCha == event && item.capDiaDanh === 2)
      }
    }
  }

  changeQuanHuyen(event) {
    if (event) {
      if (this.listQuanHuyen && this.listQuanHuyen.length > 0) {
        this.listPhuongXa = this.listQuanHuyen.filter(item => item.maCha == event && item.capDiaDanh === 3)
      }
    }
  }
}
