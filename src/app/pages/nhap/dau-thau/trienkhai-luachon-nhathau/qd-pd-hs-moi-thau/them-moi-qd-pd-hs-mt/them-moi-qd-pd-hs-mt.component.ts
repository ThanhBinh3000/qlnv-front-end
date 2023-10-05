import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetDinhPheDuyetHsmtService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetHsmt.service";
import {
  QuyetDinhPheDuyetKeHoachLCNTService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
@Component({
  selector: 'app-them-moi-qd-pd-hs-mt',
  templateUrl: './them-moi-qd-pd-hs-mt.component.html',
  styleUrls: ['./them-moi-qd-pd-hs-mt.component.scss']
})
export class ThemMoiQdPdHsMtComponent extends Base2Component implements OnInit {
  @Output() showListEvent = new EventEmitter<any>();
  @Input() isView: boolean;
  @Input() idInput: number = 0;
  @Input() loaiVthh: string;
  STATUS = STATUS;
  maQd: string = null;
  listCcPhapLy: any[] = [];
  listQuy: any[] = [];
  listOfData: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPheDuyetHsmtService: QuyetDinhPheDuyetHsmtService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetHsmtService);
    this.formData = this.fb.group({
      id: [null],
      namKhoach: [dayjs().get("year"), Validators.required],
      trangThai: [this.STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ["Đang nhập dữ liệu"],
      soQd: [""],
      ngayQd: [""],
      ngayHluc: [""],
      soQdPdKhlcnt: [""],
      idQdPdKhlcnt: [""],
      trichYeu: [""],
      noiDungQd: [""],
      tgianMthau: [""],
      tgianDthau: [""],
      ghiChu: [""],
      tenDuAn: [""],
      tenLoaiVthh: [""],
      loaiVthh: [""],
      tchuanCluong: [""],
      quy: [""],
      tgianBdauTchuc: [""],
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      this.initListQuy()
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        // this.initForm();
      }
      await Promise.all([
        // this.loadDataComboBox()
      ]);
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async openDialogQd() {
    await this.spinner.show();
    let bodyToTrinh = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.loaiVthh,
      namKhoach: this.formData.get('namKhoach').value,
      lastest: 1
    };
    let resToTrinh = await this.quyetDinhPheDuyetKeHoachLCNTService.getAll(bodyToTrinh);
    let listQdPdKhlcnt = [];
    if (resToTrinh.msg == MESSAGE.SUCCESS) {
      listQdPdKhlcnt = resToTrinh.data.filter(x => x.qdPdHsmt == null);
    }
    await this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: "Danh sách đề xuất kế hoạch lựa chọn nhà thầu",
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzComponentParams: {
        dataTable: listQdPdKhlcnt,
        dataHeader: ["Số quyết định", "Số quyết định điều chỉnh", "Loại hàng DTQG"],
        dataColumn: ["soQd", "soQdDc", "tenLoaiVthh"]
      }
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdPdKhlcnt: data.soQd,
          idQdPdKhlcnt: data.id,
          tenDuAn: data.dchinhDxKhLcntHdr ? data.dchinhDxKhLcntHdr.tenDuAn : data.tenDuAn,
          tenLoaiVthh: data.tenLoaiVthh,
          loaiVthh: data.loaiVthh,
          tchuanCluong: data.dxKhlcntHdr?.tchuanCluong,
          quy: data.dxKhlcntHdr?.quy,
          tgianBdauTchuc: data.dchinhDxKhLcntHdr ? data.dchinhDxKhLcntHdr.tgianBdauTchuc : data.tgianBdauTchuc,
        })
        this.listOfData = data.dchinhDxKhLcntHdr ? data.dchinhDxKhLcntHdr.dsGthau : data.dsGthau;
      }
    });
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    // this.setValidator(isGuiDuyet);
    // this.helperService.markFormGroupTouched(this.formData);
    // if (this.formData.invalid) {
    //   await this.spinner.hide();
    //   return;
    // }
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    body.listCcPhapLy = this.listCcPhapLy;
    let res = null;
    if (this.formData.get("id").value) {
      res = await this.quyetDinhPheDuyetHsmtService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetHsmtService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.get("id").setValue(res.data.id);
        this.guiDuyet();
      } else {
        if (this.formData.get("id").value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.formData.get("id").setValue(res.data.id);
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  setValidator(isGuiDuyet?) {
    if (!isGuiDuyet) {
      this.formData.controls["nam"].clearValidators();
    }
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn muốn ban hành quyết định?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            id: this.formData.get("id").value,
            trangThai: this.STATUS.BAN_HANH
          };
          let res = await this.quyetDinhPheDuyetHsmtService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log("error: ", e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  initListQuy() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const quarters = [];

    for (let quarter = 1; quarter <= 4; quarter++) {
      if (this.formData.get('namKhoach').value < currentYear || (this.formData.get('namKhoach').value === currentYear && quarter <= Math.ceil((currentMonth + 1) / 3))) {
        quarters.push(quarter);
      }
    }
    this.listQuy = [];
    for (const element of quarters) {
      this.listQuy.push({giaTri: "Quý " + element + "/" + this.formData.get("namKhoach").value, ma: element})
    }
  }

  disabledDate = (current: Date): boolean => {
    const startDate = new Date(this.formData.get("namKhoach").value, (this.formData.get("quy").value - 1) * 3, 1);
    const endDate = new Date(this.formData.get("namKhoach").value, this.formData.get("quy").value * 3, 0);
    return current < startDate || current > endDate;
  };

  quayLai() {
    this.showListEvent.emit();
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhPheDuyetHsmtService.getDetail(id);
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQd: data.soQd?.split("/")[0],
        soQdPdKhlcnt: data.qdKhlcntHdr.soQd,
        idQdPdKhlcnt: data.qdKhlcntHdr.id,
        tenDuAn: data.qdKhlcntHdr.dchinhDxKhLcntHdr? data.qdKhlcntHdr.dchinhDxKhLcntHdr.tenDuAn : data.qdKhlcntHdr.tenDuAn,
        tenLoaiVthh: data.qdKhlcntHdr.tenLoaiVthh,
        loaiVthh: data.qdKhlcntHdr.loaiVthh,
        tchuanCluong: data.qdKhlcntHdr.dxKhlcntHdr.tchuanCluong,
        quy: data.qdKhlcntHdr.dxKhlcntHdr.quy,
        tgianBdauTchuc: data.qdKhlcntHdr.dchinhDxKhLcntHdr? data.qdKhlcntHdr.dchinhDxKhLcntHdr.tgianBdauTchuc : data.qdKhlcntHdr.tgianBdauTchuc,
      });
      this.listOfData = data.qdKhlcntHdr.dchinhDxKhLcntHdr? data.qdKhlcntHdr.dchinhDxKhLcntHdr.dsGthau : data.qdKhlcntHdr.dsGthau;
      this.listCcPhapLy = data.listCcPhapLy;
    }
  }

  async onChangeNamKh() {
    this.initListQuy();
  }

}
