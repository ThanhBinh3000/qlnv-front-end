import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Globals} from 'src/app/shared/globals';
import {FormBuilder, FormGroup} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {HelperService} from "../../../../../../services/helper.service";
import {
  ThongTinHopDongService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {
  QuyetDinhPheDuyetKetQuaLCNTService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service";
import {MESSAGE} from "../../../../../../constants/message";
import {UserLogin} from "../../../../../../models/userlogin";
import {UserService} from "../../../../../../services/user.service";
import {NzModalService} from 'ng-zorro-antd/modal';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {saveAs} from 'file-saver';
@Component({
  selector: 'app-quanly-hopdong',
  templateUrl: './quanly-hopdong.component.html',
  styleUrls: ['./quanly-hopdong.component.scss']
})
export class QuanlyHopdongComponent implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: String;
  @Input() checkPrice: any;
  @Output()
  showListEvent = new EventEmitter<any>();

  STATUS = STATUS;
  formData: FormGroup;
  dataTable: any[] = [];
  idHopDong: number;
  isEditHopDong: boolean
  userInfo: UserLogin;
  showDlgPreview = false;
  pdfSrc: any;
  printSrc: any;
  wordSrc: any;
  reportTemplate: any = {
    typeFile: "",
    fileName: "",
    tenBaoCao: "",
    trangThai: ""
  };
  previewName : string;
  listNguoiDaiDien: any[] = [];
  isView: any;
  constructor(
    public globals: Globals,
    private helperService: HelperService,
    private fb: FormBuilder,
    private thongTinHopDong: ThongTinHopDongService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private kqLcnt: QuyetDinhPheDuyetKetQuaLCNTService,
    public userService: UserService,
    private modal: NzModalService,

  ) {
    this.formData = this.fb.group({
      id: [],
      namKhoach: [''],
      soQdPdKhlcnt: [],
      soQdPdKqLcnt: [],
      tenDuAn: [],
      tenDvi: [],
      tongMucDt: [],
      tongMucDtGoiTrung: [],
      nguonVon: [''],
      tenNguonVon: [''],
      hthucLcnt: [''],
      tenHthucLcnt: [],
      pthucLcnt: [''],
      tenPthucLcnt: [],
      loaiHdong: [''],
      tenLoaiHdong: [''],
      tgianBdauTchuc: [],
      tgianDthau: [],
      tgianMthau: [],
      tgianNhang: [''],
      gtriDthau: [],
      gtriHdong: [],
      donGiaVat: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      soGthau: [],
      soGthauTrung: [],
      soGthauTruot: [],
      soLuong: [''],
      donGia: [''],
      tongTien: [''],
      vat: ['5'],
      ghiChu: ['',],
      trangThai: [''],
      tenTrangThai: [''],
      soLuongTong: [''],
      soLuongGtTrung: [''],
      soLuongNhap: [''],
      soLuongNhapKh: [''],
      tenTrangThaiHd: [''],
      trangThaiHd: [''],
      soHdDaKy: []
    });
  }

  ngOnInit() {
    const asyncTaskPromise = new Promise<void>(async (resolve, reject) => {
      await this.spinner.show()
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadListNguoiDaiDien(),
      ]);
      if (this.id) {
        await this.getDetail(this.id)
      }
      await this.spinner.hide()
      resolve();
    });
    asyncTaskPromise.then(() => {
      var firstRow = document.querySelector(".table-body tr:first-child");
      if (firstRow) {
        firstRow.classList.add("selectedRow");
      }
    });
  }

  async loadListNguoiDaiDien() {
    let body = {
      maDvi: '0101',
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      }
    }
    await this.userService.search(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listNguoiDaiDien = res.data?.content
      }
    })
  }

  async getDetail(id) {
    if (id) {
      let res = await this.kqLcnt.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        if (this.loaiVthh.startsWith('02')) {
          this.detailVatTu(data);
        } else {
          this.detailLuongThuc(data);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  detailVatTu(data) {
    this.formData.patchValue({
      id: data.id,
      namKhoach: data.namKhoach,
      soQdPdKqLcnt: data.soQd,
      soQdPdKhlcnt: data.soQdPdKhlcnt,
      tenLoaiHdong: data.hhQdKhlcntHdr?.tenLoaiHdong,
      tenNguonVon: data.hhQdKhlcntHdr?.dxKhlcntHdr?.tenNguonVon,
      tenLoaiVthh: data.hhQdKhlcntHdr?.tenLoaiVthh,
      tenCloaiVthh: data.hhQdKhlcntHdr?.tenCloaiVthh,
      soGthauTrung: data.hhQdKhlcntHdr?.soGthauTrung == null ? 0 : data.hhQdKhlcntHdr?.soGthauTrung,
      soGthauTruot: data.hhQdKhlcntHdr?.soGthauTruot == null ? 0 : data.hhQdKhlcntHdr?.soGthauTruot,
      tenDuAn: data.hhQdKhlcntHdr?.tenDuAn,
      tongMucDt: data.hhQdKhlcntHdr?.tongMucDt,
      vat: data.hhQdKhlcntHdr?.dxKhlcntHdr?.thueVat,
      tenTrangThaiHd: data.tenTrangThaiHd,
      trangThaiHd: data.trangThaiHd,
      tenDvi: data.hhQdKhlcntHdr?.tenDvi,
    });
    this.dataTable = data.hhQdKhlcntHdr.dchinhDxKhLcntHdr?  data.hhQdKhlcntHdr.dchinhDxKhLcntHdr.dsGthau.filter(item =>
        (item.trangThaiDt == STATUS.THANH_CONG || item.trangThaiDt == STATUS.KHONG_KY_HD) && data.listIdGthau.includes(item.id)):
      data.hhQdKhlcntHdr.dsGthau.filter(item => (item.trangThaiDt == STATUS.THANH_CONG || item.trangThaiDt == STATUS.KHONG_KY_HD) && data.listIdGthau.includes(item.id));
    if (data.listHopDong) {
      let soLuong = 0
      let tongMucDtGoiTrung = 0;
      let soHdDaKy = 0
      let soGthauTrung = 0;
      this.dataTable.forEach(item => {
        item.hopDong = data.listHopDong.filter(x => x.idGoiThau == item.id)[0]
        if (item.hopDong) {
          soLuong += item.hopDong.soLuong;
        }
        tongMucDtGoiTrung += item.soLuong * item.donGiaNhaThau;
        if (item.trangThaiDt == this.STATUS.THANH_CONG) {
          soGthauTrung += 1;
        }
      })
      data.listHopDong.forEach(i => {
        if (i.trangThai == STATUS.DA_KY) {
          soHdDaKy += 1;
        }
      })
      this.formData.patchValue({
        soHdDaKy: soHdDaKy,
        soLuongNhapKh: soLuong,
        tongMucDtGoiTrung: tongMucDtGoiTrung,
        soGthau: this.dataTable.length,
        soGthauTrung: soGthauTrung
      })
    };
    if (this.dataTable.length > 0 && this.dataTable[0].hopDong != undefined) {
      this.idHopDong = this.dataTable[0].hopDong.id;
    } else {
      this.idHopDong = null;
    }
  }

  detailLuongThuc(data) {
    this.formData.patchValue({
      id: data.id,
      namKhoach: data.namKhoach,
      soQdPdKhlcnt: data.qdKhlcntDtl?.hhQdKhlcntHdr?.soQd,
      soQdPdKqLcnt: data.qdKhlcntDtl?.soQdPdKqLcnt,
      tenDuAn: data.qdKhlcntDtl?.tenDuAn,
      tenLoaiHdong: data.qdKhlcntDtl?.dxuatKhLcntHdr?.tenLoaiHdong,
      tenDvi: data.tenDvi,
      tenNguonVon: data.qdKhlcntDtl?.dxuatKhLcntHdr?.tenNguonVon,
      soGthau: data.qdKhlcntDtl?.soGthau,
      tenLoaiVthh: data.qdKhlcntDtl?.hhQdKhlcntHdr?.tenLoaiVthh,
      tenCloaiVthh: data.qdKhlcntDtl?.hhQdKhlcntHdr?.tenCloaiVthh,
      vat: data.qdKhlcntDtl?.dxuatKhLcntHdr?.thueVat,
      soGthauTrung: data.qdKhlcntDtl?.soGthauTrung,
      tenTrangThaiHd: data.tenTrangThaiHd,
      trangThaiHd: data.trangThaiHd,
    });
    if(data.qdKhlcntDtl?.children) {
      let tongMucDt = 0;
      let tongMucDtGoiTrung = 0;
      data.qdKhlcntDtl?.children.forEach(i => {
        i.children.forEach(z => {
          tongMucDt += z.donGiaLastest * z.soLuong * 1000
        });
        tongMucDtGoiTrung += i.donGiaNhaThau * i.soLuong * 1000
      })
      this.formData.patchValue({
        tongMucDt: tongMucDt,
        tongMucDtGoiTrung: tongMucDtGoiTrung,
      })
    }
    this.dataTable = data.qdKhlcntDtl?.children.filter(item => item.trangThaiDt == STATUS.THANH_CONG && data.listIdGthau.includes(item.id));
    if (data.listHopDong) {
      let soLuong = 0
      // let tongMucDtGoiTrung = 0;
      let soHdDaKy = 0
      this.dataTable.forEach(item => {
        let hopDong = data.listHopDong.filter(x => x.idGoiThau == item.id)[0];
        item.hopDong = hopDong
        if (item.hopDong) {
          soLuong += item.hopDong.soLuong;
          // tongMucDtGoiTrung += item.hopDong.soLuong * item.hopDong.donGia * 1000;
        }
      })
      data.listHopDong.forEach(i => {
        if (i.trangThai == STATUS.DA_KY) {
          soHdDaKy += 1;
        }
      })
      this.formData.patchValue({
        soHdDaKy: soHdDaKy,
        soLuongNhapKh: data.qdKhlcntDtl?.soLuong,
        // tongMucDtGoiTrung: tongMucDtGoiTrung,
        soGthauTruot: this.formData.get('soGthau').value - this.formData.get('soGthauTrung').value,
      })
    };
    if (this.dataTable.length > 0 && this.dataTable[0].hopDong != undefined) {
      this.idHopDong = this.dataTable[0].hopDong.id;
    } else {
      this.idHopDong = null;
    }
  }

  async getDetailHopDong($event, id: number) {
    this.spinner.show();
    var firstRow = document.querySelector(".table-body tr.selectedRow");
    firstRow.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow');
    this.idHopDong = id;
    this.spinner.hide();
  }

  async redirectHopDong(isShowHd: boolean, id: number, isView: boolean) {
    this.isEditHopDong = isShowHd;
    this.idHopDong = id;
    this.isView = isView;
    if (!isShowHd) {
      await this.ngOnInit()
    }
  }

  back() {
    this.showListEvent.emit();
  }

  async approve() {
    if (this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    let mess = 'Bạn có chắc chắn muốn hoàn thành cập nhật hợp đồng ?'
    if (this.validateData()) {
      mess = 'Còn gói thầu chưa tạo hợp đồng hoặc hợp đồng chưa được ký, bạn có chắc chắn muốn hoàn thành cập nhật hợp đồng ?'
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mess,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: STATUS.DA_HOAN_THANH
          }
          let res = await this.kqLcnt.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
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

  validateData(): boolean {
    let result = false;
    this.dataTable.forEach(item => {
      if (item.hopDong) {
        if (item.hopDong.trangThai != STATUS.DA_KY) {
          // this.notification.error(MESSAGE.ERROR, "Vui lòng ký tất cả hợp đồng cho các gói thầu");
          result = true;
          return
        }
      } else {
        // this.notification.error(MESSAGE.ERROR, "Vui lòng thêm các hợp đồng cho các gói thầu");
        result = true;
        return
      }
    });
    return result;
  }

  deleteHopDong(id: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: MESSAGE.DELETE_CONFIRM,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: id,
            maDvi: null,
          };
          this.thongTinHopDong
            .delete(body)
            .then(async (res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                await this.getDetail(this.id)
                this.notification.success(
                  MESSAGE.SUCCESS,
                  MESSAGE.DELETE_SUCCESS,
                );
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
              this.spinner.hide();
            });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  calcTongSl() {
    if (this.dataTable) {
      let sum = 0
      this.dataTable.forEach(item => {
        if (item.hopDong) {
          sum += item.hopDong.soLuong;
        }
      })
      return sum;
    }
  }

  calcTongThanhTien() {
    if (this.dataTable) {
      let sum = 0
      this.dataTable.forEach(item => {
        if (item.hopDong) {
          sum += item.hopDong.soLuong * item.hopDong.donGia;
        }
      })
      return sum;
    }
  }

  async preview(id) {
    if (this.loaiVthh.startsWith('02')) {
      this.previewName = 'thong_tin_hop_dong_vt'
    } else {
      this.previewName = 'thong_tin_hop_dong_lt'
    }
    this.reportTemplate.fileName = this.previewName + '.docx';
    let body = {
      id: id,
      reportTemplateRequest: this.reportTemplate
    }
    await this.thongTinHopDong.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }
  downloadPdf(fileName: string) {
    saveAs(this.pdfSrc, fileName + '.pdf');
  }

  downloadWord(fileName: string) {
    saveAs(this.wordSrc, fileName + '.docx');
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
  printPreview() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true })
  }
}
