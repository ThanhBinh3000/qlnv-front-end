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
import {ChiTieuKeHoachNamCapTongCucService} from "../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";


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
  fileDinhKemsTtr: any[] = [];
  fileDinhKems: any[] = [];
  listCcPhapLy: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  dataChiTieu: any;
  maDviSelected: any;
  previewName : string = 'qd_dieu_chinh_khlcnt_lt';
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
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dieuChinhQuyetDinhPdKhlcntService)
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().get('year'), Validators.required],
      soQdDc: [''],
      soTtrDc: ['', [Validators.required]],
      idQdGoc: ['', Validators.required],
      soQdGoc: ['', [Validators.required]],
      ngayQdGoc: [''],
      ngayQd: ['', [Validators.required]],
      ngayHluc: [''],
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
      trangThai: [STATUS.DA_LAP],
      tenTrangThai: ["Đã lập"],
      tchuanCluong: [''],
      lyDoTuchoi: [''],
      gtriDthau: [''],
      maDvi: [''],
      lanDieuChinh: [''],
      soQd: [''],
      ngayQdDc: [''],
      noiDungQd: [''],
      noiDungTtr: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      idHhQdKhlcntDtl: [''],
    });
  }
  maQd: string = '';
  maTrinh: string = "";
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
      this.maTrinh = "/" + this.userInfo.MA_TR;
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
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == "NHAP_DT");
      this.formData.get("loaiHinhNx").setValue(this.listLoaiHinhNx[0].ma);
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data;
    }
    this.spinner.hide();
  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      });
    }
  }

  initForm() {
    this.formData.patchValue({

    })
  }

  setNewData($event) {
    let pipe = new DatePipe('en-US');
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
        this.helperService.bidingDataInFormGroup(this.formData, data);
        this.formData.patchValue({
          soQdDc: data.soQdDc?.split("/")[0],
          soTtrDc: data.soTtrDc?.split("/")[0]
        })
        if (data.soQdDc != null) {
          this.maQd = "/" + data.soQdDc?.split("/")[1]
        }
        if (data.soTtrDc != null) {
          this.maTrinh = "/" + data.soTtrDc?.split("/")[1]
        }
        this.danhsachDx = cloneDeep(data.children);
        let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(data.idQdGoc);
        if (res.msg == MESSAGE.SUCCESS) {
          const dataQd = res.data;
          this.danhsachDxCache = cloneDeep(dataQd.children);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
        this.fileDinhKems = data.fileDinhKems;
        this.listCcPhapLy = data.listCcPhapLy;
        this.fileDinhKemsTtr = data.fileDinhKemsTtr;
        await this.showDetail(event, this.danhsachDx[0])
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
      this.listQdGoc = res.data.content.filter(item =>
        !item.children.every(child => child.qdPdHsmt?.trangThai == this.STATUS.BAN_HANH)
      );
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ QĐ CẦN ĐIỀU CHỈNH',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdGoc,
        dataHeader: ['Số quyết định gốc', 'Số quyết định điều chỉnh', 'Loại hàng DTQG', 'Chủng loại hàng DTQG'],
        dataColumn: ['soQd','soQdDc', 'tenLoaiVthh', 'tenCloaiVthh']
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
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          ghiChu: data.ghiChu,
          idQdGoc: $event,
          soQdGoc: data.soQd,
          ngayQdGoc: data.ngayQd,
          soQd: data.children[0]?.dxuatKhLcntHdr?.soQd,
          lanDieuChinh: data.lanDieuChinh ? data.lanDieuChinh + 1 : 1,
        })
        if (data.loaiVthh.startsWith('02')) {
          this.dataInput = data;
          // this.dataInputCache = cloneDeep(this.dataInput);
          this.danhsachDx = data.children
        } else {
          this.danhsachDx = data.children.filter(x => (x.qdPdHsmt == null || x.qdPdHsmt?.trangThai != this.STATUS.BAN_HANH))
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
        await this.showDetail(event, this.danhsachDx[0])
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
      case STATUS.TU_CHOI_LDV: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mesg = "Bạn có chắc chắn muốn gửi duyệt?";
        break;
      }
      case STATUS.TU_CHOI_LDTC: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mesg = "Bạn có chắc chắn muốn gửi duyệt?";
        break;
      }
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.DA_DUYET_LDV;
        mesg = "Bạn có chắc chắn muốn phê duyệt?";
        break;
      }
      case STATUS.DA_DUYET_LDV: {
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
          let trangThai = null;
          switch (this.formData.get("trangThai").value) {
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.TU_CHOI_LDV
              break;
            }
            case STATUS.DA_DUYET_LDV: {
              trangThai = STATUS.TU_CHOI_LDTC
              break;
            }
          }
          let body = {
            id: this.formData.get("id").value,
            lyDo: text,
            trangThai: trangThai,
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
    await this.spinner.show();
    this.setValidator(isGuiDuyet);
    await this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    let body = { ...this.formData.value };
    if (this.formData.value.soQdDc) {
      body.soQdDc = this.formData.value.soQdDc + this.maQd;
    }
    if (this.formData.value.soTtrDc) {
      body.soTtrDc = this.formData.value.soTtrDc + this.maTrinh;
    }
    let pipe = new DatePipe('en-US');
    if (this.thongtinDieuchinhComponent.formData.value.tgianMthau != null) {
      if (this.thongtinDieuchinhComponent.formData.value.tgianMthauTime != null) {
        this.danhsachDx[this.index].tgianMthau = pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianMthau, 'yyyy-MM-dd') + " " + pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianMthauTime, 'HH:mm') + ":00"
      } else {
        this.danhsachDx[this.index].tgianMthau = pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianMthau, 'yyyy-MM-dd')  + " 00:00:00"
      }
    }
    if (this.thongtinDieuchinhComponent.formData.value.tgianDthau) {
      if (this.thongtinDieuchinhComponent.formData.value.tgianDthauTime != null) {
        this.danhsachDx[this.index].tgianDthau =  pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianDthau, 'yyyy-MM-dd') + " " + pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianDthauTime, 'HH:mm') + ":00"
      } else {
        this.danhsachDx[this.index].tgianDthau =  pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianDthau, 'yyyy-MM-dd') + " 23:59:59"
      }
    }
    if (this.thongtinDieuchinhComponent.formData.value.tgianMoHoSo != null) {
      if (this.thongtinDieuchinhComponent.formData.value.tgianMoHoSoTime != null) {
        this.danhsachDx[this.index].tgianMoHoSo = pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianMoHoSo, 'yyyy-MM-dd') + " " + pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianMoHoSoTime, 'HH:mm') + ":00"
      } else {
        this.danhsachDx[this.index].tgianMoHoSo =   pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianMoHoSo, 'yyyy-MM-dd') + " 23:59:59"
      }
    }
    this.danhsachDx[this.index].tgianBdauTchuc = this.thongtinDieuchinhComponent.formData.value.tgianBdauTchuc
    this.danhsachDx[this.index].tgianNhang = this.thongtinDieuchinhComponent.formData.value.tgianNhang
    this.danhsachDx[this.index].tongTien = this.thongtinDieuchinhComponent.formData.value.tongMucDtDx
    this.danhsachDx[this.index].children = this.thongtinDieuchinhComponent.listOfData;
    this.danhsachDx[this.index].tgianMthauTime = pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianMthauTime, 'yyyy-MM-dd HH:mm')
    this.danhsachDx[this.index].tgianDthauTime = pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianDthauTime, 'yyyy-MM-dd HH:mm')
    this.danhsachDx[this.index].tgianMoHoSoTime = pipe.transform(this.thongtinDieuchinhComponent.formData.value.tgianMoHoSoTime, 'yyyy-MM-dd HH:mm')
    this.danhsachDx[this.index].giaBanHoSo = this.thongtinDieuchinhComponent.formData.value.giaBanHoSo
    body.children = this.danhsachDx;
    body.id = this.id;
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKemsTtr = this.fileDinhKemsTtr;
    body.listCcPhapLy = this.listCcPhapLy;
    let res = null;
    if (this.formData.get("id").value) {
      res = await this.dieuChinhQuyetDinhPdKhlcntService.update(body);
    } else {
      res = await this.dieuChinhQuyetDinhPdKhlcntService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.id = res.data.id;
        this.formData.get("id").setValue(res.data.id)
        await this.guiDuyet();
      } else {
        if (this.formData.get("id").value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          res.data.children.forEach(child => {
            this.danhsachDx.find(i => i.maDvi == child.maDvi).idHhQdKhlcntDtl = child.idHhQdKhlcntDtl
          })
          this.formData.get("id").setValue(res.data.id);
          this.id = res.data.id;
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }


  setValidator(isGuiDuyet: boolean) {
    if (this.formData.get("trangThai").value == STATUS.DA_DUYET_LDV && isGuiDuyet) {
        this.formData.controls["soQdDc"].setValidators([Validators.required]);
        this.formData.controls["ngayQdDc"].setValidators([Validators.required]);
        this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQdDc"].clearValidators();
      this.formData.controls["ngayQdDc"].clearValidators();
      this.formData.controls["ngayHluc"].clearValidators();
    }
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
      this.maDviSelected = this.danhsachDx[index].maDvi
      this.dataInput = this.danhsachDx[index];
      this.dataInputCache = cloneDeep(this.danhsachDxCache[index]);
      this.index = index;
      await this.getDataChiTieu()
      await this.spinner.hide();
    } else {
      this.selected = true
      this.dataInput = this.danhsachDx[0];
      this.dataInputCache = this.danhsachDxCache[0];
      this.index = 0;
      this.maDviSelected = this.danhsachDx[0].maDvi
      await this.getDataChiTieu()
      await this.spinner.hide();
    }
  }

  checkDisableQdDc() {
    if (this.isViewDetail) {
      return !(this.formData.get('trangThai').value == STATUS.DA_DUYET_LDV && this.userService.isAccessPermisson("NHDTQG_PTDT_DCKHLCNT_BANHANH_TUCHOI_TC"));
    }
    return this.isViewDetail;
  }

  async getDataChiTieu() {
    let res2 =  await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachTheoNamVaDonVi(
      +this.formData.get('nam').value, this.maDviSelected)
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
    } else {
      this.dataChiTieu = null;
    }
  }
}
