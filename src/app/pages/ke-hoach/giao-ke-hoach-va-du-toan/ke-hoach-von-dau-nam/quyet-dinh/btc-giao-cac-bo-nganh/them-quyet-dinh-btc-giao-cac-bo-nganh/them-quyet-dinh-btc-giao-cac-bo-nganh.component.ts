import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as dayjs from 'dayjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserLogin} from 'src/app/models/userlogin';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {HelperService} from 'src/app/services/helper.service';
import {QuyetDinhTtcpService} from 'src/app/services/quyetDinhTtcp.service';
import {QuyetDinhBtcNganhService} from 'src/app/services/quyetDinhBtcNganh.service';
import {MESSAGE} from 'src/app/constants/message';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {STATUS} from "../../../../../../../constants/status";
import {DonviService} from "../../../../../../../services/donvi.service";
import {FILETYPE, PREVIEW} from "../../../../../../../constants/fileType";
import printJS from "print-js";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-them-quyet-dinh-btc-giao-cac-bo-nganh',
  templateUrl: './them-quyet-dinh-btc-giao-cac-bo-nganh.component.html',
  styleUrls: ['./them-quyet-dinh-btc-giao-cac-bo-nganh.component.scss'],
})
export class ThemQuyetDinhBtcGiaoCacBoNganhComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  formData: FormGroup;
  taiLieuDinhKemList: any[] = [];
  listCcPhapLy: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];
  dsBoNganhTtcp: any[] = [];
  userInfo: UserLogin;
  maQd: string;
  muaTangList: any[] = []
  xuatGiamList: any[] = []
  xuatBanList: any[] = []
  luanPhienList: any[] = []
  hasError: boolean = false;
  dataTable: any[] = [];
  listFile: any[] = []
  STATUS = STATUS;
  templateName = 'btc-giao-bo-nganh';
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  showDlgPreview = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private helperService: HelperService,
    private quyetDinhTtcpService: QuyetDinhTtcpService,
    private quyetDinhBtcNganhService: QuyetDinhBtcNganhService,
    private notification: NzNotificationService,
    private donviService: DonviService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        ngayQd: [null, [Validators.required]],
        namQd: [dayjs().get('year'), [Validators.required]],
        trichYeu: [null],
        trangThai: [STATUS.DANG_NHAP_DU_LIEU],
        idTtcpBoNganh: [, [Validators.required]],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.getListBoNganh(),
      this.maQd = '/QĐ-BTC',
      this.getDataDetail(this.idInput),

    ])
    await this.onChangeNamQd(this.formData.get('namQd').value);
    await this.onChangeBoNganh(this.formData.get('idTtcpBoNganh').value);
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhBtcNganhService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namQd: data.namQd,
        ngayQd: data.ngayQd,
        soQd: data.soQd.split('/')[0],
        trangThai: data.trangThai,
        trichYeu: data.trichYeu,
        idTtcpBoNganh: data.idTtcpBoNganh,
      })
      // this.taiLieuDinhKemList = data.fileDinhkems;
      data.fileDinhkems.forEach(item => {
        if (item.fileType == FILETYPE.FILE_DINH_KEM) {
          this.taiLieuDinhKemList.push(item)
        } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
          this.listCcPhapLy.push(item)
        }
      })
      this.muaTangList = data.muaTangList ? data.muaTangList : [];
      this.xuatGiamList = data.xuatGiamList ? data.xuatGiamList : [];
      this.xuatBanList = data.xuatBanList ? data.xuatBanList : [];
      this.luanPhienList = data.luanPhienList ? data.luanPhienList : [];
    }
  }

  async onChangeNamQd(namQd) {
    let body = {
      namQd: namQd,
      trangThai: STATUS.BAN_HANH
    }
    let res = await this.quyetDinhTtcpService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content;
      if (data.length > 0) {
        let dataTtcp = await this.quyetDinhTtcpService.getDetail(data[0].id);
        if (dataTtcp.msg == MESSAGE.SUCCESS) {
          this.dsBoNganhTtcp = dataTtcp.data.listChiTangToanBoNganh;
        }
      } else {
        this.dsBoNganhTtcp = [];
      }
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    // let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
    }
  }

  loadDsNam() {
    for (let i = -3; i < 5; i++) {
      this.dsNam.push({
        value: dayjs().get('year') + i,
        text: dayjs().get('year') + i,
      });
    }
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

  quayLai() {
    this.onClose.emit();
  }

  banHanh() {
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
        if (this.muaTangList.length == 0) {
          this.notification.error(
            MESSAGE.ERROR,
            'Chưa nhập nội dung dự toán',
          );
          this.spinner.hide();
          return;
        }
        try {
          let body = {
            id: this.formData.get('id').value,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH,
          };
          let res =
            await this.quyetDinhBtcNganhService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
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
    if (!this.formData.valid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    if (this.hasError) {
      this.notification.error(MESSAGE.ERROR, 'Nội dung dự toán không hợp lệ.')
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    // body.fileDinhKems = this.taiLieuDinhKemList;
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
      body.fileDinhKems= this.listFile;
    }
    body.muaTangList = this.muaTangList;
    body.xuatGiamList = this.xuatGiamList;
    body.xuatBanList = this.xuatBanList;
    body.luanPhienList = this.luanPhienList;
    let res
    if (this.idInput > 0) {
      res = await this.quyetDinhBtcNganhService.update(body);
    } else {
      res = await this.quyetDinhBtcNganhService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.banHanh();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.idInput = res.data.id;
          this.getDataDetail(this.idInput);
        }
        // this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  tongGiaTri: number = 0;

  onChangeBoNganh($event) {
    this.tongGiaTri = 0;
    let data = this.dsBoNganhTtcp.filter(item => item.maBn == $event);
    if (data && data.length > 0) {
      this.tongGiaTri = data.reduce((a, item) => a + (item['tongSo'] || 0), 0);
    } else {
      this.tongGiaTri = 0;
    }
  }

  takeError($event) {
    this.hasError = $event;
  }

  async preview(event: any) {
    event.stopPropagation();
    this.spinner.show();
    await this.quyetDinhBtcNganhService.preview({
      tenBaoCao: this.templateName+ '.docx',
      id: this.formData.value.id,
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
