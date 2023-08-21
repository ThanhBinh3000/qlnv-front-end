import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {DonviService} from 'src/app/services/donvi.service';
import {
  DialogThemMoiBangKeBanLeComponent
} from 'src/app/components/dialog/dialog-them-moi-bang-ke-ban-le/dialog-them-moi-bang-ke-ban-le.component';
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";

@Component({
  selector: 'app-thong-tin-quyet-dinh-uy-quyen-ban-le',
  templateUrl: './thong-tin-quyet-dinh-uy-quyen-ban-le.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-uy-quyen-ban-le.component.scss']
})
export class ThongTinQuyetDinhUyQuyenBanLeComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: String;
  @Input() idInput: number;
  maQd: string = null;
  listOfData: any[] = [];
  fileUyQuyen: any[] = [];
  fileBanLe: any[] = [];
  listPthucBanTt: any[] = [];

  @Output()
  showListEvent = new EventEmitter<any>();

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
        await Promise.all([
          this.loadDetail(this.idInput),
          this.loadDataComboBox(),
        ]);
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async loadDataComboBox() {
    this.listPthucBanTt = [
      {
        ma: '02',
        giaTri: 'Ủy quyền',
      },
      {
        ma: '03',
        giaTri: 'Bán lẻ',
      },
    ];
  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.chaoGiaMuaLeUyQuyenService.getDetail(id)
        .then(async (res) => {
          const data = res.data
          this.dataTable = data.children.filter(s => s.maDvi == this.userInfo.MA_DVI);
          this.dataTable.forEach((item) => {
            item.children.forEach((child) => {
              this.listOfData.push(child)
              this.diaDiemKho(child)
            })

          })
          this.formData.patchValue({
            namKh: data.namKh,
            soQdPd: data.soQdPd,
            ngayKyQd: data.xhQdPdKhBttHdr.ngayKyQd,
            ngayHluc: data.xhQdPdKhBttHdr.ngayHluc,
            loaiVthh: data.xhQdPdKhBttHdr.loaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            pthucBanTrucTiep: data.pthucBanTrucTiep,
            trichYeu: data.xhQdPdKhBttHdr.trichYeu,
            thoiGianDeXuatBtt: (data.tgianDkienTu && data.tgianDkienDen) ? [data.tgianDkienTu, data.tgianDkienDen] : null,
            thoiGianPdBtt: (data.ngayMkho && data.ngayKthuc) ? [data.ngayMkho, data.ngayKthuc] : null
          })
          this.fileUyQuyen = data.fileUyQuyen;
          this.fileBanLe = data.fileBanLe;
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
      nzStyle: {top: '200px'},
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
