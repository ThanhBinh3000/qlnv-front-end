import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {
  QuyetDinhPdKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {
  QdPdKetQuaBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import {chain, cloneDeep} from 'lodash';
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {FileDinhKem} from "../../../../../../models/DeXuatKeHoachBanTrucTiep";

@Component({
  selector: 'app-them-moi-qd-giao-nv-xuat-btt',
  templateUrl: './them-moi-qd-giao-nv-xuat-btt.component.html',
  styleUrls: ['./them-moi-qd-giao-nv-xuat-btt.component.scss']
})
export class ThemMoiQdGiaoNvXuatBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  maHauTo: any;
  flagInit: Boolean = false;
  listHangHoaAll: any[] = [];
  listDviTsan: any[] = [];
  loadQdNvXh: any[] = [];
  dsThongTinChaoGia: any[] = [];
  dsHdongBanTrucTiep: any[] = [];

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
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhNvXuatBttService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      namKh: [''],
      soQdNv: [''],
      ngayQdNv: [''],
      idHd: [],
      soHd: [''],
      ngayKyHd: [''],
      idQdPd: [],
      soQdPd: [''],
      idChaoGia: [],
      maDviTsan: [''],
      tenTccn: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      soLuongBanTrucTiep: [],
      donViTinh: [''],
      tgianGnhan: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      trichYeu: [''],
      trangThaiXh: [''],
      pthucBanTrucTiep: [''],// 01 : chào giá; 02 : Ủy quyền; 03 : Bán lẻ
      phanLoai: ['', [Validators.required]],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      listMaDviTsan: [null],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = "/" + this.userInfo.MA_QD;
      if (this.idInput > 0) {
        await this.loadChiTiet(this.idInput);
      } else {
        await this.initForm();
      }
      await this.onExpandChange(0, true);
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_PHONG_BAN,
      maDvi: this.userInfo.MA_DVI,
      namKh: dayjs().get('year'),
      ngayQdNv: dayjs().format('YYYY-MM-DD'),
      phanLoai: 'CG',
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    })
    await this.loadQdNvXuatHang();
    await this.loadDsVthh();
  }

  async loadQdNvXuatHang() {
    let body = {
      maDvi: this.userInfo.MA_DVI,
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if (data && data.content && data.content.length > 0) {
        this.loadQdNvXh = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let data = await this.detail(id);
      this.formData.patchValue({
        soQdNv: data.soQdNv?.split('/')[0],
      })
      if(data.idChaoGia){
        await this.onChangeThongTin(data.idChaoGia);
      }
      this.dataTable = data.children;
    }
  }

  async openDialogHopDong() {
    if (this.formData.get('phanLoai').value != 'CG') {
      return
    }
    await this.spinner.show();
    let body = {
      trangThai: STATUS.DA_KY,
      namHd: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.hopDongBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content
      if (data && data.length > 0) {
        let set = new Set(this.loadQdNvXh.map((item => JSON.stringify({soHd: item.soHd}))));
        this.dsHdongBanTrucTiep = data.filter(item => {
          const key = JSON.stringify({soHd: item.soHd});
          return !set.has(key);
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH CĂN CỨ TRÊN HỢP ĐỒNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsHdongBanTrucTiep,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeHopDong(data.id);
      }
    });
    await this.spinner.hide();
  }

  changeSoHd(event) {
    if (this.flagInit && event && event !== this.formData.value.soHd) {
      this.formData.patchValue({
        idQdPd: null,
        soQdPd: null,
        idChaoGia: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        moTaHangHoa: null,
        tgianGnhan: null,
        donViTinh: null,
        loaiHinhNx: null,
        kieuNx: null,
        pthucBanTrucTiep: null,
        phanLoai: null,
      });
    }
  }

  async onChangeHopDong(idHd) {
    await this.spinner.show();
    if (idHd > 0) {
      await this.hopDongBttService.getDetail(idHd)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data
            this.formData.patchValue({
              idHd: data.id,
              soHd: data.soHd,
              ngayKyHd: data.ngayHluc,
              maDviTsan: data.maDviTsan,
              tenTccn: data.tenDviMua,
              loaiVthh: data.loaiVthh,
              tenLoaiVthh: data.tenLoaiVthh,
              cloaiVthh: data.cloaiVthh,
              tenCloaiVthh: data.tenCloaiVthh,
              moTaHangHoa: data.moTaHangHoa,
              soLuongBanTrucTiep: data.soLuongBanTrucTiep,
              donViTinh: data.donViTinh,
              tgianGnhan: data.tgianGnhanDen,
              loaiHinhNx: data.loaiHinhNx,
              kieuNx: data.kieuNx,
              pthucBanTrucTiep: '01',
              phanLoai: 'CG',
            })
            this.dataTable = data.children;
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async openDialogThongTin() {
    if (this.formData.get('phanLoai').value != 'UQBL') {
      return
    }
    await this.spinner.show();
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.HOAN_THANH_CAP_NHAT,
      pthucBanTrucTiep: ['02', '03'],
      lastest: 1
    }
    let res = await this.chaoGiaMuaLeUyQuyenService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content;
      if (data && data.length > 0) {
        this.dsThongTinChaoGia = data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH CĂN CỨ TRÊN QUYẾT ĐỊNH KẾ HOẠCH BÁN TRỰC TIẾP',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsThongTinChaoGia,
        dataHeader: ['Số quyết định KH BTT', 'Số đề xuất KH BTT', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdPd', 'soDxuat', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeThongTin(data.id);
      }
    });
    await this.spinner.hide();
  }

  changeSoQdPd(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdPd) {
      this.formData.patchValue({
        idHd: null,
        soHd: null,
        ngayKyHd: null,
        maDviTsan: null,
        tenTccn: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        moTaHangHoa: null,
        soLuongBanTrucTiep: null,
        donViTinh: null,
        tgianGnhan: null,
        loaiHinhNx: null,
        kieuNx: null,
        pthucBanTrucTiep: null,
        phanLoai: null,
      });
    }
  }

  async onChangeThongTin(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.chaoGiaMuaLeUyQuyenService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            await this.setListDviTsan(data.children);
            this.formData.patchValue({
              idQdPd: data.idHdr,
              soQdPd: data.soQdPd,
              idChaoGia: data.id,
              loaiVthh: data.loaiVthh,
              tenLoaiVthh: data.tenLoaiVthh,
              cloaiVthh: data.cloaiVthh,
              tenCloaiVthh: data.tenCloaiVthh,
              moTaHangHoa: data.moTaHangHoa,
              tgianGnhan: data.thoiHanBan,
              donViTinh: data.donViTinh,
              loaiHinhNx: data.loaiHinhNx,
              kieuNx: data.kieuNx,
              pthucBanTrucTiep: data.pthucBanTrucTiep,
              phanLoai: 'UQBL',
            });
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
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
    this.listDviTsan = this.listDviTsan.filter(s => !this.loadQdNvXh.some(s1 => {
      return s1.maDviTsan.split(',').includes(s.maDviTsan);
    }))
  }

  selectMaDviTsan($event) {
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
    let soLuongBanTrucTiep: number = 0;
    this.dataTable.forEach((item) => {
      item.children.forEach((child) => {
        item.soLuongChiCuc += child.soLuongDeXuat;
      })
      soLuongBanTrucTiep += item.soLuongChiCuc
    });
    this.formData.patchValue({
      soLuongBanTrucTiep: soLuongBanTrucTiep
    })
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.setValidator();
    let body = {
      ...this.formData.value,
      soQdNv: this.formData.value.soQdNv ? this.formData.value.soQdNv + this.maHauTo : null
    }
    body.children = this.dataTable;
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.setValidForm();
    let body = {
      ...this.formData.value,
      soQdNv: this.formData.value.soQdNv ? this.formData.value.soQdNv + this.maHauTo : null
    }
    body.children = this.dataTable;
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  isDisabled() {
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

  setValidForm() {
    this.formData.controls["soQdNv"].setValidators([Validators.required]);
    this.formData.controls["ngayQdNv"].setValidators([Validators.required]);
    this.formData.controls["tenDvi"].setValidators([Validators.required]);
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["soLuongBanTrucTiep"].setValidators([Validators.required]);
    this.formData.controls["donViTinh"].setValidators([Validators.required]);
    this.formData.controls["tgianGnhan"].setValidators([Validators.required]);
    this.formData.controls["trichYeu"].setValidators([Validators.required]);
    if (this.formData.value.phanLoai == 'CG') {
      this.formData.controls["idHd"].setValidators([Validators.required]);
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["maDviTsan"].setValidators([Validators.required]);
      this.formData.controls["tenTccn"].setValidators([Validators.required]);
      this.formData.controls["idQdPd"].clearValidators();
      this.formData.controls["soQdPd"].clearValidators();
      this.formData.controls["listMaDviTsan"].clearValidators();
    }
    if (this.formData.value.phanLoai == 'UQBL') {
      this.formData.controls["idHd"].clearValidators();
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["maDviTsan"].clearValidators();
      this.formData.controls["tenTccn"].clearValidators();
      this.formData.controls["idQdPd"].setValidators([Validators.required]);
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      this.formData.controls["listMaDviTsan"].setValidators([Validators.required]);
    }
  }
  setValidator() {
    if (this.formData.value.phanLoai == 'CG') {
      this.formData.controls["idHd"].setValidators([Validators.required]);
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["idQdPd"].clearValidators();
      this.formData.controls["soQdPd"].clearValidators();
      this.formData.controls["listMaDviTsan"].clearValidators();
    }
    if (this.formData.value.phanLoai == 'UQBL') {
      this.formData.controls["idHd"].clearValidators();
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["idQdPd"].setValidators([Validators.required]);
      this.formData.controls["idChaoGia"].setValidators([Validators.required]);
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      this.formData.controls["listMaDviTsan"].setValidators([Validators.required]);
    }
  }
}


