
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {Globals} from "../../../../shared/globals";
import {HelperService} from "../../../../services/helper.service";
import {STATUS} from "../../../../constants/status";
import dayjs from "dayjs";
import {UserLogin} from "../../../../models/userlogin";
import {MESSAGE} from "../../../../constants/message";
import {DANH_MUC_LEVEL} from "../../luu-kho.constant";
import {saveAs} from 'file-saver';
import {DonviService} from "../../../../services/donvi.service";
import {TheoDoiBqService} from "../../../../services/theo-doi-bq.service";
import {DialogTuChoiComponent} from "../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {BangKeNhapScService} from "../../../../services/sua-chua/bangKeNhapSc.service";
import {PhieuNhapKhoScService} from "../../../../services/sua-chua/phieuNhapKhoSc.service";
import {QuyetDinhNhService} from "../../../../services/sua-chua/quyetDinhNh.service";
import {
  DialogTableSelectionComponent
} from "../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {convertTienTobangChu} from "../../../../shared/commonFunction";
import {Base3Component} from "../../../../components/base3/base3.component";
import { cloneDeep, chain } from 'lodash';
import {QuanLySoKhoTheKhoService} from "../../../../services/quan-ly-so-kho-the-kho.service";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {ThemmoiThComponent} from "../../../sua-chua/tong-hop/themmoi-th/themmoi-th.component";
import {ThemMoiCtietTdbqComponent} from "./them-moi-ctiet-tdbq/them-moi-ctiet-tdbq.component";

@Component({
  selector: 'app-them-moi-so-theo-doi-bq',
  templateUrl: './them-moi-so-theo-doi-bq.component.html',
  styleUrls: ['./them-moi-so-theo-doi-bq.component.scss']
})
export class ThemMoiSoTheoDoiBqComponent extends Base3Component implements OnInit {

  rowItem: any = {};

  listPhuongThucBaoQuan : any[] = []
  listHinhThucBaoQuan : any[] = []
  monthFormat = 'MM/yyyy'
  monthSelect = new Date();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private theoDoiBqService: TheoDoiBqService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
    private danhMucService : DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, theoDoiBqService);
    this.defaultURL = 'luu-kho/theo-doi-bao-quan'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().year(), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      tenKtv: [''],
      soSoTdbq: ['', [Validators.required]],
      tenSoTdbq: ['', [Validators.required]],
      soKho: ['', [Validators.required]],
      idSoKho: ['', [Validators.required]],
      ngayLapSoKho: ['', [Validators.required]],
      maDiemKho : [''],
      tenDiemKho: ['',],
      maNhaKho : [''],
      tenNhaKho: ['',],
      maNganKho : [''],
      tenNganKho: ['',],
      maLoKho : [''],
      tenLoKho: ['',],
      tenThuKho : [''],
      loaiVthh : [''],
      tenLoaiVthh: [''],
      cloaiVthh : [''],
      tenCloaiVthh: [''],
      tenHangHoa : [''],
      soLuong: [''],
      dviTinh: [''],
      ngayNhapDayKho: [''],
      ngayNhapTu: [''],
      ngayNhapDen: [''],
      quyCach: [''],
      thoiHanLuuKho: [''],
      thoiHanBaoHanh: [''],
      pthucBquan: [''],
      hthucBquan: [''],
      lyDoTuChoi: ['']
    });

    this.formData.controls.cloaiVthh.valueChanges.subscribe(value => {
        this.loadDataComboBox();
    });
  };

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.getId(),
      await this.initForm()
    ]);
    this.spinner.hide();
  }

  async initForm() {
    if (this.id) {
      this.spinner.show();
      await this.detail(this.id).then((res) => {
        this.spinner.hide();
        if (res) {
          this.dataTable = res.children;
          this.loadDataComboBox();
          // this.bindingDataQdXuatHang(res.idQdNh);
          // this.bindingDataPhieuXuatKho(res.idPhieuNhapKho);
        }
      })
    } else {
      await this.userService.getId("LK_THEO_DOI_BAO_QUAN_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soSoTdbq: res + '/' + this.formData.value.nam + '/STDBQ-CCDTVT',
          tenDvi: this.userInfo.TEN_DVI,
          tenKtv: this.userInfo.TEN_DAY_DU
        })
      });
    }
  }

  async loadDataComboBox() {
    if (this.formData.value.cloaiVthh) {
      let res = await this.danhMucService.getDetail(this.formData.value.cloaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
        this.listHinhThucBaoQuan = res.data?.hinhThucBq
      }
    }
  }

  openDialogDanhSach() {
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.quanLySoKhoTheKhoService.getDsTaoSoTheoDoiBaoQuan({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayNhap = item.thoiHanNhap;
          item.ngayXuat = item.thoiHanXuat;
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách sổ kho',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Sổ kho', 'Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
            dataColumn: ['ten', 'tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.bindingDataSoKho(data.id)
          }
        });
      }
    })
  }

  bindingDataSoKho(id) {
    this.spinner.show();
    this.quanLySoKhoTheKhoService.getDetail(id).then((res) => {
      if (res.data) {
        const data = res.data
        console.log(data)
        this.formData.patchValue({
          soKho: data.ten,
          idSoKho: data.id,
          ngayLapSoKho: data.ngayTao,
          maDiemKho : data.maDiemKho,
          tenDiemKho : data.tenDiemKho,
          maNhaKho : data.maDiemKho,
          tenNhaKho : data.tenNhaKho,
          maNganKho : data.maDiemKho,
          tenNganKho : data.tenNganKho,
          maLoKho : data.maDiemKho,
          tenLoKho : data.tenLoKho,
          loaiVthh : data.loaiVthh,
          tenLoaiVthh : data.tenLoaiVthh,
          cloaiVthh : data.cloaiVthh,
          tenCloaiVthh : data.tenCloaiVthh,
          tenHangHoa : data.tenHangHoa,
          soLuong : data.soLuong,
          dviTinh : data.donViTinh
        })
      }
      this.loadDataComboBox();
      this.spinner.hide();
    });
  }

  openDialogPhieuXuatKho() {
    if (!this.formData.value.idQdNh) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn số quyết định giao nhiệm vụ nhập hàng");
      return;
    }
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    // this.phieuNhapKhoScService.getDanhSachTaoBangKe({idQdNh: this.formData.value.idQdNh}).then((res) => {
    //   this.spinner.hide();
    //   if (res.data) {
    //     const modalQD = this.modal.create({
    //       nzTitle: 'Danh sách phiếu nhập kho',
    //       nzContent: DialogTableSelectionComponent,
    //       nzMaskClosable: false,
    //       nzClosable: false,
    //       nzWidth: '900px',
    //       nzFooter: null,
    //       nzComponentParams: {
    //         dataTable: res.data,
    //         dataHeader: ['Số phiếu nhập kho', 'Ghi chú'],
    //         dataColumn: ['soPhieuNhapKho', 'ghiChu']
    //       },
    //     });
    //     modalQD.afterClose.subscribe(async (data) => {
    //       if (data) {
    //         this.bindingDataPhieuXuatKho(data.id)
    //       }
    //     });
    //   }
    // })
  }

  bindingDataPhieuXuatKho(idPhieuNhapKho) {
    this.spinner.show();
    // this.phieuNhapKhoScService.getDetail(idPhieuNhapKho).then((res) => {
    //   const data = res.data;
    //   this.formData.patchValue({
    //     soPhieuNhapKho: data.soPhieuNhapKho,
    //     idPhieuNhapKho: data.id,
    //     ngayNhapKho: data.ngayNhapKho,
    //     tenDiemKho: data.tenDiemKho,
    //     tenNhaKho: data.tenNhaKho,
    //     tenNganKho: data.tenNganKho,
    //     tenLoKho: data.tenLoKho,
    //     diaDiemKho: data.diaDiemKho,
    //     tenLoaiVthh: data.tenLoaiVthh,
    //     tenCloaiVthh: data.tenCloaiVthh,
    //     nguoiGiaoHang: data.nguoiGiaoHang,
    //     soCmt: data.soCmt,
    //     dviNguoiGiaoHang: data.dviNguoiGiaoHang,
    //     diaChi: data.diaChi,
    //     thoiGianGiaoNhan: data.thoiGianGiaoNhan,
    //     donViTinh: data.donViTinh,
    //     ngayXuatKho: data.ngayXuatKho
    //   })
    //   this.spinner.hide();
    // });
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.DU_THAO;
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    let body = this.formData.value;
    body.children = this.dataTable;
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.pheDuyet();
        } else {
          this.redirectDefault();
        }
      }
    })
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.DU_THAO :
        trangThai = STATUS.CHO_DUYET_KT;
        break;
      case STATUS.CHO_DUYET_KT :
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      case STATUS.CHO_DUYET_LDCC :
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
    }
    this.approve(this.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_KT :
        trangThai = STATUS.TU_CHOI_KT;
        break;
      case STATUS.CHO_DUYET_LDCC :
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
    }
    this.reject(this.id, trangThai);
  }

  disabled() {
    return this.formData.value.trangThai != STATUS.DU_THAO;
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.CHO_DUYET_KT || trangThai == STATUS.CHO_DUYET_LDCC;
  }

  addRow() {
    if (this.validateRow()) {
      let dataRow = cloneDeep(this.rowItem);
      this.dataTable.push(dataRow);
      this.rowItem.slThucTe = 0;
      this.rowItem.maSo = null;
      console.log(this.calTongSlThucTe());
      this.formData.patchValue({
        tongSoLuong: this.calTongSlThucTe()
      })
    }
  }

  deleteRow(i: number): void {
    this.dataTable = this.dataTable.filter((d, index) => index !== i);
  }

  validateRow(): boolean {
    if (this.rowItem.soSerial && this.rowItem.soLuong) {
      if (this.dataTable.filter(i => i.soSerial == this.rowItem.soSerial).length > 0) {
        this.notification.error(MESSAGE.ERROR, "Số serial đã tồn tại");
        return false
      }
      if (this.rowItem.soLuong <= 0) {
        this.notification.error(MESSAGE.ERROR, "Số lượng thực tế phải lớn hơn 0");
        return false
      }
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đủ thông tin");
      return false;
    }
    return true
  }

  calTongSlThucTe() {
    if (this.dataTable) {
      let sum = 0
      this.dataTable.forEach(item => {
        sum += this.nvl(item.soLuong);
      })
      return sum;
    }
  }

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
  }

  changeMonth(event) {
    if (event) {
      // this.dataLich = [];
      // const date = new Date(event);
      // const month = date.getMonth();
      // let data = this.weekOfMonth.filter( item => item.key == month+1);
      // if(data && data.length > 0){
      //   const listWeek = data[0].value;
      //   listWeek.forEach(item => {
      //     this.timTatCaLichLanhDaoTongCuc(item);
      //   })
      // }
    }
  }

  themMoiCtiet(idDtl : number ,isXacNhan?:boolean){
    console.log(idDtl,isXacNhan)
    const modalGT = this.modal.create({
      nzTitle: 'Thông tin chi tiết',
      nzContent: ThemMoiCtietTdbqComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        dataHdr : this.formData.value
      },
    });
  }
}
