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
import { DialogTableSelectionComponent } from './../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component';
import { UploadFileService } from './../../../../../../services/uploaFile.service';
import { DialogTuChoiComponent } from './../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { PhuongPhapLayMau } from './../../../../../../models/PhuongPhapLayMau';
import { isEmpty, cloneDeep } from 'lodash';
import { MttBienBanLayMauService } from './../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttBienBanLayMauService.service';
import { DanhMucTieuChuanService } from './../../../../../../services/quantri-danhmuc/danhMucTieuChuan.service';
import { KetQuaKiemNghiemChatLuongHang, PhieuKiemNghiemChatLuongHang } from './../../../../../../models/PhieuKiemNghiemChatLuongThoc';
import { MttPhieuKiemNghiemChatLuongService } from './../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttPhieuKiemNghiemChatLuongService.service';
import {FILETYPE} from "../../../../../../constants/fileType";
import {FileDinhKem} from "../../../../../../models/FileDinhKem";

@Component({
  selector: 'app-them-moi-phieu-kiem-nghiem-chat-luong',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong.component.scss']
})
export class ThemMoiPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
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

  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  listBbNhapDayKho: any[] = [];
  radioValue: any;
  checked: boolean = false;
  listBbBanGiaoMau: any = [];
  dataTableChiTieu: any = [];
  listHinhThucBaoQuan: any[] = [];
  listFileDinhKemKTCL: FileDinhKem[] = [];
  maVthh: string;

  phieuKiemNghiemChatLuongHang: PhieuKiemNghiemChatLuongHang =
    new PhieuKiemNghiemChatLuongHang();
  viewChiTiet: boolean = false;
  ketQuaKiemNghiemHangCreate: KetQuaKiemNghiemChatLuongHang =
    new KetQuaKiemNghiemChatLuongHang();
  dsKetQuaKiemNghiemHangClone: Array<KetQuaKiemNghiemChatLuongHang> = [];
  isChiTiet: boolean = false;
  listTieuChuan: any[] = [];
  isValid = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private bienBanLayMauServive: MttBienBanLayMauService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private phieuKiemNghiemChatLuongService: MttPhieuKiemNghiemChatLuongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongService);
    this.formData = this.fb.group({

      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      namKh: [dayjs().get('year'), [Validators.required]],
      soPhieuKiemNghiemCl: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maDvi: ['', [Validators.required]],
      maQhns: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      idDdiemGiaoNvNh: [''],
      soQdGiaoNvNh: ['', [Validators.required]],
      idQdGiaoNvNh: ['', [Validators.required]],
      soHd: [''],
      ngayHd: [''],
      ngayLayMau: [''],
      soLuongNhapDayKho: [''],
      ngayNhapDayKho: [''],

      soBbNhapDayKho: [''],

      soBbLayMau: [''],
      tenThuKho: [''],
      tenNguoiKiemNghiem: [''],
      tenTruongPhong: [''],

      ketQuaDanhGia: [],
      ketLuan: [],

      ngayTao: [dayjs().format('YYYY-MM-DD')],
      tenKyThuatVien: [''],
      ngayKnghiem: [''],
      hthucBquan: [''],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadBbLayMau(),
        this.loadDanhMucPhuongThucBaoQuan(),
        this.loadTieuChuan(),
      ]);
      if (this.id) {
        await this.getDetail(this.id);
      }
      else {
        await this.initForm();
      }
      this.isValid =
        !!this.phieuKiemNghiemChatLuongHang.bbBanGiaoMauId &&
        !!this.phieuKiemNghiemChatLuongHang.qdgnvnxId;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // isDisableField() {
  //   if (this.bienBanLayMau && (this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
  //     return true;
  //   }
  // }

  async initForm() {
    let id = await this.userService.getId('HH_PHIEU_KN_CLUONG_SEQ')
    this.formData.patchValue({
      soPhieuKiemNghiemCl: `${id}/${this.formData.get('namKh').value}/PKNCL-CDTVP`,
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      tenKyThuatVien: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',

    });
  }

  async getDetail(id: number) {
    this.spinner.show()
    let res = await this.phieuKiemNghiemChatLuongService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        const data = res.data;
        data.tenDvi = this.userInfo.TEN_DVI;
        this.helperService.bidingDataInFormGroup(this.formData, data);
        if(data.fileDinhKems.length > 0){
          data.fileDinhKems.forEach(item => {
            this.listFileDinhKemKTCL.push(item)
          })
        }
        this.bindingDataBbLayMau(data, true);
        this.dataTableChiTieu = data.hhPhieuKnCluongDtlList;
        this.dataTableChiTieu.forEach(e => {
          e.tenTchuan = e.ctieuCl;
          e.chiSoNhap = e.soCtieuCl;
          e.ketQuaKiemTra = e.ketQuaPt
        });
      }
    }
  }


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
        let body = this.formData.value;
        body.fileDinhKems = this.listFileDinhKemKTCL;
        body.bbanLayMauDtlList = [...this.listDaiDienChiCuc, ...this.listDaiDienCuc];
        body.phieuKnCluongDtlReqList = this.dataTableChiTieu;
        body.phieuKnCluongDtlReqList.forEach(e => {
          e.ctieuCl = e.tenTchuan;
          e.soCtieuCl = e.chiSoNhap;
          e.ketQuaPt = e.ketQuaKiemTra
        });
        let res;
        if (this.formData.get('id').value > 0) {
          res = await this.phieuKiemNghiemChatLuongService.update(body);
        } else {
          res = await this.phieuKiemNghiemChatLuongService.create(body);
        }
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            this.spinner.hide();
            this.id = res.data.id;
            this.pheDuyet();
          } else {
            if (this.formData.get('id').value) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
              this.back();
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.back();
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
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        mess = 'Bạn có muối gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        mess = 'Bạn có muối gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mess,
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
          const res = await this.phieuKiemNghiemChatLuongService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.back();
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
            trangThai: "",
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.TU_CHOI_TP;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.TU_CHOI_LDC;
              break;
            }
          }
          const res = await this.phieuKiemNghiemChatLuongService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.back();
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
        this.back();
      },
    });
  }

  back() {
    this.showListEvent.emit();
  };


  async loadBbLayMau() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      paggingReq: {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      loaiVthh: this.loaiVthh,
    }
    let res = await this.bienBanLayMauServive.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listBbBanGiaoMau = res.data.content
      }
    }
  }
  openDialogBbLayMau() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản lấy mẫu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBbBanGiaoMau,
        dataHeader: ['Số biên bản', 'Số biên bản nhập đầy kho', 'Số QĐ Giao NV NH'],
        dataColumn: ['soBienBan', 'soBbNhapDayKho', 'soQdGiaoNvNh']
      },
    });

    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataBbLayMau(data, false);
      }
    });

  }

  async bindingDataBbLayMau(id, isChiTiet) {
    let res = await this.bienBanLayMauServive.getDetailBySoQd(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.formData.patchValue({
        soBbLayMau: data.soBienBan,
        soBbNhapDayKho: data.soBbNhapDayKho,
        soQdGiaoNvNh: data.soQdGiaoNvNh,
        idQdGiaoNvNh: data.idQdGiaoNvNh,
        ngayLayMau: data.ngayLayMau,
        idDdiemGiaoNvNh: data.idDdiemGiaoNvNh,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.tenCloaiVthh,
        soLuongNhapDayKho: data.bbNhapDayKho.tongSoLuongNhap,
        ngayNhapDayKho: data.bbNhapDayKho.ngayKthucNhap,
        tenThuKho: data.bbNhapDayKho.nguoiTao,
        tenKyThuatVien: this.userInfo.TEN_DAY_DU,
      })
      if (!isChiTiet) {
        let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
        if (dmTieuChuan.data) {
          this.dataTableChiTieu = dmTieuChuan.data.children;
          this.dataTableChiTieu.forEach(element => {
            element.edit = false
          });
        }
      }
    }
  }
  async loadDanhMucPhuongThucBaoQuan() {
    let body = {
      maHthuc: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenHthuc: null,
      trangThai: null,
    };
    let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
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

  async loadTieuChuan() {
    let body = {
      maHang: this.maVthh,
      namQchuan: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenQchuan: null,
      trangThai: '01',
    };
    let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content.length > 0) {
        if (
          res.data.content[0].children &&
          res.data.content[0].children.length > 0
        ) {
          this.listTieuChuan = res.data.content[0].children;
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  startEdit(index: number) {
    this.dsKetQuaKiemNghiemHangClone[index].isEdit = true;
  }

  deleteData(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.phieuKiemNghiemChatLuongHang.kquaKnghiem =
          this.phieuKiemNghiemChatLuongHang?.kquaKnghiem.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.phieuKiemNghiemChatLuongHang?.kquaKnghiem.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsKetQuaKiemNghiemHangClone = cloneDeep(
          this.phieuKiemNghiemChatLuongHang.kquaKnghiem,
        );
        // this.loadData();
      },
    });
  }

  saveEditPhieuKiemNghiem(i: number): void {
    this.dsKetQuaKiemNghiemHangClone[i].isEdit = false;
    Object.assign(
      this.phieuKiemNghiemChatLuongHang.kquaKnghiem[i],
      this.dsKetQuaKiemNghiemHangClone[i],
    );
  }

  cancelEditPhieuKiemNghiem(index: number) {
    this.dsKetQuaKiemNghiemHangClone = cloneDeep(
      this.phieuKiemNghiemChatLuongHang.kquaKnghiem,
    );
    this.dsKetQuaKiemNghiemHangClone[index].isEdit = false;
  }

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
  }
}
