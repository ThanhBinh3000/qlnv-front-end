import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhPdKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { STATUS } from 'src/app/constants/status';
import { DonviService } from 'src/app/services/donvi.service';
import { DialogThemMoiBangKeBanLeComponent } from 'src/app/components/dialog/dialog-them-moi-bang-ke-ban-le/dialog-them-moi-bang-ke-ban-le.component';

@Component({
  selector: 'app-thong-tin-quyet-dinh-uy-quyen-ban-le',
  templateUrl: './thong-tin-quyet-dinh-uy-quyen-ban-le.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-uy-quyen-ban-le.component.scss']
})
export class ThongTinQuyetDinhUyQuyenBanLeComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: String;
  @Input() idInput: number;
  @Input() pthucBanTrucTiep: string;
  maQd: string = null;
  listOfData: any[] = [];
  radioValue: string;
  fileDinhKemUyQuyen: any[] = [];
  fileDinhKemMuaLe: any[] = [];

  @Output()
  showListEvent = new EventEmitter<any>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBanTrucTiepService);

    this.formData = this.fb.group(
      {
        namKh: [''],
        soQdPd: [''],
        ngayKyQd: [''],
        ngayHluc: [''],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        pthucBanTrucTiep: [''],
        trichYeu: [''],
        thoiGianDeXuatBtt: [''],
        thoiGianPdBtt: [''],
        donGiaThiTruong: [''],
        trangThai: [STATUS.BAN_HANH],
        tenTrangThai: ['Ban Hành'],

      }
    );
  }


  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      if (this.idInput) {
        await this.loadDetail(this.idInput)
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }


  async loadDetail(id: number) {
    if (id > 0) {
      await this.quyetDinhPdKhBanTrucTiepService.getDtlDetail(id)
        .then(async (res) => {
          const dataDtl = res.data
          this.dataTable = dataDtl.children.filter(s => s.maDvi == this.userInfo.MA_DVI);
          this.dataTable.forEach((item) => {
            item.children.forEach((child) => {
              this.listOfData.push(child)
              this.diaDiemKho(child)
            })

          })
          this.formData.patchValue({
            namKh: dataDtl.xhQdPdKhBttHdr.namKh,
            soQdPd: dataDtl.xhQdPdKhBttHdr.soQdPd,
            ngayKyQd: dataDtl.xhQdPdKhBttHdr.ngayKyQd,
            ngayHluc: dataDtl.xhQdPdKhBttHdr.ngayHluc,
            loaiVthh: dataDtl.xhQdPdKhBttHdr.loaiVthh,
            tenLoaiVthh: dataDtl.xhQdPdKhBttHdr.tenLoaiVthh,
            pthucBanTrucTiep: dataDtl.pthucBanTrucTiep,
            trichYeu: dataDtl.xhQdPdKhBttHdr.trichYeu,
            thoiGianDeXuatBtt: (dataDtl.tgianDkienTu && dataDtl.tgianDkienDen) ? [dataDtl.tgianDkienTu, dataDtl.tgianDkienDen] : null,
            thoiGianPdBtt: (dataDtl.ngayMkho && dataDtl.ngayKthuc) ? [dataDtl.ngayMkho, dataDtl.ngayKthuc] : null
          })
          if (this.pthucBanTrucTiep) {
            this.radioValue = this.pthucBanTrucTiep
          }
          this.fileDinhKemUyQuyen = dataDtl.fileDinhKemUyQuyen;
          this.fileDinhKemMuaLe = dataDtl.fileDinhKemMuaLe;
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  async diaDiemKho(dataCha) {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI
    };
    const res = await this.donViService.getAll(body)
    console.log(res, 999)
    const dataDk = res.data.filter(item => item.maDvi == dataCha.maDiemKho);
    dataCha.diaChi = dataDk.diaChi

    dataDk.forEach(s => {
      dataCha.diaDiemKho = s.diaChi
    })
  }

  calcTong(column) {
    if (this.listOfData) {
      const sum = this.listOfData.reduce((prev, cur) => {
        prev += cur[column];
        return prev;
      }, 0);
      return sum;
    }
  }

  themMoiBangKeBanLe($event, data?: null, index?: number) {
    const modalGT = this.modal.create({
      nzContent: DialogThemMoiBangKeBanLeComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzStyle: { top: '200px' },
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        idInput: data,
        loaiVthh: this.loaiVthh,
      },
    });
    modalGT.afterClose.subscribe((data) => {
      if (!data) {
        return;
      }
      if (index >= 0) {
        this.dataTable[index] = data;
      } else {
        this.dataTable.push(data);
      }
    });
  };

}
