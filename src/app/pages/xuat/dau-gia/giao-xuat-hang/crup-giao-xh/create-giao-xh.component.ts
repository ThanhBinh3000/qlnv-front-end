import { Component, Input, OnInit, } from '@angular/core';
import { Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import {
  QuyetDinhGiaoNvXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import {
  HopDongXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import { DonviService } from "src/app/services/donvi.service";
import { QdPdKetQuaBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-create-giao-xh',
  templateUrl: './create-giao-xh.component.html',
  styleUrls: ['./create-giao-xh.component.scss'],
})
export class CreateGiaoXh extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() isDetail;
  @Input() isViewOnModal: boolean;

  maQd: string = null;
  dataInput: any;
  dataInputCache: any;
  fileDinhKems: any[] = []

  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  loadDanhSachQdGiaoNv: any[] = [];
  dataHopDong:any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private donviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvXuatHangService);
    this.formData = this.fb.group({
      id: [null],
      nam: [],
      soQd: ['',],
      maDvi: [''],
      tenDvi: [''],
      ngayKy: ['',],
      idHd: [],
      soHd: ['', [Validators.required]],
      ngayKyHd: [''],
      maDviTsan: [''],
      tenTtcn: ['',],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      donViTinh: [''],
      tgianGnhan: [''],
      trichYeu: [''],
      soLuong: [],
      trangThaiXh: [''],
      bbTinhKho: [''],
      bbHaoDoi: [''],
      trangThai: [''],
      tenTrangThai: [''],
      fileName: [],
      lyDoTuChoi: [],
      loaiHinhNx: [],
      kieuNx: [],
    });

  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maQd = this.userInfo.MA_QD;
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        this.initForm();
      }
      await this.loadDataComboBox();
    }catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_DG');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
  }

  initForm() {
    this.formData.patchValue({
      nam: dayjs().get('year'),
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    })
  }

  async openDialogSoHopDong() {
    await this.spinner.show();
    let body = {
      trangThai: STATUS.DA_KY,
      maDvi: this.formData.value.maDvi,
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
    }
    await this.loadDsQdGiaoNv();
    let res = await this.hopDongXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data.content
      if(data && data.length > 0){
        console
        let set = new Set(this.loadDanhSachQdGiaoNv.map(item =>JSON.stringify({soHd: item.soHd})));
        this.dataHopDong = data.filter(item =>{
          const key = JSON.stringify({ soHd: item.soHd });
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
        dataTable: this.dataHopDong,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.loadDtailHopDong(data.id);
      }
    });
    await this.spinner.hide();
  }

 async loadDtailHopDong(idHd){
   await this.spinner.show();
   if(idHd > 0){
     await this.hopDongXuatHangService.getDetail(idHd)
       .then((res) =>{
         if (res.msg == MESSAGE.SUCCESS) {
           const dataHd = res.data;
           this.formData.patchValue({
             soHd: dataHd.soHd,
             idHd: dataHd.id,
             ngayKyHd: dataHd.ngayPduyet,
             maDviTsan: dataHd.maDviTsan,
             loaiVthh: dataHd.loaiVthh,
             tenLoaiVthh: dataHd.tenLoaiVthh,
             cloaiVthh: dataHd.cloaiVthh,
             tenCloaiVthh: dataHd.tenCloaiVthh,
             moTaHangHoa: dataHd.moTaHangHoa,
             soLuong: dataHd.soLuong,
             donViTinh: dataHd.donViTinh,
             tgianGnhan: dataHd.ngayHluc,
             tenTtcn: dataHd.tenNguoiDdienNhaThau,
             kieuNx: dataHd.kieuNhapXuat,
             loaiHinhNx: dataHd.loaiHinhNx
           })
           this.dataTable = dataHd.children;
         }
       }).catch((e) => {
         console.log('error: ', e);
         this.spinner.hide();
         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
       });
   }
   await this.spinner.hide();
  }

  async loadDsQdGiaoNv() {
    let body = {
      maDvi: this.formData.value.maDvi,
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.quyetDinhGiaoNvXuatHangService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if(data && data.content && data.content.length >0){
        this.loadDanhSachQdGiaoNv = data.content
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKem = this.fileDinhKem;
    body.children = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      } else {
        // this.goBack()
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        msg = MESSAGE.BAN_HANH_CONFIRM;
        trangThai = STATUS.BAN_HANH;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let data = await this.detail(id);
      this.formData.patchValue({
        soQd: data.soQd?.split('/')[0],
      })
      this.dataTable = data.children;
      this.fileDinhKems = data.fileDinhKems;
      this.fileDinhKem = data.fileDinhKem;
    }
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.BAN_HANH || trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC) {
      return true
    }
    return false;
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

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["nam"].setValidators([Validators.required]);
      this.formData.controls["soQd"].setValidators([Validators.required]);
      this.formData.controls["ngayKy"].setValidators([Validators.required]);
      this.formData.controls["maDviTsan"].setValidators([Validators.required]);
      this.formData.controls["tenTtcn"].setValidators([Validators.required]);
    } else {
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["nam"].clearValidators();
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["ngayKy"].clearValidators();
      this.formData.controls["maDviTsan"].clearValidators();
      this.formData.controls["tenTtcn"].clearValidators();
    }
  }
}
