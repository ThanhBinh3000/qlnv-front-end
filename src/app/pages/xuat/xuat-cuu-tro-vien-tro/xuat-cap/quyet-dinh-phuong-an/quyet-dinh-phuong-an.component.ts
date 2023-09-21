import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "../../../../../services/donvi.service";
import dayjs from "dayjs";
import { UserLogin } from "../../../../../models/userlogin";
import { MESSAGE } from "../../../../../constants/message";
import { isEmpty } from "lodash";
import { Utils } from "../../../../../Utility/utils";
import { DatePipe } from "@angular/common";
import { cloneDeep } from "lodash";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import {LOAI_HANG_DTQG, TEN_LOAI_VTHH} from "../../../../../constants/config";

@Component({
  selector: "app-quyet-dinh-phuong-an",
  templateUrl: "./quyet-dinh-phuong-an.component.html",
  styleUrls: ["./quyet-dinh-phuong-an.component.scss"]
})
export class QuyetDinhPhuongAnComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  @Output() eventTaoQd: EventEmitter<any> = new EventEmitter<any>();
  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private datePipe: DatePipe,
              private donviService: DonviService,
              private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetPhuongAnCuuTroService);
    this.formData = this.fb.group({
      nam: null,
      maDviDx: null,
      soQd: null,
      soDx: null,
      soXc: null,
      idXc: null,
      tenDvi: null,
      maDvi: null,
      ngayKetThucDx: null,
      ngayKetThucDxTu: null,
      ngayKetThucDxDen: null,
      ngayKetThuc: null,
      trangThai: this.globals.prop.NHAP_BAN_HANH,
      loaiVthh: null,
      tenVthh: TEN_LOAI_VTHH.GAO,
      xuatCap: true,
      ngayKy: null,
      ngayKyTu: null,
      ngayKyDen: null,
    });
    this.filterTable = {
      soQd: "",
      ngayKy: "",
      soDx: "",
      ngayDx: "",
      tenLoaiVthh: "",
      tongSoLuong: "",
      soLuongXuaCap: "",
      trichYeu: "",
      tenTrangThai: ""
    };
  }

  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;


  async ngOnInit() {
    try {
      this.initData();
      await this.timKiem();
      await this.spinner.hide();
    } catch (e) {
      console.log("error: ", e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDsTong() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data;
    }

  }

  async timKiem() {
    if (this.formData.value.ngayKetThucDx) {
      this.formData.value.ngayKetThucDxTu = dayjs(this.formData.value.ngayKetThucDx[0]).format("YYYY-MM-DD");
      this.formData.value.ngayKetThucDxDen = dayjs(this.formData.value.ngayKetThucDx[1]).format("YYYY-MM-DD");
    }
    if (this.formData.value.ngayKy) {
      this.formData.value.ngaykyTu = dayjs(this.formData.value.ngayKy[0]).format("YYYY-MM-DD");
      this.formData.value.ngayKyDen = dayjs(this.formData.value.ngayKy[1]).format("YYYY-MM-DD");
    }
    await this.search();
  }

  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
  }

  filterDateInTable(key: string, value: string) {
    if (value && value != "") {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        value = this.datePipe.transform(value, Utils.FORMAT_DATE_STR);
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
            temp.push(item);
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  };
  taoQuyetDinh(data) {
    console.log(data)
    this.eventTaoQd.emit(data);
  }
}
