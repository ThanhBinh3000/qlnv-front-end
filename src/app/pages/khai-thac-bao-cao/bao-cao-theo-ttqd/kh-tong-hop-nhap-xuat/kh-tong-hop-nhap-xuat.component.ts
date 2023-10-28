import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ThongTu1452013Service } from "../../../../services/bao-cao/ThongTu1452013.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { UserService } from "../../../../services/user.service";
import { DonviService } from "../../../../services/donvi.service";
import { Globals } from "../../../../shared/globals";
import * as dayjs from "dayjs";
import { saveAs } from "file-saver";
import { MESSAGE } from "../../../../constants/message";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { Base2Component } from "../../../../components/base2/base2.component";
import { DanhMucService } from "../../../../services/danhmuc.service";

@Component({
  selector: "app-kh-tong-hop-nhap-xuat",
  templateUrl: "./kh-tong-hop-nhap-xuat.component.html",
  styleUrls: ["./kh-tong-hop-nhap-xuat.component.scss"]
})
export class KhTongHopNhapXuatComponent extends Base2Component implements OnInit {
  pdfSrc: any;
  pdfBlob: any;
  excelBlob: any;
  selectedVthhCache: any;
  selectedCloaiVthhCache: any;
  showDlgPreview = false;
  listNam: any[] = [];
  dsDonVi: any;
  listChiCuc: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  rows: any[] = [];

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private thongTu1452013Service: ThongTu1452013Service,
              public userService: UserService,
              private donViService: DonviService,
              private danhMucService: DanhMucService,
              public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, thongTu1452013Service);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        namKh: [, [Validators.required]],
        maCuc: [],
        maChiCuc: [],
        loaiVthh: '',
        cloaiVthh: []
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      for (let i = 0; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get("year") - i,
          text: dayjs().get("year") - i
        });
      }
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsVthh()
      ]);
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfBlob, "bc_kh_tong_hop_nhap_xuat_hang_dtqg.pdf");
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      this.setListCondition();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.fileName = "bc_kh_tong_hop_nhap_xuat_hang_dtqg.jrxml";
      body.tenBaoCao = "Báo cáo kế hoạch tổng hợp nhập, xuất hàng dự trữ quốc gia";
      body.trangThai = "01";
      await this.thongTu1452013Service.khTongHopNhapXuat(body).then(async s => {
        this.excelBlob = s;
        saveAs(this.excelBlob, "bc_kh_tong_hop_nhap_xuat_hang_dtqg.xlsx");
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  async preView() {
    try {
      this.spinner.show();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      this.setListCondition();
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "bc_kh_tong_hop_nhap_xuat_hang_dtqg.jrxml";
      body.tenBaoCao = "Báo cáo kế hoạch tổng hợp nhập, xuất hàng dự trữ quốc gia";
      body.trangThai = "01";
      await this.thongTu1452013Service.khTongHopNhapXuat(body).then(async s => {
        this.pdfBlob = s;
        this.pdfSrc = await new Response(s).arrayBuffer();
      });
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI.substring(0, 4),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeCuc(event: any) {
    if (event) {
      let body = {
        trangThai: "01",
        maDviCha: event,
        type: "DV"
      };
      let res = await this.donViService.getDonViTheoMaCha(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listChiCuc = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadDsVthh() {
    this.listVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HHOA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data.filter(item => item.ma != "02");
    }
  }

  async changeLoaiVthh(event) {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  addRow() {
    this.rows.push({});
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
  }

  setListCondition() {
    let listVthhCondition = [];
    let listCloaiVthhCondition = [];
    listVthhCondition.push(this.selectedVthhCache);
    listCloaiVthhCondition.push(this.selectedCloaiVthhCache);
    this.rows.forEach((item) => {
      listVthhCondition.push(item.loaiVthh);
      listCloaiVthhCondition.push(item.cloaiVthh);
    });
    // this.formData.get("loaiVthh").setValue(listVthhCondition);
    this.formData.get("cloaiVthh").setValue(listCloaiVthhCondition);
  }
  clearFilter() {
    this.formData.patchValue({
      nam: null,
      namKh:null,
    })
  }
}
