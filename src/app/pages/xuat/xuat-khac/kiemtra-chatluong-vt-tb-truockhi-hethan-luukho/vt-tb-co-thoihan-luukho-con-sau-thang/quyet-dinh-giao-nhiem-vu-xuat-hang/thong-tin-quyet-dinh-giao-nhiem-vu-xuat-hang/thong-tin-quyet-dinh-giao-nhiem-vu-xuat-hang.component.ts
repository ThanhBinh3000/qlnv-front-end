import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from '../../../../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DonviService } from '../../../../../../../services/donvi.service';
import { DanhMucService } from '../../../../../../../services/danhmuc.service';
import { v4 as uuidv4 } from 'uuid';
import { chain, cloneDeep, isEmpty } from 'lodash';
import { saveAs } from 'file-saver';
import {
  QuyetDinhGiaoNvXuatHangService,
} from '../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service';
import { Validators } from '@angular/forms';
import { STATUS } from '../../../../../../../constants/status';
import {
  DialogTableSelectionComponent,
} from '../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component';
import { MESSAGE } from '../../../../../../../constants/message';
import { LOAI_HH_XUAT_KHAC } from '../../../../../../../constants/config';
import {
  TongHopDanhSachVttbService,
} from '../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/TongHopDanhSachVttb.service';
import { FILETYPE, PREVIEW } from '../../../../../../../constants/fileType';
import { KeHoachLuongThuc } from '../../../../../../../models/KeHoachLuongThuc';
import { DialogTuChoiComponent } from '../../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {
  QuyetDinhXuatGiamVattuService,
} from '../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhXuatGiamVattu.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-thong-tin-quyet-dinh-giao-nhiem-vu-xuat-hang',
  templateUrl: './thong-tin-quyet-dinh-giao-nhiem-vu-xuat-hang.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-giao-nhiem-vu-xuat-hang.component.scss'],
})
export class ThongTinQuyetDinhGiaoNhiemVuXuatHangComponent extends Base2Component implements OnInit {
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  maQd: string;
  listMaTongHop: any[] = [];
  listQdXuatGiamVt: any[] = [];
  dataTh: any[] = [];
  dataThEdit: any[] = [];
  dataThTree: any[] = [];
  dataThTreeXuatHuy: any[] = [];
  expandSetString = new Set<string>();
  templateName = 'xuat_khac_ktcl_vat_tu_6_thang_qd_giao_nv_xuat_hang';

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private tongHopDanhSachVttbService: TongHopDanhSachVttbService,
              private quyetDinhXuatGiamVattuService: QuyetDinhXuatGiamVattuService,
              private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvXuatHangService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [this.userInfo.MA_DVI],
      loai: ['XUAT_MAU', [Validators.required]],
      namKeHoach: [dayjs().get('year'), [Validators.required]],
      soQuyetDinh: [null, [Validators.required]],
      ngayKy: [],
      soCanCu: [],
      idCanCu: [],
      tenDvi: [],
      thoiHanXuatHang: [],
      lyDoTuChoi: [],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      xhXkVtQdGiaonvXhDtl: [new Array<ItemXhXkVtQdGiaonvXhDtl>()],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = '/' + this.userInfo.MA_QD;
      await Promise.all([
        this.loadDanhSachTongHop(),
        this.loadDanhSachQdXuatGiamVt(),
      ]);
      if (this.idInput) {
        this.getDetail(this.idInput);
      } else {
        this.bindingData();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  openDialogDsTongHop() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listMaTongHop,
        dataHeader: ['Năm', 'Mã danh sách', 'Trạng thái'],
        dataColumn: ['nam', 'maDanhSach', 'tenTrangThai'],
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.formData.patchValue({
          idCanCu: data.id,
          soCanCu: data.maDanhSach,
        });
        this.dataTh = [];
        data.tongHopDtl.forEach(item => {
          let it = new ItemXhXkVtQdGiaonvXhDtl();
          it.id = item.id;
          it.maDiaDiem = item.maDiaDiem;
          it.loaiVthh = item.loaiVthh;
          it.cloaiVthh = item.cloaiVthh;
          it.tenLoaiVthh = item.tenLoaiVthh;
          it.tenCloaiVthh = item.tenCloaiVthh;
          it.donViTinh = item.donViTinh;
          it.tenCuc = item.tenCuc;
          it.tenChiCuc = item.tenChiCuc;
          it.tenDiemKho = item.tenDiemKho;
          it.tenNhaKho = item.tenNhaKho;
          it.tenNganKho = item.tenNganKho;
          it.tenLoKho = item.tenLoKho;
          it.slTonKho = item.slTonKho;
          it.maDviTsan = '';
          it.slLayMau = 0;
          this.dataTh.push(it);
        });
        this.dataTh.forEach((item) => {
          this.dataThEdit[item.id] = { ...item };
        });
        this.buildTableView(this.dataTh, this.formData.get('loai').value);
      }
    });
  }


  openDialogQDXuatGiamVt() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách quyết định xuất giảm vật tư',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdXuatGiamVt,
        dataHeader: ['Năm xuất', 'Số quyết định', 'Trạng thái'],
        dataColumn: ['namKeHoach', 'soQuyetDinh', 'tenTrangThai'],
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.formData.patchValue({
          idCanCu: data.id,
          soCanCu: data.soQuyetDinh,
        });
        this.dataTh = [];
        this.spinner.show();
        try {
          this.quyetDinhXuatGiamVattuService
            .getDetail(data.id)
            .then((res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                console.log(res.data.xhXkVtPhieuXuatNhapKho, 'aaaaaaaaaaaa');
                res.data.xhXkVtPhieuXuatNhapKho.forEach(item => {
                  let it = new ItemXhXkVtQdGiaonvXhDtl();
                  it.id = item.id;
                  it.maDiaDiem = item.maDiaDiem;
                  it.loaiVthh = item.loaiVthh;
                  it.cloaiVthh = item.cloaiVthh;
                  it.donViTinh = item.donViTinh;
                  it.tenLoaiVthh = item.tenLoaiVthh;
                  it.tenCloaiVthh = item.tenCloaiVthh;
                  it.tenCuc = item.tenCuc;
                  it.tenChiCuc = item.tenChiCuc;
                  it.tenDiemKho = item.tenDiemKho;
                  it.tenNhaKho = item.tenNhaKho;
                  it.tenNganKho = item.tenNganKho;
                  it.tenLoKho = item.tenLoKho;
                  it.slTonKho = item.slTonKho;
                  it.maDviTsan = item.maSo;
                  it.slLayMau = item.slLayMau;
                  it.slXuatGiam = item.slThucTe;
                  it.mauBiHuy = true;
                  this.dataTh.push(it);
                });
                this.dataTh.forEach((item) => {
                  this.dataThEdit[item.id] = { ...item };
                });
                this.buildTableView(this.dataTh, this.formData.get('loai').value);
              }
            });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }

      }
    });
  }

  async buildTableView(data: any, loai) {
    if (loai == 'XUAT_MAU') {
      this.dataThTree = chain(data)
        .groupBy('tenChiCuc')
        .map((v, k) => {
            let rowItem = v.find(s => s.tenChiCuc === k);
            let idVirtual = uuidv4();
            this.expandSetString.add(idVirtual);
            return {
              idVirtual: idVirtual,
              tenChiCuc: k,
              tenCuc: rowItem?.tenCuc,
              maDiaDiem: rowItem?.maDiaDiem,
              tenCloaiVthh: rowItem?.tenCloaiVthh,
              tenLoaiVthh: rowItem?.tenLoaiVthh,
              childData: v,
            };
          },
        ).value();
    } else {
      this.dataThTreeXuatHuy = chain(data)
        .groupBy('tenChiCuc')
        .map((v, k) => {
            let rowItem = v.find(s => s.tenChiCuc === k);
            let idVirtual = uuidv4();
            this.expandSetString.add(idVirtual);
            return {
              idVirtual: idVirtual,
              tenChiCuc: k,
              tenCuc: rowItem?.tenCuc,
              maDiaDiem: rowItem?.maDiaDiem,
              tenCloaiVthh: rowItem?.tenCloaiVthh,
              tenLoaiVthh: rowItem?.tenLoaiVthh,
              childData: v,
            };
          },
        ).value();
    }
  }

  async bindingData() {
    let res = await this.donviService.getDonVi({ str: this.userInfo.MA_DVI });
    if (res && res.data) {
      this.formData.patchValue({
        tenDvi: res.data.tenDvi,
      });
    }
  }

  async loadDanhSachTongHop() {
    let body = {
      capTh: this.userInfo.CAP_DVI,
      loai: LOAI_HH_XUAT_KHAC.VT_6_THANG,
      namKeHoach: this.formData.get('namKeHoach').value,
      paggingReq: {
        limit: 1000,
        page: this.page - 1,
      },
    };
    let rs = await this.tongHopDanhSachVttbService.search(body);
    if (rs.msg == MESSAGE.SUCCESS) {
      this.listMaTongHop = rs.data.content;
    }
  }

  async loadDanhSachQdXuatGiamVt() {
    let body = {
      namKeHoach: this.formData.get('namKeHoach').value,
      trangThai: STATUS.BAN_HANH,
      paggingReq: {
        limit: 1000,
        page: this.page - 1,
      },
    };
    let rs = await this.quyetDinhXuatGiamVattuService.search(body);
    if (rs.msg == MESSAGE.SUCCESS) {
      this.listQdXuatGiamVt = rs.data.content;
    }
  }

  changeValueLoai($event) {
    if ($event) {
      this.formData.patchValue({
        soCanCu: null,
        idCanCu: null,
      });
    }
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    this.listFile = [];
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM;
        this.listFile.push(item);
      });
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY;
        this.listFile.push(element);
      });
    }
    if (this.listFile && this.listFile.length > 0) {
      this.formData.value.fileDinhKems = this.listFile;
    }
    this.formData.value.soQuyetDinh = this.formData.value.soQuyetDinh + this.maQd;
    if (this.dataTh && this.dataThEdit) {
      this.dataTh.forEach(item => {
        item.maDviTsan = this.dataThEdit[item.id]?.maDviTsan ? this.dataThEdit[item.id].maDviTsan : null;
        item.slLayMau = this.dataThEdit[item.id]?.slLayMau ? this.dataThEdit[item.id]?.slLayMau : 0;
      });
    }
    this.formData.value.xhXkVtQdGiaonvXhDtl = this.dataTh;
    let data = await this.createUpdate(this.formData.value);
    if (data) {
      if (!this.idInput) {
        this.idInput = data.id;
        this.formData.patchValue({ id: data.id, trangThai: data.trangThai });
      }
      if (isGuiDuyet) {
        this.pheDuyet(this.formData.get('id').value);
      }
    }
  }

  pheDuyet(id?) {
    let trangThai = '';
    let mess = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO:
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC: {
        trangThai = STATUS.CHO_DUYET_TP;
        mess = 'Bạn có muốn gửi duyệt?';
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        mess = 'Bạn có muốn gửi duyệt?';
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn phê duyệt?';
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
            id: id ? id : this.idInput,
            trangThai: trangThai,
          };
          let res =
            await this.quyetDinhGiaoNvXuatHangService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.goBack();
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
          let trangThai;
          switch (this.formData.get('trangThai').value) {
            case STATUS.CHO_DUYET_LDC: {
              trangThai = STATUS.TU_CHOI_LDC;
              break;
            }
            case STATUS.CHO_DUYET_TP: {
              trangThai = STATUS.TU_CHOI_TP;
              break;
            }
          }
          let body = {
            id: this.idInput,
            lyDoTuChoi: text,
            trangThai: trangThai,
          };
          const res = await this.quyetDinhGiaoNvXuatHangService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.goBack();
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

  async getDetail(id: number) {
    console.log(id,"id")
    await this.quyetDinhGiaoNvXuatHangService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
          if (dataDetail) {
            this.formData.patchValue({
              soQuyetDinh: dataDetail.soQuyetDinh?.split('/')[0],
            });
            this.listFile = dataDetail.fileDinhKems;
            if (dataDetail.fileDinhKems && dataDetail.fileDinhKems.length > 0) {
              dataDetail.fileDinhKems.forEach(item => {
                if (item.fileType == FILETYPE.FILE_DINH_KEM) {
                  this.listFileDinhKem.push(item);
                } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
                  this.listCcPhapLy.push(item);
                }
              });
            }
            this.dataTh = cloneDeep(dataDetail.xhXkVtQdGiaonvXhDtl);
            this.dataTh.forEach((item) => {
              this.dataThEdit[item.id] = { ...item };
            });
            this.buildTableView(this.dataTh, dataDetail.loai);
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  async preview(id) {
    this.spinner.show();
    await this.quyetDinhGiaoNvXuatHangService.preview({
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

}

export class ItemXhXkVtQdGiaonvXhDtl {
  id: string;
  maDiaDiem: string;
  loaiVthh: string;
  cloaiVthh: string;
  tenLoaiVthh: string;
  tenCloaiVthh: string;
  donViTinh: string;
  tenCuc: string;
  tenChiCuc: string;
  tenDiemKho: string;
  tenNhaKho: string;
  tenNganKho: string;
  tenLoKho: string;
  maDviTsan: string;
  slLayMau: number;
  slTonKho: number;
  slXuatGiam: number;
  mauBiHuy: boolean;
}
