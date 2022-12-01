
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
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { TreeTableService } from 'src/app/services/tree-table.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DANH_MUC_LEVEL } from '../../luu-kho/luu-kho.constant';
import dayjs from "dayjs";
import {
  DeXuatPhuongAnCuuTroService
} from "../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";

@Component({
  selector: 'app-quan-ly-quy-chuan-ky-thuat-quoc-gia',
  templateUrl: './quan-ly-quy-chuan-ky-thuat-quoc-gia.component.html',
  styleUrls: ['./quan-ly-quy-chuan-ky-thuat-quoc-gia.component.scss']
})
export class QuanLyQuyChuanKyThuatQuocGiaComponent implements OnInit {

  @Input('maLoaiVthh') maLoaiVthh: string;

  userInfo: UserLogin;
  detail: any = {};

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
  dsLoaiHangHoa:any[]=[];
  dsChungLoaiHangHoa:any[]=[];

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
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,

  ) { }

  async ngOnInit(): Promise<void> {
    this.dataTable=this.dataTable = [
      {
        "id": 1,
        "soVanBan": "1012/QĐ-TCDT",
        "idVanBanThayThe": null,
        "soVanBanThayThe": null,
        "maDvi": "0101",
        "loaiVthh": "0101",
        "cloaiVthh": "010101",
        "ngayKy": "2022-10-27",
        "ngayHieuLuc": "2022-10-29",
        "soHieuQuyChuan": "123",
        "apDungTai": "TCDT  ",
        "loaiApDung": "Hàng Hóa",
        "danhSachApDung": "Thóc,Gạo",
        "trichYeu": "TríchYếu",
        "thoiGianLuuKhoToiDa": 10,
        "trangThai": "Ban Hành",
        "trangThaiHl": "Hết hiệu Lực",
        "ngayTao": "2022-11-29",
        "ngaySua": "2022-11-29",
        "nguoiTaoId": 1,
        "nguoiSuaId": 1,
        "lastest": "1"
      },

      {
        "id": 2,
        "soVanBan": "1013/QĐ-TCDT",
        "idVanBanThayThe": 1,
        "soVanBanThayThe": "1012/QĐ-TCDT",
        "maDvi": "0101",
        "loaiVthh": "0101",
        "cloaiVthh": "010101",
        "ngayKy": "2022-06-21",
        "ngayHieuLuc": "2022-09-22",
        "soHieuQuyChuan": "123",
        "apDungTai": "TCDT",
        "loaiApDung": "Hàng Hóa",
        "danhSachApDung": "Thóc,Gạo",
        "trichYeu": "TríchYếu",
        "thoiGianLuuKhoToiDa": 10,
        "trangThai": "Ban Hành",
        "trangThaiHl": "Còn Hiệu Lực",
        "ngayTao": "2022-10-29",
        "ngaySua": "2022-10-29",
        "nguoiTaoId": 1,
        "nguoiSuaId": 1,
        "lastest": "1"
      },
      {
        "id": 3,
        "soVanBan": "1014/QĐ-TCDT",
        "idVanBanThayThe": null,
        "soVanBanThayThe": null,
        "maDvi": "0101",
        "loaiVthh": "0101",
        "cloaiVthh": "010101",
        "ngayKy": "2022-08-15",
        "ngayHieuLuc": "2022-08-18",
        "soHieuQuyChuan": "123",
        "apDungTai": "TCDT",
        "loaiApDung": "Hàng Hóa",
        "danhSachApDung": "Thóc,Gạo",
        "trichYeu": "TríchYếu",
        "thoiGianLuuKhoToiDa": 10,
        "trangThai": "Dự thảo",
        "trangThaiHl": "",
        "ngayTao": "2022-11-29",
        "ngaySua": "2022-11-29",
        "nguoiTaoId": 1,
        "nguoiSuaId": 1,
        "lastest": "1"
      }
    ];
    try {
      this.spinner.show();
      Promise.all([
        this.initForm(),
        /*this.loaiVTHHGetAll(),
        this.initData(),*/
        // this.search()
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
    await this.search();
  }

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }


  async search() {
    this.spinner.show();
    try {
      let body = {
        paggingReq: {
          limit: this.pageSize,
          page: this.page - 1,
        }
      };
      console.log(body, 'body')
      let res = await this.deXuatPhuongAnCuuTroService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
          });
        }
        this.dataTableAll = cloneDeep(this.dataTable);
        this.totalRecord = data.totalElements;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log(e)
      this.spinner.hide();
    }

  }

  async clearFilter() {
    /*this.formData.reset();
    this.search()
    await this.loadDsTong()*/
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

  updateSingleChecked() {

  }

  goDetail(data?: any, isView?: boolean) {
    this.selectedId = data.id;
    this.isDetail = true;
    //this.loaiVthh = data.loaiVthh;
    this.isView = isView;

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
