import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import dayjs from "dayjs";
import { MESSAGE } from "../../../../../constants/message";
import {
  TongHopDxKhNhapKhacService
} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/tongHopDxKhNhapKhac.service";
import { STATUS } from "../../../../../constants/status";
import { DialogTuChoiComponent } from "../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";

@Component({
  selector: "app-them-moi-tong-hop-khnk",
  templateUrl: "./them-moi-tong-hop-khnk.component.html",
  styleUrls: ["./them-moi-tong-hop-khnk.component.scss"]
})
export class ThemMoiTongHopKhnkComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isViewOnModal: boolean;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  isQuyetDinh: boolean = false;
  formTraCuu: FormGroup;
  listLoaiVthh: any[] = [];
  listLoaiHinhNx: any[] = [];
  fileDinhKems: any[] = [];
  selected: boolean = false;
  dataTableDanhSachDX: any[] = [];
  isTongHop: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDxKhNhapKhacService: TongHopDxKhNhapKhacService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDxKhNhapKhacService);
    this.formTraCuu = this.fb.group(
      {
        loaiVthh: [null, [Validators.required]],
        tenLoaiVthh: [],
        namKhoach: [dayjs().get("year"), [Validators.required]],
        loaiHinhNx: ["", [Validators.required]]
      }
    );
    this.formData = this.fb.group({
      id: [],
      ngayTh: [dayjs().format("YYYY-MM-DD")],
      trangThai: [],
      tenTrangThai: [],
      maTh: [""],
      noiDungTh: ["", [Validators.required]],
      dxHdr: []
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await Promise.all([
        this.loadData()
      ]);
      if (this.id > 0) {
        await this.loadChiTiet();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadData() {
    this.listLoaiVthh = [];
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiVthh = res.data;
      this.listLoaiVthh = res.data?.filter((x) => x.ma.length == 4);
    }
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == "NHAP_KHAC");
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async tongHopDeXuat() {
    await this.spinner.show();
    this.helperService.markFormGroupTouched(this.formTraCuu);
    if (this.formTraCuu.invalid) {
      await this.spinner.hide();
      return;
    }
    let body = this.formTraCuu.value;
    await this.tongHopDxKhNhapKhacService
      .dsDxDuocTaoQDinhPDuyet(body)
      .then(async (res) => {
        if (res.msg == MESSAGE.SUCCESS && res.data && res.data.length > 0) {
          let maTh = await this.userService.getId("HH_THOP_KHNK_SEQ");
          this.formData.patchValue({
            maTh: maTh,
            ngayTh: dayjs().format("YYYY-MM-DD")
          });
          this.dataTableDanhSachDX = res.data;
          this.isTongHop = true;
        } else {
          this.notification.error(MESSAGE.ERROR, "Không tìm thấy dữ liệu để tổng hợp.");
          this.isTongHop = false;
        }
        if (this.dataTableDanhSachDX.length > 0) {
          this.showDetail(event, this.dataTableDanhSachDX[0].id);
        }
        await this.spinner.hide();
      })
      .catch((e) => {
        console.log("error: ", e);
        this.isTongHop = false;
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  async save() {
    await this.spinner.show();
    let body = this.formData.value;
    body.loaiVthh = this.formTraCuu.get("loaiVthh").value;
    body.namKhoach = this.formTraCuu.get("namKhoach").value;
    body.loaiHinhNx = this.formTraCuu.get("loaiHinhNx").value;
    body.fileDinhKems = this.fileDinhKems;
    body.details = this.dataTableDanhSachDX;
    let data = await this.createUpdate(body, "");
    if (data) {
      this.id = data.id;
      await this.loadChiTiet();
      this.isView = true
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    }
    await this.spinner.hide();
  }

  async loadChiTiet() {
    if (this.id > 0) {
      let res = await this.tongHopDxKhNhapKhacService.getDetail(this.id);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        this.fileDinhKems = dataDetail.hdr.fileDinhKems;
        this.dataTableDanhSachDX = dataDetail.dtl;
        this.helperService.bidingDataInFormGroup(this.formTraCuu, dataDetail.hdr);
        this.helperService.bidingDataInFormGroup(this.formData, dataDetail.hdr);
        this.formData.get('dxHdr').setValue(dataDetail.dtl);
        this.isTongHop = true;
      } else {
        this.isTongHop = false;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.showDetail(event, this.dataTableDanhSachDX[0].id);
    }
  }

  clearFilter() {
    this.formTraCuu.patchValue(
      {
        loaiVthh: null,
        tenLoaiVthh: null,
        namKhoach: dayjs().get("year"),
        loaiHinhNx: null
      }
    );
  }


  idRowSelect: number;

  async showDetail($event, id: number) {
    await this.spinner.show();
    if ($event.type == "click") {
      this.selected = false;
      $event.target.parentElement.parentElement.querySelector(".selectedRow")?.classList.remove("selectedRow");
      $event.target.parentElement.classList.add("selectedRow");
    } else {
      this.selected = true;
    }
    this.idRowSelect = id;
    await this.spinner.hide();
  }

  taoQdinh() {
    this.isQuyetDinh = true;
  }
  showTongHop() {
    this.isQuyetDinh = false;
  }
}
