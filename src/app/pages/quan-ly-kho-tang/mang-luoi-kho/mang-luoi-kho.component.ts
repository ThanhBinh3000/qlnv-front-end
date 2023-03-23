import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {DonviService} from 'src/app/services/donvi.service';
import {OldResponseData} from 'src/app/interfaces/response';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {HelperService} from 'src/app/services/helper.service';
import {NzTreeSelectComponent} from 'ng-zorro-antd/tree-select';
import {LOAI_DON_VI, TrangThaiHoatDong} from 'src/app/constants/status';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NgxSpinnerService} from 'ngx-spinner';
import {MangLuoiKhoService} from 'src/app/services/quan-ly-kho-tang/mangLuoiKho.service';
import {Globals} from 'src/app/shared/globals';
import dayjs  from 'dayjs';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {ThemMoiKhoComponent} from "./them-moi-kho/them-moi-kho.component";
import {UserLogin} from "../../../models/userlogin";
import {UserService} from "../../../services/user.service";
import {
  DialogThemMoiSoDuDauKyComponent
} from "../../../components/dialog/dialog-them-moi-so-du-dau-ky/dialog-them-moi-so-du-dau-ky.component";
import {Tcdtnn} from "../../../models/Tcdtnn";


@Component({
  selector: 'app-mang-luoi-kho',
  templateUrl: './mang-luoi-kho.component.html',
  styleUrls: ['./mang-luoi-kho.component.scss']
})
export class MangLuoiKhoComponent implements OnInit {

  @ViewChild('nzTreeSelectComponent', {static: false}) nzTreeSelectComponent!: NzTreeSelectComponent;
  searchValue = '';
  searchFilter = {
    soQD: '',
    maDonVi: ''
  };

  detailTcdtnn :  Tcdtnn = new Tcdtnn();
  userInfo: UserLogin
  keySelected: any;
  res: any

  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  nodes: any = [];
  nodeDetail: any;
  defaultExpandedKeys: any = [];
  nodeSelected: any;
  detailDonVi: FormGroup;
  levelNode: number = 0;
  isEditData: boolean = true;
  dataTable: any[] = []
  fileDinhKems: any[] = []
  listNam: any[] = [];
  dvi: string = 'Tấn kho'
  checkLoKho: boolean;

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
      namSudung: [''],
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
      dviTinh: [''],
      soDiemKho: [''],
      soNhaKho: [''],
      soNganKho: [''],
      soLoKho: [''],
      tenThuKho: [''],
      slTon: [''],
      ngayNhapDay: [''],
      sdt: [''],
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
      this.getAllLoaiVthh(),
      this.getListLoaiKho(),
      this.getListClKho(),
      this.getListTtKho(),
      this.loadTinhTrangLoKho()
    ]);
    this.spinner.hide();
  }

  async loadTinhTrangLoKho() {
    this.listTinhTrang = [];
    let res = await this.danhMucService.danhMucChungGetAll('CL_KHO');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listTinhTrang = res.data;
    }
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

  listType = ["MLK", "DV"]
  async layTatCaDonViTheoTree(id?) {
    let body = {
      maDvi : this.userInfo.MA_DVI,
      type : this.listType
    }
    await this.donviService.layTatCaByMaDvi(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res && res.data && res.data.length > 0) {
          this.nodes = res.data
          this.nodes[0].expanded = true;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    })
  }


  // parentNodeSelected: any = [];
  theTich: string = 'm³';
  listTinhTrang: any[] = [];
  nzClickNodeTree(event: any): void {
    console.log(event)
    this.detailDonVi.reset();
    if (event.keys.length > 0) {
      this.isEditData = true;
      this.nodeSelected = event.node.origin;
      this.levelNode = this.nodeSelected.capDvi;
      this.getDetailMlkByKey(event.node)
    }
  }

  async getAllLoaiVthh() {
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data;
    }
  }

  async onChangeLoaiVthh(event) {
    if (event) {
      let body = {
        "str": event
      };
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
      this.listCloaiVthh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listCloaiVthh = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async onChangCloaiVthh(event) {
    let res = await this.danhMucService.getDetail(event);
    if (res.msg == MESSAGE.SUCCESS) {
      this.detailDonVi.patchValue({
        dviTinh: res.data ? res.data.maDviTinh : null
      })
    }
  }

  checkStatusSurplus() {
    let check = false;
    if ((this.levelNode == 7 && !this.detailDonVi.value.loaiVthh) || (this.levelNode == 6 && !this.detailDonVi.value.coLoKho && !this.detailDonVi.value.loaiVthh && this.detailDonVi.value.tichLuongKdLt == 0)) {
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
    if (this.levelNode != 1) {
      this.convertDataChild(dataNode);
      this.detailDonVi.patchValue({
        id: dataNode && dataNode.id ? dataNode.id : null,
        tichLuongTkLt: dataNode.tichLuongTkLt ? dataNode.tichLuongTkLt  :null,
        tichLuongTkVt: dataNode.tichLuongTkVt ? dataNode.tichLuongTkVt : null,
        theTichTkLt: dataNode.theTichTkLt ?  dataNode.theTichTkLt  :null,
        theTichTkVt: dataNode.theTichTkVt ? dataNode.theTichTkVt : null,
        tichLuongKdLt : dataNode.tichLuongKdLt ? dataNode.tichLuongKdLt  :0,
        tichLuongKdVt : dataNode.tichLuongKdVt ? dataNode.tichLuongKdVt : 0,
        tichLuongSdLt  : (dataNode.tichLuongTkLt) - (dataNode.tichLuongKdLt ? dataNode.tichLuongKdLt  :0),
        tichLuongSdVt  : dataNode.tichLuongTkVt - (dataNode.tichLuongKdVt ? dataNode.tichLuongKdVt  :0),
        theTichSdLt : dataNode.theTichTkLt - (dataNode.theTichSdLt ? dataNode.theTichSdLt : 0),
        theTichSdVt : dataNode.theTichTkVt - (dataNode.theTichSdLt ? dataNode.theTichSdLt : 0),
        theTichKdLt  : dataNode.theTichKdLt ? dataNode.theTichKdLt : 0,
        theTichKdVt  : dataNode.theTichKdVt ? dataNode.theTichKdVt : 0,
        ghiChu: dataNode.ghiChu? dataNode.ghiChu : null,
        nhiemVu : dataNode.nhiemVu ? dataNode.nhiemVu : null,
        namSudung : dataNode.namSudung ? dataNode.namSudung :  null,
        tinhtrangId : dataNode.tinhtrangId ? dataNode.tinhtrangId : null,
        dienTichDat : dataNode.dienTichDat ? dataNode.dienTichDat : null,
        loaiVthh : dataNode.loaiVthh ? dataNode.loaiVthh  :null,
        cloaiVthh : dataNode.cloaiVthh ? dataNode.cloaiVthh  :null,
        slTon : dataNode.slTon ? dataNode.slTon  :null,
        dviTinh : dataNode.dviTinh ? dataNode.dviTinh  :null,
        ngayNhapDay : dataNode.ngayNhapDay ? dataNode.ngayNhapDay  :null,
        loaikhoId : dataNode.loaikhoId ? dataNode.loaikhoId  : null,
        coLoKho : dataNode.coLoKho && dataNode.coLoKho == '01' ? true : false
      });
      this.checkLoKho = dataNode.coLoKho == '01'  ? true : false;
      this.fileDinhKems = dataNode.fileDinhkems ? dataNode.fileDinhkems : null
      this.detailTcdtnn.soCuc = dataNode.soCuc ? dataNode.soCuc : 0;
      this.detailTcdtnn.soChiCuc = dataNode.soChiCuc ? dataNode.soChiCuc : 0;
      this.detailTcdtnn.soDiemKho = dataNode.soDiemKho ? dataNode.soDiemKho : 0;
      this.detailTcdtnn.soNganKho = dataNode.soNganKho ? dataNode.soNganKho : 0;
      this.detailTcdtnn.soNhaKho = dataNode.soNhaKho ? dataNode.soNhaKho : 0;
      this.detailTcdtnn.tichLuongTk = dataNode.tichLuongTk ? dataNode.tichLuongTk : 0;
      this.detailTcdtnn.tichLuongKd = dataNode.tichLuongKd ? dataNode.tichLuongKd : 0;
      this.detailTcdtnn.tichLuongSd = 0;
    }
  }

  convertDataChild(dataNode) {
    this.dataTable = []
    if (dataNode && dataNode.child) {
      dataNode.child.forEach(element => {
        let dataChild = {
          tenDvi: null,
          tichLuongTkLt: element.tichLuongTkLt ? element.tichLuongTkLt : 0,
          tichLuongTkVt: element.tichLuongTkVt ? element.tichLuongTkVt : 0,
          tichLuongSdLt: element.tichLuongTkLt - element.tichLuongKdLt,
          tichLuongSdVt: element.tichLuongTkVt - element.tichLuongKdVt,
          tichLuongKdLt: element.tichLuongKdLt ? element.tichLuongKdLt : 0,
          tichLuongKdVt: element.tichLuongKdVt ? element.tichLuongKdVt : 0
        }
        dataChild.tenDvi = element.tenTongKho ?? element.tenDiemkho ?? element.tenNhakho ?? element.tenNgankho ?? element.tenNganlo
        this.dataTable = [...this.dataTable, dataChild]
      });
    }
  }

  showDetailDonVi(id?: any) {
    this.levelNode = this.nodeSelected.capDvi;
    if (id) {
      this.donviService.getDetail(id).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.nodeDetail = res.data;
          if (this.nodeDetail) {
            this.patchValueFormData(this.levelNode);
          }
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
      nzStyle: {top: '50px'},
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
      nzStyle: {top: '50px'},
      nzComponentParams: {
        detail: this.detailDonVi.value,
        levelNode: this.levelNode
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
    } else {
      this.checkLoKho = false;
    }
  }

  patchValueFormData(level) {
    switch (level) {
      case "1" : {
        this.detailTcdtnn.sdt = this.nodeDetail.sdt ? this.nodeDetail.sdt  :null
        this.detailTcdtnn.diaChi = this.nodeDetail.diaChi ? this.nodeDetail.diaChi  :null
        break;
      }
      case "2" : {
        this.detailDonVi.patchValue({
          tenCuc: this.nodeDetail.tenDvi,
          maCuc: this.nodeDetail.maDvi,
          ghiChu: this.nodeDetail.ghiChu,
          trangThai: this.nodeDetail.trangThai == TrangThaiHoatDong.HOAT_DONG,
          diaChi: this.nodeDetail.diaChi,
          soChiCuc: this.nodeDetail.child ? this.nodeDetail.child.length : null
        });
        break;
      }
      case "3" : {
        this.detailDonVi.patchValue({
          tenChiCuc: this.nodeDetail.tenDvi,
          maChiCuc: this.nodeDetail.maDvi,
          trangThai: this.nodeDetail.trangThai == TrangThaiHoatDong.HOAT_DONG,
          diaChi: this.nodeDetail.diaChi,
        });
        break;
      }
      case "4" : {
        this.detailDonVi.patchValue({
          diaChi: this.nodeDetail.diaChi,
          tenDiemkho: this.nodeDetail.tenDvi,
          maDiemkho: this.nodeDetail.maDvi,
          trangThai: this.nodeDetail.trangThai == TrangThaiHoatDong.HOAT_DONG
        });
        break;
      }
      case "5" : {
        this.detailDonVi.patchValue({
          tenNhakho: this.nodeDetail.tenDvi,
          maNhakho: this.nodeDetail.maDvi,
          trangThai: this.nodeDetail.trangThai == TrangThaiHoatDong.HOAT_DONG,
          diaChi: this.nodeDetail.diaChi
        });
        break;
      }
      case "6" : {
        this.detailDonVi.patchValue({
          tenNgankho: this.nodeDetail.tenDvi,
          maNgankho: this.nodeDetail.maDvi,
          trangThai: this.nodeDetail.trangThai == TrangThaiHoatDong.HOAT_DONG,
          diaChi: this.nodeDetail.diaChi,
        });
        break;
      }
      case "7" : {
        this.detailDonVi.patchValue({
          tenNganlo: this.nodeDetail.tenDvi,
          maNganlo: this.nodeDetail.maDvi,
          trangThai: this.nodeDetail.trangThai == TrangThaiHoatDong.HOAT_DONG,
          diaChi: this.nodeDetail.diaChi,
        });
        break;
      }
    }
  }

}
