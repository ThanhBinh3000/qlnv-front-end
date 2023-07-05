import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import {
  TongHopDanhSachHangDTQGService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/TongHopDanhSachHangDTQG.service";
import {
  DanhSachHangDTQGCon6ThangService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatlt/DanhSachHangDTQGCon6Thang.service";

@Component({
  selector: 'app-xk-thong-tin-danh-sach-hdtqg-het-han',
  templateUrl: './thong-tin-danh-sach-hdtqg-het-han.html',
  styleUrls: ['./thong-tin-danh-sach-hdtqg-het-han.scss']
})
export class ThongTinDanhSachHdtqgHetHan extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() itemInput: any;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private tongHopDanhSachHangDTQGService: TongHopDanhSachHangDTQGService,
    private danhSachHangDTQGCon6ThangService: DanhSachHangDTQGCon6ThangService
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhSachHangDTQGCon6ThangService);

    this.formData = this.fb.group(
      {
        id :[],
        maDvi:[],
        idTongHop:[],
        maTongHop:[],
        maDiaDiem:[],
        loaiVthh:[],
        cloaiVthh:[],
        donViTinh:[],
        moTaHangHoa: [],
        slHetHan:[],
        slTonKho:[],
        ngayNhapKho:[],
        ngayDeXuat:[],
        tgianLuuKho:[],
        ngayTongHop:[],
        lyDo:[],
        trangThai:[],
        loai:[],
        tenLoaiVthh:[],
        tenCloaiVthh:[],
        tenTrangThai:[],
        tenCuc:[],
        tenChiCuc:[],
        tenDiemKho:[],
        tenNhaKho:[],
        tenNganKho:[],
        tenLoKho:[],
      }
    );

  }

  async ngOnInit() {
    try {
      this.spinner.show();
      await this.loadDetail(this.idInput)
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
      await this.danhSachHangDTQGCon6ThangService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            console.log(res.data,"data")
            }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

}
