import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DialogThongTinPhuLucBangGiaHopDongComponent
} from 'src/app/components/dialog/dialog-thong-tin-phu-luc-bang-gia-hop-dong/dialog-thong-tin-phu-luc-bang-gia-hop-dong.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { STATUS } from "../../../../../../constants/status";
import { ThongTinPhuLucHopDongService } from "../../../../../../services/thongTinPhuLucHopDong.service";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { QuyetDinhPheDuyetKetQuaChaoGiaMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ket-qua-chao-gia-mtt.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './../../../../../../services/storage.service';
import { DanhMucService } from './../../../../../../services/danhmuc.service';
import { UploadFileService } from './../../../../../../services/uploaFile.service';

@Component({
  selector: 'app-themmoi-hopdong-phuluc',
  templateUrl: './themmoi-hopdong-phuluc.component.html',
  styleUrls: ['./themmoi-hopdong-phuluc.component.scss']
})

export class ThemmoiHopdongPhulucComponent extends Base2Component implements OnInit, OnChanges {
  @Input() idInput: number;
  @Input() isView: boolean = false;
  @Input() isQuanLy: boolean = false;
  @Input() loaiVthh: String;
  @Input() idChaoGia: number;
  @Input() dataBinding: any;
  @Input() idKqMtt: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  detail: any = {};
  listLoaiHopDong: any[] = [];
  isViewPhuLuc: boolean = false;
  idPhuLuc: number = 0;
  maHopDongSuffix: string = '';
  listQdPdKqChaoGia: any[] = [];
  listDviCungCap: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
    private thongTinPhuLucHopDongService: ThongTinPhuLucHopDongService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinPhuLucHopDongService);
    this.formData = this.fb.group(
      {
        id: [null],
        idHd: [null],
        nam: [dayjs().get('year'), [Validators.required]],
        idQdPdKq: [null, [Validators.required]],
        soQdPdKq: [null, [Validators.required]],
        idQdPdKh: [null, [Validators.required]],
        soQdPdKh: [null, [Validators.required]],
        ngayKyQdPdKh: [null],
        tgianNkho: [null],
        soHd: [null, [Validators.required]],
        tenHd: [null, [Validators.required]],
        ngayKy: [null],
        ngayKyGhiChu: [null],
        loaiHdong: [null, [Validators.required]],
        loaiHdongGhiChu: [null],
        soNgayThien: [null, [Validators.required]],
        tgianGnhan: [null, [Validators.required]],
        tgianGnhanTu: [],
        tgianGnhanDen: [],
        tgianGnhanGhiChu: [null],
        noiDung: [null, [Validators.required]],
        dieuKien: [null, [Validators.required]],
        maDvi: [null],
        tenDvi: [null],
        cdtTen: [null],
        cdtDiaChi: [null],
        cdtMst: [null],
        cdtTenNguoiDdien: [null],
        cdtChucVu: [null],
        cdtSdt: [null],
        cdtFax: [null],
        cdtStk: [null],
        cdtMoTai: [null],
        cdtThongTinGiayUyQuyen: [null],
        nccTen: [null],
        nccDiaChi: [null],
        nccMst: [null],
        nccTenNguoiDdien: [null],
        nccChucVu: [null],
        nccSdt: [null],
        nccFax: [null],
        nccStk: [null],
        nccMoTai: [null],
        nccThongTinGiayUyQuyen: [null],
        loaiVthh: [null],
        tenLoaiVthh: [null],
        cloaiVthh: [null],
        tenCloaiVthh: [null],
        moTaHangHoa: [null],
        donViTinh: [null],
        soLuong: [null],
        donGia: [null],
        donGiaVat: [null],
        thanhTien: [null],
        thanhTienBangChu: [null],
        ghiChu: [null],
        nguoiKy: [null],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự Thảo'],
        lyDoTuChoi: [null],
        trangThaiNh: [STATUS.CHUA_THUC_HIEN],
        tenTrangThaiNh: [null],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    await Promise.all([
      this.loadDataComboBox(),
      this.onChangeNam()
    ]);
    if (this.idInput) {
      // Đã có onchange
      // await this.loadChiTiet(this.id);
    } else {
      await this.initForm();
    }
    await this.spinner.hide();
  }

  async loadDataComboBox() {
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.loaiHopDongGetAll();
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
  }

  async initForm() {
    this.userInfo = this.userService.getUserLogin();
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
    })
    if (this.dataBinding) {
      await this.bindingDataQdPdKqChaoGia(this.dataBinding.id);
    }
  }

  async onChangeNam() {
    let namKh = this.formData.get('nam').value;
    this.maHopDongSuffix = `/${namKh}/HĐMB`;
    await this.getListQdKqLcnt();
  }

  async getListQdKqLcnt() {

  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.thongTinPhuLucHopDongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            maHdong: data.soHd?.split('/')[0],
            tgianGnhan: data.tgianGnhanTu && data.tgianGnhanDen ? [data.tgianGnhanTu, data.tgianGnhanDen] : null

          });
          this.fileDinhKem = data.fileDinhKems;
          this.dataTable = data.details;
        }
      }
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  async save(isKy?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    if (this.formData.value.maHdong) {
      body.soHd = `${this.formData.value.maHdong}${this.maHopDongSuffix}`;
      body.tgianGnhanDen = this.formData.get('tgianGnhan').value
        ? dayjs(this.formData.get('tgianGnhan').value[0]).format(
          'YYYY-MM-DD',
        )
        : null;
      body.tgianGnhanTu = this.formData.get('tgianGnhan').value
        ? dayjs(this.formData.get('tgianGnhan').value[1]).format(
          'YYYY-MM-DD',
        )
        : null;
    }
    body.fileDinhKems = this.fileDinhKem;
    body.detail = this.dataTable;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.thongTinPhuLucHopDongService.update(body);
    } else {
      res = await this.thongTinPhuLucHopDongService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isKy) {
        this.idInput = res.data.id;
        await this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.back();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.back();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }




  redirectPhuLuc(id) {
    this.isViewPhuLuc = true;
    this.idPhuLuc = id;
  }

  showChiTiet() {
    this.isViewPhuLuc = false;
    this.loadChiTiet(this.idInput);
  }

  openDialogBang(data) {
    const modalPhuLuc = this.modal.create({
      nzTitle: 'Thông tin phụ lục bảng giá chi tiết hợp đồng',
      nzContent: DialogThongTinPhuLucBangGiaHopDongComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalPhuLuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }

  async openDialogQdPdKqChaoGia() {
    await this.spinner.show();
    let body = {
      trangThai: STATUS.BAN_HANH,
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      loaiVthh: this.loaiVthh
    }
    let res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listQdPdKqChaoGia = res.data.content.filter(item => item.trangThaiHd != STATUS.HOAN_THANH_CAP_NHAT);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();


    const modalQD = this.modal.create({
      nzTitle: 'Danh sách kết quả lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdPdKqChaoGia,
        dataHeader: ['Số QĐ phê duyệt kết quả chào giá', 'Số QĐ phê duyệt kế hoạch mua trực tiếp'],
        dataColumn: ['soQd', 'soQdPdKh'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQdPdKqChaoGia(data.id);
      }
    });
  }

  async bindingDataQdPdKqChaoGia(idQdPdKq) {
    await this.spinner.show();
    let res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.getDetail(idQdPdKq);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.bindingDataQdPdKh(data);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
    }
    await this.spinner.hide();
  }


  bindingDataQdPdKh(data) {
    const dataDtl = data.hhQdPheduyetKhMttDx
    this.listDviCungCap = dataDtl.hhChiTietTTinChaoGiaList;
    this.dataTable = dataDtl.children;
    this.formData.patchValue({
      soQdPdKq: data.soQd,
      idQdPdKq: data.id,
      ngayKyQdPdKh: dataDtl.hhQdPheduyetKhMttHdr.ngayQd,
      tgianNkho: data.tgianKthuc,
      soQdPdKh: data.soQdPdKh,
      idQdPdKh: data.idQdPdKh,
      loaiVthh: dataDtl.loaiVthh,
      tenLoaiVthh: dataDtl.tenLoaiVthh,
      cloaiVthh: dataDtl.cloaiVthh,
      tenCloaiVthh: dataDtl.tenCloaiVthh,
      moTaHangHoa: dataDtl.moTaHangHoa,
      donViTinh: "kg",
      soLuong: dataDtl.tongSoLuong * 1000,
      donGiaVat: dataDtl.donGia * dataDtl * dataDtl.thueGtgt,
      thanhTien: +(dataDtl.tongSoLuong * 1000) * +(dataDtl.donGiaVat),
    })

  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  back() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO: {
        trangThai = STATUS.DA_KY;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  xoaPhuLuc(id: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.thongTinPhuLucHopDongService.delete({ id: id })
            .then(async () => {
              await this.loadChiTiet(this.idInput);
            });
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        this.spinner.hide();
      },
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      await this.spinner.show();
      await this.loadChiTiet(this.idInput);
      await this.spinner.hide()
    }
  }

  isDisableForm(): boolean {
    if (this.formData.value.trangThai == STATUS.DA_KY) {
      return true;
    } else {
      return false
    }
  }

  getNameFile($event: any) {
    if ($event.target.files) {
      const itemFile = {
        name: $event.target.files[0].name,
        file: $event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKemQd = new FileDinhKem();
          fileDinhKemQd.fileName = resUpload.filename;
          fileDinhKemQd.fileSize = resUpload.size;
          fileDinhKemQd.fileUrl = resUpload.url;
          fileDinhKemQd.idVirtual = new Date().getTime();
          this.formData.patchValue({ fileDinhKem: fileDinhKemQd, fileName: itemFile.name })
        });
    }
  }

}
