import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetduandtxd.service";
import {KtQdXdHangNamService} from "../../../../../../services/kt-qd-xd-hang-nam.service";
import {DonviService} from "../../../../../../services/donvi.service";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import dayjs from "dayjs";
import {v4 as uuidv4} from "uuid";
import {DeXuatKeHoachSuaChuaThuongXuyenComponent} from "../de-xuat-ke-hoach-sua-chua-thuong-xuyen.component";
import {
  DeXuatScThuongXuyenService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/de-xuat-sc-thuong-xuyen.service";
import {DanhMucKho} from "../../../dm-du-an-cong-trinh/danh-muc-du-an/danh-muc-du-an.component";
import {MESSAGE} from "../../../../../../constants/message";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  DialogThemMoiDxkhthComponent
} from "../../../ke-hoach-xay-dung-trung-han/de-xuat-ke-hoach/them-moi-dxkh-trung-han/dialog-them-moi-dxkhth/dialog-them-moi-dxkhth.component";
import {
  DialogThemMoiKehoachDanhmucChitietComponent
} from "./dialog-them-moi-kehoach-danhmuc-chitiet/dialog-them-moi-kehoach-danhmuc-chitiet.component";

@Component({
  selector: 'app-thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen',
  templateUrl: './thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen.component.html',
  styleUrls: ['./thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen.component.scss']
})
export class ThongTinDeXuatKeHoachSuaChuaThuongXuyenComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  suffixCv: string = "/" + this.userInfo.MA_TCKT;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  rowItem: KeHoachDmChiTiet = new KeHoachDmChiTiet();
  rowItemCha: KeHoachDmChiTiet = new KeHoachDmChiTiet();
  listKhoi: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    deXuatScThuongXuyenService: DeXuatScThuongXuyenService,
    private danhMucService: DanhMucService,
    private donviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatScThuongXuyenService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [this.userInfo.MA_DVI],
      maDviDeXuat: [this.userInfo.MA_DVI],
      tenDviDeXuat: [this.userInfo.TEN_DVI],
      namKh: [dayjs().get('year'), Validators.required],
      ngayKy: [null],
      soCv: [null, Validators.required],
      trichYeu: [null, Validators.required],
      ngayDuyet: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      listKtKhDxkhScThuongXuyenDtl: null
    });
  }


  async ngOnInit() {
    await this.spinner.show();
    try {
      this.getDsKhoi();
      if (this.idInput) {
        // await this.getDataDetail(this.idInput);
      }
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async getDsKhoi() {
    let res = await this.danhMucService.danhMucChungGetAll("KHOI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKhoi = res.data;
      console.log(this.listKhoi)
    }
  }

  addNewItemDetail(data: any, type: string, idx: number, list?: any) {
    if (!this.isViewDetail) {
      let modalQD = this.modal.create({
        nzTitle: type == "them" ? "Thêm mới kế hoạch, danh mục chi tiết" : "Chỉnh sửa kế hoạch, danh mục chi tiết",
        nzContent: DialogThemMoiKehoachDanhmucChitietComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: "800px",
        // nzStyle: {top: "200px"},
        nzFooter: null,
        nzComponentParams: {
          dataTable: list && list.dataChild ? list.dataChild : [],
          dataInput: data,
          type: type,
          page: "DXNC"
        }
      });
      modalQD.afterClose.subscribe(async (detail) => {
        if (detail) {
          if (!data.dataChild) {
            data.dataChild = [];
          }
          if (!data.idVirtual) {
            data.idVirtual = uuidv4();
          }
          if (type == "them") {
            data.dataChild.push(detail);
          } else {
            if (list) {
              Object.assign(list.dataChild[idx], detail);
            }
          }
          this.expandAll();
        }
      });
    }
  }

  expandAll() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(s => {
        this.expandSet.add(s.idVirtual);
      });
    }
  }

  addNewKhoi() {
    if (!this.rowItemCha.maLoaiDm) {
      this.notification.error(MESSAGE.ERROR, "Chưa chọn danh mục khối");
      return;
    }
    if (this.checkExitsData(this.rowItemCha, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Không được chọn trùng danh mục khối");
      return;
    }
    let itemKhoi = this.listKhoi.find(item => item.ma == this.rowItemCha.maLoaiDm);
    if (itemKhoi) {
      this.rowItemCha.tenLoaiDm = itemKhoi.giaTri;
    }
    this.rowItemCha.idVirtual = uuidv4();
    this.dataTable.push(this.rowItemCha);
    this.rowItemCha = new KeHoachDmChiTiet();
  }

  sumSoLuong(data: any, row: string, type?: any) {
    let sl = 0;
    if (!type) {
      if (data && data.dataChild && data.dataChild.length > 0) {
        const sum = data.dataChild.reduce((prev, cur) => {
          prev += cur[row];
          return prev;
        }, 0);
        sl = sum;
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        let sum = 0;
        this.dataTable.forEach(item => {
          sum += this.sumSoLuong(item, row);
        });
        sl = sum;
      }
    }
    return sl;
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.khoi == item.khoi) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }
}

export class KeHoachDmChiTiet {
  id: number;
  idVirtual: any
  maLoaiDm: string;
  tenLoaiDm: string;
  maDm: string;
  tenDm: string;
  maChiCuc: string;
  tenChiCuc: string;
  maDiemKho: string;
  tenDiemKho: string;
  diaDiem: string
  ghiChu: string
  giaTriDn: number;
  giaTriDuocDuyet: number;
  giaTriUocTh: any;
  giaTriDnBs: any;
  giaTriKbs: number;
  giaTriChenhLech: number;
  giaTriChuaDuocPheDuyet: number;
}
