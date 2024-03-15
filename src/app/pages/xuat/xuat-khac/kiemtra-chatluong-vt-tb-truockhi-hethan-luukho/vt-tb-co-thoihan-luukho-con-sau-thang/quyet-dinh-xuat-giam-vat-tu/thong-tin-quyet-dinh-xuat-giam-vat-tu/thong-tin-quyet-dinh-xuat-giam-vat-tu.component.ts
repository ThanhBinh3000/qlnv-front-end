import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { chain, cloneDeep, isEmpty } from 'lodash';
import * as uuid from 'uuid';
import {
  PhieuXuatNhapKhoService,
} from '../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuXuatNhapKho.service';
import {
  PhieuKdclVtKtclService,
} from '../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuKdclVtKtcl.service';
import {
  QuyetDinhGiaoNvXuatHangService,
} from '../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service';
import {
  BckqKiemDinhMauService,
} from '../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BckqKiemDinhMau.service';
import { Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { MESSAGE } from '../../../../../../../constants/message';
import { isArray } from 'rxjs/internal-compatibility';
import { Base2Component } from '../../../../../../../components/base2/base2.component';
import { CHUC_NANG, STATUS } from '../../../../../../../constants/status';
import { DanhMucService } from '../../../../../../../services/danhmuc.service';
import {
  QuyetDinhXuatGiamVattuService,
} from '../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhXuatGiamVattu.service';
import { FILETYPE, PREVIEW } from '../../../../../../../constants/fileType';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-thong-tin-quyet-dinh-xuat-giam-vat-tu',
  templateUrl: './thong-tin-quyet-dinh-xuat-giam-vat-tu.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-xuat-giam-vat-tu.component.scss'],
})
export class ThongTinQuyetDinhXuatGiamVatTuComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  STATUS = STATUS;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = [];
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  maBb: string;
  checked: boolean = false;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  listBcKqKdMauOption: any[] = [];
  listPhieuXuatKho: any[] = [];
  listLoaiHinhNhapXuat: any[] = [
    { value: 'XUAT_GIAM', label: 'Xuất mẫu bị hủy khỏi kho' },
  ];
  dataThTree: any[] = [];
  expandSetString = new Set<string>();
  LIST_DANH_GIA: any[] = [
    { value: 0, label: 'Không đạt' },
    { value: 1, label: 'Đạt' },
  ];
  templateName = 'Quyết định xuất giảm vật tư';
  maQd: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatNhapKhoService,
    private quyetDinhXuatGiamVattuService: QuyetDinhXuatGiamVattuService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bckqKiemDinhMauService: BckqKiemDinhMauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhXuatGiamVattuService);
    this.formData = this.fb.group({
      id: [],
      tenDvi: [null, [Validators.required]],
      namKeHoach: [dayjs().get('year')],
      maDvi: [null, [Validators.required]],
      maDviNhan: [null, [Validators.required]],
      tenTrangThai: ['Dự Thảo'],
      trangThai: [STATUS.DU_THAO],
      tenDviNhan: [],
      soQuyetDinh: [],
      loai: ['XUAT_GIAM'],
      trichYeu: [],
      lyDoTuChoi: [],
      soCanCu: [null, [Validators.required]],
      idCanCu: [null, [Validators.required]],
      ngayKy: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      thoiHanXuatGiam: [],
      xhXkVtPhieuXuatNhapKho: [new Array()],
      fileDinhKems: [new Array()],
    });
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      this.maQd = '/' + this.userInfo.MA_QD;
      await Promise.all([
        this.loadBcKqKdMau(),
      ]);
      await this.loadDetail(this.idInput);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async loadBcKqKdMau() {
    let body = {
      nam: this.formData.get('namKeHoach').value,
      trangThai: STATUS.DA_DUYET_LDC,
    };
    let res = await this.bckqKiemDinhMauService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBcKqKdMauOption = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.quyetDinhXuatGiamVattuService.getDetail(idInput)
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
              this.listPhieuXuatKho = cloneDeep(dataDetail.xhXkVtPhieuXuatNhapKho);
              this.buildTableView();
            }

          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
      });
    }
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true;
    }
    return false;
  }

  async changeValueBcKqKdMau(event) {
    try {
      this.spinner.show();
      if (event && event.length > 0) {
        const objBaoCaoKqKdMau = this.listBcKqKdMauOption.find(obj1 => obj1.soBaoCao == event);
        this.listPhieuXuatKho = objBaoCaoKqKdMau.xhXkVtPhieuXuatNhapKho && objBaoCaoKqKdMau.xhXkVtPhieuXuatNhapKho.length > 0 ? objBaoCaoKqKdMau.xhXkVtPhieuXuatNhapKho.filter(item => item.loai == 'XUAT_MAU' && item.loaiPhieu == 'XUAT' && item.mauBiHuy) : [];
        this.buildTableView();
        this.formData.patchValue({
          idCanCu: objBaoCaoKqKdMau.id,
          maDviNhan: objBaoCaoKqKdMau.maDvi,
          tenDviNhan: objBaoCaoKqKdMau.tenDvi,
          xhXkVtPhieuXuatNhapKho: this.listPhieuXuatKho,
        });
      } else {
        this.listPhieuXuatKho = [];
        this.buildTableView();
        this.formData.patchValue({
          idCanCu: null,
          xhXkVtPhieuXuatNhapKho: null,
        });
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  buildTableView() {
    let dataView = chain(this.listPhieuXuatKho)
      .groupBy('maChiCuc')
      .map((value, key) => {
        let phieuXuatKho = value.find(f => f.maChiCuc === key);
        return {
          idVirtual: uuid.v4(),
          maChiCuc: key != 'null' ? key : '',
          tenChiCuc: phieuXuatKho ? phieuXuatKho.tenChiCuc : null,
          childData: value,
        };
      }).value();
    this.dataThTree = dataView;
    this.expandAll();
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
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
    if (!body.xhXkVtPhieuXuatNhapKho || body.xhXkVtPhieuXuatNhapKho.length <= 0) {
      this.notification.warning(MESSAGE.WARNING, 'Danh sách hàng hóa xuất giảm trống.');
      return;
    }
    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
      this.formData.patchValue({
        id: data.id,
      });
      if (isGuiDuyet) {
        this.pheDuyet();
      }
    }
  }

  conVertTreeToList(data) {
    let arr = [];
    data.forEach(item => {
      if (item.childData && item.childData.length > 0) {
        item.childData.forEach(data => {
          arr.push(data);
        });
      } else {
        arr.push(item);
      }
    });
    return arr;
  }

  pheDuyet() {
    let trangThai = '';
    let mess = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO:
      case STATUS.TU_CHOI_LDV:
      case STATUS.TU_CHOI_LDTC: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mess = 'Bạn có muốn gửi duyệt?'
        break;
      }
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.CHO_DUYET_LDTC;
        mess = 'Bạn có chắc chắn muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.BAN_HANH;
        mess = 'Bạn có chắc chắn muốn ban hành ?'
        break;
      }
    }
    this.approve(this.idInput, trangThai, mess);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.TU_CHOI_LDV;
        break;
      }
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.TU_CHOI_LDTC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }
  expandAll() {
    this.dataThTree.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async preview(id) {
    this.spinner.show();
    await this.quyetDinhXuatGiamVattuService.preview({
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
