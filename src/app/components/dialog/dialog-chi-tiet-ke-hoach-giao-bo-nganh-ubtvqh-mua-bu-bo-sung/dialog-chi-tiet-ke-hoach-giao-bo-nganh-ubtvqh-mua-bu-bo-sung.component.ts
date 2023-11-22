import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  KeHoachLuongThucComponent,
} from '../dialog-chi-tiet-ke-hoach-giao-bo-nganh/ke-hoach-luong-thuc/ke-hoach-luong-thuc.component';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DanhMucService } from '../../../services/danhmuc.service';
import { Globals } from '../../../shared/globals';
import { MESSAGE } from '../../../constants/message';
import { MuaBuComponent } from './mua-bu/mua-bu.component';
import { DonviService } from '../../../services/donvi.service';
import { AMOUNT_THREE_DECIMAL } from '../../../Utility/utils';
import { PREVIEW } from '../../../constants/fileType';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QuyetDinhUbtvqhMuaBuBoSungService } from '../../../services/quyet-dinh-ubtvqh-mua-bu-bo-sung.service';

@Component({
  selector: 'app-dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung',
  templateUrl: './dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung.component.html',
  styleUrls: ['./dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung.component.scss'],
})
export class DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent implements OnInit {


  @ViewChild('keHoachMuaBu') kehoachmuaBu: MuaBuComponent;
  isView: boolean = false;
  errorBn: boolean = false;
  keHoach: any = {
    id: null,
    maBoNganh: null,
    tenBoNganh: null,
    tongTien: null,
    idMuaQdUbtvqh: null,
    ttMuaBu: null,
    ttMuaBsung: null,
    muaBuList: [],
    muaBsungList: [],
  };
  dsBoNganh: any[];
  dsHangHoa: any[];
  dataEdit: any;
  amount = AMOUNT_THREE_DECIMAL;
  templateName : string;
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  showDlgPreview = false;

  constructor(
    private readonly _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
    private donviService: DonviService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private quyetDinhUbtvqhMuBuBoSung: QuyetDinhUbtvqhMuaBuBoSungService,
    public globals: Globals,
  ) {
  }

  async ngOnInit() {
    this.bindingData(this.dataEdit);
    await Promise.all([
      this.getListBoNganh(),
      this.loadDanhMucHang(),
    ]);
  }

  bindingData(dataEdit) {
    if (dataEdit) {
      this.keHoach = dataEdit;
    }
  }

  onChangeBoNganh(event) {
    this.dsHangHoa = [];
    const boNganh = this.dsBoNganh.find(item => item.maDvi == event);
    if (boNganh) {
      this.keHoach.tenBoNganh = boNganh.tenDvi;
    }
    //fix btc = tcdt
    if (event == '01') {
      event = '0101';
    }
    this.danhMucService.getDanhMucHangDvql({
      'dviQly': event,
    }).subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        if (event == '0101') {
          const dataVatTu = hangHoa.data.filter(it => (it.ma == '02' || it.ma == '04' || it.ma == '0101' || it.ma == '0102'));
          dataVatTu.forEach(item => {
            if (item.ma == '02') {
              this.dsHangHoa = [...this.dsHangHoa, ...item.child];
            } else {
              this.dsHangHoa = [...this.dsHangHoa, item];
            }
          });
        } else {
          this.dsHangHoa = hangHoa.data.filter(item => item.cap == 2);
        }
      }
    });
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      //fix theo giao dien moi
      this.dsBoNganh = res.data;
    }
  }

  async loadDanhMucHang() {
    if (this.dataEdit) {
      this.onChangeBoNganh(this.dataEdit.maBoNganh);
    } else {
      this.dsHangHoa = [];
    }
  }

  luu() {
    if (this.validateData()) {
      this.keHoach.tongTien = this.keHoach.ttMuaBsung + this.keHoach.ttMuaBu;
      this._modalRef.close(this.keHoach);
    }
  }

  validateData() {
    if (!this.keHoach.maBoNganh) {
      this.errorBn = true;
      return false;
    } else {
      this.errorBn = false;
    }
    return true;
  }

  onCancel() {
    this._modalRef.close();
  }

  async preview() {
    this.spinner.show();
    // this.muaTangView = this.convertDataPreview(this.keHoach.muaTangList)
    // this.xuatBanView = this.convertDataPreview(this.keHoach.xuatBanList)
    // this.xuatGiamView = this.convertDataPreview(this.keHoach.xuatGiamList)
    // this.luanPhienView = this.convertDataPreview(this.keHoach.luanPhienList)
    await this.quyetDinhUbtvqhMuBuBoSung.preview({
      id:this.keHoach.idMuaQdUbtvqh,
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, 'Lỗi trong quá trình tải file.');
      }
    });
    this.spinner.hide();
  }
}
