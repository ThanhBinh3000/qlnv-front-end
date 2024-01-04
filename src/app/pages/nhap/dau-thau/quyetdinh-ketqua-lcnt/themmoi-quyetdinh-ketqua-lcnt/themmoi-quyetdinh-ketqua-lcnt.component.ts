import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {
  ThemmoiThongtinDauthauVtComponent
} from "../../trienkhai-luachon-nhathau/thongtin-dauthau/themmoi-thongtin-dauthau-vt/themmoi-thongtin-dauthau-vt.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FileDinhKem} from "../../../../../models/FileDinhKem";
import {UserLogin} from "../../../../../models/userlogin";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {NgxSpinnerService} from "ngx-spinner";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UploadFileService} from "../../../../../services/uploaFile.service";
import {Globals} from "../../../../../shared/globals";
import {UserService} from "../../../../../services/user.service";
import {HelperService} from "../../../../../services/helper.service";
import {
  QuyetDinhPheDuyetKetQuaLCNTService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service";
import {
  ThongTinDauThauService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service";
import * as dayjs from "dayjs";
import {MESSAGE} from "../../../../../constants/message";
import {FILETYPE, PREVIEW} from "../../../../../constants/fileType";
import {
  DialogTableSelectionComponent
} from "../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { STATUS } from "../../../../../constants/status";
import { isEmpty } from 'lodash'
import {
  ThemmoiThongtinDauthauComponent
} from "../../trienkhai-luachon-nhathau/thongtin-dauthau/themmoi-thongtin-dauthau/themmoi-thongtin-dauthau.component";
import { saveAs } from "file-saver";
@Component({
  selector: 'app-themmoi-quyetdinh-ketqua-lcnt',
  templateUrl: './themmoi-quyetdinh-ketqua-lcnt.component.html',
  styleUrls: ['./themmoi-quyetdinh-ketqua-lcnt.component.scss']
})
export class ThemmoiQuyetdinhKetquaLcntComponent extends Base2Component implements OnInit {
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() loaiVthh: string;
  @Input() isViewDetail: boolean;
  @Input() idInput: number;
  @Input() soQd: string;
  @Input() isViewOnModal: boolean;

  @Input() isView: boolean;
  @ViewChild('thongtindtvt') thongTinDauThauVt: ThemmoiThongtinDauthauVtComponent;
  @ViewChild('thongtindt') thongTinDauThau: ThemmoiThongtinDauthauComponent;

  formData: FormGroup;

  listQdPdKhlcnt: any[] = []
  maQd: String;
  listNam: any[] = [];

  isQdkqlcnt: boolean = true;
  danhSachFileDinhKem: FileDinhKem[] = [];
  danhSachFileCanCuPL: FileDinhKem[] = [];
  listFile: any[] = []
  userInfo: UserLogin;
  STATUS = STATUS
  reportTemplate: any = {
    typeFile: "",
    fileName: "qd_pd_kqlcnt_vt.docx",
    tenBaoCao: "",
    trangThai: ""
  };
  previewName: string;
  constructor(
    modal: NzModalService,
    private danhMucService: DanhMucService,
    spinner: NgxSpinnerService,
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    uploadFileService: UploadFileService,
    fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    helperService: HelperService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService,
    private thongTinDauThauService: ThongTinDauThauService

  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKetQuaLCNTService)
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [],
        ngayKy: [],
        // ngayHluc: [],
        namKhoach: [dayjs().get('year')],
        trichYeu: [null],
        soQdPdKhlcnt: [''],
        idQdPdKhlcnt: [''],
        idQdPdKhlcntDtl: [''],
        ghiChu: [null,],
        trangThai: [this.STATUS.DANG_NHAP_DU_LIEU],
        tenTrangThai: ["Đang nhập dữ liệu"],
        loaiVthh: [''],
        cloaiVthh: [''],
        noiDungQd: [''],
        fileDinhKems: new FormControl([]),
        tgianTrinhKqTcg: [''],
        tgianTrinhTtd: [''],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maQd = "/" + this.userInfo.MA_QD;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    if (this.idInput > 0) {
      await this.getDetail(this.idInput);
    }
    if (this.soQd) {
      await this.getDetail(0, this.soQd);
    }
    await this.spinner.hide();
  }

  disableForm(): boolean {
    if (this.formData.get('trangThai').value == STATUS.BAN_HANH) {
      return true
    }
    return false;
  }

  async getDetail(id: number, soQd?: string) {
    if (id > 0 || soQd) {
      let res = null;
      if (soQd) {
        var body = this.formData.value
        body.soQd = soQd
        res = await this.quyetDinhPheDuyetKetQuaLCNTService.getDetailBySoQd(body);
      }
      if (id > 0) {
        res = await this.quyetDinhPheDuyetKetQuaLCNTService.getDetail(id);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
        this.formData.patchValue({
          soQd: dataDetail.soQd?.split('/')[0],
        })
        this.danhSachFileDinhKem = dataDetail.fileDinhKems;
        this.danhSachFileCanCuPL = dataDetail.canCuPhapLy;
        if (dataDetail.children?.length > 0) {
          dataDetail.children.forEach(item => {
            if (item.fileType == FILETYPE.FILE_DINH_KEM) {
              this.danhSachFileDinhKem.push(item)
            } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
              this.danhSachFileCanCuPL.push(item)
            }
          })
        }
      }
    }
  }

  async save(isBanHanh?) {
    this.setValidator(isBanHanh);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + this.maQd;
    }
    let duocBanHanh = true;
    if (this.loaiVthh.startsWith('02')) {
      body.fileDinhKems = this.danhSachFileDinhKem;
      body.listCcPhapLy = this.danhSachFileCanCuPL;
      let detail = [];
      let type = "GOC";
      if(this.thongTinDauThauVt.isDieuChinh) {
        type = "DC"
      }
      this.thongTinDauThauVt.danhsachDx.forEach(item => {
        let dtl = {
          idGoiThau: item.id,
          idNhaThau: item.kqlcntDtl?.idNhaThau,
          donGiaVat: item.kqlcntDtl?.donGiaVat,
          trangThai: item.kqlcntDtl?.trangThai,
          type: type,
          tenNhaThau: item.kqlcntDtl?.tenNhaThau,
          dienGiaiNhaThau: item.kqlcntDtl?.dienGiaiNhaThau
        }
        detail.push(dtl)
        if (item.kqlcntDtl?.trangThai == null) {
          duocBanHanh = false
        }
      })
      body.detailList = detail;
    } else {
      body.fileDinhKems = this.danhSachFileDinhKem;
      body.listCcPhapLy = this.danhSachFileCanCuPL;
      let detail = [];
      this.thongTinDauThau.listOfData.forEach(item => {
        let dtl = {
          idGoiThau: item.id,
          idNhaThau: item.kqlcntDtl?.idNhaThau,
          donGiaVat: item.kqlcntDtl?.donGiaVat,
          trangThai: item.kqlcntDtl?.trangThai,
          tenNhaThau: item.kqlcntDtl?.tenNhaThau,
          dienGiaiNhaThau: item.kqlcntDtl?.dienGiaiNhaThau
        }
        detail.push(dtl)
        if (item.kqlcntDtl?.trangThai == null) {
          duocBanHanh = false
        }
      })
      body.detailList = detail;
    }
    if (isBanHanh && !duocBanHanh) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng cập nhật kết quả đấu thầu cho các gói thầu.');
      return;
    }
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.quyetDinhPheDuyetKetQuaLCNTService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKetQuaLCNTService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      this.idInput = res.data.id;
      this.formData.get('id').setValue(res.data.id);
      if (isBanHanh) {
        this.pheDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  setValidator(isBanHanh) {
    if (isBanHanh) {
      this.formData.controls["soQd"].setValidators([Validators.required]);
      this.formData.controls["ngayKy"].setValidators([Validators.required]);
      // if (!this.loaiVthh.startsWith('02')) {
      //   this.formData.controls["ngayHluc"].setValidators([Validators.required]);
      // }
    } else {
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["ngayKy"].clearValidators();
      // this.formData.controls["ngayHluc"].clearValidators();
    };
  }

  quayLai() {
    this.showListEvent.emit();
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.DANG_NHAP_DU_LIEU: {
        trangThai = STATUS.BAN_HANH;
        msg = 'Bạn có muốn ban hành ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: msg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: trangThai,
          };

          const res = await this.quyetDinhPheDuyetKetQuaLCNTService.approve(body);
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

  async openDialogSoQdKhlcnt() {
    let body
    if (this.loaiVthh.startsWith("02")) {
      body = {
        namKhoach: this.formData.get('namKhoach').value,
        trangThaiDt: STATUS.HOAN_THANH_CAP_NHAT,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0,
        },
        loaiVthh: this.loaiVthh,
        trangThai: STATUS.BAN_HANH,
        lastest: 0
      };
    } else {
      body = {
        namKhoach: this.formData.get('namKhoach').value,
        trangThaiDtl: STATUS.HOAN_THANH_CAP_NHAT,
        maDvi: this.userInfo.MA_DVI,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0,
        },
        loaiVthh: this.loaiVthh
      };
    }

    let res = await this.thongTinDauThauService.search(body);
    this.listQdPdKhlcnt = res.data.content.filter(item => isEmpty(item.soQdPdKqLcnt));

    this.listQdPdKhlcnt.forEach(element => {
      if (this.loaiVthh == '02') {
        element.soDxuat = element.soTrHdr;
        element.loaiVthh = element.loaiVthh;
        element.tenLoaiVthh = element.tenLoaiVthh;
        element.cloaiVthh = element.cloaiVthh;
        element.tenCloaiVthh = element.tenCloaiVthh;
        element.soQdPdKhlcnt = element.soQd;
      } else {
        element.soQdPdKhlcnt = element.hhQdKhlcntHdr?.soQd;
        element.loaiVthh = element.hhQdKhlcntHdr?.loaiVthh
        element.tenLoaiVthh = element.hhQdKhlcntHdr?.tenLoaiVthh;
        element.cloaiVthh = element.hhQdKhlcntHdr?.cloaiVthh;
        element.tenCloaiVthh = element.hhQdKhlcntHdr?.tenCloaiVthh;
      }
    });
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ QUYẾT ĐỊNH KẾ HOẠCH LỰA CHỌN NHÀ THẦU',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdPdKhlcnt,
        dataHeader: ['Số Đề Xuất KHLCNT', 'Số QĐ PD KHLCNT', 'Số QĐ điều chỉnh KHLCNT', 'Loại hàng DTQG', 'Chủng loại hàng DTQG', 'Tổng số gói thầu'],
        dataColumn: ['soDxuat', 'soQdPdKhlcnt', 'soQdDc', 'tenLoaiVthh', 'tenCloaiVthh', 'soGthau']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdPdKhlcnt: data.hhQdKhlcntHdr ? data.hhQdKhlcntHdr.soQd : data.soQd,
          idQdPdKhlcnt: data.hhQdKhlcntHdr ? data.hhQdKhlcntHdr.id : data.id,
          idQdPdKhlcntDtl: this.loaiVthh.startsWith('02') ? null : data.id,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh
        })
      }
    });
  }

  getNameFile(event?: any, item?: FileDinhKem) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      const itemFile = {
        name: fileList[0].name,
        file: event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          const fileDinhKem = new FileDinhKem();
          fileDinhKem.fileName = resUpload.filename;
          this.formData.patchValue({
            // nameFilePhuongAn: resUpload.filename
          })
          fileDinhKem.fileSize = resUpload.size;
          fileDinhKem.fileUrl = resUpload.url;
          // this.filePhuongAn = fileDinhKem;
        });
    }
  }

  async preview() {
    if(this.loaiVthh.startsWith('02')) {
      this.previewName = "qd_pd_kqlcnt_vt.docx";
    } else {
      this.previewName = "qd_pd_kqlcnt_lt.docx"
    }
    this.reportTemplate.fileName = this.previewName;
    let body = this.formData.value;
    body.reportTemplateRequest = this.reportTemplate;
    await this.quyetDinhPheDuyetKetQuaLCNTService.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }
}
