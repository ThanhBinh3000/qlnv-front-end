import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from "../../../../../../constants/status";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhPdKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { DeXuatKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import { TongHopKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/tong-hop-kh-ban-truc-tiep.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
@Component({
  selector: 'app-them-moi-qd-phe-duyet-kh-ban-truc-tiep',
  templateUrl: './them-moi-qd-phe-duyet-kh-ban-truc-tiep.component.html',
  styleUrls: ['./them-moi-qd-phe-duyet-kh-ban-truc-tiep.component.scss']
})

export class ThemMoiQdPheDuyetKhBanTrucTiepComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() dataTongHop: any;
  @Input() isViewOnModal: boolean;
  @Input() idTh: number = 0;
  @Output()
  showListEvent = new EventEmitter<any>();

  fileDinhKems: any[] = []
  maQd: string = null;
  listDanhSachTongHop: any[] = [];
  listToTrinh: any[] = [];
  danhsachDx: any[] = [];
  dataInput: any;
  dataInputCache: any;
  isTongHop: boolean
  selected: boolean = false;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
    private tongHopKhBanTrucTiepService: TongHopKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBanTrucTiepService);

    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year'), Validators.required],
      soQdPd: ['',],
      ngayKyQd: ['',],
      ngayHluc: ['',],
      idThHdr: [],
      soTrHdr: [''],
      idTrHdr: [],
      trichYeu: [''],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      phanLoai: ['TH', [Validators.required]],
      soQdCc: [''],
      slDviTsan: [],
      loaiHinhNx: [''],
      kieuNx: [''],
    })
  }

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      this.formData.controls["ngayKyQd"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQdPd"].clearValidators();
      this.formData.controls["ngayKyQd"].clearValidators();
      this.formData.controls["ngayHluc"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TH') {
      this.formData.controls["idThHdr"].setValidators([Validators.required]);
      this.formData.controls["idTrHdr"].clearValidators();
      this.formData.controls["soTrHdr"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TTr') {
      this.formData.controls["idThHdr"].clearValidators();
      this.formData.controls["idTrHdr"].setValidators([Validators.required]);
      this.formData.controls["soTrHdr"].setValidators([Validators.required]);
    }
  }

  isDetailPermission() {
    if (this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_QDLCNT_THEM")) {
      return true;
    }
    return false;
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = this.userInfo.MA_QD;
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
      }
      await Promise.all([
        this.loadDataComboBox(),
        this.bindingDataTongHop(this.dataTongHop),
      ]);
      if (this.idTh) {
        await this.selectMaTongHop(this.idTh)
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_TT');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
  }

  async showFirstRow($event, dataDxBtt: any) {
    await this.showDetail($event, dataDxBtt);
  }

  async bindingDataTongHop(dataTongHop?) {
    if (dataTongHop) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenLoaiVthh: dataTongHop.tenLoaiVthh,
        namKh: dataTongHop.namKh,
        idThHdr: dataTongHop.id,
        phanLoai: 'TH',
      })
      await this.selectMaTongHop(dataTongHop.id);
    }
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    this.setValidator(isGuiDuyet)
    let body = this.formData.value;
    if (this.formData.value.soQdPd) {
      body.soQdPd = this.formData.value.soQdPd + "/" + this.maQd;
    }
    body.children = this.danhsachDx;
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKem = this.fileDinhKem;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.guiDuyet();
      } else {
        this.loadChiTiet(data.id)
      }
    }
    await this.spinner.hide();
  }

  tuChoi() {
    this.reject(this.idInput, STATUS.TU_CHOI_LDV)
  }

  async guiDuyet() {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Văn bản sẵn sàng ban hành ?'
    this.approve(this.idInput, trangThai, mesg);
  }

  async loadChiTiet(id: number) {
    this.spinner.show()
    if (id) {
      let data = await this.detail(id);
      this.formData.patchValue({
        soQdPd: data.soQdPd?.split('/')[0]
      })
      this.danhsachDx = data.children;
      if (this.danhsachDx && this.danhsachDx.length > 0) {
        this.showFirstRow(event, this.danhsachDx[0]);
      }
      this.fileDinhKem = data.fileDinhKem;
      this.fileDinhKems = data.fileDinhKems;
    }
    this.spinner.hide()
  }

  async openDialogTh() {
    if (this.formData.get('phanLoai').value != 'TH') {
      return;
    }
    await this.spinner.show();
    let bodyTh = {
      trangThai: STATUS.CHUA_TAO_QD,
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resTh = await this.tongHopKhBanTrucTiepService.search(bodyTh);
    if (resTh.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = resTh.data.content;
    }
    await this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH TỔNG HỢP KẾ HOẠCH BÁN TRỰC TIẾP',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachTongHop,
        dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
        dataColumn: ['id', 'noiDungThop']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.selectMaTongHop(data.id);
      }
    });
  }

  async selectMaTongHop(event) {
    await this.spinner.show()
    let soLuongDviTsan: number = 0;
    if (event) {
      const res = await this.tongHopKhBanTrucTiepService.getDetail(event)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        if (data.idSoQdPd) {
          this.loadChiTiet(data.idSoQdPd)
        } else {
          data.children.forEach((item) => {
            soLuongDviTsan += item.slDviTsan;
          })
          this.formData.patchValue({
            cloaiVthh: data.cloaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            loaiVthh: data.loaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            slDviTsan: soLuongDviTsan,
            loaiHinhNx: data.loaiHinhNx,
            kieuNx: data.kieuNx,
            idThHdr: event,
            idTrHdr: null,
            soTrHdr: null,
          })
          for (let item of data.children) {
            await this.deXuatKhBanTrucTiepService.getDetail(item.idDxHdr).then((res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                const dataRes = res.data;
                this.formData.patchValue({
                  tchuanCluong: dataRes.tchuanCluong,
                  soQdCc: dataRes.soQdCtieu,
                })
                dataRes.idDxHdr = dataRes.id;
                this.danhsachDx.push(dataRes);
                if (this.danhsachDx && this.danhsachDx.length > 0) {
                  this.showFirstRow(event, this.danhsachDx[0]);
                }
              }
            })
          };
          this.dataInput = null;
          this.dataInputCache = null;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide()
  }

  async openDialogTr() {
    if (this.formData.get('phanLoai').value != 'TTr') {
      return
    }
    await this.spinner.show();
    // Get data tờ trình
    let bodyToTrinh = {
      trangThai: STATUS.DA_DUYET_LDC,
      trangThaiTh: STATUS.CHUA_TONG_HOP,
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resToTrinh = await this.deXuatKhBanTrucTiepService.search(bodyToTrinh);
    if (resToTrinh.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = resToTrinh.data.content;
    }
    await this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH ĐỀ XUẤT KẾ HOẠCH BÁN TRỰC TIẾP',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listToTrinh,
        dataHeader: ['Số tờ trình đề xuất', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soDxuat', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeIdTrHdr(data);
      }
    });
  }

  async onChangeIdTrHdr(data) {
    await this.spinner.show();
    this.danhsachDx = [];
    if (data) {
      const res = await this.deXuatKhBanTrucTiepService.getDetail(data.id)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataRes = res.data;
        dataRes.idDxHdr = dataRes.id;
        this.danhsachDx.push(dataRes);
        if (this.danhsachDx && this.danhsachDx.length > 0) {
          this.showFirstRow(event, this.danhsachDx[0]);
        }
        let tongMucDt = 0
        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tchuanCluong: data.tchuanCluong,
          moTaHangHoa: data.moTaHangHoa,
          tgianDkienTu: data.tgianDkienTu,
          tgianDkienDen: data.tgianDkienDen,
          tgianTtoan: data.tgianTtoan,
          tgianTtoanGhiChu: data.tgianTtoanGhiChu,
          pthucTtoan: data.pthucTtoan,
          tgianGnhan: data.tgianGnhan,
          tgianGnhanGhiChu: data.tgianGnhanGhiChu,
          pthucGnhan: data.pthucGnhan,
          thongBaoKh: data.thongBaoKh,
          soQdCc: data.soQdCtieu,
          tenDvi: data.tenDvi,
          diaChi: data.diaChi,
          maDvi: data.maDvi,
          loaiHinhNx: data.loaiHinhNx,
          kieuNx: data.kieuNx,
          idThHdr: null,
          soTrHdr: dataRes.soDxuat,
          idTrHdr: dataRes.id,
          slDviTsan: dataRes.slDviTsan,
          tongMucDt: tongMucDt
        })
        this.dataInput = null;
        this.dataInputCache = null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide();
  }

  index = 0;
  async showDetail($event, index) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow');
      this.isTongHop = this.formData.value.phanLoai == 'TH';
      this.dataInput = this.danhsachDx[index];
      if (this.dataInput) {
        let res = await this.deXuatKhBanTrucTiepService.getDetail(this.dataInput.idDxHdr);
        this.dataInputCache = res.data;
      }
      this.index = index;
      await this.spinner.hide();
    } else {
      this.selected = true
      this.isTongHop = this.formData.value.phanLoai == 'TH';
      this.dataInput = this.danhsachDx[0];
      if (this.dataInput) {
        let res = await this.deXuatKhBanTrucTiepService.getDetail(this.dataInput.idDxHdr);
        this.dataInputCache = res.data;
      }
      this.index = 0;
      await this.spinner.hide();
    }
  }

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.DU_THAO) {
      return false;
    } else {
      return true;
    }
  }

  isDisabledQD() {
    if (this.formData.value.id == null) {
      return false
    } else {
      return true;
    }
  }
}
