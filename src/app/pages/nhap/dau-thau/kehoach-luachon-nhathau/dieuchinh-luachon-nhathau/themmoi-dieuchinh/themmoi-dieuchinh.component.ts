import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { dauThauGoiThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import { DieuChinhQuyetDinhPdKhlcntService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/dieuchinh-khlcnt/dieuChinhQuyetDinhPdKhlcnt.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { STATUS } from "../../../../../../constants/status";
import { cloneDeep } from "lodash";
import { ThongtinDieuchinhComponent } from './thongtin-dieuchinh/thongtin-dieuchinh.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import {DatePipe} from "@angular/common";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";


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
  danhsachDxCache: any[] = [];
  selected: boolean = false;
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
      gtriDthau: [''],
      maDvi: ['']
    });
  }
  maQd: string = '';
  listQdGoc: any[] = [];
  listNguonVon: any[] = []
  listPhuongThucDauThau: any[] = []
  listHinhThucDauThau: any[] = []
  listLoaiHopDong: any[] = []

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
    this.spinner.show();
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
    let resHd = await this.danhMucService.danhMucChungGetAll('HINH_THUC_HOP_DONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
    this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({

    })
  }

  setNewData($event) {
    let pipe = new DatePipe('en-US');
    console.log($event)
    this.formData.get('tgianBdauTchuc').setValue($event.tgianBdauTchuc);
    this.formData.get('tgianMthau').setValue(pipe.transform($event.tgianMthau, 'yyyy-MM-dd HH:mm'));
    this.formData.get('tgianDthau').setValue(pipe.transform($event.tgianDthau, 'yyyy-MM-dd HH:mm'));
    this.formData.get('tgianNhang').setValue($event.tgianNhang);
    this.formData.get('gtriDthau').setValue($event.gtriDthau);
    this.formData.get('tchuanCluong').setValue($event.tchuanCluong);
    this.formData.get('maDvi').setValue($event.maDvi);
    // this.danhsachDx[this.index].tgianBdauTchuc = $event.tgianBdauTchuc;
    // this.danhsachDx[this.index].tgianMthau = $event.tgianMthau;
    // this.danhsachDx[this.index].tgianDthau = $event.tgianDthau;
    // this.danhsachDx[this.index].tgianNhang = $event.tgianNhang;
  }

  async getDetail() {
    if (this.id > 0) {
      let data = await this.detail(this.id);
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
      console.log(res.data)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          ghiChu: data.ghiChu,
          trichYeu: data.trichYeu,
          idQdGoc: $event,
          soQdGoc: data.soQd,
          ngayQdGoc: data.ngayQd
        })
        if (data.loaiVthh.startsWith('02')) {
          this.dataInput = data;
          // this.dataInputCache = cloneDeep(this.dataInput);
          this.danhsachDx = data.children
        } else {
          this.danhsachDx = data.children
          this.danhsachDxCache = cloneDeep(this.danhsachDx);
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
        this.showDetail(event, this.danhsachDx[0])
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.spinner.hide();
  }

  async guiDuyet() {
    let trangThai = "";
    let mesg = "";
    // Vật tư
    switch (this.formData.get("trangThai").value) {
      case STATUS.DA_LAP: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mesg = "Bạn có chắc chắn muốn gửi duyệt?";
        break;
      }
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.BAN_HANH;
        mesg = "Bạn muốn ban hành quyết định?";
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: mesg,
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            id: this.formData.get("id").value,
            trangThai: trangThai
          };
          let res = await this.dieuChinhQuyetDinhPdKhlcntService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log("error: ", e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  async tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: "TỪ CHỐI PHÊ DUYỆT",
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzComponentParams: {}
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.get("id").value,
            lyDo: text,
            trangThai: STATUS.TU_CHOI_LDV,
          };
          const res = await this.dieuChinhQuyetDinhPdKhlcntService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  quayLai() {
    this.showListEvent.emit();
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
    // let body = { ...this.formData.value, ... this.thongtinDieuchinhComponent.formData.value };
    let body = { ...this.formData.value };
    body.soQdDc = body.soQdDc + this.maQd;
    body.children = this.danhsachDx;
    body.id = this.id;
    console.log(body)
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.guiDuyet();
      } else {
        this.quayLai();
      }
    }
  }


  setValidator() {
    // if (this.formData.get('loaiVthh').value.startsWith('02')) {
    //   this.formData.controls["hthucLcnt"].clearValidators();
    //   this.formData.controls["pthucLcnt"].clearValidators();
    //   this.formData.controls["loaiHdong"].clearValidators();
    //   this.formData.controls["nguonVon"].clearValidators();
    //   this.formData.controls["tgianBdauTchuc"].clearValidators();
    //   this.formData.controls["tgianDthau"].clearValidators();
    //   this.formData.controls["tgianMthau"].clearValidators();
    //   this.formData.controls["tgianNhang"].clearValidators();
    //   this.formData.controls["cloaiVthh"].clearValidators();
    //   this.formData.controls["tenCloaiVthh"].clearValidators();
    //   this.formData.controls["moTaHangHoa"].clearValidators();

    // } else {
    //   this.formData.controls["hthucLcnt"].setValidators([Validators.required]);
    //   this.formData.controls["pthucLcnt"].setValidators([Validators.required]);
    //   this.formData.controls["loaiHdong"].setValidators([Validators.required]);
    //   this.formData.controls["nguonVon"].setValidators([Validators.required]);
    //   this.formData.controls["tgianBdauTchuc"].setValidators([Validators.required]);
    //   this.formData.controls["tgianDthau"].setValidators([Validators.required]);
    //   this.formData.controls["tgianMthau"].setValidators([Validators.required]);
    //   this.formData.controls["tgianNhang"].setValidators([Validators.required]);
    //   this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
    //   this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    //   this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
    // }
  }

  getNameFile($event) {

  }

  deleteItem(index) {

  }

  showDetailCuc($event, data) {
    console.log(data);
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    this.dataInput = data;
    this.dataInputCache = cloneDeep(data);
  }
  index = 0;
  async showDetail($event, index) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow');
      this.dataInput = this.danhsachDx[index];
      this.dataInputCache = cloneDeep(this.danhsachDxCache[index]);
      this.index = index;
      await this.spinner.hide();
    } else {
      this.selected = true
      this.dataInput = this.danhsachDx[0];
      this.dataInputCache = this.danhsachDxCache[0];
      this.index = 0;
      await this.spinner.hide();
    }
  }

}
