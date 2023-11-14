import {Component, OnInit, ViewChild} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {MESSAGE} from 'src/app/constants/message';
import {Globals} from 'src/app/shared/globals';
import {DanhMucService} from '../../../services/danhmuc.service';
import {KeHoachLuongThucComponent} from './ke-hoach-luong-thuc/ke-hoach-luong-thuc.component';
import {cloneDeep} from 'lodash';
import {DonviService} from "../../../services/donvi.service";
import {PREVIEW} from "../../../constants/fileType";
import printJS from "print-js";
import {NgxSpinnerService} from "ngx-spinner";
import {QuyetDinhTtcpService} from "../../../services/quyetDinhTtcp.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-dialog-chi-tiet-ke-hoach-giao-bo-nganh',
  templateUrl: './dialog-chi-tiet-ke-hoach-giao-bo-nganh.component.html',
  styleUrls: ['./dialog-chi-tiet-ke-hoach-giao-bo-nganh.component.scss'],
})
export class DialogChiTietKeHoachGiaoBoNganhComponent implements OnInit {

  @ViewChild('keHoachLuongThuc') keHoachLuongThucComponent: KeHoachLuongThucComponent;
  isView: boolean = false;
  errorBn: boolean = false;
  nam: any;
  keHoach: any = {
    id: null,
    sapXep: null,
    maBoNganh: null,
    tenBoNganh: null,
    tongTien: null,
    ltGaoMua: null,
    ltThocMua: null,
    ltGaoXuat: null,
    ltThocXuat: null,
    ttMuaTang: null,
    ttXuatBan: null,
    ttXuatGiam: null,
    ltGaoTon: null,
    ltThocTon: null,
    ghiChuLt :null,
    muaTangList: [],
    ghiChuMuaTang :null,
    xuatGiamList: [],
    ghiChuXuatGiam :null,
    xuatBanList: [],
    ghiChuXuatBan :null,
    luanPhienList: [],
    ghiChuLuanPhien :null,
  };
  dataTable: any[] = [];
  dsBoNganh: any[];
  dsHangHoa: any[] = [];
  muaTangView: any[] = [];
  xuatGiamView: any[] = [];
  xuatBanView: any[] = [];
  luanPhienView: any[] = [];
  dataEdit: any;
  dataToanBn: any;
  radioData: any;
  radioValue: any;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
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
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public globals: Globals,
    private quyetDinhTtcpService: QuyetDinhTtcpService,
    ) {
    this.radioData = [
      {label: 'Bộ Tài chính', value: 'BTC'},
      {label: 'Bộ/Ngành khác', value: 'Khac'},
    ];
    this.radioValue = 'BTC';
  }

  async ngOnInit() {
    if (this.dataEdit) {
      this.keHoach = cloneDeep(this.dataEdit);
    }
    await Promise.all([
      this.getListBoNganh(),
      this.loadDanhMucHang()
    ]);
    if (this.dataEdit) {
      if (this.dataEdit.tenBoNganh === 'Bộ Tài chính') {
        this.radioValue = 'BTC';
        this.templateName = 'quyet-dinh-ttgcp-bo-tai-chinh';
      } else {
        this.radioValue = 'Khac';
        this.templateName = 'quyet-dinh-ttgcp-bo-nganh';
      }
    } else {
      this.radioValue = 'BTC';
      this.templateName = 'quyet-dinh-ttgcp-bo-tai-chinh';
    }
  }

  onChangeBoNganh(event) {
    this.dsHangHoa = [];
    if (event) {
      const boNganh = this.dsBoNganh.find(item => item.maDvi == event)
      if (boNganh) {
        this.keHoach.tenBoNganh = boNganh.tenDvi;
        this.keHoach.maBoNganh = boNganh.maDvi;
        this.keHoach.sapXep = boNganh.sapXep;
        this.keHoach.tongTien = 0;
      }
      //fix btc = tcdt
      if (event == '01') {
        event = '0101'
      }
      this.danhMucService.getDanhMucHangDvql({
        "dviQly": event
      }).subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          if (event == '0101') {
            const dataVatTu = hangHoa.data.filter(item => (item.ma == "02" || item.ma == "04" || item.ma == "03"));
            dataVatTu.forEach(item => {
              this.dsHangHoa = [...this.dsHangHoa, ...item.child]
            });
          } else {
            this.dsHangHoa = hangHoa.data.filter(item => item.cap == 2);
          }
        }
      })
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    //let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      if (!this.dataEdit) {
        let boTaiChinh = res.data.find(s => s.code === 'BTC');
        this.keHoach.maBoNganh = boTaiChinh.maDvi;
        this.keHoach.tenBoNganh = boTaiChinh.tenDvi;
      }
      //fix theo giao dien moi
      this.dsBoNganh = res.data.filter(s => s.code != 'BTC');
    }
  }

  async loadDanhMucHang() {
    if (this.dataEdit) {
      this.onChangeBoNganh(this.dataEdit.maBoNganh);
    } else {
      this.dsHangHoa = [];
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          const dataVatTu = hangHoa.data.filter(item => (item.ma == "02" || item.ma == "04"   || item.ma == "03"));
          dataVatTu.forEach(item => {
            this.dsHangHoa = [...this.dsHangHoa, ...item.child]
          });
        }
      })
    }
  }

  luu() {
    if (this.keHoachLuongThucComponent) {
      this.keHoachLuongThucComponent.onChangeInput();
    }
    if (this.validateData()) {
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
    //
    // if (!this.keHoach.tongTien) {
    //   this.errorTt = true;
    //   return false;
    // } else {
    //   this.errorTt = false;
    // }
    return true;
  }

  onCancel() {
    this._modalRef.close();
  }

  onChangeBoNganhRadio() {
    if (this.radioValue == 'BTC') {
      this.keHoach.maBoNganh = '01'
      this.onChangeBoNganh("0101");
    } else {
      //this.keHoach.maBoNganh = [];
      this.onChangeBoNganh("");
    }
  }

  async preview() {
    this.spinner.show();
    await this.quyetDinhTtcpService.preview({
      tenBaoCao: this.templateName+ '.docx',
      id: 1941
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

  downloadPdf() {
    saveAs(this.pdfSrc, this.templateName + '.pdf');
  }

  downloadWord() {
    saveAs(this.wordSrc, this.templateName + '.docx');
  }

  printPreview() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true });
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  convertDataPreview(data: any[]) : any[] {
    let result = [];
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          let itemClonePr = cloneDeep(item);
          result.push(itemClonePr)
          item.children.forEach(child => {
            let itemCloneChild = cloneDeep(child);
            itemCloneChild.tenVthh = "";
            result.push(itemCloneChild);
          })
        }
      });
    }
    return  result;
  }
}
