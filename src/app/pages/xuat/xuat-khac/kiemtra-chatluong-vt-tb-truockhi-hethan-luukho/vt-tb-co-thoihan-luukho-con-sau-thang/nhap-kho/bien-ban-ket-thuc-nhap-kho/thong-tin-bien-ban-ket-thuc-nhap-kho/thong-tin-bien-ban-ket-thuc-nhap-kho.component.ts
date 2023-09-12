import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from '../../../../../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DanhMucService } from '../../../../../../../../services/danhmuc.service';
import {
  QuyetDinhGiaoNvXuatHangService,
} from '../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service';
import {
  BckqKiemDinhMauService,
} from '../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BckqKiemDinhMau.service';
import {
  PhieuXuatNhapKhoService,
} from '../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuXuatNhapKho.service';
import dayjs from 'dayjs';
import { Validators } from '@angular/forms';
import { STATUS } from '../../../../../../../../constants/status';
import { FileDinhKem } from '../../../../../../../../models/FileDinhKem';
import { MESSAGE } from '../../../../../../../../constants/message';
import {
  DialogTableSelectionComponent,
} from '../../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component';
import { convertTienTobangChu } from '../../../../../../../../shared/commonFunction';
import {
  BienBanKetThucNhapKhoService,
} from '../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BienBanKetThucNhapKho.service';
import { now } from 'moment';

@Component({
  selector: 'app-thong-tin-bien-ban-ket-thuc-nhap-kho',
  templateUrl: './thong-tin-bien-ban-ket-thuc-nhap-kho.component.html',
  styleUrls: ['./thong-tin-bien-ban-ket-thuc-nhap-kho.component.scss'],
})
export class ThongTinBienBanKetThucNhapKhoComponent extends Base2Component implements OnInit {

  @Input() soBcKqkdMau: string;
  @Input() nganLoKho: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoBcKqkdMau: any[] = [];
  listDiaDiemNhap: any[] = [];
  listPhieuKtraCl: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  listBbLayMau: any[] = [];
  maPhieu: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  listNganLoKho: any = [];
  dataPhieuNhapKho: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bckqKiemDinhMauService: BckqKiemDinhMauService,
    private phieuXuatNhapKhoService: PhieuXuatNhapKhoService,
    private bienBanKetThucNhapKhoService: BienBanKetThucNhapKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanKetThucNhapKhoService);

    this.formData = this.fb.group(
      {
        id: [0],
        namKeHoach: [dayjs().get('year')],
        maDvi: [],
        maQhns: [],
        soBienBan: [],
        ngayLapBienBan: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
        idCanCu: [null, [Validators.required]],
        soCanCu: [null, [Validators.required]],
        maDiaDiem: [null, [Validators.required]],
        maNhaKho: [null, [Validators.required]],
        maNganKho: [],
        maLoKho: [],
        loaiVthh: [],
        cloaiVthh: [],
        canBoLapBb: [],
        ldChiCuc: [],
        thuKho: [],
        keToanTruong: [],
        soBbLayMau: [],
        idBbLayMau: [],
        soPhieuKncl: [],
        idPhieuKncl: [],
        ktvBaoQuan: [],
        ngayKetThucNhap: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
        ngayBatDauNhap: [],
        ngayHetHanLuuKho: [],
        ghiChu: ['', [Validators.required]],
        trangThai: [STATUS.DU_THAO],
        tenDvi: [],
        lyDoTuChoi: [],
        type: [],
        tenTrangThai: ['Dự Thảo'],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenDiemKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        tenNganKho: [''],
        tenLoKho: [],
        fileDinhKems: [new Array<FileDinhKem>()],
        listPhieuNhapKho: [new Array()],
      },
    );
    this.maPhieu = 'BBKTNK-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.loadSoBaoCaoKqKdMau(),
      ]);
      await this.loadDetail(this.idInput);
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.bienBanKetThucNhapKhoService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            this.fileDinhKems = data.fileDinhKems;
            //load thông tin ngăn lô kho
            let itemBcKqKdMau = this.listSoBcKqkdMau.find(item => item.soBaoCao == data.soCanCu && item.id == data.idCanCu);
            if (itemBcKqKdMau) {
              this.bindingDataQd(itemBcKqKdMau, data.maDiaDiem);
            }
            this.dataPhieuNhapKho = data.listPhieuNhapKho;
            this.formData.patchValue(data);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XK_VT_BB_KT_NHAP_KHO_SEQ');
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        canBoLapBb: this.userInfo.TEN_DAY_DU,
        soBienBan: `${id}/${this.formData.get('namKeHoach').value}/${this.maPhieu}`,
      });
      if (this.soBcKqkdMau) {
        let dataBcKqKdm = this.listSoBcKqkdMau.find(item => item.soBaoCao == this.soBcKqkdMau);
        if (dataBcKqKdm) {
          this.bindingDataQd(dataBcKqKdm);
          this.bindingDataPhieuNhapKho(dataBcKqKdm);
        }
      }
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadSoBaoCaoKqKdMau() {
    let body = {
      trangThai: STATUS.DA_DUYET_LDC,
      dvql: this.userInfo.MA_DVI.substring(0, this.userInfo.MA_DVI.length - 2),
      nam: this.formData.get('namKeHoach').value,
    };
    let res = await this.bckqKiemDinhMauService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoBcKqkdMau = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoBcKqkdMau,
        dataHeader: ['Số báo cáo', 'Ngày báo cáo', 'Năm'],
        dataColumn: ['soBaoCao', 'ngayBaoCao', 'nam'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data);
      }
    });
  };

  async bindingDataQd(data, maDiaDiem?) {
    try {
      await this.spinner.show();
      if (data) {
        let res = await this.phieuXuatNhapKhoService.search({
          soBcKqkdMau: data.soBaoCao,
          idBcKqkdMau: data.id,
          namKeHoach: this.formData.get('namKeHoach').value,
          loaiPhieu: 'XUAT',
          loai: 'XUAT_MAU',
        });
        if (res.msg == MESSAGE.SUCCESS) {
          this.listNganLoKho = res.data.content;
        }
        this.formData.patchValue({
          soCanCu: data.soBaoCao,
          idCanCu: data.id,
          maDiaDiem: maDiaDiem ? maDiaDiem : null,
        });
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async bindingDataPhieuNhapKho(data, maDiaDiem?) {
    this.dataPhieuNhapKho = [];
    try {
      await this.spinner.show();
      if (data) {
        let res = await this.phieuXuatNhapKhoService.search({
          soCanCu: data.soBcKqkdMau,
          maDiaDiem: data.maDiaDiem,
          idCanCu: data.idBcKqkdMau,
          namKeHoach: this.formData.get('namKeHoach').value,
          loaiPhieu: 'NHAP',
          loai: 'NHAP_MAU',
        });
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data.content && res.data.content.length > 0) {
            this.dataPhieuNhapKho = res.data.content;
            this.formData.patchValue({
              listPhieuNhapKho: res.data.content,
              ngayBatDauNhap: this.dataPhieuNhapKho[0].ngayXuatNhap,
              ngayKetThucNhap: this.formData.get('ngayLapBienBan').value,
            });
          }
        }
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async changeValueNganLoKho($event) {
    if ($event) {
      let item = this.listNganLoKho.find(it => it.maDiaDiem == $event);
      if (item) {
        this.formData.patchValue({
          tenNhaKho: item.tenNhaKho,
          tenDiemKho: item.tenDiemKho,
          tenLoaiVthh: item.tenLoaiVthh,
          loaiVthh: item.loaiVthh,
          cloaiVthh: item.cloaiVthh,
          soBbLayMau: item.soBbLayMau,
          soPhieuKncl: item.soPhieuKncl,
          idPhieuKncl: item.idPhieuKncl,
          tenCloaiVthh: item.tenCloaiVthh,
        });
        await this.bindingDataPhieuNhapKho(item);
      }
    }
  }

  async save() {
    try {
      this.formData.disable();
      let body = this.formData.value;
      body.fileDinhKems = this.fileDinhKems;
      await this.createUpdate(body);
      this.formData.enable();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_KTVBQ;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.TU_CHOI_KTVBQ;
        break;
      }
    }
    this.reject(this.idInput, trangThai);
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true;
    }
    return false;
  }

  clearItemRow() {
    this.formData.patchValue({
      maSo: null,
      slLayMau: null,
      slThucTe: null,
    });
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

}
