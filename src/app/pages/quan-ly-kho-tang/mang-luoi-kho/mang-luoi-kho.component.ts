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
// import { NewDonViComponent } from './new-don-vi/new-don-vi.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MangLuoiKhoService } from 'src/app/services/quan-ly-kho-tang/mangLuoiKho.service';
import { Globals } from 'src/app/shared/globals';
import dayjs from 'dayjs';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import {NewDonViComponent} from "../../quan-tri-danh-muc/danh-muc-don-vi/new-don-vi/new-don-vi.component";
import {ThemMoiKhoComponent} from "./them-moi-kho/them-moi-kho.component";
import {UserLogin} from "../../../models/userlogin";
import {UserService} from "../../../services/user.service";
import {
  DialogThemMoiSoDuDauKyComponent
} from "../../../components/dialog/dialog-them-moi-so-du-dau-ky/dialog-them-moi-so-du-dau-ky.component";



@Component({
  selector: 'app-mang-luoi-kho',
  templateUrl: './mang-luoi-kho.component.html',
  styleUrls: ['./mang-luoi-kho.component.scss']
})
export class MangLuoiKhoComponent implements OnInit {

  @ViewChild('nzTreeSelectComponent', { static: false }) nzTreeSelectComponent!: NzTreeSelectComponent;
  searchValue = '';
  searchFilter = {
    soQD: '',
    maDonVi: ''
  };
  userInfo: UserLogin
  keySelected: any;
  res: any
  nodes: any = [];
  nodeDetail: any;
  defaultExpandedKeys: any = [];
  nodeSelected: any;
  detailDonVi: FormGroup;
  levelNode: number = 1;
  isEditData: boolean = true;
  dataTable: any[] = []
  fileDinhKems: any[] = []
  listNam: any[] = [];
  dvi: string = 'Tấn kho'
  checkLoKho: boolean= true;
  constructor(
    private router: Router,
    private donviService: DonviService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private _modalService: NzModalService,
    private spinner: NgxSpinnerService,
    private mangLuoiKhoService: MangLuoiKhoService,
    public globals: Globals,
    private userService: UserService,
    private danhMucService: DanhMucService,
    private modals: NzModalService
  ) {
    this.detailDonVi = this.formBuilder.group({
      id: [''],
      maCha: [null],
      maCuc: [],
      tenCuc: [],
      maChiCuc: [],
      soChiCuc: [],
      nganKhoId: [''],
      diaChi: [''],
      tenChiCuc: [''],
      tenNganlo: [''],
      maNganlo: [''],
      ngankhoId: [''],
      tenDiemkho: [''],
      maDiemkho: [''],
      diemkhoId: [''],
      tenNhakho: [''],
      maNhakho: [''],
      tenNgankho: [''],
      maNgankho: [''],
      loaikhoId: [''],
      nhakhoId: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      trangThai: [true],
      diaDiem: [''],
      type: [true],
      coLoKho: [false],
      ghiChu: [''],
      nhiemVu: [''],
      tichLuongTkLt: [''],
      tichLuongTkVt: [''],
      tichLuongSdLt: [''],
      tichLuongSdVt: [''],
      theTichSdLt: [''],
      theTichSdVt: [''],
      namSuDung: [''],
      dienTichDat: [''],
      tichLuongKdLt: [''],
      tichLuongKdVt: [''],
      theTichKdLt: [''],
      theTichKdVt: [''],
      theTichTk: [''],
      theTichTkLt: [''],
      theTichTkVt: [''],
      namNhap: [''],
      tinhtrangId: [''],
      chatluongId: [''],
      soLuongTonKho: [''],
      ngayNhapDay: [''],
      dviTinh: [''],
      soDiemKho: [''],
      soNhaKho: [''],
      soNganKho: [''],
      soLoKho: [''],
      tenThuKho: [''],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.userInfo = this.userService.getUserLogin();
    await Promise.all([
      this.layTatCaDonViTheoTree(),
      this.getListLoaiKho(),
      this.getListClKho(),
      this.getListTtKho()
    ]);
    this.spinner.hide();
  }

  listLoaiKho: any[] = []
  async getListLoaiKho() {
    this.listLoaiKho = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_KHO');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiKho = res.data;
    }
  }

  listChatLuongKho: any[] = []
  async getListClKho() {
    this.listChatLuongKho = [];
    let res = await this.danhMucService.danhMucChungGetAll('CL_KHO');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChatLuongKho = res.data;
    }
  }

  listTinhTrangKho: any[] = [];
  async getListTtKho() {
    this.listTinhTrangKho = [];
    let res = await this.danhMucService.danhMucChungGetAll('TT_KHO');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listTinhTrangKho = res.data;
    }
  }

  /**
   * call api init
   */

  async layTatCaDonViTheoTree(id?) {
      await this.donviService.layTatCaByMaDvi(LOAI_DON_VI.MLK, this.userInfo.MA_DVI).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res && res.data) {
            this.nodes = res.data
          }
          this.nodes[0].expanded = true;
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
  }


  // parentNodeSelected: any = [];
  theTich : string = 'm³';
  nzClickNodeTree(event: any): void {
    if (event.keys.length > 0) {
      this.isEditData = true;
      this.nodeSelected = event.node.origin;
      this.levelNode = this.nodeSelected.capDvi;
      this.getDetailMlkByKey(event.node)
    }
  }

  checkStatusSurplus() {
    let check = false;
    if ((this.levelNode == 7 && !this.detailDonVi.value.tongTichLuongDsd)  || (this.levelNode == 6 && !this.detailDonVi.value.coLoKho && !this.detailDonVi.value.tongTichLuongDsd)) {
      check = true
    }
    return check;
  }

  async getDetailMlkByKey(dataNode) {
    if (dataNode) {
      let body = {
        maDvi: dataNode.origin.key,
        capDvi: this.nodeSelected.capDvi
      }
      await this.mangLuoiKhoService.getDetailByMa(body).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataNodeRes = res.data.object;
          this.bindingDataDetail(dataNodeRes);
          this.showDetailDonVi(dataNode.origin.id)
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
    }
  }

  bindingDataDetail(dataNode) {
    this.convertDataChild(dataNode);
    // this.detailDonVi.patchValue({
    //   dienTichDat: dataNode.dienTichDat,
    //   tichLuongThietKe: dataNode.tichLuongThietKe,
    //   tichLuongChua: dataNode.tichLuongChua,
    //   tichLuongKd: dataNode.tichLuongKhaDung,
    //   soLuongChiCuc: dataNode.soLuongChiCuc,
    //   soLuongDiemKho: dataNode.soLuongDiemKho,
    //   soLuongNhaKho: dataNode.soLuongNhaKho,
    //   soLuongNganKho: dataNode.soLuongNganKho,
    //   soLuongNganLo: dataNode.soLuongNganLo,
    // });
  }

  convertDataChild(dataNode) {
    this.dataTable = []
    // tichLuongThietKe: element.tichLuongThietKe,
    // tichLuongChuaLt: element.tichLuongChuaLt,
    // tichLuongChuaVt: element.tichLuongChuaVt,
    // tichLuongKdLt: element.tichLuongKdLt,
    // tichLuongKdVt: element.tichLuongKdVt
    if (dataNode && dataNode.child) {
      dataNode.child.forEach(element => {
        let dataChild = {
          tenDvi: null,
          tichLuongThietKe: 2,
          tichLuongChuaLt: 3,
          tichLuongChuaVt: 4,
          tichLuongKdLt: 5,
          tichLuongKdVt: 6
        }
        dataChild.tenDvi = element.tenTongKho ?? element.tenDiemkho ?? element.tenNhakho ?? element.tenNgankho ?? element.tenNganlo
        this.dataTable = [...this.dataTable, dataChild]
      });
    }
  }

  showDetailDonVi(id?: any) {
    if (id) {
      this.donviService.getDetail(id).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.nodeDetail = res.data;
          // gán giá trị vào form
          this.detailDonVi.patchValue({
            tenDvi: this.nodeDetail.tenDvi,
            maDvi:this.nodeDetail.maDvi,
            trangThai: this.nodeDetail.trangThai == TrangThaiHoatDong.HOAT_DONG,
            diaChi: this.nodeDetail.diaChi,
            loaikhoId : this.nodeDetail.loaikhoId
          });
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      })
    }
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
      type: this.detailDonVi.value.type ? LOAI_DON_VI.PB : null
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
      nzTitle: 'Thêm mới tổ chức kho',
      nzContent: ThemMoiKhoComponent,
      nzClosable: true,
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzWidth: 1600
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        this.ngOnInit()
      }
    });
  }


  calcTong(dataColumn: string) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[dataColumn]
        return prev;
      }, null);
      return sum;
    }
  }

  themSoDuDauKy() {
    const modalQD = this.modals.create({
      nzTitle: 'KHỞI TẠO SỐ DƯ ĐẦU KỲ CHO NGĂN/LÔ KHO',
      nzContent: DialogThemMoiSoDuDauKyComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzComponentParams: {
        detail : this.detailDonVi.value,
        levelNode : this.levelNode
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
      }
    });
  }
  changeLoKho() {
    if (this.detailDonVi.value.coLoKho) {
      this.checkLoKho = true;
    }else {
      this.checkLoKho = false;
    }
  }
}
