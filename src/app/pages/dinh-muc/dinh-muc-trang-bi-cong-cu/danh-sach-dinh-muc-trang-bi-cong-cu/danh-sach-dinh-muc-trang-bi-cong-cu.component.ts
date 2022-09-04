import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';
import { cloneDeep, isEmpty } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChiTietGiaoDichHangTrongKhoComponent } from 'src/app/components/dialog/dialog-chi-tiet-giao-dich-hang-trong-kho/dialog-chi-tiet-giao-dich-hang-trong-kho.component';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { TreeTableService } from 'src/app/services/tree-table.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-danh-sach-dinh-muc-trang-bi-cong-cu',
  templateUrl: './danh-sach-dinh-muc-trang-bi-cong-cu.component.html',
  styleUrls: ['./danh-sach-dinh-muc-trang-bi-cong-cu.component.scss']
})
export class DanhSachDinhMucTrangBiCongCuComponent implements OnInit {

  @Input('maLoaiVthh') maLoaiVthh: string;

  userInfo: UserLogin;
  detail: any = {};

  dsLoaiHangHoa = [];
  dsChungLoaiHangHoa = [];
  dsTong;
  dsCuc = [];
  dsChiCuc = [];
  dsChiCucDataSource = [];
  dsDiemKho = [];
  dsNhaKho = [];
  dsNganKho = [];
  dsLoKho = [];

  formData: FormGroup;
  searchInTable: any = {
    donVi: null,
    chungLoaiHH: null,
    tonDauKy: null,
    nhapTrongKy: null,
    xuatTrongKy: null,
    tonCuoiKy: null,
    donViTinh: null,
  };

  errorMessage = '';
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  mapOfExpandedData: { [key: string]: HangTrongKhoRowItem[] } = {};

  constructor(
    private fb: FormBuilder,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    private notification: NzNotificationService,
    public treeTableService: TreeTableService<HangTrongKhoRowItem>,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    public globals: Globals,
    private modal: NzModalService,

  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      Promise.all([
        this.initForm(),
        this.loaiVTHHGetAll(),
        this.initData(),
        this.search()
      ]);
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma !== '01' && item.ma === this.maLoaiVthh) {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, item];
            }
            else {
              if (item.child && item.child.length > 0) {
                item.child.forEach((itemHH) => {
                  if (itemHH.ma === this.maLoaiVthh) { this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, itemHH]; }
                });
              }
            }
          })
        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async onChangeLoaiHH(id: number) {
    if (id && id > 0) {
      let loaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma === id)
      if (loaiHangHoa && loaiHangHoa.length > 0) {
        this.dsChungLoaiHangHoa = loaiHangHoa[0].child
      }
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      soVanBan: [null],
      idLoaiHH: [null],
      idChungLoaiHH: [null],
      ngay: [null],
      idCuc: [null],
      idDiemKho: [null],
      idChiCuc: [null],
      idNhaKho: [null],
      idNganKho: [null],
      idLoKho: [null],
    });
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async loadDsTong() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };
    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.dsCuc = dsTong[DANH_MUC_LEVEL.CUC];
      if (this.userInfo.CAP_DVI === this.globals.prop.CUC) {
        this.formData.get('idCuc').setValue(this.dsCuc[0].tenDvi)
        this.formData.controls['idCuc'].disable();
        this.onChangeCuc(this.dsCuc[0].id);
      }
      if (this.userInfo.CAP_DVI === this.globals.prop.CHICUC) {
        this.dsChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
        this.formData.get('idChiCuc').setValue(this.dsChiCuc[0].tenDvi)
        this.formData.controls['idCuc'].disable();
        this.formData.controls['idChiCuc'].disable();
        this.onChangeChiCuc(this.dsChiCuc[0].id);
      }
    }
  }

  onChangeCuc(id) {
    const cuc = this.dsCuc.find((item) => item.id === Number(id));
    this.formData.get('idChiCuc').setValue(null);
    this.formData.get('idDiemKho').setValue(null);
    this.formData.get('idNhaKho').setValue(null);
    this.formData.get('idNganKho').setValue(null);
    this.formData.get('idLoKho').setValue(null);
    if (cuc) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, cuc),
      };
      this.dsChiCuc = result[DANH_MUC_LEVEL.CHI_CUC];
    } else {
      this.dsChiCuc = [];
    }
  }

  onChangeChiCuc(id) {
    const chiCuc = this.dsChiCuc.find((item) => item.id === Number(id));
    this.formData.get('idDiemKho').setValue(null);
    this.formData.get('idNhaKho').setValue(null);
    this.formData.get('idNganKho').setValue(null);
    this.formData.get('idLoKho').setValue(null);
    if (chiCuc) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, chiCuc),
      };
      this.dsDiemKho = result[DANH_MUC_LEVEL.DIEM_KHO];
    } else {
      this.dsDiemKho = [];
    }
  }

  onChangeDiemKho(id) {
    const dsDiemKho = this.dsDiemKho.find((item) => item.id === Number(id));
    this.formData.get('idNhaKho').setValue(null);
    this.formData.get('idNganKho').setValue(null);
    this.formData.get('idLoKho').setValue(null);
    if (dsDiemKho) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, dsDiemKho),
      };
      this.dsNhaKho = result[DANH_MUC_LEVEL.NHA_KHO];
    } else {
      this.dsNhaKho = [];
    }
  }

  onChangeNhaKho(id) {
    const nhaKho = this.dsNhaKho.find((item) => item.id === Number(id));
    this.formData.get('idNganKho').setValue(null);
    this.formData.get('idLoKho').setValue(null);
    if (nhaKho) {
      const result = { ...this.donviService.layDsPhanTuCon(this.dsTong, nhaKho), };
      this.dsNganKho = result[DANH_MUC_LEVEL.NGAN_KHO];
    } else {
      this.dsNganKho = [];
    }
  }

  onChangeNganKho(id) {
    const nganKho = this.dsNganKho.find((item) => item.id === Number(id));
    this.formData.get('idLoKho').setValue(null);
    if (nganKho) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, nganKho),
      };
      this.dsLoKho = result[DANH_MUC_LEVEL.NGAN_LO];
    } else {
      this.dsLoKho = [];
    }
  }

  async search() {
    let body = {
      "loaiHH": this.formData.value.idLoaiHH,
      "chungLoaiHH": this.formData.value.idChungLoaiHH,
      "tuNgay": '',
      "denNgay": '',
      "maCuc": this.formData.value.idCuc,
      "maChiCuc": this.formData.value.idChiCuc,
      "maDiemKho": this.formData.value.idDiemKho,
      "maNhaKho": this.formData.value.idNhaKho,
      "maNganKho": this.formData.value.idNganKho,
      "maLokho": this.formData.value.idLoKho,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1,
      }
    }
    if (this.formData.value.ngay != null) {
      body.tuNgay = this.formData.value.ngay[0]
      body.denNgay = this.formData.value.ngay[1]
    }
    let res = await this.quanLyHangTrongKhoService.searchHangTrongKho(body);
    if (res.msg === MESSAGE.SUCCESS) {
      this.dataTableAll = [...res.data.content];
      this.dataTableAll.forEach((item) => {
        this.mapOfExpandedData[item.maDvi] = this.treeTableService.convertTreeToList(item, 'maDvi');
      });
      this.dataTable = cloneDeep(this.dataTableAll)
      this.totalRecord = res.data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async clearFilter() {
    this.formData.reset();
    this.search()
    await this.loadDsTong()
  }
  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      if (this.page === 1) {
        await this.search();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  viewDetail(data: HangTrongKhoRowItem) {
    this.mapOfExpandedData[data.maDvi] = this.treeTableService.convertTreeToList(data, 'maDvi');
    const modalQD = this.modal.create({
      nzTitle: 'Chi tiết giao dich',
      nzContent: DialogChiTietGiaoDichHangTrongKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1400px',
      nzFooter: null,
      nzComponentParams: {
        dataView: this.mapOfExpandedData[data.maDvi][this.mapOfExpandedData[data.maDvi].length - 1],
        isView: true,
      },
    });
    // modalQD.afterClose.subscribe((data) => {
    //   if (data) {
    //   }
    // });
  }

  deleteSelect() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            // let res = await this.bienBanChuanBiKhoService.deleteMultiple({ ids: dataDelete });
            // if (res.msg == MESSAGE.SUCCESS) {
            //   this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            //   await this.search();
            //   this.allChecked = false;
            // } else {
            //   this.notification.error(MESSAGE.ERROR, res.msg);
            // }
            this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  xoaItem(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          // this.bienBanChuanBiKhoService.deleteData(item.id).then((res) => {
          //   if (res.msg == MESSAGE.SUCCESS) {
          //     this.notification.success(
          //       MESSAGE.SUCCESS,
          //       MESSAGE.DELETE_SUCCESS,
          //     );
          //     this.search();
          //   } else {
          //     this.notification.error(MESSAGE.ERROR, res.msg);
          //   }
          //   this.spinner.hide();
          // });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show()
      try {
        let body = {
          "loaiHH": this.formData.value.idLoaiHH,
          "chungLoaiHH": this.formData.value.idChungLoaiHH,
          "tuNgay": '',
          "denNgay": '',
          "maCuc": this.formData.value.idCuc,
          "maChiCuc": this.formData.value.idChiCuc,
          "maDiemKho": this.formData.value.idDiemKho,
          "maNhaKho": this.formData.value.idNhaKho,
          "maNganKho": this.formData.value.idNganKho,
          "maLokho": this.formData.value.idLoKho,
          "paggingReq": {
            "limit": this.pageSize,
            "page": this.page - 1,
          }
        }
        if (this.formData.value.ngay != null) {
          body.tuNgay = this.formData.value.ngay[0]
          body.denNgay = this.formData.value.ngay[1]
        }
        this.quanLyHangTrongKhoService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'danh-sach-hang-trong-kho.xlsx')
        });
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY)
    }
  }
}



interface IHangTrongKho {
  id: number;
  child?: IHangTrongKho[];
  tenDvi: string;
  maDvi: string;
  loaiHH: string;
  chungLoaiHH: string;
  tonKhoDauKy: number;
  nhapTrongKy: number;
  xuatTrongKy: number;
  tonKhoCuoiKy: number;
  donViTinh: string;
}

interface ITreeTableItem {
  parent?: any;
  expand?: boolean;
  level?: number;
}

class HangTrongKhoRowItem implements IHangTrongKho, ITreeTableItem {
  parent?: HangTrongKhoRowItem;
  expand?: boolean;
  level?: number;
  id: number;
  child?: IHangTrongKho[];
  tenDvi: string;
  maDvi: string;
  loaiHH: string;
  chungLoaiHH: string;
  tonKhoDauKy: number;
  nhapTrongKy: number;
  xuatTrongKy: number;
  tonKhoCuoiKy: number;
  donViTinh: string;
}
