import {Component, OnInit, ViewChild} from '@angular/core';
import {MuabuBosungComponent} from "../dialog-qd-muabubosung-ttcp/muabu-bosung/muabu-bosung.component";
import {NzModalRef} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../services/danhmuc.service";
import {Globals} from "../../../shared/globals";
import {MESSAGE} from "../../../constants/message";
import {MuaBuBoSungComponent} from "./mua-bu-bo-sung/mua-bu-bo-sung.component";
import {DonviService} from "../../../services/donvi.service";
import { PREVIEW } from '../../../constants/fileType';
import {saveAs} from 'file-saver';
import {cloneDeep} from 'lodash';
import printJS from 'print-js';
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";
import {sumBy} from "lodash";
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MuaBuBoSungBtcService } from '../../../services/mua-bu-bo-sung-btc.service';

@Component({
  selector: 'app-dialog-muabu-bosung-btc',
  templateUrl: './dialog-muabu-bosung-btc.component.html',
  styleUrls: ['./dialog-muabu-bosung-btc.component.scss']
})
export class DialogMuabuBosungBtcComponent implements OnInit {

  @ViewChild('keHoachMuaBu') kehoachmuaBuBoSung: MuaBuBoSungComponent
  ;

  isView: boolean = false;
  errorBn: boolean = false;
  keHoach: any = {
    id: null,
    maBoNganh: null,
    tenBoNganh: null,
    tongTien: null,
    idMuaQdBtc: null,
    ttMuaBu: null,
    ttMuaBsung: null,
    muaBuList: [],
    muaBsungList: []
  }
  dsBoNganh: any[];
  dsHangHoa: any[];
  dataEdit: any;
  templateName = 'quyet-dinh-btc-giao-bo-nganh';
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  showDlgPreview = false;

  constructor(
    private readonly _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
    private donviService: DonviService,
    private qdBtcService: MuaBuBoSungBtcService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    public globals: Globals
  ) {
  }

  async ngOnInit() {
    this.bindingData(this.dataEdit)
    await Promise.all([
      this.getListBoNganh(),
      this.loadDanhMucHang()
    ]);
  }

  bindingData(dataEdit) {
    if (dataEdit) {
      console.log(dataEdit);
      this.keHoach = dataEdit;
    }
  }

  onChangeBoNganh(event) {
    const boNganh = this.dsBoNganh.find(item => item.maDvi == event)
    if (boNganh) {
      this.keHoach.tenBoNganh = boNganh.tenDvi;
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
          const dataVatTu = hangHoa.data.filter(it => (it.ma == '02' || it.ma == '04' || it.ma == '0101' || it.ma == '0102'));
          dataVatTu.forEach(item => {
            if (item.ma == "02") {
              this.dsHangHoa = [...this.dsHangHoa, ...item.child]
            } else {
              this.dsHangHoa = [...this.dsHangHoa, item]
            }
          });
        } else {
          this.dsHangHoa = hangHoa.data.filter(item => item.cap == 2);
        }
      }
    })
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    //let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      //fix theo giao dien moi
      this.dsBoNganh = res.data;
    }
  }

  async loadDanhMucHang() {
    if (this.dataEdit) {
      this.onChangeBoNganh(this.dataEdit.maBoNganh);
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
    await this.qdBtcService.preview({
      tenBaoCao: this.templateName+ '.docx',
      id : this.keHoach.idMuaQdBtc,
      muaBuList : this.convertDataPreview(this.keHoach.muaBuList),
      muaBsungList : this.convertDataPreview(this.keHoach.muaBsungList),
      tenBoNganh : this.keHoach.tenBoNganh,
      ttMuaBsung : this.keHoach.ttMuaBsung,
      ttMuaBu : this.keHoach.ttMuaBu
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

  convertDataPreview(data: any[]): any[] {
    let arr = [];
    let result = [];
    if (data && data.length > 0) {
      arr = chain(data)
        .groupBy('tenVthh')
        .map((value, key) => ({
          tenVthh: key,
          isLeaf: (!value || (value.length == 1 && !value[0].cloaiVthh)) ? true : false,
          soLuong: sumBy(value, 'soLuong'), // Tính tổng soLuong của các phần tử con
          children: value,
          idVirtual: uuidv4(),
        }))
        .value();
    }
    if (arr && arr.length > 0) {
      arr.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          let itemClonePr = cloneDeep(item);
          itemClonePr.stt = index + 1;
          if (item.isLeaf) {
            itemClonePr.dviTinh = item.children[0].dviTinh
          }
          result.push(itemClonePr)
          if (!item.isLeaf) {
            item.children.forEach(child => {
              let itemCloneChild = cloneDeep(child);
              itemCloneChild.tenVthh = itemCloneChild.tenCloaiVthh;
              itemCloneChild.stt = '-'
              result.push(itemCloneChild);
            })
          }
        }
      })
    }
    return result;
  }
}
