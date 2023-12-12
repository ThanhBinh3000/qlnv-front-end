import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  ThongTinDauThauService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service";
import {
  QuyetDinhPheDuyetKeHoachLCNTService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service";
import { MESSAGE } from "../../../../../../constants/message";
import { cloneDeep } from 'lodash';
import { formatDate } from "@angular/common";
import { PREVIEW } from "../../../../../../constants/fileType";
import { saveAs } from "file-saver";
import {CurrencyMaskInputMode} from "ngx-currency";
import {STATUS} from "../../../../../../constants/status";
@Component({
  selector: 'app-themmoi-thongtin-dauthau-vt',
  templateUrl: './themmoi-thongtin-dauthau-vt.component.html',
  styleUrls: ['./themmoi-thongtin-dauthau-vt.component.scss']
})
export class ThemmoiThongtinDauthauVtComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() loaiVthh: String;
  @Output() showListEvent = new EventEmitter<any>();
  @Input() isShowFromKq: boolean;
  @Input() isKqDaBh: boolean;
  @Input() isView: boolean;
  danhsachDx: any[] = [];
  listNthauNopHs: any[] = [];
  dsTrangThai: any[] = [];
  selected: boolean = false;
  itemRow: any = {};
  itemRowQd: any[] = [];
  itemRowUpdate: any = {};
  idGoiThau: number = 0;
  isDieuChinh: boolean = false;
  previewName: string = "thong_tin_dau_thau_vt";
  listNhaThau: any[] = [];
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  };
  fileDinhKems: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTinDauThauService: ThongTinDauThauService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauThauService);
    this.formData = this.fb.group({
      namKhoach: [''],
      soQdPdKhlcnt: [''],
      soQdPdKqLcnt: [''],
      tenDuAn: [''],
      tenDvi: [''],
      tenNguonVon: [''],
      tongMucDt: [''],
      tongMucDtGoiTrung: [''],
      tenLoaiHdong: [''],
      tenHthucLcnt: [''],
      tenPthucLcnt: [''],
      tgianBdauTchuc: [''],
      tgianMthau: [''],
      tgianDthau: [''],
      soGthau: [''],
      soGthauTrung: [''],
      tenLoaiVthh: [''],
      vat: [''],
      soLuong: [''],
      tgianThien: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      trangThaiDt: [''],
      tenTrangThaiDt: [''],
      tongGiaTriGthau: [''],
      tgianTrinhKqTcg: [''],
      tgianTrinhTtd: [''],
      ghiChuTtdt: [''],
    })
  }

  async ngOnInit(){
    this.listNhaThau = [];
    let resNt = await this.thongTinDauThauService.getDanhSachNhaThau();
    if (resNt.msg == MESSAGE.SUCCESS) {
      this.listNhaThau = resNt.data;
    }
    this.dsTrangThai = [
      {
        value: this.STATUS.THANH_CONG,
        text: 'Thành công'
      }, {
        value: this.STATUS.THAT_BAI,
        text: 'Thất bại'
      }, {
        value: this.STATUS.HUY_THAU,
        text: 'Hủy thầu'
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.idInput) {
      this.detailVatTu()
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  save() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn hoàn thành cập nhật ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: this.STATUS.HOAN_THANH_CAP_NHAT,
            loaiVthh: this.loaiVthh
          }

          let res = await this.thongTinDauThauService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async detailVatTu() {
    this.spinner.show();
    const res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(this.idInput);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.formData.patchValue({
        trangThaiDt: data.trangThaiDt,
        tenTrangThaiDt: data.tenTrangThaiDt,
        namKhoach: data.namKhoach,
        soQdPdKhlcnt: data.soQd,
        soQdPdKqLcnt: data.soQdPdKqLcnt,
        tenDuAn: data.tenDuAn,
        tenDvi: data.tenDvi,
        tenNguonVon: data.dxKhlcntHdr?.tenNguonVon,
        tongMucDt: data.dchinhDxKhLcntHdr ? data.dchinhDxKhLcntHdr.tongMucDtDx * 1000000000 : data.tongMucDtDx * 1000000000,
        tenLoaiHdong: data.tenLoaiHdong,
        tenHthucLcnt: data.tenHthucLcnt,
        tenPthucLcnt: data.tenPthucLcnt,
        tgianBdauTchuc: data.dchinhDxKhLcntHdr ? data.dchinhDxKhLcntHdr.tgianBdauTchuc : data.tgianBdauTchuc,
        tgianMthau: data.qdPdHsmt?.tgianMthau ? formatDate(data.qdPdHsmt?.tgianMthau, "dd/MM/yyyy", 'en-US') : null,
        tgianDthau: data.qdPdHsmt?.tgianDthau ? formatDate(data.qdPdHsmt?.tgianDthau, "dd/MM/yyyy", 'en-US') : null,
        tongMucDtGoiTrung: [''],
        soGthauTrung: [''],
        tenLoaiVthh: data.tenLoaiVthh,
        vat: data.dxKhlcntHdr?.thueVat + '%',
        tgianThien: data.dchinhDxKhLcntHdr ? data.dchinhDxKhLcntHdr.tgianThien + " ngày" : data.tgianThien + " ngày",
        tenLoaiHinhNx: data.dxKhlcntHdr?.tenLoaiHinhNx,
        tenKieuNx: data.dxKhlcntHdr?.tenKieuNx,
      })
      this.danhsachDx = data.dchinhDxKhLcntHdr ? data.dchinhDxKhLcntHdr.dsGthau : data.dsGthau;
      if (data.dchinhDxKhLcntHdr) {
        this.isDieuChinh = true;
      }
      let soLuong = 0;
      let tongGiaTri = 0;
      let soGthauTrung = 0;
      this.danhsachDx.forEach(i => {
        soLuong += i.soLuong;
        tongGiaTri += i.soLuong * i.donGiaVat;
        if (i.trangThaiDt == this.STATUS.THANH_CONG) {
          soGthauTrung += 1;
        }
      })
      this.formData.patchValue({
        soLuong: soLuong,
        tongGiaTriGthau: tongGiaTri,
        soGthau: this.danhsachDx.length,
        soGthauTrung: soGthauTrung
      })
      this.showDetail(event, this.danhsachDx[0]);
    }
    this.spinner.hide();
  }

  async showDetail($event, dataGoiThau: any) {
    await this.spinner.show();
    this.listNthauNopHs = [];
    if ($event.type == 'click') {
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow')
      this.selected = false;
      this.idGoiThau = dataGoiThau.id;
    } else {
      this.selected = true;
      this.idGoiThau = dataGoiThau.id;
    }
    let type = "GOC";
    if (this.isDieuChinh) {
      type = "DC"
    }
    let res = await this.thongTinDauThauService.getDetailThongTinVt(this.idGoiThau, this.loaiVthh, type);
    // this.itemRow.soLuong = dataGoiThau.soLuong
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        // tgianTrinhKqTcg: res.data.tgianTrinhKqTcg,
        // tgianTrinhTtd: res.data.tgianTrinhTtd,
        ghiChuTtdt: res.data.ghiChuTtdt,
      })
      this.fileDinhKems = res.data.fileDinhKems
      this.listNthauNopHs = res.data.dsNhaThauDthau;
      this.listNthauNopHs.forEach(item => {
        item.edit = false;
      })
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  deleteRow(i, data) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let res = await this.thongTinDauThauService.delete({id: data.id});
          if (res.msg == MESSAGE.SUCCESS) {
            this.listNthauNopHs.splice(i, 1)
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  startEdit(index: number): void {
    this.listNthauNopHs[index].edit = true;
    this.itemRowUpdate = cloneDeep(this.listNthauNopHs[index]);
  }

  cancelEdit(index: number): void {
    this.listNthauNopHs[index].edit = false;
  }

  async saveEdit(dataUpdate, index: any) {
    this.listNthauNopHs[index] = this.itemRowUpdate;
    this.listNthauNopHs[index].edit = false;
    await this.saveGt();
  }
  async saveGt() {
    if (this.listNthauNopHs.length > 0) {
      await this.spinner.show()
      let type = "GOC";
      if (this.isDieuChinh) {
        type = "DC"
      }
      let body = {
        idGoiThau: this.idGoiThau,
        nthauDuThauList: this.listNthauNopHs,
        loaiVthh: this.loaiVthh,
        type: type
      }
      let res = await this.thongTinDauThauService.create(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        this.listNthauNopHs = res.data
        // await this.detailVatTu()
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      await this.spinner.hide()
    }
  }

  async addRow() {
    this.listNthauNopHs = [
      ...this.listNthauNopHs,
      this.itemRow
    ];
    await this.saveGt();
    this.clearItemRow();
  }

  clearItemRow() {
    this.itemRow = {};
  }

  async startEditRowNt(i) {
    let type = "GOC";
    if (this.isDieuChinh) {
      type = "DC"
    }
    let res = await this.thongTinDauThauService.getDetailThongTinVt(this.danhsachDx[i].id, this.loaiVthh, type);
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        // tgianTrinhKqTcg: res.data.tgianTrinhKqTcg,
        // tgianTrinhTtd: res.data.tgianTrinhTtd,
        ghiChuTtdt: res.data.ghiChuTtdt,
      })
      this.fileDinhKems = res.data.fileDinhKems
      this.listNthauNopHs = res.data.dsNhaThauDthau;
      this.listNthauNopHs.forEach(item => {
        item.edit = false;
      })
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.danhsachDx.forEach(item => {
      item.edit = false;
    })
    this.danhsachDx[i].edit = true;
    if (this.danhsachDx[i].kqlcntDtl) {
      this.itemRowQd[i] = cloneDeep(this.danhsachDx[i].kqlcntDtl);
    } else {
      this.itemRowQd[i] = {}
    }
  }
  cancelEditRowNt(i) {
    this.danhsachDx[i].edit = false;
  }
  async saveEditRowNt(i) {
    this.danhsachDx[i].kqlcntDtl = this.itemRowQd[i];
    if (this.itemRowQd[i].trangThai != null) {
      this.danhsachDx[i].kqlcntDtl.tenTrangThai = this.dsTrangThai.find(item => item.value == this.itemRowQd[i].trangThai).text;
    }
    if (this.itemRowQd[i].idNhaThau != null) {
      this.danhsachDx[i].kqlcntDtl.tenNhaThau = this.listNthauNopHs.find(item => item.id == this.itemRowQd[i].idNhaThau)?.tenNhaThau;
    }
    this.danhsachDx[i].edit = false;
  }

  async updateKqLcnt(i) {
    await this.spinner.show()
    let type = "GOC";
    if (this.isDieuChinh) {
      type = "DC"
    }
    let body = {
      idGoiThau: this.danhsachDx[i].id,
      id: this.danhsachDx[i].idNhaThau,
      loaiVthh: this.loaiVthh,
      type: type,
      trangThai: this.danhsachDx[i].trangThai,
      donGia: this.danhsachDx[i].donGiaVatNt
    }
    let res = await this.thongTinDauThauService.updateKqLcnt(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide()
  }

  calcTongSl() {
    if (this.danhsachDx) {
      return this.danhsachDx.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
    }
  }

  calcTongThanhTien() {
    return this.danhsachDx.reduce((prev, cur) => {
      prev += cur.soLuong * cur.donGiaVat;
      return prev;
    }, 0);
  }

  calcTongThanhTienKq() {
    return this.danhsachDx.reduce((prev, cur) => {
      prev += cur.soLuong * cur.donGiaNhaThau;
      return prev;
    }, 0);
  }

  async preview() {
    this.reportTemplate.fileName = this.previewName + '.docx';
    let body = {
      id: this.idInput,
      reportTemplateRequest: this.reportTemplate,
      loaiVthh: this.loaiVthh
    }
    await this.thongTinDauThauService.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }

  changeNhaThau(event?: any) {
    if (event.nzValue != '') {
      this.listNhaThau.forEach(item => {
        if (item.tenNhaThau == event.nzValue) {
          this.itemRow.donGia = item.donGia
          this.itemRow.mst = item.mst
          this.itemRow.diaChi = item.diaChi
          this.itemRow.sdt = item.sdt
        }
      })
    }
  }

  selectNhaThau(i, event) {
    this.listNthauNopHs.forEach(item => {
      if (item.id == event) {
        this.itemRowQd[i].donGiaVat = item.donGia
      }
    })
  }

  async saveGoiThauPopup($event) {
    $event.stopPropagation();
    await this.spinner.show();
    let type = "GOC";
    if (this.isDieuChinh) {
      type = "DC"
    }
    let body = {
      idGoiThau: this.idGoiThau,
      ghiChuTtdt: this.formData.value.ghiChuTtdt,
      // tgianTrinhKqTcg: this.formData.value.tgianTrinhKqTcg,
      // tgianTrinhTtd: this.formData.value.tgianTrinhTtd,
      fileDinhKems: this.fileDinhKems,
      loaiVthh: this.loaiVthh,
      type: type
    }
    let res = await this.thongTinDauThauService.updateGoiThau(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    if (this.listNthauNopHs.length > 0) {
      await this.saveGt();
    }
    await this.spinner.hide()
  }
}
