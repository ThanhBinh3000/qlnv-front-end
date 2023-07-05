import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserLogin} from "../../../../../../../models/userlogin";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {KeHoachXayDungTrungHan} from "../../../../../../../models/QuyHoachVaKeHoachKhoTang";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UserService} from "../../../../../../../services/user.service";
import {Globals} from "../../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {
  TongHopScThuongXuyenService
} from "../../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/tong-hop-sc-thuong-xuyen.service";
import {
  DeXuatScThuongXuyenService
} from "../../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/de-xuat-sc-thuong-xuyen.service";
import {
  DanhMucSuaChuaService
} from "../../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/danh-muc-kho/danh-muc-sua-chua.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../../../../services/helper.service";
import dayjs from "dayjs";
import {STATUS} from "../../../../../../../constants/status";
import {MESSAGE} from "../../../../../../../constants/message";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {DonviService} from "../../../../../../../services/donvi.service";
import {
  TongHopDanhSachVttbService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/TongHopDanhSachVttb.service";
import {
  KeHoachXuatHangService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/KeHoachXuatHang.service";

@Component({
  selector: 'app-thong-tin-tong-hop-ke-hoach-xuat-hang',
  templateUrl: './thong-tin-tong-hop-ke-hoach-xuat-hang.component.html',
  styleUrls: ['./thong-tin-tong-hop-ke-hoach-xuat-hang.component.scss']
})
export class ThongTinTongHopKeHoachXuatHangComponent extends Base2Component implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() isViewQd: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  expandSet = new Set<number>();
  userInfo: UserLogin;
  formData: FormGroup;
  listDmSuaChua: any[] = [];
  listDx: any[] = [];
  itemSelected: any;
  dataTable: any[] = [];
  dataTableReq: any[] = [];
  dataTableDx: any[] = [];
  dataTableDxAll: any[] = [];
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: KeHoachXayDungTrungHan = new KeHoachXayDungTrungHan();
  dataEdit: { [key: string]: { edit: boolean; data: KeHoachXayDungTrungHan } } = {};
  isTongHop: boolean = false;
  listNam: any[] = [];
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listLoaiDuAn: any[] = [];
  STATUS = STATUS;
  maTt: string;
  soQd: string;
  isEdit: string = "";
  listFile: any[] = []

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private tongHopDanhSachVttbService: TongHopDanhSachVttbService,
              private keHoachXuatHangService: KeHoachXuatHangService) {
    super(httpClient, storageService, notification, spinner, modal, keHoachXuatHangService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      ngayTaoTt: [null],
      thoiGianTh: [null],
      namKh: [dayjs().get("year")],
      noiDungTh: [null],
      soToTrinh: [null, Validators.required],
      soQuyetDinh: [null],
      ngayKyQd: [null],
      trangThai: ["00"],
      tenTrangThai: ["Dự thảo"],
      loai: ["00", Validators.required],
      lyDoTuChoi: []
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.maTt = "/TTr-TCDT";
    this.soQd = "/QĐ-TCDT";
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async tongHop() {
    this.spinner.show();
    this.formData.patchValue({
      thoiGianTh: new Date()
    });
    let body = {
      "namKeHoach": this.formData.value.namKh,
      "loai": "00",
      "capDvi": 2,
    };
    let res = await this.keHoachXuatHangService.searchTh(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDx = [];
      this.dataTableDx = [];
      this.dataTableDxAll = [];
      this.dataTable = [];
      this.dataTableReq = [];
      let listDataKh = res.data;
      if (listDataKh && listDataKh.length > 0) {
        this.isTongHop = true;
        this.listDx = listDataKh;
        // this.listDx.forEach(item => {
        //   if (item.listKtKhDxkhScThuongXuyenDtl && item.listKtKhDxkhScThuongXuyenDtl.length > 0) {
        //     item.listKtKhDxkhScThuongXuyenDtl.forEach(itChild => {
        //       itChild.id = null;
        //       itChild.idHdrDx = item.id;
        //       this.dataTableDxAll.push(itChild);
        //       this.dataTableReq.push(itChild);
        //     })
        //   }
        // })
      } else {
        this.notification.error(MESSAGE.ERROR, "Không tìm thấy dữ liệu kế hoạch xuất hàng của Cục");
        this.isTongHop = false;
        this.spinner.hide();
        return;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }
    this.spinner.hide();
  }
}
