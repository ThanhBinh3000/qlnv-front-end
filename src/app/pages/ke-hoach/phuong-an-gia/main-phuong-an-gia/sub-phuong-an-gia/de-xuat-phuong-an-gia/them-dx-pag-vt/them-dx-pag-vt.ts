import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserLogin} from "../../../../../../../models/userlogin";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {UserService} from "../../../../../../../services/user.service";
import {Globals} from "../../../../../../../shared/globals";
import {HelperService} from "../../../../../../../services/helper.service";
import {DeXuatPAGService} from "../../../../../../../services/ke-hoach/phuong-an-gia/deXuatPAG.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import dayjs from "dayjs";
import {API_STATUS_CODE, TYPE_PAG} from "../../../../../../../constants/config";
import {MESSAGE} from "../../../../../../../constants/message";
import {DanhMucTieuChuanService} from "../../../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {UploadFileService} from "../../../../../../../services/uploaFile.service";
import {ChiTieuKeHoachNamCapTongCucService} from "../../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import {saveAs} from 'file-saver';
import {CanCuXacDinhPag, PhuongPhapXacDinhGia, ThongTinChungPag,} from "../../../../../../../models/DeXuatPhuongAnGia";
import {FileDinhKem} from "../../../../../../../models/FileDinhKem";
import {STATUS} from "../../../../../../../constants/status";
import {DialogTuChoiComponent} from "../../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {uniqBy} from 'lodash';
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";

@Component({
  selector: 'app-them-moi-de-xuat-pag',
  templateUrl: './them-dx-pag-vt.html',
  styleUrls: ['./them-dx-pag-vt.scss']
})
export class ThemMoiDeXuatPagComponent implements OnInit {
  @Input() loaiVthh: string;
  @Input('isView') isView: boolean;
  @Input('isModal') isModal: boolean;
  @Input()
  idInput: number;
  @Input()
  type: string;
  @Output('onClose') onClose = new EventEmitter<any>();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinChungPag } } = {};
  dataEditCc: { [key: string]: { edit: boolean; data: CanCuXacDinhPag } } = {};
  dataEditPp: { [key: string]: { edit: boolean; data: PhuongPhapXacDinhGia } } = {};
  formData: FormGroup;
  pagPpXacDinhGias: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  dataTableKsGia: any[];
  dataTableCanCuXdg: any[] = [];
  dataTableKqGia: any[];
  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];
  dsQdPdKhlcnt: any[] = [];
  userInfo: UserLogin;
  soDeXuat: string;
  dsLoaiGia: any[] = [];
  rowItemCcXdg: CanCuXacDinhPag = new CanCuXacDinhPag();
  rowItemTtc: ThongTinChungPag = new ThongTinChungPag();
  rowItemPpxdg: PhuongPhapXacDinhGia = new PhuongPhapXacDinhGia();
  listDxCanSua: any[] = []
  dsLoaiDx: any[] = []
  pagTtChungs: any[] = []
  maDx: string;
  dataTable: any[] = [];
  listQdCtKh: any[] = [];
  dsPhuongAnGia: any[] = [];
  dsLoaiHangXdg: any[] = [];
  STATUS = STATUS;
  fileDinhKemList: any[] = [];
  typeConst = TYPE_PAG;

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private helperService: HelperService,
    private giaDeXuatGiaService: DeXuatPAGService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private uploadFileService: UploadFileService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year'), [Validators.required]],
        soDeXuat: [, [Validators.required]],
        loaiVthh: [null, [Validators.required]],
        ngayKy: [null, [Validators.required]],
        nguoiKy: [null, [Validators.required]],
        loaiGia: [null, [Validators.required]],
        trichYeu: [null, [Validators.required]],
        trangThai: ['00'],
        tenTrangThai: ['Dự Thảo'],
        ghiChu: [],
        noiDung: [null],
        lyDoTuChoi: [],
        qdCtKhNam: [null],
        soCanCu: [null],
        maPphapXdg: [null, [Validators.required]],
        loaiHangXdg: [],
        vat: [null]
      }
    );
  }

  async loadDsPhuongAnGia() {
    this.dsPhuongAnGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('PP_XDG');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsPhuongAnGia = res.data;
    }
  }


  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maDx = '/TCDT-KH';
      this.loadDsNam();
      // this.getDataChiTieu(),
      this.loadDsPhuongAnGia();
      this.loadDsVthh();
      this.loadDsHangHoaPag();
      this.loadDsLoaiGia();
      this.loadDsLoaiDx();
      this.loadDsDxCanSua();
      this.getDataDetail(this.idInput);
    this.spinner.hide();
  }

  luuEdit(id: number, page: string): void {
    if (page == 'ttc') {
      Object.assign(this.pagTtChungs[id], this.dataEdit[id].data);
      this.dataEdit[id].edit = false;
    }

    if (page == 'ccxdg') {
      Object.assign(this.dataTableCanCuXdg[id], this.dataEditCc[id].data);
      this.dataEditCc[id].edit = false;
    }
    if (page == 'ppxdg') {
      this.dataEditPp[id].data.tongChiPhi = this.dataEditPp[id].data.giaVonNk + this.dataEditPp[id].data.chiPhiChung + this.dataEditPp[id].data.chiPhiPhanBo;
      Object.assign(this.pagPpXacDinhGias[id], this.dataEditPp[id].data);
      this.dataEditPp[id].edit = false;
    }

  }

  async loadDsLoaiDx() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_DE_XUAT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiDx = res.data;
      if (this.dsLoaiDx.length > 0) {
        this.dsLoaiDx.sort((a, b) => (a.ma - b.ma))
      }
    }
  }

  async onChangeCloaiVthh(event) {
    let res = await this.danhMucTieuChuanService.getDetailByMaHh(event);
    if (res.statusCode == API_STATUS_CODE.SUCCESS) {
      this.formData.get('tchuanCluong').setValue(res.data.tenQchuan)
    }
  }

  async tuChoi() {
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
            lyDoTuChoi: text,
            trangThai: ''
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.CHO_DUYET_LDV: {
              body.trangThai = STATUS.TU_CHOI_LDV;
              break;
            }
          }
          let res = await this.giaDeXuatGiaService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
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
      }
    });
  }


  async loadDsHangHoaPag() {
    this.dsLoaiHangXdg = [];
    let res = await this.danhMucService.danhMucChungGetAll('PP_XDG_LOAI_HANG');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiHangXdg = res.data;
    }
  }

  openModalSoDx() {
    if (!this.isView && !this.isModal) {
      const modalQD = this.modal.create({
        nzTitle: 'Danh sách điều chỉnh đề xuất Phương án giá',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listDxCanSua,
          dataHeader: ['Số công văn', 'Ngày ký', 'Loại hàng hoa'],
          dataColumn: ['soDeXuat', 'ngayKy', 'tenLoaiVthh'],
        },
      })
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.bindingDataQd(data.id);
        }
      });
    }
  }

  async bindingDataQd(id) {
    let res = await this.giaDeXuatGiaService.getDetail(id);
    const data = res.data;
    this.formData.patchValue({
      namKeHoach: data.namKeHoach,
      soDeXuatDc: data.soDeXuat,
      loaiVthh: data.loaiVthh,
      ngayKy: data.ngayKy,
      loaiGia: data.loaiGia,
      trichYeu: data.trichYeu,
      cloaiVthh: data.cloaiVthh,
      moTa: data.moTa,
      tchuanCluong: data.tchuanCluong,
      giaDeNghi: data.giaDeNghi,
      vat: data.vat ? data.vat.toString() : '',
      giaDeNghiVat: data.giaDeNghiVat,
      soLuong: data.soLuong,
      ghiChu: data.ghiChu,
      diaDiemDeHang: data.diaDiemDeHang,
      maPphapXdg: data.maPphapXdg,
      loaiHangXdg: data.loaiHangXdg,
      giaVonNk: data.giaVonNk,
      chiPhiChung: data.chiPhiChung,
      chiPhiPbo: data.chiPhiPbo,
      tongChiPhi: data.tongChiPhi,
      noiDung: data.noiDung,
      tgianNhang: data.tgianNhang,
      soCanCu: data.soCanCu,
      qdCtKhNam: data.qdCtKhNam,
    })
    // await this.loadDsQdPduyetKhlcnt();
    this.updateEditCache('ttc');
    this.updateEditCache('ppxdg');
  }


  async loadDsDxCanSua() {
    this.spinner.show();

    let body = {
      namKh : this.formData.value.namKeHoach,
      type : this.type,
      pagType : this.loaiVthh,
      maDvi : this.userInfo.MA_DVI,
      paggingReq : {
        limit: 99999,
        page: 0,
      }
    }
    let res = await this.giaDeXuatGiaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listDxCanSua = data.content;
      if (this.listDxCanSua && this.listDxCanSua.length > 0) {
        this.listDxCanSua = this.listDxCanSua.filter(item => item.trangThai == STATUS.DA_DUYET_CBV);
      }
    }
    this.spinner.hide();
  }

  deleteItem(index: number, page: string) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          if (page == 'ttc') {
            this.pagTtChungs.splice(index, 1);
            this.updateEditCache('ttc');
          }
          if (page == 'ccXdg') {
            this.dataTableCanCuXdg.splice(index, 1);
            this.updateEditCache('ccXdg');
          }
          if (page == 'ppxdg') {
            this.pagPpXacDinhGias.splice(index, 1);
            this.updateEditCache('ppxdg');
          }
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  updateEditCache(page): void {
    if (page == 'ttc') {
      if (this.pagTtChungs) {
        this.pagTtChungs.forEach((item, index) => {
          this.dataEdit[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    }
    if (page == 'ccXdg') {
      if (this.dataTableCanCuXdg) {
        this.dataTableCanCuXdg.forEach((item, index) => {
          this.dataEditCc[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    }
    if (page == 'ppxdg') {
      if (this.pagPpXacDinhGias) {
        this.pagPpXacDinhGias.forEach((item, index) => {
          this.dataEditPp[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    }
  }

  themDataTable(page: string) {
    if (page == 'ttc') {
      this.pagTtChungs = [...this.pagTtChungs, this.rowItemTtc];
      this.rowItemTtc = new ThongTinChungPag();
      this.updateEditCache(page);
    }
    if (page == 'ccXdg') {
      this.dataTableCanCuXdg = [...this.dataTableCanCuXdg, this.rowItemCcXdg];
      this.rowItemCcXdg = new CanCuXacDinhPag();
      this.updateEditCache(page)
    }
    if (page == 'ppxdg') {
      if (this.formData.value.loaiHangXdg == "'XDG_LH02'") {
        this.rowItemPpxdg.tongChiPhi = this.rowItemPpxdg.giaVonNk + this.rowItemPpxdg.chiPhiChung - this.rowItemPpxdg.chiPhiPhanBo
      } else {
        this.rowItemPpxdg.tongChiPhi = this.rowItemPpxdg.giaVonNk + this.rowItemPpxdg.chiPhiChung
      }
      this.rowItemPpxdg.tenCloaiVthh = this.listVthh.find(s => s.ma = this.rowItemPpxdg.cloaiVthh).ten;
      this.pagPpXacDinhGias = [...this.pagPpXacDinhGias, this.rowItemPpxdg];
      this.rowItemPpxdg = new PhuongPhapXacDinhGia();
      this.updateEditCache(page)
    }

  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.giaDeXuatGiaService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soDeXuat: data.soDeXuat ? data.soDeXuat.split("/")[0] : '',
        loaiVthh: data.loaiVthh,
        ngayKy: data.ngayKy,
        nguoiKy: data.nguoiKy,
        loaiGia: data.loaiGia,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        tenTrangThai: data.tenTrangThai,
        ghiChu: data.ghiChu,
        loaiHangXdg: data.loaiHangXdg,
        noiDung: data.noiDung,
        lyDoTuChoi: data.lyDoTuChoi,
        qdCtKhNam: data.qdCtKhNam,
        maPphapXdg: data.maPphapXdg
      })
      this.pagTtChungs = data.pagTtChungs;
      this.pagPpXacDinhGias = data.pagPpXacDinhGias;
      this.dataTableKqGia = data.ketQuaThamDinhGia;
      this.dataTableKsGia = data.ketQuaKhaoSatGiaThiTruong;
      this.dataTableCanCuXdg = data.canCuPhapLy;
      this.fileDinhKemList = data.fileDinhKems;
      this.updateEditCache('ttc')
      this.updateEditCache('ccXdg')
      this.updateEditCache('ppxdg')
    }
  }

  getNameFile(event?: any, tableName?: string, item?: FileDinhKem,) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      const itemFile = {
        name: fileList[0].name,
        file: event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          if (item) {
            item.fileName = resUpload.filename;
            item.fileSize = resUpload.size;
            item.fileUrl = resUpload.url;
          } else {
            if (!this.rowItemCcXdg.fileDinhKem) {
              this.rowItemCcXdg.fileDinhKem = new FileDinhKem();
            }
            this.rowItemCcXdg.fileDinhKem.fileName = resUpload.filename;
            this.rowItemCcXdg.fileDinhKem.fileSize = resUpload.size;
            this.rowItemCcXdg.fileDinhKem.fileUrl = resUpload.url;
            this.rowItemCcXdg.fileDinhKem.idVirtual = new Date().getTime();
          }
        });
    }
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_GIA');
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.type == TYPE_PAG.GIA_MUA_TOI_DA) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG01' || item.ma == 'LG02'
        );
      }
      if (this.type == TYPE_PAG.GIA_CU_THE) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG03' || item.ma == 'LG04'
        );
      }
    }
  }

  async loadDsVthh() {
    let body = {
      "str": "02"
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.listVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangeLoaiVthh(event) {
    let body = {
      "str": event
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.listCloaiVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listCloaiVthh = res.data;
        this.loadDsQdPduyetKhlcnt();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangecloaiVthh(event) {
    this.rowItemTtc.donViTinh = null;
    const cloaiVthh = this.listCloaiVthh.filter(item => item.ma == event);
    if (cloaiVthh.length > 0) {
      this.rowItemTtc.tenCloaiVthh = cloaiVthh[0].ten
      this.rowItemTtc.donViTinh = cloaiVthh[0].maDviTinh
      this.rowItemTtc.tchuanCluong = cloaiVthh[0].tchuanCluong
    }
  }

  async onChangecloaiVTHH(event, idx) {
    this.dataEdit[idx].data.donViTinh = null;
    const cloaiVthh = this.listCloaiVthh.filter(item => item.ma == event);
    if (cloaiVthh.length > 0) {
      this.dataEdit[idx].data.tenCloaiVthh = cloaiVthh[0].ten
      this.dataEdit[idx].data.donViTinh = cloaiVthh[0].maDviTinh
      this.dataEdit[idx].data.tchuanCluong = cloaiVthh[0].tchuanCluong
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  openFile(event) {
    // if (!this.isView) {
    //   let item = {
    //     id: new Date().getTime(),
    //     text: event.name,
    //   };
    //   if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
    //     this.uploadFileService
    //       .uploadFile(event.file, event.name)
    //       .then((resUpload) => {
    //         if (!this.deXuatDieuChinh.fileDinhKemReqs) {
    //           this.deXuatDieuChinh.fileDinhKemReqs = [];
    //         }
    //         const fileDinhKem = new FileDinhKem();
    //         fileDinhKem.fileName = resUpload.filename;
    //         fileDinhKem.fileSize = resUpload.size;
    //         fileDinhKem.fileUrl = resUpload.url;
    //         fileDinhKem.idVirtual = item.id;
    //         this.deXuatDieuChinh.fileDinhKemReqs.push(fileDinhKem);
    //         this.taiLieuDinhKemList.push(item);
    //       });
    //   }
    // }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
    }
  }

  downloadFileKeHoach(event) {
  }

  quayLai() {
    this.onClose.emit();
  }

  async pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.get('id').value,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.TU_CHOI_LDV:
            case STATUS.DU_THAO: {
              body.trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDV: {
              body.trangThai = STATUS.DA_DUYET_LDV;
              break;
            }
          }
          let res = await this.giaDeXuatGiaService.approve(body)
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
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

  startEdit(index: number, page: string) {
    if (page == 'ttc') {
      this.dataEdit[index].edit = true;
    }
    if (page == 'ccXdg') {
      this.dataEditCc[index].edit = true;
    }
    if (page == 'ppxdg') {
      this.dataEditPp[index].edit = true;
    }
  }

  cancelEdit(index: number, page: string) {
    if (page == 'ttc') {
      this.dataEdit[index] = {
        data: {...this.pagTtChungs[index]},
        edit: false,
      };
    }
    if (page == 'ccXdg') {
      this.dataEditCc[index] = {
        data: {...this.dataTableCanCuXdg[index]},
        edit: false,
      };
    }
    if (page == 'ppxdg') {
      this.dataEditPp[index] = {
        data: {...this.pagPpXacDinhGias[index]},
        edit: false,
      };
    }
  }

  async getDataChiTieu() {
    if (this.type == 'GMDTBTT' && !this.idInput) {
      let res2 = await this.chiTieuKeHoachNamCapTongCucService.chiTeuPag(+this.formData.get('namKeHoach').value)
      if (res2.msg == MESSAGE.SUCCESS) {
        const dataChiTieu = res2.data;
        if (dataChiTieu) {
          this.formData.patchValue({
            soCanCu: dataChiTieu.soQuyetDinh,
          });
        } else {
          this.notification.error(MESSAGE.ERROR, 'Không tìm thấy chỉ tiêu kế hoạch năm ' + dayjs().get('year'))
          return;
        }
      }
    }
  }

  async loadDsQdPduyetKhlcnt() {
    if (this.type == 'GCT') {
      let body = {
        namKhoach: this.formData.value.namKeHoach,
        namKeHoach: this.formData.value.namKeHoach,
        maDvi: this.userInfo.MA_DVI,
        loaiVthh: this.formData.value.loaiVthh,
        trangThai: STATUS.BAN_HANH
      };
      let res = await this.giaDeXuatGiaService.loadQdGiaoKhLcnt(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let arr = res.data;
        if (arr) {
          this.listQdCtKh = uniqBy(arr, 'id');
        }
      } else {
        this.notification.error(MESSAGE.ERROR, 'Không tồn tại quyết định giao chỉ tiêu kế hoạch năm!')
        return;
      }
    }
  }


  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      let invalid = [];
      let controls = this.formData.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.pagTtChungs = this.pagTtChungs;
    body.pagPpXacDinhGias = this.pagPpXacDinhGias;
    body.canCuPhapLy = this.dataTableCanCuXdg;
    body.ketQuaKhaoSatGiaThiTruong = this.dataTableKsGia;
    body.ketQuaThamDinhGia = this.dataTableKqGia;
    body.type = this.type;
    body.soDeXuat = body.soDeXuat + this.maDx;
    body.fileDinhKemReqs = this.fileDinhKemList;
    let res
    if (this.idInput > 0) {
      res = await this.giaDeXuatGiaService.update(body);
    } else {
      res = await this.giaDeXuatGiaService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.pheDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }


  huyEdit(index: number, page: string) {
    if (page == 'ttc') {
      this.dataEdit[index].edit = false;
    }
    if (page == 'ccXdg') {
      this.dataEditCc[index].edit = false;
    }
    if (page == 'ppxdg') {
      this.dataEditPp[index].edit = false;
    }
  }

  onChangePp() {
    if (this.formData.value.loaiHangXdg == 'XDG_LH02') {
      this.rowItemPpxdg.tongChiPhi = this.rowItemPpxdg.chiPhiChung + this.rowItemPpxdg.giaVonNk - this.rowItemPpxdg.chiPhiPhanBo
    } else {
      this.rowItemPpxdg.tongChiPhi = this.rowItemPpxdg.chiPhiChung + this.rowItemPpxdg.giaVonNk
    }
    this.pagPpXacDinhGias = []
  }
}
