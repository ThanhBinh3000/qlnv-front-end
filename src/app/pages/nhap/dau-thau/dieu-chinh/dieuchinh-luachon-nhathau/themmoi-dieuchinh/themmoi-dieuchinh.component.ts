import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCanCuQDPheDuyetKHLCNTComponent } from 'src/app/components/dialog/dialog-can-cu-qd-phe-duyet-khlcnt/dialog-can-cu-qd-phe-duyet-khlcnt.component';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DATEPICKER_CONFIG } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { dauThauGoiThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { DieuChinhQuyetDinhPdKhlcntService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/dieuchinh-khlcnt/dieuChinhQuyetDinhPdKhlcnt.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";
import { cloneDeep } from "lodash";
import { ThongtinDieuchinhComponent } from './thongtin-dieuchinh/thongtin-dieuchinh.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';


@Component({
  selector: 'app-themmoi-dieuchinh',
  templateUrl: './themmoi-dieuchinh.component.html',
  styleUrls: ['./themmoi-dieuchinh.component.scss']
})
export class ThemMoiDieuChinhComponent extends Base2Component implements OnInit {

  @ViewChild('thongTinDc') thongtinDieuchinhComponent: ThongtinDieuchinhComponent;

  @Input() isViewDetail: boolean;
  @Input() loaiVthh: string;
  @Input() id: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  danhsachDx: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private dieuChinhQuyetDinhPdKhlcntService: DieuChinhQuyetDinhPdKhlcntService,
    private danhMucService: DanhMucService,
    private dauThauGoiThauService: dauThauGoiThauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dieuChinhQuyetDinhPdKhlcntService)
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().get('year'), Validators.required],
      soQdDc: ['', [Validators.required]],
      idQdGoc: ['', Validators.required],
      soQdGoc: ['', [Validators.required]],
      ngayQdGoc: [''],
      ngayQd: ['', [Validators.required]],
      ngayHluc: ['', [Validators.required]],
      trichYeu: [''],
      hthucLcnt: [''],
      pthucLcnt: [''],
      loaiHdong: [''],
      nguonVon: [''],
      tgianBdauTchuc: [''],
      tgianDthau: [''],
      tgianMthau: [''],
      tgianNhang: [''],
      tgianThien: [''],
      ghiChu: [''],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      tchuanCluong: [''],
      lyDoTuchoi: [''],
    });
  }
  maQd: string = '';
  isVatTu: boolean = false;
  listQdGoc: any[] = [];
  listNthauNopHs: any[] = [];
  listDiaDiemNhapHang: any[] = [];
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  editDiaDiemCache: { [key: string]: { edit: boolean; data: any } } = {};
  i = 0;
  listNguonVon: any[] = []
  listPhuongThucDauThau: any[] = []
  listHinhThucDauThau: any[] = []
  listLoaiHopDong: any[] = []
  listVthh: any[] = [];


  isDetail = false;
  dataInput: any;
  dataInputCache: any;


  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadDataComboBox(),
      ]);
      this.maQd = "/" + this.userInfo.MA_QD
      if (this.id) {
        this.getDetail();
      } else {
        this.initForm();
      }
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // phương thức đấu thầu
    this.listPhuongThucDauThau = [];
    let resPt = await this.danhMucService.danhMucChungGetAll('PT_DTHAU');
    if (resPt.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = resPt.data;
    }
    // hình thức đấu thầu
    this.listHinhThucDauThau = [];
    let resPtdt = await this.danhMucService.danhMucChungGetAll('HT_LCNT');
    if (resPtdt.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = resPtdt.data;
    }
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
  }

  initForm() {
    this.formData.patchValue({

    })
  }

  async getDetail() {
    if (this.id > 0) {
      let data = await this.detail(this.id);
      console.log(data);
      if (data) {
        this.formData.patchValue({
          soQdDc: data.soQdDc?.split("/")[0],
        })
        if (data.loaiVthh.startsWith('02')) {
        } else {
          this.danhsachDx = data.hhQdKhlcntDtlList
        }
        await this.onChangeSoQdGoc(data.idQdGoc);
      }
    }
  }

  async openDialogSoQdGoc() {
    this.spinner.show();
    this.listQdGoc = [];
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.loaiVthh,
      nam: this.formData.get('nam') ? this.formData.get('nam').value : null,
      lastest: 1
    }
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listQdGoc = res.data.content

    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định gốc',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdGoc,
        dataHeader: ['Số quyết định gốc', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeSoQdGoc(data.id);
      }
    });
  }

  async onChangeSoQdGoc($event) {
    this.spinner.show();
    if ($event) {
      let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail($event);
      let qdGoc = this.listQdGoc.filter(item => item.id == $event)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.dataInput = data;
        this.dataInputCache = cloneDeep(data);
        this.formData.patchValue({
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          ghiChu: data.ghiChu,
          trichYeu: data.trichYeu,
          idQdGoc: $event,
          soQdGoc: qdGoc.length > 0 ? qdGoc[0].soQd : null,
          ngayQdGoc: data.ngayQd
        })
        if (data.loaiVthh.startsWith('02')) {
          this.danhsachDx = data.children
        } else {
          this.danhsachDx = data.children
          this.formData.patchValue({
            hthucLcnt: data.hthucLcnt,
            pthucLcnt: data.pthucLcnt,
            loaiHdong: data.loaiHdong,
            nguonVon: data.nguonVon,
            tgianBdauTchuc: data.tgianBdauTchuc,
            tgianDthau: data.tgianDthau,
            tgianMthau: data.tgianMthau,
            tgianNhang: data.tgianNhang,
            tgianThienHd: data.tgianThienHd
          })
        }
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.spinner.hide();
  }

  async pheDuyet() {
    let trangThai = ''
    let mesg = ''
    if (this.formData.get('loaiVthh').value.startsWith("02")) {
      switch (this.formData.get('trangThai').value) {
        case STATUS.DU_THAO: {
          trangThai = STATUS.CHO_DUYET_LDV;
          mesg = 'Bạn có muốn gửi duyệt ?'
          break;
        }
        case STATUS.TU_CHOI_LDV: {
          trangThai = STATUS.CHO_DUYET_LDV;
          mesg = 'Bạn có muốn gửi duyệt ?'
          break;
        }
        case STATUS.CHO_DUYET_LDV: {
          trangThai = STATUS.DA_DUYET_LDV;
          mesg = 'Bạn có muốn gửi duyệt ?'
          break;
        }
        case STATUS.DA_DUYET_LDV: {
          trangThai = STATUS.BAN_HANH;
          mesg = 'Văn bản sẵn sàng ban hành ?'
          break;
        }
      }
    } else {
      trangThai = STATUS.BAN_HANH;
      mesg = 'Văn bản sẵn sàng ban hành ?'
    }
    await this.approve(this.formData.value.id, trangThai, mesg)
  }

  async tuChoi() {
    await this.reject(this.formData.value.id, STATUS.TU_CHOI_LDC);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  themMoiGoiThau() {
    this.listNthauNopHs.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
  }

  addRow(): void {
    this.listNthauNopHs = [
      ...this.listNthauNopHs,
      {}
    ];
    this.i++;
    this.listNthauNopHs.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
    this.editCache[this.i].edit = true;
  }

  updateEditCache(): void {
    this.listNthauNopHs.forEach((item, index) => {
      this.editCache[index] = {
        edit: true,
        data: { ...item }
      };
    });
    this.listDiaDiemNhapHang.forEach((item, index) => {
      this.editDiaDiemCache[index] = {
        edit: true,
        data: { ...item }
      };
    });
  }

  startEdit(index: number): void {
    console.log(index);
    this.editCache[index].edit = true;
  }

  deleteRow(index: number) {
    this.listNthauNopHs = this.listNthauNopHs.filter((d, index) => index !== index);
  }

  cancelEdit(id: any): void {
    const index = this.listNthauNopHs.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listNthauNopHs[index] },
      edit: false
    };
  }

  saveEdit(index: any): void {
    Object.assign(
      this.listNthauNopHs[index],
      this.editCache[index].data,
    );
    this.editCache[index].edit = false;
  }

  async saveDthauGthau() {
    let body = this.formData.value;
    console.log(body)
    body.children = this.listNthauNopHs;
    let res = await this.dauThauGoiThauService.create(body);
    console.log(res);
  }

  calendarGia() {
    let donGia = this.formData.get('donGia').value;
    let VAT = this.formData.get('VAT').value;
    let soLuong = this.formData.get('soLuong').value;
    if (donGia >= 0 && VAT >= 0) {
      this.formData.patchValue({
        dgianHdongSauThue: (donGia + (donGia * VAT / 100)),
        giaHdongTruocThue: donGia * soLuong,
        giaHdongSauThue: (donGia + (donGia * VAT / 100)) * soLuong,
      })
    }
  }

  openDialogGoiThau(data?: any, index?: number, isReadOnly?: boolean) {
    const modal = this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        loaiVthh: data ? data.loaiVthh : this.formData.get('loaiVthh').value,
        isReadOnly: isReadOnly
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        console.log(res);
        console.log(index);
        // res.nguonVon = this.dataNguonVon.nguonVon;
        // res.tenNguonVon = this.dataNguonVon.tenNguonVon;
        // if (index >= 0) {
        //   this.danhsachDx[index] = res;
        // } else {
        //   this.danhsachDx.push(res);
        // }
        // console.log(this.danhsachDx)
      }
    });
  }

  deleteSelect() {

  }

  deleteItem(index) {
    this.danhsachDx = this.danhsachDx.filter((item, i) => i !== index)
  }

  async openDialogDeXuat(index) {
    let data = this.danhsachDx[index]
    this.modal.create({
      nzTitle: '',
      nzContent: DialogThongTinPhuLucQuyetDinhPheDuyetComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '90%',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        isEdit: true
      },
    });
  }

  async save(isGuiDuyet?) {
    this.setValidator();
    let body = { ...this.formData.value, ... this.thongtinDieuchinhComponent.formData.value };
    body.soQdDc = body.soQdDc + this.maQd;
    body.children = this.danhsachDx;
    body.id = this.id;
    await this.createUpdate(body);
  }



  setValidator() {
    if (this.formData.get('loaiVthh').value.startsWith('02')) {
      this.formData.controls["hthucLcnt"].clearValidators();
      this.formData.controls["pthucLcnt"].clearValidators();
      this.formData.controls["loaiHdong"].clearValidators();
      this.formData.controls["nguonVon"].clearValidators();
      this.formData.controls["tgianBdauTchuc"].clearValidators();
      this.formData.controls["tgianDthau"].clearValidators();
      this.formData.controls["tgianMthau"].clearValidators();
      this.formData.controls["tgianNhang"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["moTaHangHoa"].clearValidators();

    } else {
      this.formData.controls["hthucLcnt"].setValidators([Validators.required]);
      this.formData.controls["pthucLcnt"].setValidators([Validators.required]);
      this.formData.controls["loaiHdong"].setValidators([Validators.required]);
      this.formData.controls["nguonVon"].setValidators([Validators.required]);
      this.formData.controls["tgianBdauTchuc"].setValidators([Validators.required]);
      this.formData.controls["tgianDthau"].setValidators([Validators.required]);
      this.formData.controls["tgianMthau"].setValidators([Validators.required]);
      this.formData.controls["tgianNhang"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
    }
  }



  getNameFile($event) {

  }

}
