import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  HopDongXuatHangService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service";
import {
  QdPdKetQuaBanDauGiaService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service";
import {
  ThongTinDauGiaService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service";
import {cloneDeep} from 'lodash';


@Component({
  selector: 'app-quan-ly-hop-dong-thanh-ly',
  templateUrl: './quan-ly-hop-dong-thanh-ly.component.html',
  styleUrls: ['./quan-ly-hop-dong-thanh-ly.component.scss']
})
export class QuanLyHopDongThanhLyComponent extends Base2Component implements OnInit {

  @Input() id: number;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  isView = false;
  idHopDong: number;
  isEditHopDong: boolean
  listAllDviTsan: any[] = [];
  listDviTsanDaKy: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private thongTinDauGiaService: ThongTinDauGiaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    this.formData = this.fb.group({
      id: [],
      nam: [''],
      soQdTl: [],
      soHoSo: [],
      tenDvi: [],
      tongTienGiaKdiem: [],
      tgianThanhLy: [''],
      tgianTtoan: [],
      tgianGnhan: [],
      pthucTtoan: [''],
      tongSoDviTsanDg: [],
      soLuongDviTsanTrung: [],
      soLuongDviTsanTruot: [],
      loaiHinhNx: [''],
      tenLoaiHinhNx: [''],
      kieuNx: [''],
      tenKieuNx: [''],
      trangThaiHd: [''],
      tenTrangThaiHd: [''],
    });
  }

  async ngOnInit() {
    await this.spinner.show()
    await Promise.all([]);
    if (this.id) {
      await this.selectRow(this.dataTable[0])
    }
    await this.spinner.hide()
  }

  async pheDuyet() {

  }

  async selectRow(item: any) {
    if (this.dataTable.length > 0) {
      this.dataTable.forEach(i => i.selected = false);
      item.selected = true;
      this.idHopDong = cloneDeep(item.id);
      this.isView = true;
    }
  }

  async redirectHopDong(isShowHd: boolean, id: number) {
    this.isEditHopDong = isShowHd;
    this.idHopDong = id;
    if (!isShowHd) {
      await this.ngOnInit()
    }
  }

  async deleteHd(data) {

  }

  outputListAllDviTsan($event) {
    this.listAllDviTsan = $event;
  }

}
