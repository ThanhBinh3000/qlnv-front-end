import { FileDinhKem } from './../../../../../../models/FileDinhKem';
import { DatePipe } from '@angular/common';
import { DieuChinhQuyetDinhPdKhmttService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/dieuchinh-khmtt/DieuChinhQuyetDinhPdKhmtt.service';
import { async } from '@angular/core/testing';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DATEPICKER_CONFIG } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { dauThauGoiThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";
import { cloneDeep } from "lodash";


@Component({
  selector: 'app-themmoi-dieuchinh-muatt',
  templateUrl: './themmoi-dieuchinh-muatt.component.html',
  styleUrls: ['./themmoi-dieuchinh-muatt.component.scss']
})
export class ThemmoiDieuchinhMuattComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Input()
  loaiVthhInput: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  soLuongDiaDiemList: any;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private dieuChinhQuyetDinhPdKhmttService: DieuChinhQuyetDinhPdKhmttService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private fb: FormBuilder,
    private dauThauGoiThauService: dauThauGoiThauService,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      namKh: [dayjs().get('year'), Validators.required],
      soQdDc: ['', [Validators.required]],
      idQdGoc: ['', Validators.required],
      soQdGoc: ['', [Validators.required]],
      ngayKyQdGoc: [''],
      ngayKyDc: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayHluc: ['', [Validators.required]],
      trichYeu: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tenDvi: [''],
      diaChiDvi: [''],
      soDxuat: [''],

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
  isDetail = false;
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
  fileDinhKem: Array<FileDinhKem> = [];
  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.soQdDc = "/" + this.userInfo.MA_QD
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      await Promise.all([
        this.nguonVonGetAll(),
        this.getDetail(),
        this.getQdGocList(),
      ]);

      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  tuChoi() {
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
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.TU_CHOI_TP;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.TU_CHOI_LDC;
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
        const data = res.data;
        this.formData.patchValue({
          id: data.id,
          soQdDc: data.soQdDc.split("/")[0],
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
          ldoTuchoi: data.ldoTuchoi,
          ngayKyQdGoc: data.ngayKyQdGoc,

        });
        this.danhsachDxMtt = data.hhDcQdPduyetKhmttDxList;
        this.danhsachDxMttCache = cloneDeep(this.danhsachDxMtt)
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.setTitle();
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async getQdGocList() {
    this.spinner.show();
    let body = {
      trangThai: STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhPheDuyetKeHoachMTTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listQdGoc = res.data.content
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();

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
        dataHeader: ['Số quyết định gốc', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdPduyet', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.onChangeSoQdGoc(data.id);
      }
    });
  }
  async onChangeSoQdGoc($event) {
    this.spinner.show();
    if ($event) {
      let res = await this.quyetDinhPheDuyetKeHoachMTTService.getDetail($event);
      let qdGoc = this.listQdGoc.filter(item => item.id == $event)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          id: null,
          ngayKyQdGoc: data.ngayKy,
          idQdGoc: $event,
          soQdGoc: qdGoc.length > 0 ? qdGoc[0].soQdPduyet : null,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          moTaHangHoa: data.moTaHangHoa,
        })
        this.danhsachDxMtt = data.hhQdPheduyetKhMttDxList;
        this.danhsachDxMttCache = cloneDeep(this.danhsachDxMtt)
        for (let item of this.danhsachDxMtt) {
          item.id = null;
        }

      }

      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.spinner.hide();
  }
  index = 0;
  async showDetail(event, index) {
    await this.spinner.show();
    event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    event.target.parentElement.classList.add('selectedRow');
    this.dataInput = this.danhsachDxMtt[index];
    this.dataInputCache = this.danhsachDxMttCache[index];
    this.index = index;
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
  iconButtonDuyet: string;
  titleButtonDuyet: string;
  titleStatus: string;
  setTitle() {
    let trangThai = this.formData.get('trangThai').value
    switch (trangThai) {
      case STATUS.DU_THAO: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Gửi duyệt';
        this.titleStatus = 'Dự thảo';
        break;
      }
      case STATUS.TU_CHOI_LDV: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Gửi duyệt';
        this.titleStatus = 'Từ chối - LĐ Vụ';
        break;
      }
      case STATUS.CHO_DUYET_LDV: {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet'
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - LĐ Vụ';
        break
      }
      case STATUS.DA_DUYET_LDV: {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet'
        this.titleButtonDuyet = 'Ban hành';
        this.titleStatus = 'Đã duyệt';
        break
      }
      case STATUS.BAN_HANH: {
        this.titleStatus = 'Ban hành';
        break
      }
    }

  }

  deleteItem(index) {
    this.danhsachDxMtt = this.danhsachDxMtt.filter((item, i) => i !== index)
  }

  async openDialogDeXuat(index) {
    let data = this.danhsachDxMtt[index]
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
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    let body = this.formData.value;
    body.soQdDc = body.soQdDc + this.soQdDc;
    body.hhDcQdPduyetKhmttDxList = this.danhsachDxMtt;
    body.fileDinhKems = this.fileDinhKem;
    for (const item of body.hhDcQdPduyetKhmttDxList) {
      item.hhDcQdPduyetKhmttSlddList = item.soLuongDiaDiemList;
    };

    body.ngayKyDc = this.datePipe.transform(body.ngayKyDc, 'yyyy-MM-dd');
    body.ngayHluc = this.datePipe.transform(body.ngayHluc, 'yyyy-MM-dd');

    let res = null;
    if (this.formData.get('id').value) {
      res = await this.dieuChinhQuyetDinhPdKhmttService.update(body);
    } else {
      res = await this.dieuChinhQuyetDinhPdKhmttService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
        this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.quayLai()
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.quayLai()
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async guiDuyet() {
    let trangThai = ''
    let mesg = ''

    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        mesg = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC: {
        trangThai = STATUS.CHO_DUYET_TP;
        mesg = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        mesg = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC
        mesg = 'Bạn có muốn gửi duyệt ?'
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

}
