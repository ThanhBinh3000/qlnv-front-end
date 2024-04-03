import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {DanhMucService} from "../../../services/danhmuc.service";
import {MESSAGE} from "../../../constants/message";
import {Base2Component} from "../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetDinhPdKhBdgService
} from "../../../services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service";
import {DonviService} from "../../../services/donvi.service";
import {isEmpty} from "lodash";
import {
  ThongTinDauGiaService
} from "../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service";
import {cloneDeep} from 'lodash';
@Component({
  selector: 'app-hop-dong',
  templateUrl: './cong-tac-dau-gia.component.html',
  styleUrls: ['./cong-tac-dau-gia.component.scss']
})
export class CongTacDauGiaComponent extends Base2Component implements OnInit {
  tabs: any[] = [];
  loaiVthhSelected: string
  tenLoaiVthh: string
  dsDonvi: any[] = [];

  listTrangThai: any[] = [
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Hoàn thành nhập'}
  ];
  readonly TRANG_THAI_NHAP_LIEU = {
    DANG_NHAP: "00",
    HOAN_THANH: "01"
  };
  selectedId: number = 0;
  isView = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    public userService: UserService,
    private danhMucService: DanhMucService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
    private thongTinDauGiaService: ThongTinDauGiaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      nam: null,
      maDvi: null,
      soDxuat: null,
      soQdPd: null,
      soQdKq: null,
      ngayKyQdKqTu: null,
      ngayKyQdKqDen: null,
      loaiVthh: this.loaiVthhSelected,
      trangThai: null,
      khoiTao: true,
    })
    this.filterTable = {
      nam: null,
      soQdPd: null,
      soQdDc: null,
      soDxuat: null,
      soQdKq: null,
      ngayKyQdKq: null,
      slDviTsan: null,
      soDviTsanThanhCong: null,
      soDviTsanKhongThanh: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      tenTrangThai: null,
      ketQuaDauGia: null,

    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loaiVTHHGetAll(),
        this.loadDsDonVi(),
        this.searchDtl(),
      ]);
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }

  }

  async loaiVTHHGetAll() {
    this.tabs = [];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg === MESSAGE.SUCCESS && res.data && res.data.length > 0) {
      this.tabs = res.data.map(element => {
        return {...element, count: 0};
      });
      this.selectTab(this.tabs[0].ma);
    }
  }

  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
    this.tenLoaiVthh = this.tabs.find(i=>i.ma == this.loaiVthhSelected)?.giaTri;
  }

  async loadDsDonVi() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data.filter(s => s.type === 'DV');
    }

  }
  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
  }

  async searchDtl() {
    try {
      await this.spinner.show();
      const body = {
        ...this.formData.value,
      };
      const res = await this.quyetDinhPdKhBdgService.searchDtl(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
          });
        }
        this.dataTableAll = cloneDeep(this.dataTable);
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  showList() {
    this.isDetail = false;
    this.searchDtl();
    this.showListEvent.emit();
  }

}
