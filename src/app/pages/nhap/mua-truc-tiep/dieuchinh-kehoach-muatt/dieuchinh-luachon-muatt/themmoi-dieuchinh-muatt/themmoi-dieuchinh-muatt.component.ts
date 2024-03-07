import { FileDinhKem } from './../../../../../../models/FileDinhKem';
import { DatePipe } from '@angular/common';
import { DieuChinhQuyetDinhPdKhmttService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/dieuchinh-khmtt/DieuChinhQuyetDinhPdKhmtt.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DATEPICKER_CONFIG } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";
import { cloneDeep } from "lodash";
import { filter } from 'rxjs/operators';
import {ChiTieuKeHoachNamCapTongCucService} from "../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";


@Component({
  selector: 'app-themmoi-dieuchinh-muatt',
  templateUrl: './themmoi-dieuchinh-muatt.component.html',
  styleUrls: ['./themmoi-dieuchinh-muatt.component.scss']
})
export class ThemmoiDieuchinhMuattComponent extends Base2Component implements OnInit {
  @Input('isView') isView: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Input()
  loaiVthhInput: string;
  @Input() checkPrice: any;
  @Output()
  showListEvent = new EventEmitter<any>();
  soLuongDiaDiemList: any;
  dataOnChanges: any[] = [];
  dataChildOnChanges: any[] = [];
  selected: boolean;
  dataChiTieu: any
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  previewName: string = "qd_dieu_chinh_khmtt";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    public userService: UserService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private dieuChinhQuyetDinhPdKhmttService: DieuChinhQuyetDinhPdKhmttService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    public globals: Globals,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dieuChinhQuyetDinhPdKhmttService);
    this.formData = this.fb.group({
      id: [null],
      namKh: [dayjs().get('year'), Validators.required],
      soQdDc: [''],
      idQdGoc: ['', Validators.required],
      soQdGoc: ['', [Validators.required]],
      ngayKyQdGoc: [''],
      ngayKyDc: [],
      ngayHluc: [''],
      trichYeu: [''],
      trangThai: [STATUS.DA_LAP],
      tenTrangThai: ['Đã lập'],
      ldoTchoi: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tenDvi: [''],
      diaChiDvi: [''],
      soDxuat: [''],
      soLanDieuChinh: [''],
      soQdCc: [''],
      idSoQdCc: [''],
      soToTrinh: [''],
      ngayTaoCv: [dayjs().format('YYYY-MM-DD')],
      loaiHinhNx: [''],
      tenLoaiHinhNx: [''],
      kieuNx: [''],
      tenKieuNx: [''],
      trichYeuDc: [''],
      noiDungToTrinh: [''],
      noiDungQdDc: [''],
      checkListFileDinhKems: [''],

    });
  }
  soQdDc: string = '';
  maQd: string = null;
  listNam: any[] = [];
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
  formData: FormGroup
  dataTable: any[] = [];
  danhsachDxMtt: any[] = [];
  danhsachDxMttCache: any[] = [];
  dataDetail: any;
  hhDcQdPduyetKhmttSlddList: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  STATUS = STATUS;
  userInfo: UserLogin;
  dataInput: any;
  dataInputCache: any;
  datePickerConfig = DATEPICKER_CONFIG;
  datePipe = new DatePipe('en-US');
  dtl: any[] = [];
  fileDinhKems: any[] = [];
  canCuPhapLy: any[] = [];
  cvanToTrinh: any[] = [];
  mthh: any = [];
  maTt: string;
  selectedId: number = 0;
  isDetail: boolean = false;
  async ngOnInit() {
    this.spinner.show();
    try {
      this.maTt = "/TTr-TCDT";
      this.userInfo = this.userService.getUserLogin();
      this.soQdDc = "/" + this.userInfo.MA_QD
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      await Promise.all([
        this.loadDataComboBox(),
        await this.nguonVonGetAll(),
        await this.getDetail(),
        await this.getQdGocList(),
      ]);

      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDataComboBox() {
    this.spinner.show();
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == "NHAP_TT");
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

  tuChoi() {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {

            case STATUS.CHO_DUYET_LDV: {
              body.trangThai = STATUS.TU_CHOI_LDV;
              break;
            }
            case STATUS.DA_DUYET_LDV: {
              body.trangThai = STATUS.TU_CHOI_LDTC;
              break;
            }
          }
          const res = await this.dieuChinhQuyetDinhPdKhmttService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  async getDetail() {
    if (this.idInput > 0) {
      let res = await this.dieuChinhQuyetDinhPdKhmttService.getDetail(this.idInput);
      if (res.msg == MESSAGE.SUCCESS) {
        console.log(res.data, "getDetail")
        const data = res.data;
        this.formData.patchValue({
          id: data.id,
          soQdDc: data.soQdDc.split("/")[0] != "" ? data.soQdDc.split("/")[0] : "",
          ngayKyDc: data.ngayKyDc,
          ngayHluc: data.ngayHluc,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          moTaHangHoa: data.moTaHangHoa,
          loaiHdong: data.loaiHdong,
          pthucLcnt: data.pthucLcnt,
          hthucLcnt: data.hthucLcnt,
          nguonVon: data.nguonVon,
          namKh: data.namKh,
          ghiChu: data.ghiChu,
          trangThai: data.trangThai,
          tenTrangThai: data.tenTrangThai,
          trichYeu: data.trichYeu,
          idQdGoc: data.idQdGoc,
          soQdGoc: data.soQdGoc,
          ldoTchoi: data.ldoTchoi,
          trichYeuDc: data.trichYeuDc,
          ngayKyQdGoc: data.ngayKyQdGoc,
          soLanDieuChinh: data.soLanDieuChinh,
          soQdCc: data.soQdCc,
          idSoQdCc: data.idSoQdCc,
          soToTrinh: data.soToTrinh.split("/")[0] != "" ? data.soToTrinh.split("/")[0] : "",
          ngayTaoCv: data.ngayTaoCv,

        });
        this.fileDinhKems = data.fileDinhKems;
        this.canCuPhapLy = data.canCuPhapLy;
        this.cvanToTrinh = data.cvanToTrinh;
        console.log(data.hhDcQdPduyetKhmttDxList, "hhDcQdPduyetKhmttDxList")
        this.danhsachDxMtt = data.hhDcQdPduyetKhmttDxList;
        this.danhsachDxMttCache = cloneDeep(this.danhsachDxMtt)
        await this.showFirstRow(event, this.danhsachDxMtt[0], true);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async getQdGocList() {
    this.spinner.show();
    let body = {
      trangThai: STATUS.BAN_HANH,
      namKh: this.formData.value.namKh,
      maDvi: null,
      lastest: null
    };
    let res = await this.dieuChinhQuyetDinhPdKhmttService.danhSachQdDc(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listQdGoc = res.data
      this.listQdGoc.forEach(item => {
        item.trangThaiGia = item.qthtChotGiaInfoRes?.qthtQuyetDinhChinhGia.length > 0 ? 'Dừng thực hiện để điều chỉnh giá' : '';
        item.loai = item.qthtChotGiaInfoRes?.qthtQuyetDinhChinhGia.length > 0 ? 'Điều chỉnh giá' : ''
      })
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();

  }


  openDialogSoQdGoc() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định gốc',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdGoc,
        dataHeader: ['Số quyết định gốc', 'Loại hàng DTQG', 'Chủng loại hàng DTQG', 'Trạng thái', 'Loại'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh', 'trangThaiGia', 'loai']
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if(data){
        if (data.soQd != null) {
          this.onChangeSoQdGoc(data);
        }else{
          this.onChangeSoQdDcGoc(data)
        }
      }
    });
  }
  async onChangeSoQdGoc($event) {
    this.spinner.show();
    if ($event) {
      // let res = await this.quyetDinhPheDuyetKeHoachMTTService.getDetail($event);
      console.log($event,5555)
      let qdGoc = this.listQdGoc.filter(item => item.id == $event.id)
      // if ($event) {
        const data = $event;
        delete $event?.trangThai;
        delete $event?.tenTrangThai;
        for (let item of data.children) {
          this.mthh = item.moTaHangHoa;
        }
        Object.assign(data, { mthh: this.mthh })
        this.formData.patchValue({
          id: null,
          ngayKyQdGoc: data.ngayQd,
          idQdGoc: $event?.id,
          soQdGoc: qdGoc.length > 0 ? qdGoc[0].soQd : null,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          moTaHangHoa: data.mthh,
          soLanDieuChinh: data.soLanDieuChinh + 1,
          soQdCc: data.soQdCc,
          idSoQdCc: data.idSoQdCc,
          namKh: data.namKh

        })
        // await this.getDataChiTieu(data.idSoQdCc);
        this.danhsachDxMtt = data.children.filter(x => x.idQdGiaoNvuNh == null);
        this.danhsachDxMttCache = cloneDeep(this.danhsachDxMtt)
        for (let item of this.danhsachDxMtt) {
          item.id = null;
        }
        this.showFirstRow(event, this.danhsachDxMtt[0]);
      // }

      // else {
      //   this.notification.error(MESSAGE.ERROR, res.msg);
      // }
    }
    this.spinner.hide();
  }

  async onChangeSoQdDcGoc($event) {
    this.spinner.show();
    if ($event) {
      console.log($event, 6666)
      delete $event?.trangThai;
      delete $event?.tenTrangThai;
      for (let item of $event.hhDcQdPduyetKhmttDxList) {
        this.mthh = item.moTaHangHoa;
      }
      Object.assign($event, {mthh: this.mthh})
      this.formData.patchValue({
        id: null,
        ngayKyQdGoc: $event.ngayKyDc,
        idQdGoc: $event.id,
        soQdGoc: $event.soQdDc,
        loaiVthh: $event.loaiVthh,
        tenLoaiVthh: $event.tenLoaiVthh,
        cloaiVthh: $event.cloaiVthh,
        tenCloaiVthh: $event.tenCloaiVthh,
        moTaHangHoa: $event.mthh,
        soLanDieuChinh: $event.soLanDieuChinh + 1,
        soQdCc: $event.soQdCc,
        idSoQdCc: $event.idSoQdCc,
        namKh: $event.namKh

      })
      // await this.getDataChiTieu(res.data.idSoQdCc);
      this.danhsachDxMtt = $event.hhDcQdPduyetKhmttDxList;
      this.danhsachDxMttCache = cloneDeep(this.danhsachDxMtt)
      for (let item of this.danhsachDxMtt) {
        item.id = null;
      }
      this.showFirstRow(event, this.danhsachDxMtt[0]);
    }
    this.spinner.hide();
  }

  async showFirstRow($event, dataGoiThau: any, detail?) {
    await this.showDetail($event, dataGoiThau, detail);
  }

  index = 0;
  async showDetail($event, data, detail?) {
    console.log("1")
    await this.spinner.show();
    if ($event != undefined && $event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow')
    } else {
      this.selected = true
    }
    if (data) {
      await this.getDataChiTieu(data.idSoQdCc);
      this.dataInput = data;
      if(data.soQd != null){
        let res = await this.quyetDinhPheDuyetKeHoachMTTService.getDetail(data?.idQdHdr);
        this.dataInputCache = res.data.children.find(x => x.maDvi == data.maDvi)
      }else{
        if(detail){
          let res = await this.dieuChinhQuyetDinhPdKhmttService.findByIdFromDcDx(data);
          console.log(res, "detail-idQdGoc")
          if(res.msg == MESSAGE.SUCCESS){
            if(res.data.type == 'DC_HDR'){
              this.dataInputCache = res.data.hhDcQdPduyetKhmttDxList.find(x => x.maDvi == data.maDvi)
            }
            if(res.data.type == 'QD_HDR'){
              this.dataInputCache = res.data.children.find(x => x.maDvi == data.maDvi)
            }
            console.log(this.dataInputCache, "dataInputCache")
          }
        }else{
          this.dataInputCache = this.dataInput
        }
      }
    }
    await this.spinner.hide();
  }
  setNewSoLuong($event) {
    this.danhsachDxMtt[this.index].soLuong = $event;
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }


  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
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



  async save(isGuiDuyet?) {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.clearValidatorLuuDuThao()
    await this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    let body = this.formData.value;
    body.hhDcQdPduyetKhmttDxList = this.danhsachDxMtt;
    body.ngayKyDc = this.datePipe.transform(body.ngayKyDc, 'yyyy-MM-dd');
    body.ngayHluc = this.datePipe.transform(body.ngayHluc, 'yyyy-MM-dd');
    body.fileDinhkems = this.fileDinhKems;
    body.canCuPhapLy = this.canCuPhapLy;
    body.cvanToTrinh = this.cvanToTrinh;
    let res = null;
    body.soQdDc = body.soQdDc + this.soQdDc;
    body.soToTrinh = body.soToTrinh + this.maTt;
    if (this.formData.get('id').value) {
      res = await this.dieuChinhQuyetDinhPdKhmttService.update(body);
    } else {
      res = await this.dieuChinhQuyetDinhPdKhmttService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        await this.setValidator();
        await this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          return;
        }
        this.idInput = res.data.id;
        await this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          res.data.soQdDc = res.data.soQdDc.split("/")[0] != "" ? res.data.soQdDc.split("/")[0] : ""
          res.data.soToTrinh = res.data.soToTrinh.split("/")[0] != "" ? res.data.soToTrinh.split("/")[0] : ""
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          // this.quayLai()
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          res.data.soQdDc = res.data.soQdDc.split("/")[0] != "" ? res.data.soQdDc.split("/")[0] : ""
          res.data.soToTrinh = res.data.soToTrinh.split("/")[0] != "" ? res.data.soToTrinh.split("/")[0] : ""
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          // this.quayLai()
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  clearValidatorLuuDuThao() {
    this.formData.controls["soToTrinh"].clearValidators();
    this.formData.controls["ngayTaoCv"].clearValidators();
    this.formData.controls["soQdDc"].clearValidators();
    this.formData.controls["ngayHluc"].clearValidators();
    this.formData.controls["ngayKyDc"].clearValidators();
    if (this.formData.get("trangThai").value == STATUS.DA_DUYET_LDV) {
      this.formData.controls["soQdDc"].setValidators([Validators.required]);
      this.formData.controls["ngayKyDc"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
      this.formData.controls["trichYeuDc"].setValidators([Validators.required]);
      if (this.fileDinhKems.length == 0) {
        this.formData.controls["checkListFileDinhKems"].setValidators([Validators.required]);
      } else {
        this.formData.controls["checkListFileDinhKems"].clearValidators();
      }
    }
    if (this.formData.get("trangThai").value == STATUS.CHO_DUYET_LDV) {
      if (this.fileDinhKems.length == 0) {
        this.formData.controls["ngayKyQdGoc"].setValidators([Validators.required]);
      } else {
        this.formData.controls["ngayKyQdGoc"].clearValidators();
      }
    }
  }

  async setValidator() {
    this.formData.controls["soToTrinh"].setValidators([Validators.required]);
    this.formData.controls["ngayTaoCv"].setValidators([Validators.required]);
    // this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    if (this.formData.get("trangThai").value == STATUS.DA_DUYET_LDV) {
      this.formData.controls["soQdDc"].setValidators([Validators.required]);
      this.formData.controls["ngayKyDc"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
      this.formData.controls["trichYeuDc"].setValidators([Validators.required]);
      if(this.fileDinhKems.length == 0){
        this.formData.controls["checkListFileDinhKems"].setValidators([Validators.required]);
      }else{
        this.formData.controls["checkListFileDinhKems"].clearValidators();
      }
    } else {
      this.formData.controls["soQdDc"].clearValidators();
      this.formData.controls["ngayKyDc"].clearValidators();
      this.formData.controls["ngayHluc"].clearValidators();
      this.formData.controls["trichYeuDc"].clearValidators();
    }
  }

  async guiDuyet() {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    let trangThai = ''
    let mesg = ''

    switch (this.formData.get('trangThai').value) {
      case STATUS.DA_LAP: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mesg = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.TU_CHOI_LDV: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mesg = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.TU_CHOI_LDTC: {
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
        trangThai = STATUS.BAN_HANH
        mesg = 'Bạn có muốn ban hành ?'
        break;
      }
    }

    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mesg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            "id": this.idInput,
            "trangThai": trangThai
          }
          let res = await this.dieuChinhQuyetDinhPdKhmttService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
  public onChangesData(_event) {
    this.dataOnChanges.splice(0, 1, _event);

  }
  public onChangesDataChild(_event) {
    this.dataChildOnChanges = _event;
  }

  async getDataChiTieu(id: any) {
    let res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachNam(id);
    if (res2.msg == MESSAGE.SUCCESS) {
      console.log(res2.data, "getDataChiTieu")
      this.dataChiTieu = res2.data;
    }
  }

  setNewTableData($event) {
    debugger
    this.danhsachDxMtt.forEach(item => {
      if($event.find(x => x.maDvi.includes(item.maDvi))){
        item.children = $event;
      }
      // item.tongSoLuong = item.children.reduce((acc, data) => acc + data.tongSoLuong, 0)
      // item.tongMucDt = item.children.reduce((acc, data) => acc + data.tongThanhTien, 0)
    })
  }

  objectChange($event){
    this.danhsachDxMtt.forEach(item => {
      if($event.maDvi == item.maDvi){
        item.tgianKthuc = $event.tgianKthuc
        item.tgianMkho = $event.tgianMkho
        item.tenDvi = $event.tenDvi
        item.ghiChu = $event.ghiChu
      }
    })
  }

  // async getDataChiTieu() {
  //   let res2 =
  //     await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
  //       +this.formData.get('namKh').value,
  //     );
  //   if (res2.msg == MESSAGE.SUCCESS) {
  //     this.dataChiTieu = res2.data;
  //     console.log(this.dataChiTieu, "00000")
  //     this.formData.patchValue({
  //       soQdCc: res2.data.soQuyetDinh,
  //       idSoQdCc: res2.data.id
  //     });
  //   } else {
  //     this.formData.patchValue({
  //       soQdCc: null
  //     });
  //   }
  // }

  checkDisableQdDc() {
    if (this.isView) {
      return !(this.formData.get('trangThai').value == STATUS.DA_DUYET_LDV && this.userService.isAccessPermisson("NHDTQG_PTMTT_DCKHMTT_BANHANH"));
    }
    return true;
  }

}
