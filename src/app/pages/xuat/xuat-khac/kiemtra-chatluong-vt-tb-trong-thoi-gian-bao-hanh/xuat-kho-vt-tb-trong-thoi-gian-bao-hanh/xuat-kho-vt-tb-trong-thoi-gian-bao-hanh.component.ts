import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from 'src/app/constants/message';
import {chain} from 'lodash';
import * as uuid from "uuid";
import dayjs from "dayjs";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {StorageService} from "../../../../../services/storage.service";
import {CHUC_NANG} from "../../../../../constants/status";
import {UserLogin} from "../../../../../models/userlogin";
import {
  PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService
} from "../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanh.service";


@Component({
  selector: 'app-xuat-kho-vt-tb-trong-thoi-gian-bao-hanh',
  templateUrl: './xuat-kho-vt-tb-trong-thoi-gian-bao-hanh.component.html',
  styleUrls: ['./xuat-kho-vt-tb-trong-thoi-gian-bao-hanh.component.scss']
})
export class XuatKhoVtTbTrongThoiGianBaoHanhComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  CHUC_NANG = CHUC_NANG;


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoVtTbTrongThoiGianBaoHanhService: PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoVtTbTrongThoiGianBaoHanhService);
    this.formData = this.fb.group({
      tenDvi: null,
      maDvi: null,
      nam: null,
      soCanCu: null,
      soPhieu: null,
      ngayXuatNhap: null,
      ngayXuatNhapTu: null,
      ngayXuatNhapDen: null,
      loaiVthh: null,
      loaiPhieu: 'XUAT'
    })
    this.filterTable = {
      soQdGiaoNvXh: '',
      nam: '',
      ngayQdGiaoNvXh: '',
      tenDiemKho: '',
      tenLoKho: '',
      soPhieuXuatKho: '',
      ngayXuatNhap: '',
      soPhieuKnCl: '',
      ngayKn: '',
      tenTrangThai: '',
    };
  }


  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  disabledStartNgayXk = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayXuatNhapDen) {
      return startValue.getTime() >= this.formData.value.ngayXuatNhapDen.getTime();
    }
    return false;
  };

  disabledEndNgayXk = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayXuatNhapTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayXuatNhapTu.getTime();
  };

  ngOnInit(): void {
    try {
      this.initData()
      this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?): Promise<void> {
    await super.search(roles);
    this.buildTableView();
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }


  isOwner(maDvi: any) {
    return this.userInfo.MA_PHONG_BAN == maDvi;
  }

  isBelong(maDvi: any) {
    return this.userInfo.MA_DVI == maDvi;
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayXuatNhap) {
        this.formData.value.ngayXuatNhapTu = dayjs(this.formData.value.ngayXuatNhap[0]).format('YYYY-MM-DD')
        this.formData.value.ngayXuatNhapDen = dayjs(this.formData.value.ngayXuatNhap[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("soCanCu")
      .map((value, key) => {
        let quyetDinh = value.find(f => f.soCanCu === key);
        let rs = chain(value)
          .groupBy("tenDiemKho")
          .map((v, k) => {
            let childData = chain(v)
              .groupBy("tenNganKho")
              .map((v1, k1) => {
                let nganLo = v1.find(s1 => s1.tenNganKho === k1); // Lấy đối tượng đầu tiên có trường "tenNganKho" trùng khớp
                return {
                  idVirtual: uuid.v4(),
                  tenNganKho: k1 != "null" ? k1 : '', // Kiểm tra nếu k1 là "null" thì gán giá trị rỗng
                  tenLoKho: nganLo ? nganLo.tenLoKho : null,
                  childData: v1
                };
              })
              .value();

            return {
              idVirtual: uuid.v4(),
              tenDiemKho: k != "null" ? k : '',
              childData: childData
            };
          })
          .value();

        let namKeHoach = quyetDinh ? quyetDinh.namKeHoach : null;
        let ngayKyCanCu = quyetDinh ? quyetDinh.ngayKyCanCu : null;
        return {
          idVirtual: uuid.v4(),
          soCanCu: key != "null" ? key : '',
          namKeHoach: namKeHoach,
          ngayKyCanCu: ngayKyCanCu,
          childData: rs
        };
      })
      .value();

    this.children = dataView;
    console.log(this.children, "this.children");
    this.expandAll();
  }


  expandAll() {
    this.children.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }


  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }

  openPhieuKnClModal(id: number) {
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

}
