import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { STATUS } from "../../../../../../constants/status";
import { cloneDeep } from "lodash";
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { TongHopDeXuatKHMTTService } from 'src/app/services/tong-hop-de-xuat-khmtt.service';
import { DanhSachMuaTrucTiep } from 'src/app/models/DeXuatKeHoachMuaTrucTiep';



@Component({
  selector: 'app-themmoi-quyetdinh-khmtt',
  templateUrl: './themmoi-quyetdinh-khmtt.component.html',
  styleUrls: ['./themmoi-quyetdinh-khmtt.component.scss']
})
export class ThemmoiQuyetdinhKhmttComponent implements OnInit {

  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() dataTongHop: any;
  @Output()
  showListEvent = new EventEmitter<any>();


  formData: FormGroup;
  formThongTinChung: FormGroup;

  selectedCanCu: any = {};
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: "" };
  errorInputRequired: string = null;
  errorGhiChu: boolean = false;
  maQd: string = null;
  fileDinhKem: Array<FileDinhKem> = [];

  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listVatTuHangHoa: any[] = [];
  fileList: any[] = [];
  listDanhSachTongHop: any[] = [];
  listToTrinh: any[] = [];
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-core/file/upload-attachment`;

  lastBreadcrumb: string;
  userInfo: UserLogin;

  danhMucDonVi: any;
  danhsachDxMtt: any[] = [];
  danhsachDxMttCache: any[] = [];

  iconButtonDuyet: string;
  titleButtonDuyet: string;

  listNam: any[] = [];
  yearNow: number = 0;

  listOfData: any[] = [];


  STATUS = STATUS

  dataInput: any;
  dataInputCache: any;



  constructor(
    private router: Router,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private tongHopDeXuatKHMTTService: TongHopDeXuatKHMTTService,
    public userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    public globals: Globals,
    private dauThauService: DanhSachDauThauService,
  ) {
    this.formData = this.fb.group({
      id: [null],
      namKh: [dayjs().get('year'), Validators.required],
      soQdPduyet: ['', [Validators.required]],
      idDxuat: [''],
      soDxuat: [''],
      idThop: [''],
      ngayKy: ['', [Validators.required]],
      ngayHluc: ['', [Validators.required]],
      idTrHdr: [''],
      trichYeu: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      trangThaiTkhai: [STATUS.CHUA_CAP_NHAT],
      tenTrangThaiTkhai: ['Chưa cập nhập'],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tchuanCluong: [''],
      phanLoai: [''],
      namKhoach: [''],
    })
  }

  setValidator() {
    if (this.formData.get('phanLoai').value == 'TH') {
      this.formData.controls["idThop"].setValidators([Validators.required]);
      this.formData.controls["idTrHdr"].clearValidators();
      this.formData.controls["soDxuat"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TTr') {
      this.formData.controls["idThop"].clearValidators();
      this.formData.controls["idTrHdr"].setValidators([Validators.required]);
      this.formData.controls["soDxuat"].setValidators([Validators.required]);
    }
  }

  isDetailPermission() {
    if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_SUA") && this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_THEM")) {
      return true;
    }
    return false;
  }

  deleteSelect() {

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.maQd = this.userInfo.MA_QD;
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') + i,
          text: dayjs().get('year') + i,
        });
      }
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
      } else {
        this.initForm();
      }
      await Promise.all([
        this.bindingDataTongHop(this.dataTongHop),
      ]);
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm() {
    this.formData.patchValue({
      namKhoach: dayjs().get('year'),
    })
  }


  async bindingDataTongHop(dataTongHop?) {
    if (dataTongHop) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenLoaiVthh: dataTongHop.tenLoaiVthh,
        namKh: +dataTongHop.namKhoach,
        idThop: dataTongHop.id,
        tchuanCluong: dataTongHop.tchuanCluong,
        phanLoai: 'TH',
      })
      await this.selectMaTongHop(dataTongHop.id);
    }
    await this.listDsTongHopToTrinh();

  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }


  async listDsTongHopToTrinh() {
    await this.spinner.show();
    // Get data tổng hợp
    let bodyTh = {
      trangThai: STATUS.CHUA_TAO_QD,
      namKhoach: this.formData.get('namKh').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resTh = await this.tongHopDeXuatKHMTTService.search(bodyTh);
    if (resTh.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = resTh.data.content;
    }
    // Get data tờ trình
    let bodyToTrinh = {
      listTrangThai: [STATUS.DA_DUYET_LDC, STATUS.DA_DUYET_LDV],
      listTrangThaiTh: [STATUS.CHUA_TONG_HOP, STATUS.CHUA_TAO_QD],
      namKh: this.formData.get('namKh').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resToTrinh = await this.danhSachMuaTrucTiepService.search(bodyToTrinh);
    if (resToTrinh.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = resToTrinh.data.content;
    }
    await this.spinner.hide();
  }


  async save(isGuiDuyet?) {
    await this.spinner.show();
    if (!this.isDetailPermission()) {
      return;
    }
    this.setValidator()
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + "/" + this.maQd;
    body.hhQdPheduyetKhMttDxList = this.danhsachDxMtt;
    body.fileDinhKems = this.fileDinhKem;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.quyetDinhPheDuyetKeHoachMTTService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKeHoachMTTService.create(body);
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
    await this.spinner.hide();
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
        await this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThai: STATUS.TU_CHOI_LDV,
          };
          const res = await this.quyetDinhPheDuyetKeHoachMTTService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    let trangThai = ''
    let mesg = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO: {
        trangThai = STATUS.BAN_HANH;
        mesg = 'Văn bản sẵn sàng ban hành ?'
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
        await this.spinner.show();
        try {
          let body = {
            "id": this.idInput,
            "trangThai": trangThai
          }
          let res = await this.quyetDinhPheDuyetKeHoachMTTService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhPheDuyetKeHoachMTTService.getDetail(id);
      this.listToTrinh = [];
      this.listDanhSachTongHop = [];
      const data = res.data;

      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQd: data.soQd.split("/")[0],
      });
      this.danhsachDxMtt = data.hhQdPheduyetKhMttDxList[0].soLuongDiaDiemList
      this.danhsachDxMtt = data.hhQdPheduyetKhMttDxList;
      this.danhsachDxMttCache = cloneDeep(this.danhsachDxMtt);
      for (const item of this.danhsachDxMttCache) {
        await this.danhSachMuaTrucTiepService.getDetail(item.idDxHdr).then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            item.soLuongDiaDiemList = res.data.soLuongDiaDiemList;
          }
        })
      }

    };
  }

  openDialogTh() {
    if (this.formData.get('phanLoai').value != 'TH') {
      return;
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp đề xuất kế hoạch lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachTongHop,
        dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
        dataColumn: ['id', 'noiDung']
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
    if (event) {
      const res = await this.tongHopDeXuatKHMTTService.getDetail(event)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        console.log(data, 1121);

        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tchuanCluong: data.tchuanCluong,
          loaiHdong: data.loaiHdong,
          nguonVon: data.nguonVon,
          idThop: event,
          idTrHdr: null,
          maTrHdr: null,
        })
        // this.danhsachDx = data.hhDxKhMttThopDtls;
        data.hhDxKhMttThopDtls.forEach(item => {
          this.danhsachDxMtt.push(item.listDxuatHdr)
        })
        for (const item of this.danhsachDxMtt) {
          await this.danhSachMuaTrucTiepService.getDetail(item.idDxKhmtt).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              item.soLuongDiaDiemList = res.data.soLuongDiaDiemList;
            }
          })
        };
        this.danhsachDxMttCache = cloneDeep(this.danhsachDxMtt);
        this.dataInput = null;
        this.dataInputCache = null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide()
  }

  openDialogTr() {
    if (this.formData.get('phanLoai').value != 'TTr') {
      return
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách đề xuất kế hoạch lựa chọn nhà thầu',
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
    this.danhsachDxMtt = [];
    if (data) {
      const res = await this.danhSachMuaTrucTiepService.getDetail(data.id)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataRes = res.data;
        dataRes.idDxKhmtt = data.id;
        this.danhsachDxMtt.push(dataRes);
        this.formData.patchValue({
          trichYeu: dataRes.trichYeu,
          idThop: null,
          soDxuat: dataRes.soDxuat,
          idTrHdr: dataRes.id
        })
        this.danhsachDxMttCache = cloneDeep(this.danhsachDxMtt);
        this.dataInput = null;
        this.dataInputCache = null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide();
  }

  async showDetail($event, index) {
    await this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow');
    this.dataInput = this.danhsachDxMtt[index];
    this.dataInputCache = this.danhsachDxMttCache[index];
    await this.spinner.hide();
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

}
