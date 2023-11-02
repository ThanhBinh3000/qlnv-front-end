import {Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ThongTu1452013Service} from "../../../../services/bao-cao/ThongTu1452013.service";
import {UserService} from "../../../../services/user.service";
import {DonviService} from "../../../../services/donvi.service";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {Globals} from "../../../../shared/globals";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../constants/message";
import {Base2Component} from "../../../../components/base2/base2.component";
import {saveAs} from "file-saver";

@Component({
  selector: "app-thuc-hien-kh-nhap-xuat-ctvt-bao-quan",
  templateUrl: "./thuc-hien-kh-nhap-xuat-ctvt-bao-quan.component.html",
  styleUrls: ["./thuc-hien-kh-nhap-xuat-ctvt-bao-quan.component.scss"]
})
export class ThucHienKhNhapXuatCtvtBaoQuanComponent extends Base2Component implements OnInit {
  pdfSrc: any;
  excelSrc: any;
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
  listQuy = [
    {text: 'Quý I', value: 1},
    {text: 'Quý II', value: 2},
    {text: 'Quý III', value: 3},
    {text: 'Quý IV', value: 4},
  ];
  selectedValue = 1;
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
        nam: [, [Validators.required]],
        quy: [],
        maCuc: [],
        maChiCuc: [],
        loaiVthh: [],
        cloaiVthh: [],
        donViNhan: [],
        moTai: [],
        stk: [],
      }
    );
    // this.formData.controls['nam'].valueChanges.subscribe((namValue) => {
    //   const month = dayjs().get("month");
    //   this.listQuy = [];
    //   for (let i = 0; i <= Math.floor(month / 3); i++) {
    //     if (i >= 1) {
    //       this.listQuy.push(this.quyData[i - 1]);
    //     }
    //   }
    //   if (namValue < dayjs().get('year')) {
    //     this.listQuy = this.quyData
    //   }
    // });
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
      this.formData.controls['nam'].setValue(dayjs().get("year"))
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
    saveAs(this.pdfBlob, "bc_thuc_hien_kh_hoach_nhap_xuat_ct_vt_bao_quan_hang_dtqg.pdf");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  async preView() {
    try {
      this.spinner.show();
      this.setListCondition();
      let body = this.formData.value;
      console.log("body", body);
      body.typeFile = "pdf";
      body.fileName = "bc_thuc_hien_kh_hoach_nhap_xuat_ct_vt_bao_quan_hang_dtqg.jrxml";
      body.tenBaoCao = "Báo cáo thực hiện KH hoạch nhập, xuất, ct, vt, bảo quản hàng DTQG";
      body.trangThai = "01";
      await this.thongTu1452013Service.thucHienKeHoach(body).then(async s => {
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

  async downloadExcel() {
    try {
      this.spinner.show();
      if (this.formData.value.thoiGianSx) {
        this.formData.value.thoiGianSxTu = dayjs(this.formData.value.thoiGianSx[0]).format("YYYY-MM-DD");
        this.formData.value.thoiGianSxDen = dayjs(this.formData.value.thoiGianSx[1]).format("YYYY-MM-DD");
      }
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.fileName = "bc_thuc_hien_kh_hoach_nhap_xuat_ct_vt_bao_quan_hang_dtqg.jrxml";
      body.tenBaoCao = "Báo cáo thực hiện KH hoạch nhập, xuất, ct, vt, bảo quản hàng DTQG";
      body.trangThai = "01";
      await this.thongTu1452013Service.thucHienKeHoach(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "bc_thuc_hien_kh_hoach_nhap_xuat_ct_vt_bao_quan_hang_dtqg.xlsx");
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
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: event});
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
    debugger
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
      quy: null,
    })
  }
}
