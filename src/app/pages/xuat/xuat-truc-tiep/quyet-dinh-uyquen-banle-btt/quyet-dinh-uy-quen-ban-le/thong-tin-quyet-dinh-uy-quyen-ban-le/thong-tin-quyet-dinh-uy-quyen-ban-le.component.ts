import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS, THONG_TIN_BAN_TRUC_TIEP} from 'src/app/constants/status';
import {DonviService} from 'src/app/services/donvi.service';
import {
  DialogThemMoiBangKeBanLeComponent
} from 'src/app/components/dialog/dialog-them-moi-bang-ke-ban-le/dialog-them-moi-bang-ke-ban-le.component';
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";
import dayjs from "dayjs";

@Component({
  selector: 'app-thong-tin-quyet-dinh-uy-quyen-ban-le',
  templateUrl: './thong-tin-quyet-dinh-uy-quyen-ban-le.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-uy-quyen-ban-le.component.scss']
})
export class ThongTinQuyetDinhUyQuyenBanLeComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Output() showListEvent = new EventEmitter<any>();
  TRUC_TIEP = THONG_TIN_BAN_TRUC_TIEP
  listOfData: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);

    this.formData = this.fb.group(
      {
        namKh: [''],
        soQdPd: [''],
        soQdDc: [''],
        ngayKy: [''],
        ngayHluc: [''],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        pthucBanTrucTiep: [''],
        pthucBanTrucTiepHt: [''],
        trichYeu: [''],
        tgianDkienTu: [''],
        tgianDkienDen : [''],
        trangThai: [STATUS.BAN_HANH],
        tenTrangThai: ['Ban Hành'],
      }
    );
  }

  async ngOnInit() {
    try {
      if (this.idInput) {
        await this.loadDetail(this.idInput)
      }
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDetail(id: number) {
    if (id <= 0) {
      return;
    }
    try {
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.dataTable = data.children.filter(s => s.maDvi == this.userInfo.MA_DVI);
      for (const item of this.dataTable) {
        for (const child of item.children) {
          this.listOfData.push(child);
          await this.diaDiemKho(child);
        }
      }
      this.formData.patchValue({
        namKh: data.namKh,
        soQdPd: data.soQdPd,
        soQdDc: data.soQdDc,
        ngayKy: data.xhQdPdKhBttHdr.type === 'QDDC' ? data.xhQdPdKhBttHdr.ngayKyDc : data.xhQdPdKhBttHdr.ngayKyQd,
        ngayHluc: data.xhQdPdKhBttHdr.type === 'QDDC' ? data.xhQdPdKhBttHdr.ngayHlucDc : data.xhQdPdKhBttHdr.ngayHluc,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        pthucBanTrucTiepHt: data.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN ? 'Ủy quyền' : 'Bán lẻ',
        pthucBanTrucTiep: data.pthucBanTrucTiep,
        trichYeu: data.trichYeu,
        tgianDkienTu : data.tgianDkienTu,
        tgianDkienDen : data.tgianDkienDen,
      });
      this.fileDinhKem = data.fileDinhKem;
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  disabledTgianTocChucTu = (startValue: Date): boolean => {
    const tgianDkienDen = this.formData.value.tgianDkienDen as Date;
    if (!startValue || !tgianDkienDen || !(tgianDkienDen instanceof Date)) {
      return false;
    }
    return startValue.getTime() > tgianDkienDen.getTime();
  };

  disabledTgianTocChucDen = (endValue: Date): boolean => {
    const tgianDkienTu = this.formData.value.tgianDkienTu as Date;
    if (!endValue || !tgianDkienTu || !(tgianDkienTu instanceof Date)) {
      return false;
    }
    return endValue.getTime() <= tgianDkienTu.getTime();
  };

  isValidDate(dateString: string): boolean {
    return dayjs(dateString).isValid();
  }

  async diaDiemKho(dataCha) {
    const body = {
      trangThai: STATUS.CHO_DUYET_TP,
      maDviCha: this.userInfo.MA_DVI
    };
    try {
      const res = await this.donViService.getAll(body);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const dataDk = res.data.find(item => item.maDvi === dataCha.maDiemKho);
      if (dataDk) {
        dataCha.diaChi = dataDk.diaChi;
        dataCha.diaDiemKho = dataCha.diaChi;
      }
    } catch (e) {
      console.error('error: ', e);
    }
  }

  calcTong(column) {
    if (!this.listOfData) return 0;
    return this.listOfData.reduce((sum, cur) => sum + (cur[column] || 0), 0);
  }

  themMoiBangKeBanLe($event, data: any = null, index: number = -1) {
    const modalGT = this.modal.create({
      nzContent: DialogThemMoiBangKeBanLeComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzStyle: {top: '200px'},
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        idInput: data,
        loaiVthh: this.loaiVthh,
      },
    });
    modalGT.afterClose.subscribe((result) => {
      if (result && index >= 0) {
        this.dataTable[index] = result;
      } else if (result) {
        this.dataTable.push(result);
      }
    });
  }
}
