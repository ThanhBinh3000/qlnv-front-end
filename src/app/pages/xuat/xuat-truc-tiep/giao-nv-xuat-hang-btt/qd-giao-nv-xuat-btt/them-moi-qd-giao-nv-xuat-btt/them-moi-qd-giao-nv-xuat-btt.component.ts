import { Component, Input, OnInit, } from '@angular/core';
import { Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { QuyetDinhPdKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { QdPdKetQuaBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import { ChaoGiaMuaLeUyQuyenService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import { chain, cloneDeep } from 'lodash';

@Component({
  selector: 'app-them-moi-qd-giao-nv-xuat-btt',
  templateUrl: './them-moi-qd-giao-nv-xuat-btt.component.html',
  styleUrls: ['./them-moi-qd-giao-nv-xuat-btt.component.scss']
})
export class ThemMoiQdGiaoNvXuatBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() idQdPdDtl: number;
  @Input() isViewOnModal: boolean;
  maQd: string = null;

  radioValue: string = '01';
  listDviTsan: any[] = [];

  fileDinhKems: any[] = []

  loadQdNvXh: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private hopDongBttService: HopDongBttService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhNvXuatBttService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      namKh: [dayjs().get('year')],
      soQdNv: ['',],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      idHd: [],
      soHd: [''],
      idQdPd: [],
      idQdPdDtl: [],
      soQdPd: [''],
      maDviTsan: [''],
      tenTccn: ['',],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      soLuongBanTrucTiep: [],
      donViTinh: [''],
      tgianGnhan: [''],
      trichYeu: [''],
      trangThaiXh: [''],
      tenTrangThaiXh: [''],
      phanLoai: ['01', [Validators.required]],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [''],
      listMaDviTsan: [null],
      ngayKyHd: ['']

    })
  }

  setValidator(isGuiDuyet?) {
    if (this.radioValue == '01' && isGuiDuyet) {
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
      this.formData.controls["idHd"].setValidators([Validators.required]);
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["idQdPd"].clearValidators();
      this.formData.controls["soQdPd"].clearValidators();
    }
    if (this.radioValue == '02' && isGuiDuyet) {
      this.formData.controls["idHd"].clearValidators();
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["idQdPd"].setValidators([Validators.required]);
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
    }
    if (this.radioValue == '01') {
      this.formData.controls["idHd"].setValidators([Validators.required]);
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["idQdPd"].clearValidators();
      this.formData.controls["soQdPd"].clearValidators();
    }
    if (this.radioValue == '02') {
      this.formData.controls["idHd"].clearValidators();
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["idQdPd"].setValidators([Validators.required]);
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
    }
  }

  deleteSelect() {
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      await Promise.all([
      ]);
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        this.initForm();
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({
      namKh: dayjs().get('year'),
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
    })
  }

  async openDialogSoHopDong() {
    this.spinner.show();
    let body = {
      trangThai: STATUS.DA_KY,
      maDvi: this.formData.value.maDvi,
      namHd: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    await this.loadQdNvXuatHang();
    let dsHd = []
    let res = await this.hopDongBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = [
        ...res.data.content.filter((item) => {
          return !this.loadQdNvXh.some((child) => {
            if (child.soHd.length > 0 && item.soHd.length > 0) {
              return item.soHd === child.soHd;
            }
          })
        })
      ]
      dsHd = data
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH CĂN CỨ TRÊN HỢP ĐỒNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dsHd,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.onChangeHd(data.id);
      }
    });
  }

  async loadQdNvXuatHang() {
    let body = {
      maDvi: this.formData.value.maDvi,
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.data) {
      this.loadQdNvXh = res.data.content;
    }
  }

  async onChangeHd(id) {
    if (id > 0) {
      await this.hopDongBttService.getDetail(id)
        .then(async (resHd) => {
          if (resHd.data) {
            const dataHopDong = resHd.data;
            let resQdCg = await this.qdPdKetQuaBttService.getDetail(dataHopDong.idQdKq);
            const dataQdCg = resQdCg.data
            this.formData.patchValue({
              idHd: dataHopDong.id,
              soHd: dataHopDong.soHd,
              maDviTsan: dataHopDong.maDviTsan,
              tenTccn: dataHopDong.tenDviMua,
              loaiVthh: dataHopDong.loaiVthh,
              tenLoaiVthh: dataHopDong.tenLoaiVthh,
              cloaiVthh: dataHopDong.cloaiVthh,
              tenCloaiVthh: dataHopDong.tenCloaiVthh,
              moTaHangHoa: dataHopDong.moTaHangHoa,
              soLuongBanTrucTiep: dataHopDong.soLuongBanTrucTiep,
              donViTinh: dataHopDong.donViTinh,
              ngayKyHd: dataHopDong.ngayPduyet,
              trichYeu: dataQdCg.trichYeu,
              tgianGnhan: dataQdCg.ngayKthuc
            })
            this.dataTable = dataHopDong.children;
          }
        })
    }
  }


  async openDialogQdPdKhBtt() {
    this.spinner.show();
    let dsHd = []
    await this.chaoGiaMuaLeUyQuyenService.search({
      // maDviChiCuc: this.userInfo.MA_DVI,
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.HOAN_THANH_CAP_NHAT,
      pthucBanTrucTiep: ['02', '03'],
      lastest: 1
    }
    ).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          dsHd = data.content;
        }
      }
    });
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH CĂN CỨ TRÊN QUYẾT ĐỊNH KẾ HOẠCH BÁN TRỰC TIẾP',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dsHd,
        dataHeader: ['Số quyết định KH BTT', 'Loại hàng hóa', 'Chủng loại hàng hóa', 'Số lượng'],
        dataColumn: ['soQdPd', 'tenLoaiVthh', 'tenCloaiVthh', 'tongSoLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.onChangeQdPdKh(data.id);
      }
    });
  }

  async onChangeQdPdKh(id) {
    if (id > 0) {
      await this.quyetDinhPdKhBanTrucTiepService.getDtlDetail(id).then(async res => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            const data = res.data;
            await this.setListDviTsan(data.children);
            this.formData.patchValue({
              idQdPd: data.xhQdPdKhBttHdr.id,
              soQdPd: data.xhQdPdKhBttHdr.soQdPd,
              loaiVthh: data.xhQdPdKhBttHdr.loaiVthh,
              tenLoaiVthh: data.xhQdPdKhBttHdr.tenLoaiVthh,
              cloaiVthh: data.xhQdPdKhBttHdr.cloaiVthh,
              tenCloaiVthh: data.xhQdPdKhBttHdr.tenCloaiVthh,
              moTaHangHoa: data.xhQdPdKhBttHdr.moTaHangHoa,
              soLuongBanTrucTiep: data.tongSoLuong,
              donViTinh: 'Kg',
              trichYeu: data.xhQdPdKhBttHdr.trichYeu,
              tgianGnhan: data.thoiHanBan,
              idQdPdDtl: data.id
            })
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
        this.spinner.hide();
      })
    }
  }

  setListDviTsan(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((item) => {
      let dataGroup = chain(item.children).groupBy('maDviTsan').map((value, key) => ({
        maDviTsan: key,
        children: value
      })).value();
      item.dataDviTsan = dataGroup;
      item.dataDviTsan.forEach(x => {
        x.tenDvi = item.tenDvi
        x.maDvi = item.maDvi
        x.soLuongChiCuc = null;
        if (x.maDviTsan) {
          this.listDviTsan = [...this.listDviTsan, x];
        }
      })
    })
  }

  selectMaDviTsan() {
    this.dataTable = [];
    let currentSelectList = cloneDeep(this.listDviTsan);
    if (this.formData.value.listMaDviTsan && this.formData.value.listMaDviTsan.length > 0) {
      let listAll = currentSelectList.filter(s => this.formData.value.listMaDviTsan.includes(s.maDviTsan));
      listAll.forEach(item => {
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((child) => {
            if (child.maDvi == item.maDvi) {
              child.children = [...child.children, ...item.children]
            } else {
              this.dataTable = [...this.dataTable, item]
            }
          })
        } else {
          this.dataTable = [...this.dataTable, item]
        }
      });
      this.calculatorTable();
    } else {
      this.dataTable = []
    }
  }

  calculatorTable() {
    this.dataTable.forEach((item) => {
      item.children.forEach((child) => {
        item.soLuongChiCuc += child.soLuongDeXuat;
      })
    });
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    if (this.formData.value.soQdNv) {
      body.soQdNv = this.formData.value.soQdNv + "/" + this.maQd;
    }
    body.children = this.dataTable;
    body.phanLoai = this.radioValue
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKem = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      } else {
        // this.goBack()
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        msg = MESSAGE.BAN_HANH_CONFIRM;
        trangThai = STATUS.BAN_HANH;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      if (this.idQdPdDtl) {
        await this.onChangeQdPdKh(this.idQdPdDtl);
      }
      let data = await this.detail(id);
      this.formData.patchValue({
        soQdNv: data.soQdNv?.split('/')[0],
      })
      this.dataTable = data.children;
      this.fileDinhKem = data.fileDinhKem;
      this.fileDinhKems = data.fileDinhKems;
      if (data.phanLoai) {
        this.radioValue = data.phanLoai
      }
    };
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.BAN_HANH || trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC) {
      return true
    }
    return false;
  }

  isDisabledQD() {
    if (this.formData.value.id == null) {
      return false
    } else {
      return true;
    }
  }

  calcTong(column) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[column];
        return prev;
      }, 0);
      return sum;
    }
  }
}


