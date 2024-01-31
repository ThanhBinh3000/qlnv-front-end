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
import {DatePipe} from "@angular/common";
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
  listGoiThau: any[] = [];
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
      tenCloaiVthh: [""],
      loaiVthh: [""],
      tchuanCluong: [""],
      quy: [""],
      tgianBdauTchuc: [],
      tgianDthauTime: [],
      tgianMthauTime: [],
      gtriDthau: [],
      idQdPdKhlcntDtl: [],
      listIdGthau: [],
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
      nzTitle: "DANH SÁCH QUYẾT ĐỊNH PHÊ DUYỆT/ĐIỀU CHỈNH KHLCNT",
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzComponentParams: {
        dataTable: listQdPdKhlcnt,
        dataHeader: ["Số quyết định", "Số quyết định điều chỉnh", "Loại hàng DTQG", "Chủng loại hàng DTQG"],
        dataColumn: ["soQd", "soQdDc", "tenLoaiVthh", "tenCloaiVthh"]
      }
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        data.children.forEach(chiCuc => {
          if (chiCuc.maDvi == this.userInfo.MA_DVI) {
            this.formData.patchValue({
              soQdPdKhlcnt: data.soQd,
              idQdPdKhlcnt: data.id,
              idQdPdKhlcntDtl: chiCuc.id,
              tenDuAn: chiCuc.tenDuAn,
              tenLoaiVthh: chiCuc.dxuatKhLcntHdr?.tenLoaiVthh,
              tenCloaiVthh: chiCuc.dxuatKhLcntHdr?.tenCloaiVthh,
              loaiVthh: chiCuc.dxuatKhLcntHdr?.loaiVthh,
              cloaiVthh: chiCuc.dxuatKhLcntHdr?.cloaiVthh,
              tchuanCluong: chiCuc.dxuatKhLcntHdr?.tchuanCluong,
              quy: chiCuc.dxuatKhLcntHdr?.quy,
              gtriDthau: chiCuc.dxuatKhLcntHdr?.gtriDthau,
              tgianBdauTchuc: chiCuc.tgianBdauTchuc,
              tgianDthauTime: chiCuc.tgianDthauTime,
              tgianDthau: chiCuc.tgianDthau,
              tgianMthauTime: chiCuc.tgianMthauTime,
              tgianMthau: chiCuc.tgianMthau,
            })
            this.listGoiThau = chiCuc.children.filter(item => item.idQdPdHsmt == null);
          }
        })
      }
    });
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    this.setValidator(isGuiDuyet);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    let pipe = new DatePipe('en-US');
    if (this.formData.value.tgianMthau != null) {
      if (this.formData.value.tgianMthauTime != null) {
        this.formData.value.tgianMthau = pipe.transform(this.formData.value.tgianMthau, 'yyyy-MM-dd') + " " + pipe.transform(this.formData.value.tgianMthauTime, 'HH:mm') + ":00"
      } else {
        this.formData.value.tgianMthau = pipe.transform(this.formData.value.tgianMthau, 'yyyy-MM-dd')  + " 00:00:00"
      }
    }
    if (this.formData.value.tgianDthau != null) {
      if (this.formData.value.tgianDthauTime != null) {
        this.formData.value.tgianDthau =  pipe.transform(this.formData.value.tgianDthau, 'yyyy-MM-dd') + " " + pipe.transform(this.formData.value.tgianDthauTime, 'HH:mm') + ":00"
      } else {
        this.formData.value.tgianDthau =  pipe.transform(this.formData.value.tgianDthau, 'yyyy-MM-dd') + " 23:59:59"
      }
    }
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    body.listCcPhapLy = this.listCcPhapLy;
    body.tgianMthauTime = pipe.transform(body.tgianMthauTime, 'yyyy-MM-dd HH:mm')
    body.tgianDthauTime = pipe.transform(body.tgianDthauTime, 'yyyy-MM-dd HH:mm')
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
    if (isGuiDuyet) {
      this.formData.controls["namKhoach"].setValidators([Validators.required]);
      this.formData.controls["soQd"].setValidators([Validators.required]);
      this.formData.controls["ngayQd"].setValidators([Validators.required]);
      // this.formData.controls["ngayHluc"].setValidators([Validators.required]);
      this.formData.controls["soQdPdKhlcnt"].setValidators([Validators.required]);
      this.formData.controls["trichYeu"].setValidators([Validators.required]);
      this.formData.controls["noiDungQd"].setValidators([Validators.required]);
      this.formData.controls["tenDuAn"].setValidators([Validators.required]);
      this.formData.controls["quy"].setValidators([Validators.required]);
      this.formData.controls["tgianMthau"].setValidators([Validators.required]);
      this.formData.controls["tgianDthau"].setValidators([Validators.required]);
    } else {
      Object.keys(this.formData.controls).forEach(key => {
        const control = this.formData.controls[key];
        control.clearValidators();
        control.updateValueAndValidity();
      });
      this.formData.updateValueAndValidity();
      this.formData.controls["soQdPdKhlcnt"].setValidators([Validators.required]);
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
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
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
        tenLoaiVthh: data.qdKhlcntHdr.tenLoaiVthh,
        loaiVthh: data.qdKhlcntHdr.loaiVthh,
        tenCloaiVthh: data.qdKhlcntHdr.tenCloaiVthh,
        cloaiVthh: data.qdKhlcntHdr.cloaiVthh,
        tgianBdauTchuc: data.tgianBdauTchuc
      });
      if (data.soQd) {
        this.maQd = data.soQd?.split("/")[1];
      }
      data.qdKhlcntHdr.children.forEach(cuc => {
        if (cuc.maDvi == data.maDvi) {
          this.listGoiThau = cuc.children;
          this.formData.patchValue({
            tenDuAn: cuc.dxuatKhLcntHdr?.tenDuAn,
            tchuanCluong: cuc.dxuatKhLcntHdr?.tchuanCluong,
            quy: cuc.dxuatKhLcntHdr?.quy,
            listIdGthau: cuc.listIdGthau
          });
          this.selectGthau()
        }
      })
      this.listCcPhapLy = data.listCcPhapLy;
    }
  }

  async onChangeNamKh() {
    this.initListQuy();
  }

  tinhTongMucDtDx () {
    let tongMucDt: number = 0;
    let tongMucDtDx: number = 0;
    let tongSlChiTieu: number = 0;
    let tongSl: number = 0;
    this.listOfData.forEach((item) => {
      let thanhTien: number = 0;
      let thanhTienDx: number = 0;
      item.children.forEach(i => {
        tongMucDt = tongMucDt + (i.soLuong * i.donGia *1000);
        tongMucDtDx = tongMucDtDx + (i.soLuong * i.donGiaTamTinh * 1000);
        thanhTien = thanhTien + (i.soLuong * i.donGia *1000);
        thanhTienDx = thanhTienDx + (i.soLuong * i.donGiaTamTinh * 1000);
        tongSl += i.soLuong
        tongSlChiTieu += i.soLuongChiTieu
      })
      item.thanhTien = thanhTien;
      item.thanhTienDx = thanhTienDx;
    });
    this.formData.patchValue({
      tongMucDtLamTron: parseFloat((tongMucDt/1000000000).toFixed(2)),
      tongMucDtDxLamTron: parseFloat((tongMucDtDx/1000000000).toFixed(2)),
      tongMucDt: tongMucDt,
      tongMucDtDx: tongMucDtDx,
      tongSlChiTieu: tongSlChiTieu,
      soLuong: tongSl,
    });
  }

  selectGthau() {
    if (this.formData.value.listIdGthau != null) {
      this.listOfData = this.listGoiThau.filter(item => this.formData.value.listIdGthau.includes(item.id))
      this.tinhTongMucDtDx()
      for (let i = 0; i < this.listOfData.length; i++) {
        this.expandSet.add(i)
        for (let j = 0; j < this.listOfData[i].children.length; j++) {
          this.expandSet2.add(j)
        }
      }
    }
  }

  calcTongSl() {
    if (this.listOfData) {
      let sum = 0;
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong;
          return prev;
        }, 0);
        sum += sumChild;
      });
      return sum;
    }
  }

  calcTongThanhTien() {
    if (this.listOfData) {
      let sum = 0;
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * cur.donGia;
          return prev;
        }, 0);
        sum += sumChild;
      });
      return sum;
    }
  }
}
