import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import { STATUS } from "../../../../../../constants/status";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhGiaoNvNhapHangService } from './../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { DialogTableSelectionComponent } from './../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component';
import { UploadFileService } from './../../../../../../services/uploaFile.service';
import { FileDinhKem } from './../../../../../../models/DeXuatKeHoachuaChonNhaThau';
import { DialogTuChoiComponent } from './../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { PhuongPhapLayMau } from './../../../../../../models/PhuongPhapLayMau';
import { isEmpty } from 'lodash';
import { MttBienBanLayMauService } from './../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttBienBanLayMauService.service';
import {FILETYPE} from "../../../../../../constants/fileType";
import {cloneDeep} from 'lodash';
import {KhCnQuyChuanKyThuat} from "../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";

@Component({
  selector: 'app-them-moi-bien-ban-lay-ban-giao-mau',
  templateUrl: './them-moi-bien-ban-lay-ban-giao-mau.component.html',
  styleUrls: ['./them-moi-bien-ban-lay-ban-giao-mau.component.scss']
})
export class ThemMoiBienBanLayBanGiaoMauComponent extends Base2Component implements OnInit, OnChanges {
  @Input()
  typeVthh: string;
  @Input() isView: boolean;
  @Input()
  id: number;
  @Input()
  showFromTH: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() idQdGiaoNvNh: number;

  listDiaDiemNhap: any[] = [];
  listSoPhieuNhapKho: any[] = [];
  listSoQuyetDinh: any[] = [];

  listBienBan: any[] = [];
  listDaiDien: any[] = [];
  bienBanLayMau: any;
  listFileDinhKem: any[] = [];
  listCanCuPhapLy: any[] = [];
  listBbDaKy: any[] = [];
  listFile: any[] = []
  daiDienRowEdit: any[] = [];
  viewTableDaiDien: any[] = [];

  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  phuongPhapLayMaus: any[] = [];
  chiTieuChatLuongs: any[] = [];
  listBbNhapDayKho: any[] = [];
  radioValue: any;
  tenNganLoKho: any;
  ppLayMau: any;
  checked: boolean = false;
  previewName: string = 'ntt_bien_ban_lay_mau';
  daiDienRow: any = {};
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private bienBanLayMauServive: MttBienBanLayMauService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauServive);
    this.formData = this.fb.group({

      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      ldoTuChoi: [''],
      loaiBienBan: [''],
      namKh: [dayjs().get('year'), [Validators.required]],
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
      ngayQdGiaoNvNh: [''],
      idQdGiaoNvNh: ['', [Validators.required]],
      soHd: [''],
      ngayHd: [''],
      ngayLayMau: [dayjs().format('YYYY-MM-DD')],
      dviKiemNghiem: ['', [Validators.required]],
      diaDiemLayMau: ['', [Validators.required]],
      soBbNhapDayKho: ['',],
      idBbNhapDayKho: ['',],
      ngayKetThucNhap: ['',],
      soLuongMau: [''],
      ppLayMau: [''],
      chiTieuKiemTra: [''],
      ketQuaNiemPhong: [''],
      tenNganLoKho: [''],
      ppLayMauList: [''],
      chiTieuKiemTraList: [''],
      tenNguoiTao: [''],
      truongBpKtbq: [''],
      tenDviCcHang: [''],
      nguoiPduyet: [''],
      soBangKe: [],
      loaiQd: [],
    });
  }

  async ngOnInit() {
    await Promise.all([
      this.loadSoQuyetDinh(),
      // this.loadChiTieuCl(this.typeVthh),
      this.loadLoaiBienBan(),
    ]);
    if (this.id) {
      await this.loadBienbanLayMau(this.id);
    }
    else {
      await this.initForm();
    }
  }

  // isDisableField() {
  //   if (this.bienBanLayMau && (this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
  //     return true;
  //   }
  // }

  async ngOnChanges(changes: SimpleChanges) {
  }
  async initForm() {
    let id = await this.userService.getId('HH_BIEN_BAN_LAY_MAU_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      loaiBienBan: this.listBienBan[0].ma,
      soBienBan: `${id}/${this.formData.get('namKh').value}/BBLM-CCDTVP`,
      tenNguoiTao: this.userInfo.TEN_DAY_DU
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh, true);
    }
  }

  // addDaiDien(type) {
  //   if (!this.listDaiDien) {
  //     this.listDaiDien = [];
  //   }
  //   let item = {
  //     "bbLayMauId": null,
  //     "daiDien": null,
  //     "id": null,
  //     "idTemp": new Date().getTime(),
  //     "loaiDaiDien": type
  //   }
  //   this.listDaiDien.push(item);
  // }

  // xoaDaiDien(item) {
  //   this.listDaiDien = this.listDaiDien.filter(x => x.idTemp != item.idTemp);
  // }

  isAction(): boolean {
    return (
      this.bienBanLayMau.trangThai === this.globals.prop.NHAP_DU_THAO ||
      !this.isView
    );
  }

  async save(isGuiDuyet?: boolean) {

    if (this.setValidator) {
      try {
        this.spinner.show();
        this.helperService.markFormGroupTouched(this.formData);
        if (!this.formData.valid) {
          this.spinner.hide();
          return;
        }
        if (this.phuongPhapLayMaus.filter(item => item.checked).length <= 0) {
          this.notification.error(MESSAGE.ERROR, 'Phương pháp lấy mẫu không được để trống.');
          this.spinner.hide();
          return;
        }
        let body = this.formData.value;
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
        if (this.listBbDaKy.length > 0) {
          this.listBbDaKy.forEach(element => {
            element.fileType = FILETYPE.FILE_DINH_KEM_BB_DA_KY
            this.listFile.push(element)
          })
        }
        body.fileDinhKems = this.listFile;
        body.bbanLayMauDtlList = this.viewTableDaiDien;
        body.ppLayMau = this.phuongPhapLayMaus.filter(item => item.checked).map(f => `${f.id}-${f.giaTri}`).join(",")
        let res;
        if (this.formData.get('id').value > 0) {
          res = await this.bienBanLayMauServive.update(body);
        } else {
          res = await this.bienBanLayMauServive.create(body);
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
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }

    }


  }

  async loadPhuongPhapLayMau(maChLoaiHangHoa) {
    let res = await this.danhMucService.loadDanhMucHangChiTiet(maChLoaiHangHoa)
    if (res.msg == MESSAGE.SUCCESS) {
      this.phuongPhapLayMaus = res.data.ppLayMau
    }
  }

  setValidator() {
    return true
  }

  isDisableField() {
    if (this.bienBanLayMau && (this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
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
          const res = await this.bienBanLayMauServive.approve(body);
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
            lyDo: text,
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          const res = await this.bienBanLayMauServive.approve(body);
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

  // async loadPhuongPhapLayMau() {
  //   this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       this.phuongPhapLayMaus = res.data;
  //     }
  //     else {
  //       this.notification.error(MESSAGE.ERROR, res.msg);
  //     }
  //   }).catch(err => {
  //     this.notification.error(MESSAGE.ERROR, err.msg);
  //   })
  // }

  // async loadLoaiBienBan() {
  //   await this.danhMucService.danhMucChungGetAll("LOAI_BIEN_BAN").then(res => {
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       this.listBienBan = res.data.filter(item => item.ma == 'LBGM');
  //     }
  //     else {
  //       this.notification.error(MESSAGE.ERROR, res.msg);
  //     }
  //   }).catch(err => {
  //     this.notification.error(MESSAGE.ERROR, err.msg);
  //   })
  // }

  async loadBienbanLayMau(id) {
    this.spinner.show()
    console.log(id)
    let res = await this.bienBanLayMauServive.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      data.tenDvi = this.userInfo.TEN_DVI;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      await this.bindingDataQd(data.idQdGiaoNvNh);
      this.formData.value.tenNganLoKho = data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho;
      this.tenNganLoKho = this.formData.value.tenNganLoKho;
      this.radioValue = data.loaiBienBan;
      this.checked = data.ketQuaNiemPhong;
      this.viewTableDaiDien = data.bbanLayMauDtlList;
      // this.listDaiDienChiCuc = data.bbanLayMauDtlList.filter(x => x.loaiDaiDien == 'CHI_CUC')
      // this.listDaiDienCuc = data.bbanLayMauDtlList.filter(x => x.loaiDaiDien == 'CUC')
      if (data.fileDinhKems.length > 0) {
        data.fileDinhKems.forEach(item => {
          if (item.fileType == FILETYPE.FILE_DINH_KEM) {
            this.listFileDinhKem.push(item)
          } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
            this.listCanCuPhapLy.push(item)
          } else if (item.fileType == FILETYPE.FILE_DINH_KEM_BB_DA_KY) {
            this.listBbDaKy.push(item)
          }
        })
      }
      console.log("1", this.formData.value)
      await this.bindingDataQd(data.idQdGiaoNvNh);
      if (data.ppLayMau) {
        const dspplayMau = data.ppLayMau.split(",").map(f => ({ id: f.split("-")[0], giaTri: f.split("-")[1] }))
        this.phuongPhapLayMaus = this.phuongPhapLayMaus.map(pp => {
          return {
            ...pp,
            checked: !!dspplayMau.find(check => Number(check.id) == pp.id)
          }
        })
      }
      if (data.chiTieuKiemTra) {
        const dschiTieuKiemTra = data.chiTieuKiemTra.split(",").map(f => ({ id: f.split("-")[0], giaTri: f.split("-")[1] }))
        this.chiTieuChatLuongs = this.chiTieuChatLuongs.map(pp => {
          return {
            ...pp,
            checked: !!dschiTieuKiemTra.find(check => Number(check.id) == pp.id)
          }
        })
      }
    }
    else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide()

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
    this.listDaiDien = [];
    let tcdd = await this.danhMucService.danhMucChungGetAll("TO_CHUC_DAI_DIEN");
    if (tcdd.msg == MESSAGE.SUCCESS) {
      this.listDaiDien = tcdd.data;
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "denNgayQd": null,
      "loaiQd": "",
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.typeVthh,
      "namNhap": null,
      "ngayQd": "",
      "orderBy": "",
      "orderDirection": "",
      "paggingReq": {
        "limit": 1000,
        "orderBy": "",
        "orderType": "",
        "page": 0
      },
      "soHd": "",
      "soQd": null,
      "str": "",
      "trangThai": this.globals.prop.NHAP_BAN_HANH,
      "tuNgayQd": null,
      "veViec": null
    }
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng DTQG'],
        dataColumn: ['soQd', 'ngayQd', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNvNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQdinh,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      loaiQd: data.loaiQd,
      moTaHangHoa: data.moTaHangHoa,
      soHd: data.soHd,
      // ngayHd: data.hopDong.ngayKyHd,
      // donGiaHd: data.hopDong.donGia
    });
    console.log("2", this.formData.value)
    let dataChiCuc = data.hhQdGiaoNvNhangDtlList.filter(item => item.maDvi.includes(this.userInfo.MA_DVI))[0];
    // this.listDiaDiemNhap = dataChiCuc.hhQdGiaoNvNhDdiemList.filter(item => !isEmpty(item.bienBanNhapDayKho) && isEmpty(item.bienBanLayMau));
    if (dataChiCuc) {
      this.listDiaDiemNhap = dataChiCuc.children.filter(item => !isEmpty(item.bienBanNhapDayKho) && isEmpty(item.bienBanLayMau));
    }
    await this.loadPhuongPhapLayMau(data.cloaiVthh);
    await this.loadChiTieuChatLuongs(data.cloaiVthh);
    await this.loadChiTieuCl();
    await this.spinner.hide();
  }

  async loadChiTieuChatLuongs(cloaiVthh: string) {
    if (cloaiVthh) {
      const res = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh);
      if (res?.msg === MESSAGE.SUCCESS) {
        this.chiTieuChatLuongs = Array.isArray(res.data) ? res.data.map((f) => ({
          id: f.id, giaTri: (f.tenChiTieu || "") + " " + (f.mucYeuCauNhap || ""), checked: true
        })) : []
      }
    }
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
          soBbNhapDayKho: data.bienBanNhapDayKho[0]?.soBbNhapDayKho,
          idBbNhapDayKho: data.bienBanNhapDayKho[0]?.id,
          ngayKetThucNhap: data.bienBanNhapDayKho[0]?.ngayKthucNhap,
          soBangKe: data.bienBanNhapDayKho[0]?.soBangKe,
        });
        this.tenNganLoKho = data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho;
        console.log(data.bienBanNhapDayKho[0]?.ngayKthucNhap, 888888);
        console.log(this.formData.value.ngayKetThucNhap, 6666);

      }
    });
  }

  getNameFile($event: any) {
    if ($event.target.files) {
      const itemFile = {
        name: $event.target.files[0].name,
        file: $event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKemQd = new FileDinhKem();
          fileDinhKemQd.fileName = resUpload.filename;
          fileDinhKemQd.fileSize = resUpload.size;
          fileDinhKemQd.fileUrl = resUpload.url;
          fileDinhKemQd.idVirtual = new Date().getTime();
          this.formData.patchValue({ fileDinhKem: fileDinhKemQd, fileName: itemFile.name })
        });
    }
  }

  // async loadPhuongPhapLayMau() {
  //   this.danhMucService.loadDanhMucHangChiTiet(this.formData.value.cloaiVthh).then(res => {
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       if (res.data && res.data.ppLayMau && res.data.ppLayMau.length > 0) {
  //         let ppLayMauOptions = [];
  //         res.data.ppLayMau.forEach(item => {
  //           let option = {
  //             label: item.giaTri,
  //             value: item.ma,
  //             checked: false
  //           }
  //           ppLayMauOptions.push(option);
  //           if(this.formData.value.ppLayMau != null){
  //             ppLayMauOptions.find(x => x.value == this.formData.value.ppLayMau) ? ppLayMauOptions.find(x => x.value == this.formData.value.ppLayMau).checked = true : ppLayMauOptions;
  //           }
  //           console.log(ppLayMauOptions)
  //           this.formData.patchValue({
  //             ppLayMauList: ppLayMauOptions,
  //           })
  //         });
  //       }
  //     } else {
  //       this.notification.error(MESSAGE.ERROR, res.msg);
  //     }
  //   }).catch(err => {
  //     this.notification.error(MESSAGE.ERROR, err.msg);
  //   })
  // }

  handleChange(selectedValues: any): void {
    if(selectedValues != undefined){
      console.log('Các giá trị đã chọn:', selectedValues);
      if(selectedValues.checked == true){
        this.formData.patchValue({
          ppLayMau: selectedValues.value
        })
      }
    }
  }

  async loadChiTieuCl() {
    this.bienBanLayMauServive.getQuyChuanTheoCloaiVthh(this.formData.value.cloaiVthh).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          let chiTieuClOptions = [];
          res.data.forEach(item => {
            let option = {
              label: item.tenChiTieu,
              value: item.id,
              checked: true
            }
            chiTieuClOptions.push(option);
            this.formData.patchValue({
              chiTieuKiemTraList: chiTieuClOptions,
            })
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  async suaDaiDien(i) {
    this.viewTableDaiDien[i].edit = true;
    this.daiDienRowEdit[i] = cloneDeep(this.viewTableDaiDien[i])
  }

  async luuDaiDien(i) {
    if (this.daiDienRowEdit[i].daiDien && this.daiDienRowEdit[i].loaiDaiDien) {
      this.daiDienRowEdit[i].tenLoaiDaiDien = this.listDaiDien.find(e => e.ma == this.daiDienRowEdit[i].loaiDaiDien)?.giaTri
      this.viewTableDaiDien[i] = cloneDeep(this.daiDienRowEdit[i])
      this.viewTableDaiDien[i].edit = false;
    }
  }

  async huySuaDaiDien(i) {
    this.viewTableDaiDien[i].edit = false;
  }

  async xoaDaiDien(i) {
    this.viewTableDaiDien.splice(i, 1)
  }

  async nhapLaiDaiDien() {
    this.daiDienRow = {};
  }

  async themDaiDien() {
    if (this.daiDienRow.daiDien && this.daiDienRow.loaiDaiDien) {
      this.daiDienRow.tenLoaiDaiDien = this.listDaiDien.find(i => i.ma == this.daiDienRow.loaiDaiDien)?.giaTri
      this.viewTableDaiDien = [...this.viewTableDaiDien, this.daiDienRow];
      this.daiDienRow = {};
    }
  }


}
