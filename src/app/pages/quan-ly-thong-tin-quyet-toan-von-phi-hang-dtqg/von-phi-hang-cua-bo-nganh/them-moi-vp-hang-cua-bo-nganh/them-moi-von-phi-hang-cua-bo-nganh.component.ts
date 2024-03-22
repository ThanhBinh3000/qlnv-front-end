import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { STATUS } from 'src/app/constants/status';
import { KeHoachVonPhiBNCT } from '../../../../models/KeHoachVonPhiBNCT';
import { MESSAGE } from '../../../../constants/message';
import { DonviService } from '../../../../services/donvi.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HelperService } from '../../../../services/helper.service';
import { QuyetToanVonPhiService } from '../../../../services/ke-hoach/von-phi/quyetToanVonPhi.service';
import { DialogTuChoiComponent } from '../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { PREVIEW } from '../../../../constants/fileType';
import printJS from 'print-js';
import { saveAs } from 'file-saver';
import { QuyetDinhTtcpService } from '../../../../services/quyetDinhTtcp.service';

@Component({
  selector: 'app-them-moi-von-phi-hang-cua-bo-nganh',
  templateUrl: './them-moi-von-phi-hang-cua-bo-nganh.component.html',
  styleUrls: ['./them-moi-von-phi-hang-cua-bo-nganh.component.scss'],
})
export class ThemMoiVonPhiHangCuaBoNganhComponent implements OnInit {
  formData: FormGroup;
  @Input('isView') isView: boolean = false;
  dataTable: any[] = [];
  @Output()
  showListEvent = new EventEmitter<any>();
  page: number = 1;
  dsNam: any[] = [];
  @Input()
  idInput: number;
  dataTableAll: any[] = [];
  dsQtNsChiTw: any[] = [];
  dsQtNsKpChiNvDtqg: any[] = [];
  listBoNganh: any[] = [];
  allChecked = false;
  totalRecord: number = 10;
  STATUS = STATUS;
  isAdddsQtNsChiTw: boolean = false;
  isAdddsQtNsKpChiNvDtqg: boolean = false;
  dataQtNsChiTwEdit: { [key: string]: { edit: boolean; data: KeHoachVonPhiBNCT } } = {};
  dataQtNsKpChiNvDtqgEdit: { [key: string]: { edit: boolean; data: KeHoachVonPhiBNCT } } = {};
  rowItemQtNsChiTw: KeHoachVonPhiBNCT = new KeHoachVonPhiBNCT();
  rowItemQtNsKpChiNvDtqg: KeHoachVonPhiBNCT = new KeHoachVonPhiBNCT();
  taiLieuDinhKemList: any[] = [];
  setOfCheckedId = new Set<number>();
  indeterminate = false;
  filterTable: any = {
    namQuyetToan: '',
    ngayNhap: '',
    ngayCapNhat: '',
    qdCtKhNam: '',
    trangThai: '',
    trangThaiPdBtc: '',
  };
  templateName = 'bao-cao-so-lieu-quyet-toan-toan-nganh.docx';
  pdfSrc: any;
  printSrc: any;
  wordSrc: any;
  showDlgPreview = false;

  constructor(
    private readonly fb: FormBuilder,
    public globals: Globals,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    private donviService: DonviService,
    private vonPhiService: QuyetToanVonPhiService,
    public modal: NzModalService,
    private qdTtcp : QuyetDinhTtcpService,
    private helperService: HelperService,
    private notification: NzNotificationService,
  ) {
    this.formData = this.fb.group({
      namQuyetToan: [dayjs().get('year'), [Validators.required]],
      ngayNhap: ['', [Validators.required]],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [null],
    });
  }

  ngOnInit() {
    this.loadDsNam();
    this.loadBoNganh();
    this.getDataDetail(this.idInput);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async getDataDetail(id) {
    if (id > 0) {
      this.spinner.show();
      let res = await this.vonPhiService.getDetail(id);
      const data = res.data;
      if (res.msg == MESSAGE.SUCCESS) {
        this.formData.patchValue({
          id: data.id,
          namQuyetToan: data.namQt,
          lyDoTuChoi: data.lyDoTuChoi,
          ngayNhap: data.ngayNhap,
          tenTrangThai: data.tenTrangThai,
          trangThai: data.trangThai,
        });
        this.dsQtNsChiTw = cloneDeep(data.dsQtNsChiTw);
        this.dsQtNsKpChiNvDtqg = cloneDeep(data.dsQtNsKpChiNvDtqg);
        this.taiLieuDinhKemList = data.taiLieuDinhKems;
        this.updateEditQtNsKpChiNvDtqgCache();
        this.updateEditQtNsChiTwCache();
        this.spinner.hide();
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }


  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    }
    let body = {
      'id': null,
      'namQt': this.formData.value.namQuyetToan,
      'trangThai': this.formData.value.trangThai,
      'ngayNhap': this.formData.get('ngayNhap').value ? dayjs(this.formData.get('ngayNhap').value).format('YYYY-MM-DD') : null,
      'dsQtNsChiTw': this.dsQtNsChiTw,
      'dsQtNsKpChiNvDtqg': this.dsQtNsKpChiNvDtqg,
      'taiLieuDinhKems': this.taiLieuDinhKemList,
      'loai': '00',
    };
    this.spinner.show();
    try {
      if (this.idInput > 0) {
        body.id = this.idInput;
        let res = await this.vonPhiService.update(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isGuiDuyet) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.pheDuyet();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.vonPhiService.create(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isGuiDuyet) {
            this.formData.patchValue({
              id: res.data.id,
            });
            this.idInput = res.data.id;
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          } else {
            this.pheDuyet(res.data.id);
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(
        MESSAGE.ERROR,
        e?.error?.message ?? MESSAGE.SYSTEM_ERROR,
      );
    }
  }

 async changeBN() {
    if (this.rowItemQtNsChiTw.maBoNganh) {
      let maBn  =  this.listBoNganh.find(item => item.code == this.rowItemQtNsChiTw.maBoNganh).maDvi;
      await this.getDtDauNam(maBn);
      this.isAdddsQtNsChiTw = true;
      this.rowItemQtNsChiTw.tenBoNganh = this.listBoNganh.find(item => item.code == this.rowItemQtNsChiTw.maBoNganh).title;
    }
    if (this.rowItemQtNsKpChiNvDtqg.maBoNganh) {
      this.isAdddsQtNsKpChiNvDtqg = true;
      this.rowItemQtNsKpChiNvDtqg.tenBoNganh = this.listBoNganh.find(item => item.code == this.rowItemQtNsKpChiNvDtqg.maBoNganh).title;
    }
  }


 async getDtDauNam(maBn){
    let namQd = this.formData.get("namQuyetToan").value;
    let res = await this.qdTtcp.chiTietTheoNam(namQd);
   if (res.msg == MESSAGE.SUCCESS) {
        if(res.data){
          let dataBn = res.data.listBoNganh.find(it => it.maBoNganh == maBn);
          this.rowItemQtNsChiTw.soDtDauNam = ( dataBn && dataBn.tongTien) ? dataBn.tongTien : 0;
        }
     } else {
       this.notification.error(MESSAGE.ERROR, res.msg);
     }
  }

  addQtNsChiTw() {
    if (!this.isAdddsQtNsChiTw) {
      return;
    }
    this.dsQtNsChiTw = [...this.dsQtNsChiTw, this.rowItemQtNsChiTw];
    this.rowItemQtNsChiTw = new KeHoachVonPhiBNCT();
    this.updateEditQtNsChiTwCache();
  }

  addQtNsKpChiNvDtqg() {
    if (!this.isAdddsQtNsKpChiNvDtqg) {
      return;
    }
    this.dsQtNsKpChiNvDtqg = [...this.dsQtNsKpChiNvDtqg, this.rowItemQtNsKpChiNvDtqg];
    this.rowItemQtNsKpChiNvDtqg = new KeHoachVonPhiBNCT();
    this.updateEditQtNsKpChiNvDtqgCache();
  }

  updateEditQtNsChiTwCache(): void {
    if (this.dsQtNsChiTw) {
      this.dsQtNsChiTw.forEach((item, index) => {
        this.dataQtNsChiTwEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  updateEditQtNsKpChiNvDtqgCache(): void {
    if (this.dsQtNsKpChiNvDtqg) {
      this.dsQtNsKpChiNvDtqg.forEach((item, index) => {
        this.dataQtNsKpChiNvDtqgEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  editQtNsChiTw(index) {
    this.dataQtNsChiTwEdit[index].edit = true;
  }

  editQtNsKpChiNvDtqg(index) {
    this.dataQtNsKpChiNvDtqgEdit[index].edit = true;
  }

  deleteQtNsChiTw(index) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dsQtNsChiTw.splice(index, 1);
          this.updateEditQtNsChiTwCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  deleteQtNsKpChiNvDtqg(index) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dsQtNsKpChiNvDtqg.splice(index, 1);
          this.updateEditQtNsKpChiNvDtqgCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveEditQtNsChiTw(idx) {
    Object.assign(this.dsQtNsChiTw[idx], this.dataQtNsChiTwEdit[idx].data);
    this.dataQtNsChiTwEdit[idx].edit = false;
  }

  saveEditQtNsKpChiNvDtqg(idx) {
    Object.assign(this.dsQtNsKpChiNvDtqg[idx], this.dataQtNsKpChiNvDtqgEdit[idx].data);
    this.dataQtNsKpChiNvDtqgEdit[idx].edit = false;
  }

  cancelEditQtNsChiTw(idx) {
    this.dataQtNsChiTwEdit[idx] = {
      data: { ...this.dsQtNsChiTw[idx] },
      edit: false,
    };
  }

  cancelEditQtNsKpChiNvDtqg(idx) {
    this.dataQtNsKpChiNvDtqgEdit[idx] = {
      data: { ...this.dsQtNsKpChiNvDtqg[idx] },
      edit: false,
    };
  }

  refreshQtNsChiTw() {
    this.rowItemQtNsChiTw = new KeHoachVonPhiBNCT();
    this.isAdddsQtNsChiTw = false;
  }

  refreshQtNsKpChiNvDtqg() {
    this.rowItemQtNsKpChiNvDtqg = new KeHoachVonPhiBNCT();
    this.isAdddsQtNsKpChiNvDtqg = false;
  }

  async loadBoNganh() {
    this.listBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      // this.listBoNganh = res.data.filter(item => item.key != '01');
      this.listBoNganh = res.data;
    }
  }


  pheDuyet(id?) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.DU_THAO: {
              trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.DA_DUYET_LDV;
              break;
            }
            case STATUS.TU_CHOI_LDV: {
              trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
          }
          let body = {
            id: id ? id : this.idInput,
            trangThai: trangThai,
          };
          const res = await this.vonPhiService.approve(body);
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

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: text,
            trangThai: STATUS.TU_CHOI_LDV,
          };
          const res = await this.vonPhiService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
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
      }
    });
  }

  sumCT1(key) {
    return this.dsQtNsChiTw.reduce((a, b) => a + (b[key] || 0), 0);
  }

  sumCT2(key) {
    return this.dsQtNsKpChiNvDtqg.reduce((a, b) => a + (b[key] || 0), 0);
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: thisYear + i,
        text: thisYear + i,
      });
    }
  }

  async preview(id) {
    this.spinner.show();
    await this.vonPhiService.preview({
      tenBaoCao: this.templateName,
      id: id,
    }).then(async res => {
      if (res.data) {
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

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true });
  }

}
