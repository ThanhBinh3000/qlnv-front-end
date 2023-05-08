import { Component, OnInit } from "@angular/core";
import { BcBnTt108Service } from "../../../../services/bao-cao/BcBnTt108.service";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { BcCLuongHangDTQGService } from "../../../../services/bao-cao/BcCLuongHangDTQG.service";
import { UserService } from "../../../../services/user.service";
import { DonviService } from "../../../../services/donvi.service";
import { Globals } from "../../../../shared/globals";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { Base2Component } from "../../../../components/base2/base2.component";

@Component({
  selector: "app-nguon-hinh-thanh-dtqg",
  templateUrl: "./nguon-hinh-thanh-dtqg.component.html",
  styleUrls: ["./nguon-hinh-thanh-dtqg.component.scss"]
})
export class NguonHinhThanhDtqgComponent extends Base2Component implements OnInit {
  listQuy: any[] = [
    {text: 'Quý I', value: 1},
    {text: 'Quý II', value: 2},
    {text: 'Quý III', value: 3},
    {text: 'Quý IV', value: 4},
  ]

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private bcBnTt108Service: BcBnTt108Service,
              public userService: UserService,) {
    super(httpClient, storageService, notification, spinner, modal, bcBnTt108Service);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        quy: [null],
        tuNgayTao: [null],
        tuNgayKyGui: [null],
        denNgayTao: [null],
        denNgayKyGui: [null],
      }
    );
  }

  tuNgayTao: Date | null = null;
  tuNgayKyGui: Date | null = null;
  denNgayTao: Date | null = null;
  denNgayKyGui: Date | null = null;
  disabledTuNgayTao = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayTao) {
      return false;
    }
    return startValue.getTime() > this.denNgayTao.getTime();
  };

  disabledDenNgayTao = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayTao) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayTao.getTime();
  };
  disabledTuNgayKyGui = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayKyGui) {
      return false;
    }
    return startValue.getTime() > this.denNgayKyGui.getTime();
  };

  disabledDenNgayKyGui = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayKyGui) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayKyGui.getTime();
  };

  ngOnInit(): void {
  }

  async clearFilter() {
    this.formData.get('nam').setValue(dayjs().get("year"));
    this.formData.get('quy').setValue(null);
    this.formData.get('tuNgayTao').setValue(null);
    this.formData.get('tuNgayKyGui').setValue(null);
    this.formData.get('denNgayTao').setValue(null);
    this.formData.get('denNgayKyGui').setValue(null);
    this.tuNgayTao = null;
    this.tuNgayKyGui = null;
    this.denNgayTao = null;
    this.denNgayKyGui = null;
  }

}
