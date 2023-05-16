import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetKhlcnt.service";
import {
  QuyetdinhpheduyetKqLcntService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetKqLcnt.service";
import {HopdongService} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/hopdong.service";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../../../constants/message";
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-thong-tin-hop-dong',
  templateUrl: './thong-tin-hop-dong.component.html',
  styleUrls: ['./thong-tin-hop-dong.component.scss']
})
export class ThongTinHopDongComponent extends Base2Component implements OnInit {
  @Input()
  idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input('isViewDetail') isViewDetail: boolean;
  tongMucDt: number = 0;
  @Input()
  flagThemMoi: string;
  @Input()
  itemQdPdKhLcnt: any;
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
    private quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService,
    private quyetdinhpheduyetKqLcntService: QuyetdinhpheduyetKqLcntService,
    private hopdongService: HopdongService
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
      listKtXdscQuyetDinhPdKhlcntCvDaTh: null,
      listKtXdscQuyetDinhPdKhlcntCvKad: null,
      listKtXdscQuyetDinhPdKhlcntCvKh: null
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

  save(isHoanThanh?) {

  }

  async detail(isBackFromHd?) {
    this.spinner.show();
    try {
      if (this.itemQdPdKhLcnt && !isBackFromHd) {
        this.helperService.bidingDataInFormGroup(this.formData, this.itemQdPdKhLcnt);
        this.listHopDong = this.itemQdPdKhLcnt.listKtXdscQuyetDinhPdKhlcntCvKh;
        if (this.listHopDong && this.listHopDong.length > 0) {
          this.selectRow(this.listHopDong[0]);
        }
      } else {
        //Load lại page thông tin hợp đồng khi back lại từ trang thêm mới hợp đồng.
        let body = {
          "namKh": this.itemQdPdKhLcnt.namKh,
          "idDuAn": this.itemQdPdKhLcnt.idDuAn,
          "idQdPdDaDtxd": this.itemQdPdKhLcnt.idQdPdDaDtxd,
          "idQdPdKhLcnt": this.itemQdPdKhLcnt.id,
        }
        let res = await this.hopdongService.detailQdPdKhLcnt(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            this.itemQdPdKhLcnt = res.data;
            this.helperService.bidingDataInFormGroup(this.formData, this.itemQdPdKhLcnt);
            this.listHopDong = this.itemQdPdKhLcnt.listKtXdscQuyetDinhPdKhlcntCvKh;
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
   console.log(id,' data.idHopDong data.idHopDong data.idHopDong data.idHopDong data.idHopDong')
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
            let resp = await this.hopdongService.danhSachHdTheoKhlcnt(this.idInput);
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
