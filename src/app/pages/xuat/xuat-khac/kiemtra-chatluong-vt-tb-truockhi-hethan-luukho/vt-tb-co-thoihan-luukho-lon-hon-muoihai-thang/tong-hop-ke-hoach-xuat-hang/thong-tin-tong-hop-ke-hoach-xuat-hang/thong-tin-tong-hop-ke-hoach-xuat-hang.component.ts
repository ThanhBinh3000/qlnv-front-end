import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserLogin} from "../../../../../../../models/userlogin";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {KeHoachXayDungTrungHan} from "../../../../../../../models/QuyHoachVaKeHoachKhoTang";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {chain, cloneDeep, isEmpty} from "lodash";
import {v4 as uuidv4} from "uuid";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UserService} from "../../../../../../../services/user.service";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {NzModalService} from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import {STATUS} from "../../../../../../../constants/status";
import {MESSAGE} from "../../../../../../../constants/message";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {DonviService} from "../../../../../../../services/donvi.service";
import {
  TongHopDanhSachVttbService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/TongHopDanhSachVttb.service";
import {
  KeHoachXuatHangService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/KeHoachXuatHang.service";
import {NumberToRoman} from "../../../../../../../shared/commonFunction";
import {
  TongHopKeHoachXuatHangService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/TongHopKeHoachXuatHang.service";
import {FILETYPE} from "../../../../../../../constants/fileType";

@Component({
  selector: 'app-thong-tin-tong-hop-ke-hoach-xuat-hang',
  templateUrl: './thong-tin-tong-hop-ke-hoach-xuat-hang.component.html',
  styleUrls: ['./thong-tin-tong-hop-ke-hoach-xuat-hang.component.scss']
})
export class ThongTinTongHopKeHoachXuatHangComponent extends Base2Component implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() isViewQd: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  userInfo: UserLogin;
  formData: FormGroup;
  listDxCuc: any[] = [];
  listKeHoachDtl: any[] = [];
  listKeHoachDtlTreeByChiCuc: any[] = [];
  listKeHoachDtlTreeByVthh: any[] = [];
  isTongHop: boolean = false;
  STATUS = STATUS;
  expandSetStringCuc = new Set<string>();
  expandSetStringLoaiVthh = new Set<string>();
  numberToRoman = NumberToRoman;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private keHoachXuatHangService: KeHoachXuatHangService,
              private tongHopKeHoachXuatHangService: TongHopKeHoachXuatHangService) {
    super(httpClient, storageService, notification, spinner, modal, tongHopKeHoachXuatHangService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      ngayTaoTt: [null],
      thoiGianTh: [null],
      thoiGianDuKienXuat: [null],
      thoiGianDuKienXuatTu: [null],
      thoiGianDuKienXuatDen: [null],
      namKeHoach: [dayjs().get("year")],
      noiDungTh: [null, Validators.required],
      ngayKyQd: [null],
      trangThai: [STATUS.CHUATAO_KH],
      moTa: [null],
      maDvi: [this.userInfo.MA_DVI],
      tenTrangThai: ["Dự thảo kế hoạch"],
      loai: ["01", Validators.required],
      listSoKeHoachs: [],
      listIdKeHoachs: [new Array()],
      xhXkKhXuatHangDtl: [new Array()]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.idInput) {
        this.getDetail(this.idInput)
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetStringCuc.add(id);
    } else {
      this.expandSetStringCuc.delete(id);
    }
  }

  onExpandStringChangeVthh(id: string, checked: boolean) {
    if (checked) {
      this.expandSetStringLoaiVthh.add(id);
    } else {
      this.expandSetStringLoaiVthh.delete(id);
    }
  }

  async tongHop() {
    try {
      this.spinner.show();
      this.formData.patchValue({
        thoiGianTh: new Date()
      });
      let body = {
        "namKeHoach": this.formData.get("namKeHoach").value,
        "loai": "00",
        "trangThai": STATUS.DA_DUYET_LDC,
        "capDvi": 2,
      };
      let res = await this.keHoachXuatHangService.searchTh(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listDxCuc = [];
        this.listKeHoachDtl = [];
        let listDataKh = res.data;
        if (listDataKh) {
          this.formData.patchValue({
            listSoKeHoachs: listDataKh.listSoKeHoachs.join(","),
            listIdKeHoachs: listDataKh.listIdKeHoachs,
            xhXkKhXuatHangDtl: listDataKh.xhXkKhXuatHangDtl
          })
          this.listKeHoachDtl = cloneDeep(listDataKh.xhXkKhXuatHangDtl);
          this.listDxCuc = cloneDeep(listDataKh.listDxCuc);
          this.isTongHop = true;
          this.buildTableView(this.listKeHoachDtl);
          this.buildTableViewByLoaiVthh(this.listKeHoachDtl);
        } else {
          this.notification.warning(MESSAGE.WARNING, "Không tìm thấy dữ liệu kế hoạch xuất hàng của Cục111");
          this.isTongHop = false;
          this.spinner.hide();
          return;
        }
      } else {
        this.notification.warning(MESSAGE.WARNING, res.msg);
        this.spinner.hide();
      }
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }


  async buildTableView(data: any) {
    this.listKeHoachDtlTreeByChiCuc = chain(data)
      .groupBy("tenChiCuc")
      .map((value, key) => {
        let idVirtual = uuidv4();
        this.expandSetStringCuc.add(idVirtual);
        return {
          idVirtual: idVirtual,
          tenChiCuc: key,
          childData: value
        };
      }).value();
  }

  async buildTableViewByLoaiVthh(data: any) {
    this.listKeHoachDtlTreeByVthh = chain(data)
      .groupBy("tenLoaiVthh")
      .map((value, key) => {
        let idVirtual = uuidv4();
        this.expandSetStringLoaiVthh.add(idVirtual);
        return {
          idVirtual: idVirtual,
          tenLoaiVthh: key,
          childData: value
        };
      }).value();
  }

  async save() {
    try {
      this.spinner.show();
      this.helperService.markFormGroupTouched(this.formData)
      if (this.formData.invalid) {
        return;
      }
      if (this.formData.get("thoiGianDuKienXuat").value) {
        this.formData.value.thoiGianDuKienXuatTu = this.formData.get("thoiGianDuKienXuat").value[0] ? this.formData.get("thoiGianDuKienXuat").value[0] : null;
        this.formData.value.thoiGianDuKienXuatDen = this.formData.get("thoiGianDuKienXuat").value[1] ? this.formData.get("thoiGianDuKienXuat").value[1] : null;
      }
      this.formData.value.xhXkKhXuatHangDtl.forEach(item => {
        delete item.id;
        delete item.thoiGianDuKienXuat;
      });
      let data = await this.createUpdate(this.formData.value);
      if (data) {
        if (!this.idInput) {
          this.idInput = data.id;
          this.formData.patchValue({id: data.id, trangThai: data.trangThai});
        }
      } else {
        this.notification.error(MESSAGE.ERROR, "Có lỗi xảy ra.");
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async getDetail(id: number) {
    await this.tongHopKeHoachXuatHangService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
          if (dataDetail) {
            let thoiGianDuKienXuat = [dataDetail.thoiGianDuKienXuatTu, dataDetail.thoiGianDuKienXuatDen];
            if (dataDetail.thoiGianDuKienXuatTu || dataDetail.thoiGianDuKienXuatDen) {
              this.formData.patchValue({
                thoiGianDuKienXuat: thoiGianDuKienXuat
              });
            }
            this.listKeHoachDtl = cloneDeep(dataDetail.xhXkKhXuatHangDtl);
            this.listDxCuc = cloneDeep(dataDetail.listDxCuc);
            this.isTongHop = true;
            this.buildTableView(this.listKeHoachDtl);
            this.buildTableViewByLoaiVthh(this.listKeHoachDtl);
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }
}
