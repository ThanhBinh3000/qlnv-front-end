import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {DanhMucTieuChuanService} from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import dayjs from "dayjs";
import {MESSAGE} from "src/app/constants/message";
import {Base2Component} from "src/app/components/base2/base2.component";
import {
  QuyetDinhGiaoNvCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cap/QuyetDinhGiaoNvCuuTro.service";

@Component({
  selector: 'app-quyet-dinh-gnv-xuat-hang',
  templateUrl: './quyet-dinh-gnv-xuat-hang.component.html',
  styleUrls: ['./quyet-dinh-gnv-xuat-hang.component.scss']
})
export class QuyetDinhGnvXuatHangComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
              private danhMucService: DanhMucService,
              private danhMucTieuChuanService: DanhMucTieuChuanService) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvCuuTroService);
    this.formData = this.fb.group({
      nam: [dayjs().get('year')],
      soQd: [''],
      maDvi: [''],
      ngayKy: [''],
      loaiVthh: [''],
      trichYeu: [''],
    });
    this.filterTable = {
      nam: '',
      soQd: '',
      ngayKy: '',
      soQdPd: '',
      trichYeu: '',
      tenLoaiVthh: '',
      thoiGianGiaoNhan: '',
      soBbHaoDoi: '',
      soBbTinhKho: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',

    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      // this.formData.patchValue({
      //   loaiVthh: this.loaiVthh
      // })
      await Promise.all([
        this.search(),
        this.loadDsVthh(),
      ])
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }
}
