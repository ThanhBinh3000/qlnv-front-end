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

@Component({
  selector: "app-them-moi-tong-hop-khnk",
  templateUrl: "./them-moi-tong-hop-khnk.component.html",
  styleUrls: ["./them-moi-tong-hop-khnk.component.scss"]
})
export class ThemMoiTongHopKhnkComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() id: number;
  @Input() isViewOnModal: boolean;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
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
        tenLoaiVthh: [null, [Validators.required]],
        namKhoach: [dayjs().get("year"), [Validators.required]],
        loaiHinhNx: ["", [Validators.required]]
      }
    );
    this.formData = this.fb.group({
      id: [],
      loaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      namKhoach: [, [Validators.required]],
      ngayTao: [, [Validators.required]],
      noiDung: ["", [Validators.required]],
      hthucLcnt: ["", [Validators.required]],
      pthucLcnt: ["", [Validators.required]],
      loaiHdong: ["", [Validators.required]],
      nguonVon: ["", [Validators.required]],
      ghiChu: [""],
      trangThai: [""],
      tenLoaiVthh: [""],
      tenCloaiVthh: [""],
      tchuanCluong: [""],
      soQdCc: [""]
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await Promise.all([
        this.loadData()
      ]);
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
    let body = this.formTraCuu.value
    await this.tongHopDxKhNhapKhacService
      .dsDxDuocTaoQDinhPDuyet(body)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          console.log(res.data)
        }
      })
      .catch((e) => {
        console.log("error: ", e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  save(isGuiDuyet?) {

  }

  clearFilter() {

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
}