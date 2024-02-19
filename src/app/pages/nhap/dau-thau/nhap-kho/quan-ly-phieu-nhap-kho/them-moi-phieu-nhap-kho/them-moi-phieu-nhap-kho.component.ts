import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyPhieuNhapKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { isEmpty } from 'lodash';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import { saveAs } from "file-saver";


@Component({
  selector: 'them-moi-phieu-nhap-kho',
  templateUrl: './them-moi-phieu-nhap-kho.component.html',
  styleUrls: ['./them-moi-phieu-nhap-kho.component.scss'],
})
export class ThemMoiPhieuNhapKhoComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Input() isTatCa: boolean;
  @Input() idQdGiaoNvNh: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuKtraCl: any[] = [];

  taiLieuDinhKemList: any[] = [];
  chungTuKemTheo: any[] = [];
  fileDinhKems: any[] = [];
  dataTable: any[] = [];
  previewName: string;
  templateName = "8.C20a-HD_Phiếu nhập kho";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyPhieuNhapKhoService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      maQhns: ['',],
      tenDvi: ['', [Validators.required]],

      soPhieuNhapKho: [],
      ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      soNo: [],
      soCo: [],

      soQdGiaoNvNh: [],
      idQdGiaoNvNh: [],

      soHd: [''],
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
      soPhieuKtraCl: ['', [Validators.required]],
      soBienBanGuiHang: ['', [Validators.required]],
      nguoiTaoPhieuKtraCl: [''],
      loaiVthh: ['',],
      tenLoaiVthh: ['',],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tenNguoiTao: [''],
      tenNguoiPduyet: [''],
      keToanTruong: [''],
      nguoiGiaoHang: [''],
      cmtNguoiGiaoHang: [''],
      donViGiaoHang: [''],
      diaChiNguoiGiao: [''],
      thoiGianGiaoNhan: [''],
      ghiChu: [''],

      soBangKeCanHang: [''],
      trangThaiBkch: [''],

      trangThai: [],
      tenTrangThai: [],
      lyDoTuChoi: [],
      donGiaHd: [],
      loaiHinhNx: 'Mua đấu thầu',
      kieuNx: 'Nhập mua',
      dviCungCap: [],
      ngayQdGiaoNvNh: [],
      tenNganLoKho: [],
      tenThuKho: [],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      super.ngOnInit();
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        // this.loadSoQuyetDinh(),
      ]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let maBb = 'PNK-' + this.userInfo.DON_VI.tenVietTat;
    let res = await this.userService.getId("PHIEU_NHAP_KHO_SEQ");
    this.formData.patchValue({
      soPhieuNhapKho: `${res}/${this.formData.get('nam').value}/${maBb}`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenNguoiTao: this.userInfo.TEN_DAY_DU
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh);
    }
  }

  isDisableField() {
    // if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
    //   return true;
    // }
  }

  async loadSoQuyetDinh() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.loaiVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value,
      "loaiVthh": this.loaiVthh
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    await this.loadSoQuyetDinh()
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
      thoiGianGiaoNhan: data.tgianNkho,
      ngayHd: data.hopDong?.ngayKy,
      donGiaHd: data.hopDong?.donGia,
      dviCungCap: data.hopDong?.tenNhaThau,
    });
    let dataChiCuc;
    if (this.userService.isChiCuc()) {
      dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
    } else {
      dataChiCuc = data.dtlList
    }
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].children;
      this.listDiaDiemNhap = this.listDiaDiemNhap.filter(item => isEmpty(item.phieuNhapKho));
    }
    if (this.loaiVthh.startsWith('02')) {
      this.listDiaDiemNhap.forEach(item => {
        if (item.bienBanGuiHang != null) {
          item.soBienBanGuiHang = item.bienBanGuiHang.soBienBanGuiHang
        }
      })
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
      await this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      this.dataTable = [];
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
        tenNganLoKho: data.tenLoKho ? data.tenLoKho + " - " + data.tenNganKho : data.tenNganKho,
      });
      if (this.loaiVthh.startsWith('02')) {
        this.formData.patchValue({
          nguoiTaoPhieuKtraCl: data.bienBanGuiHang.tenNguoiTao,
          soBienBanGuiHang: data.bienBanGuiHang.soBienBanGuiHang,
        });
      } else {
        // this.listPhieuKtraCl = [];
        // this.listPhieuKtraCl = data.listPhieuKtraCl.filter(item => (item.trangThai == STATUS.DA_DUYET_LDCC && isEmpty(item.phieuNhapKho)));
        this.formData.patchValue({
          soPhieuKtraCl: data.listPhieuKtraCl[0]?.soPhieu,
          tenThuKho: data.listBbNtbqld?.find(item => item.id === Math.min(...data.listBbNtbqld?.map(item => item.id)))?.tenThuKho,
        });
      }
      let dataObj = {
        moTaHangHoa: this.loaiVthh.startsWith('02') ? (this.formData.value.tenCloaiVthh ? this.formData.value.tenCloaiVthh : this.formData.value.tenLoaiVthh) : (this.formData.value.moTaHangHoa ? this.formData.value.moTaHangHoa : this.formData.value.tenCloaiVthh),
        maSo: '',
        donViTinh: this.loaiVthh.startsWith('02') ? '' : 'kg',
        soLuongChungTu: 0,
        soLuongThucNhap: 0,
        donGia: this.formData.value.donGiaHd
      }
      this.dataTable.push(dataObj)
    }
  }
  openDialogPhieuKtraCl() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách phiếu kiểm tra chất lượng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listPhieuKtraCl,
        dataHeader: ['Số phiếu', 'Ngày giám định'],
        dataColumn: ['soPhieu', 'ngayGdinh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soPhieuKtraCl: data.soPhieu,
          nguoiTaoPhieuKtraCl: data.tenNguoiTao,
        });
        this.dataTable[0].soLuongThucNhap = data.soLuongNhapKho;
      }
    });
  }

  async loadChiTiet(id) {
    let res = await this.quanLyPhieuNhapKhoService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        const data = res.data;
        this.fileDinhKems = data.fileDinhKems;
        this.chungTuKemTheo = data.chungTuKemTheo;
        this.helperService.bidingDataInFormGroup(this.formData, data);
        if (this.loaiVthh.startsWith('02')) {
          this.formData.patchValue({
            soBangKeCanHang: data.bangKeVt?.soBangKe,
            trangThaiBkch: data.bangKeVt?.trangThai
          })
        } else {
          this.formData.patchValue({
            soBangKeCanHang: data.bangKeCanHang?.soBangKe,
            trangThaiBkch: data.bangKeCanHang?.trangThai
          })
        }
        await this.bindingDataQd(res.data?.idQdGiaoNvNh);
        let dataDdNhap = this.listDiaDiemNhap.filter(item => item.id == res.data.idDdiemGiaoNvNh)[0];
        await this.bindingDataDdNhap(dataDdNhap);
        this.dataTable = data.hangHoaList;
      }
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  pheDuyet() {
    if (this.formData.value.soBangKeCanHang == null || this.formData.value.trangThaiBkch != this.STATUS.DA_DUYET_LDCC) {
      if (this.loaiVthh.startsWith('02')) {
        this.notification.error(MESSAGE.ERROR, "Bạn cần tạo và phê duyệt bảng kê nhập vật tư trước.")
      } else {
        this.notification.error(MESSAGE.ERROR, "Bạn cần tạo và phê duyệt bảng kê cân hàng trước.")
      }
      return;
    }
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
      nzWidth: 500,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: trangThai,
          };
          let res =
            await this.quanLyPhieuNhapKhoService.approve(
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
            lyDoTuChoi: text,
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          let res =
            await this.quanLyPhieuNhapKhoService.approve(
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

  async save(isGuiDuyet: boolean) {
    await this.spinner.show();
    try {
      this.setValidator();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        await this.spinner.hide();
        return;
      }
      let pipe = new DatePipe('en-US');
      let body = this.formData.value;
      body.hangHoaList = this.dataTable;
      body.thoiGianGiaoNhan = pipe.transform(this.formData.value.thoiGianGiaoNhan, 'yyyy-MM-dd HH:mm');
      body.fileDinhKems = this.fileDinhKems;
      body.chungTuKemTheo = this.chungTuKemTheo;
      let res;
      if (this.formData.get('id').value > 0) {
        res = await this.quanLyPhieuNhapKhoService.update(body);
      } else {
        res = await this.quanLyPhieuNhapKhoService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (isGuiDuyet) {
          await this.spinner.hide();
          this.id = res.data.id;
          this.pheDuyet();
        } else {
          if (this.formData.get('id').value) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.id = res.data.id;
            this.formData.get('id').setValue(res.data.id)
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          }
          await this.spinner.hide();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        await this.spinner.hide();
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, (e?.error?.message ?? MESSAGE.SYSTEM_ERROR));
      await this.spinner.hide();
    }
  }

  setValidator() {
    if (this.loaiVthh == '02') {
      this.formData.controls["soPhieuKtraCl"].clearValidators();
      this.formData.controls["soBienBanGuiHang"].setValidators([Validators.required]);

    } else {
      this.formData.controls["soPhieuKtraCl"].setValidators([Validators.required]);
      this.formData.controls["soBienBanGuiHang"].clearValidators();
    }
  }

  print() {

  }

  clearItemRow(i) {
    this.dataTable[i] = {};
  }

  async preview() {
    if (this.loaiVthh.startsWith('02')) {
      this.previewName = 'phieu_nhap_kho_dau_thau_lt';
    } else {
      this.previewName = 'phieu_nhap_kho';
    }
    let body = this.formData.value;
    body.reportTemplateRequest = this.reportTemplate;
    await this.quanLyPhieuNhapKhoService.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }

  openDialogSoBbGuiHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Số biên bản tạm giao, nhận hàng'],
        dataColumn: ['soBienBanGuiHang']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      await this.bindingDataDdNhap(data);
    });
  }
}
