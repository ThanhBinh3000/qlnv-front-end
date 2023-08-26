import { L, M } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { BienBanLayMau } from 'src/app/models/BienBanLayMau';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyBienBanLayMauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanLayMau.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapDayKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { HelperService } from 'src/app/services/helper.service';
import { isEmpty } from 'lodash';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import { saveAs } from 'file-saver';

@Component({
  selector: 'them-moi-bien-ban-lay-mau',
  templateUrl: './them-moi-bien-ban-lay-mau.component.html',
  styleUrls: ['./them-moi-bien-ban-lay-mau.component.scss'],
})
export class ThemMoiBienBanLayMauKhoComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() isTatCa: boolean;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  formData: FormGroup;
  maSuffix: string = '/BBLM-CCDTVP';
  listFileDinhKem: any[] = [];
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  userInfo: UserLogin;
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listDiaDiemNhap: any[] = [];
  listBbNhapDayKho: any[] = [];

  bienBanLayMau: any;
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  maVthh: string;
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  listBienBan: any[] = [];
  listSoQuyetDinh: any[] = [];
  listBienBanDayKho: any[] = [];
  listHopDong: any[] = [];
  listNam: any[] = [];
  capCuc: string = '2';
  capChiCuc: string = '3';
  previewName: string = 'bien_ban_lay_mau.docx';
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
  listHangHoa: any[] = [];
  listDaiDien: any[] = [
    {
      "bbLayMauId": null,
      "daiDien": null,
      "id": null,
      "idTemp": 1,
      "loaiDaiDien": '2'
    },
    {
      "bbLayMauId": null,
      "daiDien": null,
      "id": null,
      "idTemp": 1,
      "loaiDaiDien": '3'
    }
  ];
  STATUS = STATUS
  constructor(
    private spinner: NgxSpinnerService,
    private bienBanLayMauService: QuanLyBienBanLayMauService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public globals: Globals,
    private routerActive: ActivatedRoute,
    public userService: UserService,
    private thongTinHopDongService: ThongTinHopDongService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private danhMucService: DanhMucService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
    private fb: FormBuilder,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      loaiBienBan: [''],
      nam: [dayjs().get('year'), [Validators.required]],
      soBienBan: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maDvi: ['', [Validators.required]],
      maQhns: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      idDdiemGiaoNvNh: [''],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      soQdGiaoNvNh: ['', [Validators.required]],
      ngayQdGiaoNvNh: ['', [Validators.required]],
      idQdGiaoNvNh: ['', [Validators.required]],
      soHd: [''],
      ngayHd: [''],
      ngayLayMau: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      dviKiemNghiem: ['', [Validators.required]],
      soBbNhapDayKho: ['', [Validators.required]],
      idBbNhapDayKho: ['', [Validators.required]],
      diaDiemLayMau: ['', [Validators.required]],

      soLuongMau: ['', [Validators.required]],
      ppLayMau: [''],
      chiTieuKiemTra: ['', [Validators.required]],
      ketQuaNiemPhong: [''],
      tenNguoiTao: [''],
      soBbGuiHang: [''],
      idBbGuiHang: [''],
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') + i,
        text: dayjs().get('year') + i,
      });
    }
    await Promise.all([
      this.loadPhuongPhapLayMau(),
      this.loadLoaiBienBan(),
    ]);
    if (this.id > 0) {
      await this.loadBienbanLayMau();
    }
    else {
      await this.initForm();
    }
  }

  isDisableField() {
    if (this.bienBanLayMau && (this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async initForm() {
    let id = await this.userService.getId('BB_LAY_MAU_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      loaiBienBan: this.listBienBan[0].ma,
      soBienBan: `${id}/${this.formData.get('nam').value}/BBLM-CCDTVP`,
      tenNguoiTao: this.userInfo.TEN_DAY_DU
    });
  }

  addDaiDien(type) {
    if (!this.listDaiDien) {
      this.listDaiDien = [];
    }
    let item = {
      "bbLayMauId": null,
      "daiDien": null,
      "id": null,
      "idTemp": new Date().getTime(),
      "loaiDaiDien": type
    }
    this.listDaiDien.push(item);
  }

  xoaDaiDien(item) {
    this.listDaiDien = this.listDaiDien.filter(x => x.idTemp != item.idTemp);
  }

  isAction(): boolean {
    return (
      this.bienBanLayMau.trangThai === this.globals.prop.NHAP_DU_THAO ||
      !this.isView
    );
  }

  async save(isGuiDuyet?: boolean) {
    this.spinner.show();
    this.setValidator();
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.fileDinhKems = this.listFileDinhKem;
    body.chiTiets = [...this.listDaiDienChiCuc, ...this.listDaiDienCuc];
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.bienBanLayMauService.update(body);
    } else {
      res = await this.bienBanLayMauService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.spinner.hide();
        this.id = res.data.id;
        this.pheDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.redirectBienBanLayMau();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.redirectBienBanLayMau();
        }
        this.spinner.hide();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }
  }

  setValidator() {
    if (this.loaiVthh.startsWith('02')) {
      this.formData.controls['soBbNhapDayKho'].clearValidators();
      this.formData.controls['idBbNhapDayKho'].clearValidators();
      this.formData.controls['soBbGuiHang'].setValidators([Validators.required]);
      this.formData.controls['idBbGuiHang'].setValidators([Validators.required]);
    } else {
      this.formData.controls['soBbNhapDayKho'].setValidators([Validators.required]);
      this.formData.controls['idBbNhapDayKho'].setValidators([Validators.required]);
      this.formData.controls['soBbGuiHang'].clearValidators();
      this.formData.controls['idBbGuiHang'].clearValidators();
    }
  }

  pheDuyet() {
    let trangThai = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn duyệt ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: trangThai,
          };
          const res = await this.bienBanLayMauService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectBienBanLayMau();
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
            id: this.id,
            lyDoTuChoi: text,
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          const res = await this.bienBanLayMauService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectBienBanLayMau();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.redirectBienBanLayMau();
      },
    });
  }

  redirectBienBanLayMau() {
    this.showListEvent.emit();
  };

  async loadPhuongPhapLayMau() {
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMaus = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  async loadLoaiBienBan() {
    await this.danhMucService.danhMucChungGetAll("LOAI_BIEN_BAN").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBienBan = res.data.filter(item => item.ma == 'LBGM');
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  async loadBienbanLayMau() {
    this.spinner.show()
    let res = await this.bienBanLayMauService.getDetail(+this.id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.listDaiDienChiCuc = data.chiTiets.filter(x => x.loaiDaiDien == 'CHI_CUC')
      this.listDaiDienCuc = data.chiTiets.filter(x => x.loaiDaiDien == 'CUC')
      await this.bindingDataQd(data.idQdGiaoNvNh);
    }
    else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide()

  }

  async openDialogSoQd() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.loaiVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQdinh,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      soHd: data.soHd,
      ngayHd: data.hopDong.ngayKy,
      donGiaHd: data.hopDong.donGia
    });
    let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0];
    if (dataChiCuc) {
      if (this.loaiVthh.startsWith('02')) {
        this.listDiaDiemNhap = dataChiCuc.children.filter(item => !isEmpty(item.bienBanGuiHang));
      } else {
        this.listDiaDiemNhap = dataChiCuc.children.filter(item => !isEmpty(item.bienBanNhapDayKho) && isEmpty(item.bienBanLayMau));
      }
    }
    await this.spinner.hide();
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.listBbNhapDayKho = [];
        this.formData.patchValue({
          idDdiemGiaoNvNh: data.id,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          soBbNhapDayKho: data.bienBanNhapDayKho?.soBienBanNhapDayKho,
          idBbNhapDayKho: data.bienBanNhapDayKho?.id,
          soBbGuiHang: data.bienBanGuiHang?.soBienBanGuiHang,
          idBbGuiHang: data.bienBanGuiHang?.id
        });
      }
    });
  }

  getNameFile(event?: any) {
    // const element = event.currentTarget as HTMLInputElement;
    // const fileList: FileList | null = element.files;
    // if (fileList) {
    //   this.nameFile = fileList[0].name;
    // }
    // this.formData.patchValue({
    //   file: event.target.files[0] as File,
    // });
    // if (this.dataCanCuXacDinh) {
    //   this.formTaiLieuClone.file = this.nameFile;
    //   this.isSave = !isEqual(this.formTaiLieuClone, this.formTaiLieu);
    // }
  }

  async preview(fileName: string) {
    let body = this.formData.value;
    this.reportTemplate.fileName = fileName;
    body.reportTemplateRequest = this.reportTemplate;
    await this.bienBanLayMauService.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }
  downloadPdf(fileName: string) {
    saveAs(this.pdfSrc, fileName);
  }

  downloadWord(fileName: string) {
    saveAs(this.wordSrc, fileName);
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
  printPreview(){
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }

}
