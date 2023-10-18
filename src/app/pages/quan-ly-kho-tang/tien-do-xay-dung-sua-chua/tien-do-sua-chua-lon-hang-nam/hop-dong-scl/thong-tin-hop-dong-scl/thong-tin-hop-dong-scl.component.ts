import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {MESSAGE} from "../../../../../../constants/message";
import {CurrencyMaskInputMode} from "ngx-currency";
import {STATUS} from "../../../../../../constants/status";
import {
  HopdongTdscService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/hopdongTdsc.service";
import {
  QuyetdinhpheduyetKqLcntSclService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/qdPdKqLcntScl.service";
import {
  QdPheDuyetKhlcntTdsclService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/qd-phe-duyet-khlcnt-tdscl.service";

@Component({
  selector: 'app-thong-tin-hop-dong-scl',
  templateUrl: './thong-tin-hop-dong-scl.component.html',
  styleUrls: ['./thong-tin-hop-dong-scl.component.scss']
})
export class ThongTinHopDongSclComponent extends Base2Component implements OnInit {
  @Input()
  idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input('isViewDetail') isViewDetail: boolean;
  tongMucDt: number = 0;
  @Input() flagThemMoi: string;
  @Input() itemDuAn: any;
  @Input() itemQdPdKhLcnt: any;
  @Input() itemQdPdKtkt: any;
  listHopDong: any[] = []
  itemSelected: any;
  openPopThemMoiHd = false;
  AMOUNT = {
    allowZero: true,
    allowNegative: false,
    precision: 0,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 100000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  viewHopDong: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetdinhpheduyetKhlcntService: QdPheDuyetKhlcntTdsclService,
    private quyetdinhpheduyetKqLcntService: QuyetdinhpheduyetKqLcntSclService,
    private hopdongService: HopdongTdscService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopdongService)
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      soQd: [],
      ngayKy: [],
      soQdPdDaDtxd: [],
      soQdPdKqlcnt: [],
      idQdPdDaDtxd: [],
      trichYeu: [],
      tenDuAn: [],
      chuDauTu: [],
      diaChi: [],
      idDuAn: [],
      tenNguonVon: [],
      tenLoaiHopDong: [],
      soGoiThau: [0],
      soGoiThauTc: [0],
      soGoiThauTb: [0],
      soHopDongDaKy: [0],
      tienCvKad: [0],
      tienCvKhlcnt: [0],
      tienCvChuaDdk: [0],
      tongTien: [0],
      trangThaiHd: [],
      tenTrangThaiHd: [],
      fileDinhKems: [null],
      loaiSuaChua : [null],
      listKtTdscQuyetDinhPdKhlcntCvDaTh: null,
      listKtTdscQuyetDinhPdKhlcntCvKad: null,
      listKtTdscQuyetDinhPdKhlcntCvKh: null,
      loai: ['00']
    });
    super.ngOnInit()
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.idInput && this.itemQdPdKhLcnt) {
        await this.detail()
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  hoanThanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành hợp đồng?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.itemQdPdKhLcnt.id,
            trangThai: STATUS.DA_HOAN_THANH,
          };
          let res =
            await this.hopdongService.hoanThanh(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);

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

  async detail(isBackFromHd?) {
    this.spinner.show();
    try {
      if (this.itemQdPdKhLcnt && !isBackFromHd) {
        this.helperService.bidingDataInFormGroup(this.formData, this.itemQdPdKhLcnt);
        this.formData.patchValue({
          tenDuAn : this.itemDuAn.tenCongTrinh,
          tenNguonVon : this.itemQdPdKhLcnt.nguonVonDt
        })
        this.listHopDong = this.itemQdPdKhLcnt.listKtTdscQuyetDinhPdKhlcntCvKh;
        console.log(this.listHopDong,"this.listHopDong")
        if (this.listHopDong && this.listHopDong.length > 0) {
          this.selectRow(this.listHopDong[0]);
        }
      } else {
        //Load lại page thông tin hợp đồng khi back lại từ trang thêm mới hợp đồng.
        let body = {
          "namKh": this.itemQdPdKhLcnt.namKh,
          "idDuAn": this.itemQdPdKhLcnt.idDuAn,
          "idQdPdKtkt": this.itemQdPdKtkt.id,
          "idQdPdKhLcnt": this.itemQdPdKhLcnt.id,
          "loai": '00'
        }
        let res = await this.hopdongService.detailQdPdKhLcnt(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {(this.itemQdPdKhLcnt, 'this item')
            this.helperService.bidingDataInFormGroup(this.formData, this.itemQdPdKhLcnt);
            this.listHopDong = this.itemQdPdKhLcnt.listKtTdscQuyetDinhPdKhlcntCvKh;
            if (this.listHopDong && this.listHopDong.length > 0) {
              this.selectRow(this.listHopDong[0]);
            }
          } else {
            this.notification.warning(MESSAGE.WARNING, "Không tìm thấy thông tin hợp đồng cho dự án này, vui lòng kiểm tra lại.");
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
    } catch
      (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async selectRow(data) {
    if (data) {
      this.listHopDong.forEach(item => item.selected = false);
      data.selected = true;
      this.itemSelected = data;
      this.viewHopDong = true
      this.idInput = data.idHopDong;
    }
  }

  closeThemHopDong() {
    this.openPopThemMoiHd = false;
  }

  async receivedData(data: any) {
    await this.detail(true);
    this.openPopThemMoiHd = false;
  }

  openThemMoiHd(id?, isView?: boolean) {
    if (!id) {
      this.flagThemMoi = 'addnew';
    } else {
      this.flagThemMoi = 'edit';
    }
    this.idInput = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
    this.openPopThemMoiHd = true;
  }

  delete(item
           :
           any
  ) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.hopdongService.delete(body).then(async () => {
            let body = {
              idQdPdKhlcnt : this.itemQdPdKhLcnt.id,
              loai: "00"
            }
            let resp = await this.hopdongService.danhSachHdTheoKhlcnt(body);
            if (resp.msg == MESSAGE.SUCCESS) {
              this.listHopDong = resp.data;
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

  themMoiHopDong() {

  }
}
