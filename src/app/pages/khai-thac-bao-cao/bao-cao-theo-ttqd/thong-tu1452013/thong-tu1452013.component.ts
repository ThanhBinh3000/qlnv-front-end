import {saveAs} from 'file-saver';
import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../../../../services/user.service";
import {DonviService} from "../../../../services/donvi.service";
import {Globals} from "../../../../shared/globals";
import {ThongTu1452013Service} from "../../../../services/bao-cao/ThongTu1452013.service";
import * as dayjs from "dayjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {createLogErrorHandler} from "@angular/compiler-cli/ngcc/src/execution/tasks/completion";

@Component({
  selector: 'app-thong-tu1452013',
  templateUrl: './thong-tu1452013.component.html',
  styleUrls: ['./thong-tu1452013.component.scss']
})
export class ThongTu1452013Component implements OnInit {
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  showDlgPreview = false;
  listNam: any[] = [];
  formData: FormGroup;
  listQuy = [
    {text: 'Quý I', value: 1},
    {text: 'Quý II', value: 2},
    {text: 'Quý III', value: 3},
    {text: 'Quý IV', value: 4},
  ];
  selectedValue = 1;

  constructor(private spinner: NgxSpinnerService,
              private notification: NzNotificationService,
              private thongTu1452013Service: ThongTu1452013Service,
              private fb: FormBuilder,
              private modal: NzModalService,
              public userService: UserService,
              private donviService: DonviService,
              public globals: Globals,
  ) {

    this.formData = this.fb.group(
      {
        nam: [, [Validators.required]],
        quy: [,[Validators.required]],
        maCuc: [],
        maChiCuc: [],
        loaiVthh: [],
        cloaiVthh: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
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

  ngOnInit(): void {
    for (let i = 0; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.formData.controls['nam'].setValue(dayjs().get("year"))
  }

  private blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }


  exportData() {

  }

  downloadPdf() {
    saveAs(this.pdfBlob, 'baocao.pdf');
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  async preView() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "bc_nhap_xuat_ton_kho_hang_dtnn.jrxml";
      body.tenBaoCao = "Báo cáo nhập, xuất, tồn kho hàng dự trữ nhà nước";
      body.trangThai = "01";
      await this.thongTu1452013Service.nhapXuatTon(body).then(async s => {
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
      // this.setListCondition();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.fileName = "bc_nhap_xuat_ton_kho_hang_dtnn.jrxml";
      body.tenBaoCao = "Báo cáo nhập, xuất, tồn kho hàng dự trữ nhà nước";
      body.trangThai = "01";
      await this.thongTu1452013Service.nhapXuatTon(body).then(async s => {
        this.excelBlob = s;
        saveAs(this.excelBlob, "bc_nhap_xuat_ton_kho_hang_dtnn.xlsx");
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }
  clearFilter() {
    this.formData.patchValue({
      nam: null,
      quy:null,
    })
  }
}
