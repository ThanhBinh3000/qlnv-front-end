import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { TreeTableService } from 'src/app/services/tree-table.service';
import { DonviService } from '../../../../../services/donvi.service';
import { DanhMucService } from '../../../../../services/danhmuc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from '../../../luu-kho.constant';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { Globals } from 'src/app/shared/globals';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogChiTietGiaoDichHangTrongKhoComponent } from 'src/app/components/dialog/dialog-chi-tiet-giao-dich-hang-trong-kho/dialog-chi-tiet-giao-dich-hang-trong-kho.component';
import { saveAs } from 'file-saver';
import * as dayjs from 'dayjs';



@Component({
  selector: 'app-hang-trong-kho-theo-loai',
  templateUrl: './hang-trong-kho-theo-loai.component.html',
  styleUrls: ['./hang-trong-kho-theo-loai.component.scss'],
})
export class HangTrongKhoTheoLoaiComponent implements OnInit {

  @Input('idLoaiVthh') idLoaiVthh: string;

  userInfo: UserLogin;
  detail: any = {};

  dsLoaiHangHoa = [];
  dsChungLoaiHangHoa = []; ư
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

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataTable: any[] = [];

  mapOfExpandedData: { [key: string]: HangTrongKhoRowItem[] } = {};

  constructor(
    private readonly fb: FormBuilder,
    private readonly donviService: DonviService,
    private readonly danhMucService: DanhMucService,
    private readonly spinner: NgxSpinnerService,
    public readonly userService: UserService,
    private readonly notification: NzNotificationService,
    public treeTableService: TreeTableService<HangTrongKhoRowItem>,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    public globals: Globals,
    private readonly modal: NzModalService,

  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.initForm();
      this.loaiVTHHGetAll()
      await this.initData();
      await this.search()
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  loaiVTHHGetAll() {
    this.danhMucService.loadDanhMucHangHoa().subscribe(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsLoaiHangHoa = [...res.data]
      }
      else { this.notification.error(MESSAGE.ERROR, res.msg); }
    })
  }

  onChangeLoaiHH(id: number) {
    if (id && id > 0) {
      let loaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma === id)
      if (loaiHangHoa && loaiHangHoa.length > 0) {
        this.dsChungLoaiHangHoa = loaiHangHoa[0].child
      }
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
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

  async loadDsTong() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };
    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.dsCuc = dsTong[DANH_MUC_LEVEL.CUC];
      if (this.userInfo.CAP_DVI === this.globals.prop.CHICUC) {
        this.dsChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
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
    console.log(id);
    if (cuc) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, cuc),
      };
      console.log(result);

      this.dsChiCuc = result[DANH_MUC_LEVEL.CHI_CUC];
      console.log(this.dsChiCuc);
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
      console.log(result);
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
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, nhaKho),
      };
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

  onChangeAutoComplete(e) {
    const value = (e.target as HTMLInputElement).value;
    if (value) {
      this.dsChiCucDataSource = this.dsChiCuc
        .filter((item) =>
          item?.tenDvi?.toLowerCase()?.includes(value.toLowerCase()),
        )
        .map((item) => item.tenDvi);
    } else {
      this.dsChiCucDataSource = this.dsChiCuc.map((item) => item.tenDvi);
    }
  }

  async search() {
    let body = {
      "loaiHH": this.formData.value.idLoaiHH,
      "chungLoaiHH": this.formData.value.idLoaiHH,
      "tuNgay": '',
      "denNgay": '',
      "maCuc": this.formData.value.idCuc,
      "maChiCuc": this.formData.value.idChiCuc,
      "maDiemKho": this.formData.value.idDiemKho,
      "maNhaKho": this.formData.value.idNhaKho,
      "maNganKho": this.formData.value.idNganKho,
      "maLokho": this.formData.value.idLoKho,
      "paggingReq": {
        "limit": 10,
        "page": 0
      }
    }
    if (this.formData.value.ngay != null) {
      body.tuNgay = this.formData.value.ngay[0]
      body.denNgay = this.formData.value.ngay[1]
    }
    let res = await this.quanLyHangTrongKhoService.searchHangTrongKho(body);
    if (res.msg === MESSAGE.SUCCESS) {
      this.dataTable = [...res.data.content];
      // console.log(this.dataTable);
      this.dataTable.forEach((item) => {
        this.mapOfExpandedData[item.maDvi] = this.treeTableService.convertTreeToList(item, 'maDvi');
      });
      this.totalRecord = res.data.totalElements;

    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  clearFilter() {
    this.formData.reset();
    this.search()
  }

  changePageIndex(event) { }

  changePageSize(event) { }

  viewDetail(data: HangTrongKhoRowItem) {

    const modalQD = this.modal.create({
      nzTitle: 'Chi tiết giao dich',
      nzContent: DialogChiTietGiaoDichHangTrongKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataView: data,
        isView: true,
      },
    });
    // modalQD.afterClose.subscribe((data) => {
    //   if (data) {
    //     console.log(data);

    //   }
    // });
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show()
      try {
        let body = {
          "loaiHH": "",
          "chungLoaiHH": "",
          "tuNgay": "",
          "denNgay": "",
          "maCuc": "",
          "maChiCuc": "",
          "maDiemKho": "",
          "maNhaKho": "",
          "maNganKho": "",
          "maLokho": "",
          "paggingReq": {
            "limit": 10,
            "page": 0
          }
        }
        if (this.formData.value.ngayTao != null) {
          body.tuNgay = this.formData.value.ngayTao[0]
          body.denNgay = this.formData.value.ngayTao[1]
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

  dataExample: HangTrongKhoRowItem[] = [];

}



interface IHangTrongKho {
  id: number;
  child?: IHangTrongKho[];
  tenDvi: string;
  maDvi: string;
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
  chungLoaiHH: string;
  tonKhoDauKy: number;
  nhapTrongKy: number;
  xuatTrongKy: number;
  tonKhoCuoiKy: number;
  donViTinh: string;
}
