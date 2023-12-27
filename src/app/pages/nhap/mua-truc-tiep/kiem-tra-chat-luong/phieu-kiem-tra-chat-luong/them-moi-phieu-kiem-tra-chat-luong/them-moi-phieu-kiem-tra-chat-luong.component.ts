import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogThemBienbanNghiemThuKeLotComponent } from 'src/app/components/dialog/dialog-them-bien-ban-nghiem-thu-ke-lot/dialog-them-bien-ban-nghiem-thu-ke-lot.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { MttPhieuKiemTraChatLuongService } from './../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttPhieuKiemTraChatLuongService.service';
import { BaseComponent } from './../../../../../../components/base/base.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './../../../../../../services/storage.service';
import { QuyetDinhGiaoNvNhapHangService } from './../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from './../../../../../../components/base2/base2.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UploadFileService } from './../../../../../../services/uploaFile.service';
import { FILETYPE } from "../../../../../../constants/fileType";
@Component({
  selector: 'app-them-moi-phieu-kiem-tra-chat-luong',
  templateUrl: './them-moi-phieu-kiem-tra-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-tra-chat-luong.component.scss']
})
export class ThemMoiPhieuKiemTraChatLuongComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() isTatCa: boolean;
  @Input() typeVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  detail: any = {};
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listTieuChuan: any[] = [];
  listSoQuyetDinh: any[] = [];
  listHopDong: any[] = [];
  dataTableChiTieu: any[] = [];
  listDiaDiemNhap: any[] = [];
  listFileDinhKem: FileDinhKem[] = [];
  listFileDinhKemKTCL: FileDinhKem[] = [];
  listFile: any[] = [];
  previewName: string = 'ntt_phieu_kiem_tra_chat_luong';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKtraCluongService: MttPhieuKiemTraChatLuongService,
    public globals: Globals,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKtraCluongService);

    this.formData = this.fb.group(
      {
        id: [],
        namKh: dayjs().get('year'),
        maDvi: ['',],
        maQhns: ['',],
        tenDvi: ['',],
        idQdGiaoNvNh: ['',],
        soQdGiaoNvNh: [, [Validators.required]],
        ngayQdGiaoNvNh: ['',],
        soPhieu: ['', [Validators.required]],
        ngayTao: [dayjs().format('YYYY-MM-DD')],
        ktvBaoQuan: [''],
        loaiVthh: ['',],
        tenLoaiVthh: ['',],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        soHd: [''],
        soBb: [''],
        ngayHd: [null,],

        idDdiemGiaoNvNh: [, [Validators.required]],
        maDiemKho: ['', [Validators.required]],
        tenDiemKho: ['', [Validators.required]],
        maNhaKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        maNganKho: ['', [Validators.required]],
        tenNganKho: ['', [Validators.required]],
        maLoKho: [''],
        tenLoKho: [''],
        soLuongQdGiaoNvNh: [''],
        soLuongDaNhap: [''],
        nguoiGiaoHang: ['', [Validators.required]],
        cmtNguoiGiaoHang: ['',],
        donViGiaoHang: ['', [Validators.required]],
        diaChi: ['',],
        bienSoXe: ['',],
        soLuongDeNghiKt: ['',],
        soLuong: [''],
        soLuongNhapKho: ['',],
        soChungThuGiamDinh: ['',],
        ngayGdinh: ['',],
        slTtKtra: ['',],
        slKhKb: ['',],
        tchucGdinh: ['',],
        fileDinhKem: [FileDinhKem],
        ketLuan: [],
        kqDanhGia: [],
        ldoTuChoi: [''],
        trangThai: [],
        tenTrangThai: [],
        tenNganLoKho: [],
        soBangKe: [],
        loaiQd: [],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      super.ngOnInit();
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadTieuChuan(),
        this.loadSoQuyetDinh(),
      ]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        await this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let res = await this.userService.getId("HH_PHIEU_KT_CHAT_LUONG_SEQ");
    this.formData.patchValue({
      soPhieu: `${res}/${this.formData.get('namKh').value}/KTCL-CCDTKVVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      ktvBaoQuan: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh, true);
    }
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.typeVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('namKh').value
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
      ngayQdGiaoNvNh: data.ngayQd,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      soHd: data.soHd,
      loaiQd: data.loaiQd,
    });
    let dataChiCuc = data.hhQdGiaoNvNhangDtlList.filter(item => item.maDvi.includes(this.userInfo.MA_DVI));
    if (dataChiCuc.length > 0) {
      console.log(dataChiCuc[0].children.filter(x => x.maDiemKho.includes(this.userInfo.MA_DVI)))
      this.listDiaDiemNhap = dataChiCuc[0].children.filter(x => x.maDiemKho.includes(this.userInfo.MA_DVI));
    }
    if (isSetTc) {
      let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
      if (dmTieuChuan.data) {
        this.dataTableChiTieu = dmTieuChuan.data.children;
        this.dataTableChiTieu.forEach(element => {
          element.edit = false
        });
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
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'SL theo QĐ giao NV NH'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      console.log(data)
      let soLuongNhap = await this.phieuKtraCluongService.getSoLuongNhap({ "idDdiemGiaoNvNh": data.id });
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
        soLuong: data.soLuong * 1000,
        soLuongQdGiaoNvNh: data.soLuong * 1000,
        soBb: data.listBienBanNghiemThuBq.find(item => item.id === Math.min(...data.listBienBanNghiemThuBq.map(item => item.id))).soBb,
        soBangKe: data.listBienBanNghiemThuBq.find(item => item.id === Math.min(...data.listBienBanNghiemThuBq.map(item => item.id))).soBangKe,
        tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
        soLuongDaNhap: soLuongNhap.data
      })
    }
  }

  async loadTieuChuan() {
    let body = {
      "maHang": this.typeVthh,
      "namQchuan": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenQchuan": null,
      "trangThai": "01"
    }
    let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content.length > 0) {
        if (res.data.content[0].children && res.data.content[0].children.length > 0) {
          this.listTieuChuan = res.data.content[0].children;
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeChiTieu(item) {
    if (item) {
      let getChiTieu = this.listTieuChuan.filter(x => x.tenTchuan == item.tenChiTieu);
      if (getChiTieu && getChiTieu.length > 0) {
        item.tieuChuan = getChiTieu[0].chiSoNhap;
        item.phuongPhapXacDinh = getChiTieu[0].phuongPhap;
      }
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.phieuKtraCluongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          console.log(data)
          this.dataTableChiTieu = data.phieuKiemTraChatLuongDtlList;
          this.dataTableChiTieu.forEach(e => {
            e.tenTchuan = e.chiTieuCl;
            e.chiSoNhap = e.chiSoCl;
            e.ketQuaKiemTra = e.ketQuaPt
          });
          this.helperService.bidingDataInFormGroup(this.formData, data);
          await this.bindingDataQd(data.idQdGiaoNvNh);
          if (data.fileDinhKems.length > 0) {
            data.fileDinhKems.forEach(item => {
              if (item.fileType == FILETYPE.FILE_DINH_KEM) {
                this.listFileDinhKem.push(item)
              } else if (item.fileType == FILETYPE.FILE_DINH_KEM_KTCL) {
                this.listFileDinhKemKTCL.push(item)
              }
            })
          }
          let dataDdiem = this.listDiaDiemNhap.filter(item => item.id == data.idDdiemGiaoNvNh)[0];
          await this.bindingDataDdNhap(dataDdiem);
        }
      }
    }
    this.updateEditCache();
  }

  async save(isGuiDuyet: boolean) {
    if (this.validateSave()) {
      await this.spinner.show();

      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      this.listFile = [];
      if (this.listFileDinhKem.length > 0) {
        this.listFileDinhKem.forEach(item => {
          item.fileType = FILETYPE.FILE_DINH_KEM
          this.listFile.push(item)
        })
      }
      if (this.listFileDinhKemKTCL.length > 0) {
        this.listFileDinhKemKTCL.forEach(element => {
          element.fileType = FILETYPE.FILE_DINH_KEM_KTCL
          this.listFile.push(element)
        })
      }
      if (this.listFile && this.listFile.length > 0) {
        body.fileDinhKems = this.listFile;
      }
      body.phieuKiemTraChatLuongDtlList = this.dataTableChiTieu;
      body.phieuKiemTraChatLuongDtlList.forEach(e => {
        e.chiTieuCl = e.tenTchuan;
        e.chiSoCl = e.chiSoNhap;
        e.ketQuaPt = e.ketQuaKiemTra
      });
      let res;
      if (this.formData.get('id').value > 0) {
        res = await this.phieuKtraCluongService.update(body);
      } else {
        res = await this.phieuKtraCluongService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (isGuiDuyet) {
          await this.spinner.hide();
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
          await this.spinner.hide();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        await this.spinner.hide();
      }
    }
  }

  validateSave() {
    let soLuongConLai = this.formData.value.soLuongQdGiaoNvNh - this.formData.value.soLuongDaNhap
    if (this.formData.value.soLuongNhapKho > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng nhập hàng vượt quá số lượng còn trống, xin vui lòng nhập lại")
      return false;
    }
    return true
  }

  pheDuyet() {
    let trangThai = ''
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        mess = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
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
            trangThai: trangThai
          };
          let res =
            await this.phieuKtraCluongService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
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
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          let res =
            await this.phieuKtraCluongService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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
      }
    });
  }

  back() {
    this.showListEvent.emit();
  }

  themBienBanNgiemThuKeLot() {
    const modalLuongThuc = this.modal.create({
      nzTitle: 'Thêm mới thông tin chi tiết',
      nzContent: DialogThemBienbanNghiemThuKeLotComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalLuongThuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  deleteRow(data: any) {
    this.detail.phieuKiemTraChatLuongDtlList = this.detail?.phieuKiemTraChatLuongDtlList.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
  }

  addRow() {
    if (!this.detail?.phieuKiemTraChatLuongDtlList) {
      this.detail.phieuKiemTraChatLuongDtlList = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.create);
    item.stt = this.detail?.phieuKiemTraChatLuongDtlList.length + 1;
    this.detail.phieuKiemTraChatLuongDtlList = [
      ...this.detail?.phieuKiemTraChatLuongDtlList,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.create = {};
  }

  updateEditCache(): void {
    if (this.detail?.phieuKiemTraChatLuongDtlList && this.detail?.phieuKiemTraChatLuongDtlList.length > 0) {
      this.detail?.phieuKiemTraChatLuongDtlList.forEach((item) => {
        this.editDataCache[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  sortTableId() {
    this.detail?.phieuKiemTraChatLuongDtlList.forEach((lt, i) => {
      lt.stt = i + 1;
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


}
