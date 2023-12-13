import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {
  DialogChiTietKeHoachGiaoBoNganhComponent
} from 'src/app/components/dialog/dialog-chi-tiet-ke-hoach-giao-bo-nganh/dialog-chi-tiet-ke-hoach-giao-bo-nganh.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Globals} from 'src/app/shared/globals';
import {MESSAGE} from 'src/app/constants/message';
import {groupBy, mapValues} from 'lodash';
import {QuyetDinhTtcpService} from 'src/app/services/quyetDinhTtcp.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {UserService} from 'src/app/services/user.service';
import {UserLogin} from 'src/app/models/userlogin';
import {HelperService} from 'src/app/services/helper.service';
import {STATUS} from "../../../../../../../constants/status";
import {DonviService} from "../../../../../../../services/donvi.service";
import {CurrencyMaskInputMode} from 'ngx-currency'
import {AMOUNT_ONE_DECIMAL} from "../../../../../../../Utility/utils";
import {FILETYPE, PREVIEW} from "../../../../../../../constants/fileType";
import {NzCollapsePanelComponent} from "ng-zorro-antd/collapse";
import printJS from "print-js";
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-them-quyet-dinh-ttcp',
  templateUrl: './them-quyet-dinh-ttcp.component.html',
  styleUrls: ['./them-quyet-dinh-ttcp.component.scss'],
})
export class ThemQuyetDinhTtcpComponent implements OnInit {
  @ViewChild('collapseExpand', {static: false}) collapseExpand!: NzCollapsePanelComponent;
  @Input('isView') isView: boolean = false;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  @Input()
  trangThai: any = [];
  formData: FormGroup;
  STATUS = STATUS;
  taiLieuDinhKemList: any[] = [];
  listCcPhapLy: any[] = [];
  listFile: any[] = []
  dsNam: any[] = [];
  maQd: string;
  userInfo: UserLogin;
  dataTable: any[] = [];
  dataTableAllBn: any[] = [];
  totalBnKh: number = 0;
  totalBtcKh: number = 0;
  options = AMOUNT_ONE_DECIMAL;
  templateName = 'quyet-dinh-ttgcp-thong-tin-chung';
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  showDlgPreview = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    public globals: Globals,
    private quyetDinhTtcpService: QuyetDinhTtcpService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
    private donviService: DonviService,
  ) {
    this.formData = this.fb.group({
      id: [],
      soQd: [, [Validators.required]],
      ngayQd: [null, [Validators.required]],
      namQd: [dayjs().get('year'), [Validators.required]],
      trichYeu: [null],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    if (!this.idInput) {
      this.getListBoNganh();
    }
    await Promise.all([
      (this.userInfo = this.userService.getUserLogin()),
      this.loadDsNam(),
      (this.maQd = '/QĐ-TTg'),
      this.getDataDetail(this.idInput),
    ]);
    this.spinner.hide();
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      this.dataTableAllBn = [];
      let res = await this.quyetDinhTtcpService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          id: data.id,
          namQd: data.namQd,
          ngayQd: data.ngayQd,
          soQd: data.soQd.split('/')[0],
          trangThai: data.trangThai,
          trichYeu: data.trichYeu,
        });
        this.dataTable = data.listBoNganh;
        if (data.listChiTangToanBoNganh.length > 0) {
          this.dataTableAllBn.push({
            "stt": 1,
            "maCha": null,
            "maBn": '01',
            "tenBn": "Bộ Tài Chính",
            "isSum": true,
            "tongSo": 0
          })
          for (let item of data.listChiTangToanBoNganh) {
            var obj = {
              "stt": item.maBn == '01' ? 1 : item.stt,
              "maCha": item.maBn == '01' ? item.maBn : null,
              "maBn": item.maBn,
              "tenBn": item.tenBn,
              "isSum": false,
              "tongSo": item.tongSo
            };
            this.dataTableAllBn.push(obj);
          }
          this.dataTableAllBn.sort((a, b) => (a.stt - b.stt));
          this.dataTable.sort((a, b) => (a.sapXep - b.sapXep));
          this.onInputNumberBNChange();
        }
        data.fileDinhkems.forEach(item => {
          if (item.fileType == FILETYPE.FILE_DINH_KEM) {
            this.taiLieuDinhKemList.push(item)
          } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
            this.listCcPhapLy.push(item)
          }
        });
        this.listFile = data.fileDinhkems;
      }
    }
  }

  async getListBoNganh() {
    this.dataTableAllBn = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      let i = 1;
      for (let item of res.data) {
        var obj = {
          "stt": i,
          "maCha": null,
          "maBn": item.maDvi,
          "tenBn": item.tenDvi,
          "isSum": item.maDvi == '01' ? true : false,
          "tongSo": null
        };
        this.dataTableAllBn.push(obj);
        if (item.maDvi == '01') {
          this.addDetailItem(this.dataTableAllBn, item.maDvi);
        }
        i++;
      }
    }
  }

  addDetailItem(dataTableAllBn, maCha) {
    dataTableAllBn.push({
      "stt": "",
      "maCha": maCha,
      "maBn": maCha,
      "tenBn": "   Lương thực",
      "isSum": false,
      "tongSo": null
    }, {
      "stt": "",
      "maCha": maCha,
      "maBn": maCha,
      "tenBn": "   Vật tư, thiết bị",
      "isSum": false,
      "tongSo": null
    })
  }

  onInputNumberBNChange() {
    let total = 0;
    let totalBtc = 0;
    this.dataTableAllBn.forEach(function (item) {
      if (item.maBn == '01') {
        totalBtc = totalBtc + Number(item.tongSo);
      }
      total = total + Number(item.tongSo);
    })
    this.totalBnKh = total;
    this.totalBtcKh = totalBtc;
  }

  loadDsNam() {
    for (let i = -3; i < 5; i++) {
      this.dsNam.push({
        value: dayjs().get('year') + i,
        text: dayjs().get('year') + i,
      });
    }
  }

  openFile(event) {
    // if (!this.isView) {
    //   let item = {
    //     id: new Date().getTime(),
    //     text: event.name,
    //   };
    //   if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
    //     this.uploadFileService
    //       .uploadFile(event.file, event.name)
    //       .then((resUpload) => {
    //         if (!this.deXuatDieuChinh.fileDinhKemReqs) {
    //           this.deXuatDieuChinh.fileDinhKemReqs = [];
    //         }
    //         const fileDinhKem = new FileDinhKem();
    //         fileDinhKem.fileName = resUpload.filename;
    //         fileDinhKem.fileSize = resUpload.size;
    //         fileDinhKem.fileUrl = resUpload.url;
    //         fileDinhKem.idVirtual = item.id;
    //         this.deXuatDieuChinh.fileDinhKemReqs.push(fileDinhKem);
    //         this.taiLieuDinhKemList.push(item);
    //       });
    //   }
    // }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
    }
  }

  downloadFileKeHoach(event) {
  }

  xoaItem(id: number) {
  }

  quayLai() {
    this.onClose.emit();
  }

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.get('id').value,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH
          };
          let res = await this.quyetDinhTtcpService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.BAN_HANH_SUCCESS,
            );
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

  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách kế hoạch không được để trống',
      );
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    body.listBoNganh = this.dataTable;
    body.listToanBoNganh = this.dataTableAllBn.filter(item => item.isSum == false);
    this.listFile = [];
    if (this.taiLieuDinhKemList.length > 0) {
      this.taiLieuDinhKemList.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      })
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFile.push(element)
      })
    }
    if (this.listFile && this.listFile.length > 0) {
      body.fileDinhKems = this.listFile;
    }
    let res;
    if (this.idInput > 0) {
      res = await this.quyetDinhTtcpService.update(body);
    } else {
      res = await this.quyetDinhTtcpService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.pheDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.idInput = res.data.id;
        this.getDataDetail(this.idInput);
        // this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  exportData() {
  }

  themKeHoach(data?: any, index?, isView?: boolean) {
    const modalQD = this.modal.create({
      nzTitle: 'Kế hoạch dự trữ quốc gia - TTCP giao Bộ/Ngành',
      nzContent: DialogChiTietKeHoachGiaoBoNganhComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        isView: isView,
        nam: this.formData.get('namQd').value,
        dataToanBn: this.dataTableAllBn
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        if (index >= 0) {
          this.dataTable[index] = data;
        } else {
          this.dataTable.push(data);
        }
        const result = mapValues(groupBy(this.dataTableAllBn, 'maBn'), (itemsByCategory: any[]) =>
          itemsByCategory.reduce((sum, item) => sum + item.tongSo, 0)
        );
        this.dataTable.forEach(item => {
          item.tongTien = result && result[item.maBoNganh] ? result[item.maBoNganh] : 0;
        })
      }
    });
    this.collapseExpand.clickHeader();
  };

  xoaKeHoach(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn xóa kế hoạch giao Bộ/Ngành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(index, 1);
        } catch (e) {
          console.log('error: ', e);
        }
      },
    });
  }

  async preview(event: any) {
    event.stopPropagation();
    this.spinner.show();
    await this.quyetDinhTtcpService.preview({
      tenBaoCao: this.templateName+ '.docx',
      id: this.formData.value.id,
      listToanBoNganh : this.dataTableAllBn,
      loaiBaoCao : "00"
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

}
