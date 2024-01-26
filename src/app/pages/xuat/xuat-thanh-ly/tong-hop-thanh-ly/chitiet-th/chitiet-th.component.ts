import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { Validators } from "@angular/forms";

import { NumberToRoman } from 'src/app/shared/commonFunction';
import { cloneDeep, chain } from 'lodash';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { StorageService } from 'src/app/services/storage.service';
import { TongHopScService } from 'src/app/services/sua-chua/tongHopSc.service';
import { TongHopThanhLyService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/TongHopThanhLy.service';
import printJS from "print-js";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-chitiet-th',
  templateUrl: './chitiet-th.component.html',
  styleUrls: ['./chitiet-th.component.scss']
})
export class ChitietThComponent extends Base3Component implements OnInit {
  numberToRoman = NumberToRoman

  isDetail: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: TongHopThanhLyService,
    private _modalRef: NzModalRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      maDanhSach: [null, [Validators.required]],
      tenDanhSach: [null, [Validators.required]],
      thoiHanXuat: [null, [Validators.required]],
      thoiHanNhap: [null, [Validators.required]],
      ngayTao: [null, [Validators.required]],
      trangThai: [],
      tenDvi: [],
      thoiGianTl : []
    })
  }

  ngOnInit(): void {
    this.dataTable = []
    this.detail(this.id).then((res) => {
      this.formData.patchValue({
        thoiGianTl : [res.thoiGianTlTu,res.thoiGianTlDen]
      })
      this.dataTable.push(res);
      this.dataTable.forEach(item => {
        item.expandSet = true;
        item.groupChiCuc = chain(item.children).groupBy('xhTlDanhSachHdr.tenChiCuc').map((value, key) => ({
          tenDonVi: key,
          children: value,
        })
        ).value()
      })
    });
  }

  onCancel() {
    this._modalRef.close();
  }

  handleOk() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn gửi duyệt',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: STATUS.GUI_DUYET,
          }
          let res = await this._service.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.SUCCESS);
            this._modalRef.close(true);
            this.spinner.hide();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }

  showDetail() {
    this.isDetail = true;
  }

  downloadPdf() {
    saveAs(this.pdfSrc, "tong_hop_kh_lcnt.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "tong_hop_kh_lcnt.docx");
  }

  printPreview(){
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }

}
