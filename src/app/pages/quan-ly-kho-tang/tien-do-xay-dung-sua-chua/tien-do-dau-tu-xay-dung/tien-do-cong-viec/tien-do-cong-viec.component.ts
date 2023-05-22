import {Component, Input, OnInit} from '@angular/core';
import {MESSAGE} from "../../../../../constants/message";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HopdongService} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/hopdong.service";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetKhlcnt.service";
import {AMOUNT_NO_DECIMAL} from "../../../../../Utility/utils";
import {STATUS} from "../../../../../constants/status";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {
  DeXuatScLonService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/de-xuat-sc-lon.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import dayjs from "dayjs";

@Component({
  selector: 'app-tien-do-cong-viec',
  templateUrl: './tien-do-cong-viec.component.html',
  styleUrls: ['./tien-do-cong-viec.component.scss']
})
export class TienDoCongViecComponent extends Base2Component implements OnInit {
  @Input()
  itemQdPdKhLcnt: any;
  listHopDong: any[] = []
  dataTable: any[] = []
  formData : FormGroup;
  AMOUNT = AMOUNT_NO_DECIMAL;
  STATUS = STATUS;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopdongService: HopdongService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopdongService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [null],
      tenTrangThai : ['Chưa thực hiện'],
      soQd : [null]
    })
  }

  ngOnInit(): void {
    this.loadItemDsGoiThau();
  }


  async loadItemDsGoiThau() {
    if (this.itemQdPdKhLcnt) {
      let body = {
        "namKh": this.itemQdPdKhLcnt.namKh,
        "idDuAn": this.itemQdPdKhLcnt.idDuAn,
        "idQdPdDaDtxd": this.itemQdPdKhLcnt.idQdPdDaDtxd,
        "idQdPdKhLcnt": this.itemQdPdKhLcnt.id,
      }
      let res = await this.hopdongService.detailQdPdKhLcnt(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          let listGoiThau = res.data.listKtTdxdQuyetDinhPdKhlcntCvKh;
          if (listGoiThau && listGoiThau.length > 0) {
            listGoiThau.forEach(item => item.chuDauTu = res.data.chuDauTu);
          }
          this.listHopDong = listGoiThau;
          console.log(this.listHopDong, 'itemQdPdKhLcnt...');
        } else {
          this.notification.warning(MESSAGE.WARNING, "Không tìm thấy thông tin gói thầu cho dự án này, vui lòng kiểm tra lại.");
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async selectRow(data) {
    if (data) {
      this.listHopDong.forEach(item => item.selected = false);
      data.selected = true;
      // this.itemSelected = data;
      // this.viewHopDong = true
      // this.idInput = data.idHopDong;
    }
  }
}
