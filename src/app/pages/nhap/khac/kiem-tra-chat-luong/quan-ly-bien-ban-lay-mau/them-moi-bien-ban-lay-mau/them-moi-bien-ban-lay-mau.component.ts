import { L, M } from '@angular/cdk/keycodes';
import { cloneDeep, isEqual } from 'lodash';
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
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapDayKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { HelperService } from 'src/app/services/helper.service';
import { isEmpty } from 'lodash';
import {
  QuanLyBienBanLayMauKhacService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quanLyBienBanLayMauKhac.service";
import {
  QuyetDinhGiaoNhapHangKhacService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import { FileDinhKem } from "../../../../../../models/FileDinhKem";
import { FILETYPE } from "../../../../../../constants/fileType";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'them-moi-bien-ban-lay-mau',
  templateUrl: './them-moi-bien-ban-lay-mau.component.html',
  styleUrls: ['./them-moi-bien-ban-lay-mau.component.scss'],
})
export class ThemMoiBienBanLayMauKhoComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() idQdGvuNh: number;
  @Input() isView: boolean;
  @Input() isTatCa: boolean;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  previewName: string = 'nk_bien_ban_lay_mau';
  formData: FormGroup;
  maSuffix: string = '/BBLM-CCDTVP';
  listFileDinhKem: FileDinhKem[] = [];
  listCanCuPhapLy: FileDinhKem[] = [];
  listAnhDinhKem: FileDinhKem[] = [];
  listFile: any[] = []
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  userInfo: UserLogin;
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listDiaDiemNhap: any[] = [];
  listBbNhapDayKho: any[] = [];
  hhQdPdNhapKhacDtlReq: any;
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
  isSave: boolean = false;
  nameFile: string;
  formTaiLieu: any;
  formTaiLieuClone: any;
  maCloaiVthh: any;
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
    private httpClient: HttpClient,
    private storageService: StorageService,
    spinner: NgxSpinnerService,
    private bienBanLayMauKhacService: QuanLyBienBanLayMauKhacService,
    notification: NzNotificationService,
    private router: Router,
    modal: NzModalService,
    public globals: Globals,
    private routerActive: ActivatedRoute,
    public userService: UserService,
    private thongTinHopDongService: ThongTinHopDongService,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
    private danhMucService: DanhMucService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauKhacService);
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      loaiBienBan: [''],
      nam: [dayjs().get('year'), [Validators.required]],
      soBienBan: [''],
      tenDvi: [''],
      maDvi: [''],
      maQhns: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      idDdiemGiaoNvNh: [''],
      maDiemKho: [''],
      tenDiemKho: [''],
      maNhaKho: [''],
      tenNhaKho: [''],
      maNganKho: [''],
      tenNganKho: [''],
      maLoKho: [''],
      tenLoKho: [''],
      tenNganLoKho: [''],
      soQdGiaoNvNh: [''],
      ngayQdGiaoNvNh: [''],
      idQdGiaoNvNh: [''],
      soHd: [''],
      ngayHd: [''],
      ngayLayMau: [dayjs().format('YYYY-MM-DD')],
      dviKiemNghiem: ['Phòng KTBQ'],
      soBbNhapDayKho: [''],
      idBbNhapDayKho: [''],
      diaDiemLayMau: [''],

      soLuongMau: [''],
      ppLayMau: [''],
      chiTieuKiemTra: [''],
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
    if (this.idQdGvuNh > 0) {
      await this.initForm();
      await this.bindingDataQd(this.idQdGvuNh);
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
    // this.setValidator();
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    console.log(this.formData.value)
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      })
    }
    if (this.listCanCuPhapLy.length > 0) {
      this.listCanCuPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFile.push(element)
      })
    }
    if (this.listAnhDinhKem.length > 0) {
      this.listAnhDinhKem.forEach(element => {
        element.fileType = FILETYPE.ANH_DINH_KEM
        this.listFile.push(element)
      })
    }
    body.chiTiets = [...this.listDaiDienChiCuc, ...this.listDaiDienCuc];
    body.hhQdPdNhapKhacDtlReq = this.hhQdPdNhapKhacDtlReq;
    body.fileDinhKemReq = this.listFile
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.bienBanLayMauKhacService.update(body);
    } else {
      res = await this.bienBanLayMauKhacService.create(body);
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
      // this.formData.controls['soBbNhapDayKho'].clearValidators();
      this.formData.controls['idBbNhapDayKho'].clearValidators();
      this.formData.controls['soBbGuiHang'].setValidators([Validators.required]);
      this.formData.controls['idBbGuiHang'].setValidators([Validators.required]);
    } else {
      // this.formData.controls['soBbNhapDayKho'].setValidators([Validators.required]);
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
          const res = await this.bienBanLayMauKhacService.approve(body);
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
          const res = await this.bienBanLayMauKhacService.approve(body);
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
    let res = await this.bienBanLayMauKhacService.getDetail(+this.id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.listDaiDienChiCuc = data.chiTiets.filter(x => x.loaiDaiDien == 'CHI_CUC')
      this.listDaiDienCuc = data.chiTiets.filter(x => x.loaiDaiDien == 'CUC')
      if (data.fileDinhKems.length > 0) {
        data.fileDinhKems.forEach(item => {
          if (item.fileType == FILETYPE.FILE_DINH_KEM) {
            this.listFileDinhKem.push(item)
          } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
            this.listCanCuPhapLy.push(item)
          } else if (item.fileType == FILETYPE.ANH_DINH_KEM) {
            this.listAnhDinhKem.push(item)
          }
        })
      }
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
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value,
      "checkIdBbLayMau": 1,
    }
    let res = await this.quyetDinhGiaoNhapHangKhacService.dsQdNvuDuocLapBb(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      this.listSoQuyetDinh = data;
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
    let dataRes = await this.quyetDinhGiaoNhapHangKhacService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQdinh,
      loaiVthh: data.loaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      moTaHangHoa: data.moTaHangHoa,
    });
    data.dtlList.forEach(item => {
      if (item.idBbLayMau == this.id) {
        this.formData.patchValue({
          tenCloaiVthh: item.tenCloaiVthh,
          cloaiVthh: item.cloaiVthh,
          tenNganLoKho: item.tenNganLoKho,
        });
      }
    })
    let dataChiCuc = data.dtlList;
    if (dataChiCuc) {
      // if (this.loaiVthh.startsWith('02')) {
      //   this.listDiaDiemNhap = dataChiCuc.children.filter(item => !isEmpty(item.bienBanGuiHang));
      // } else {
      this.listDiaDiemNhap = dataChiCuc.filter(item => item.maChiCuc == this.userInfo.MA_DVI);
      // }
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
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'SL theo QĐ giao NV NH'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'tongSlNhap']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.hhQdPdNhapKhacDtlReq = data;
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
          tenNganLoKho: data.tenNganLoKho ? data.tenNganLoKho : `${data.tenLoKho} - ${data.tenNganKho}`,
          tenCloaiVthh: data.tenCloaiVthh,
          soBbNhapDayKho: data.bienBanNhapDayKho?.soBienBanNhapDayKho,
          idBbNhapDayKho: data.bienBanNhapDayKho?.id,
          soBbGuiHang: data.bienBanGuiHang?.soBienBanGuiHang,
          idBbGuiHang: data.bienBanGuiHang?.id,
          diaDiemLayMau: data.tenDiemKho + ' - ' + this.formData.value.tenDvi,
        });
      }
    });
  }

  getNameFile(event?: any) {
    this.isSave = true;
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.nameFile = fileList[0].name;
    }
    this.formData.patchValue({
      file: event.target.files[0] as File,
    });
    this.formTaiLieuClone.file = this.nameFile;
    this.isSave = !isEqual(this.formTaiLieuClone, this.formTaiLieu);
  }

}
