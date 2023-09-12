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
import {TYPE_PAG} from "../../../../../../../constants/config";
import {MESSAGE} from "../../../../../../../constants/message";
import {DanhMucTieuChuanService} from "../../../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {UploadFileService} from "../../../../../../../services/uploaFile.service";
import {saveAs} from 'file-saver';
import {CanCuXacDinhPag, PhuongPhapXacDinhGia, ThongTinChungPag,} from "../../../../../../../models/DeXuatPhuongAnGia";
import {FileDinhKem} from "../../../../../../../models/FileDinhKem";
import {STATUS} from "../../../../../../../constants/status";
import {DialogTuChoiComponent} from "../../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  QuyetDinhGiaCuaBtcService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";
import {PREVIEW} from "../../../../../../../constants/fileType";
import printJS from "print-js";

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
  userInfo: UserLogin;
  soDeXuat: string;
  dsLoaiGia: any[] = [];
  rowItemCcXdg: CanCuXacDinhPag = new CanCuXacDinhPag();
  rowItemTtc: ThongTinChungPag = new ThongTinChungPag();
  rowItemPpxdg: PhuongPhapXacDinhGia = new PhuongPhapXacDinhGia();
  listVat: any[] = []
  listDxCanSua: any[] = []
  dsLoaiDx: any[] = []
  pagTtChungs: any[] = []
  maDx: string;
  dataTable: any[] = [];
  dsPhuongAnGia: any[] = [];
  dsLoaiHangXdg: any[] = [];
  STATUS = STATUS;
  fileDinhKemList: any[] = [];
  dataTableTtThamKhao: any[] = [];
  typeConst = TYPE_PAG;
  tenLoaiVthh: string;
  reportTemplate: any = {
    typeFile: "",
    fileName: "de_xuat_phuong_an_gia.docx",
    tenBaoCao: "",
    trangThai: ""
  };
  showDlgPreview = false;
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;

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
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year')],
        soDeXuat: [],
        loaiVthh: [null],
        ngayKy: [null],
        nguoiKy: [null],
        loaiGia: [null],
        trichYeu: [null],
        trangThai: ['00'],
        tenTrangThai: ['Dự Thảo'],
        ghiChu: [],
        noiDung: [null],
        soDeXuatDc: [null],
        lanDeXuat: [1],
        lyDoTuChoi: [],
        qdCtKhNam: [null],
        soCanCu: [null],
        maPphapXdg: [null],
        loaiHangXdg: ['XDG_LH01'],
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
    this.loadTiLeThue();
    await this.getDataDetail(this.idInput);
    this.spinner.hide();
  }

  async loadTiLeThue() {
    this.spinner.show();
    try {
      let res = await this.danhMucService.danhMucChungGetAll("THUE_SUAT_VAT");
      if (res.msg == MESSAGE.SUCCESS) {
        this.listVat = res.data;
        if (this.listVat && this.listVat.length > 0) {
          this.listVat.sort((a, b) => (a.giaTri - b.giaTri))
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  luuEdit(id: number, page: string): void {
    if (page == 'ttc') {
      Object.assign(this.pagTtChungs[id], this.dataEdit[id].data);
      this.dataEdit[id].edit = false;
    }

    if (page == 'ccXdg') {
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
        nzTitle: 'Danh sách điều chỉnh đề xuất phương án giá',
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
      vat: data.vat ? data.vat.toString() : '',
      ghiChu: data.ghiChu,
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
      type: data.type,
      lanDeXuat: data.lanDeXuat > 0 ? data.lanDeXuat + 1 : 1
    })
    this.dataTableCanCuXdg = data.canCuPhapLy;
    this.dataTableCanCuXdg.forEach(item => {
      item.id = null;
    })
    this.pagTtChungs = data.pagTtChungs;
    this.pagTtChungs.forEach(item => {
      item.id = null;
    })
    this.dataTableKsGia = data.ketQuaKhaoSatGiaThiTruong;
    this.dataTableKsGia.forEach(item => {
      item.id = null;
    })
    this.dataTableKqGia = data.ketQuaThamDinhGia;
    this.dataTableKqGia.forEach(item => {
      item.id = null;
    })
    this.dataTableTtThamKhao = data.ketQuaKhaoSatTtThamKhao;
    this.dataTableTtThamKhao.forEach(item => {
      item.id = null;
    })
  }


  async loadDsDxCanSua() {
    this.spinner.show();

    let body = {
      namKh: this.formData.value.namKeHoach,
      type: this.type,
      pagType: this.loaiVthh,
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
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

  async themDataTable(page: string) {
    if (page == 'ttc') {
      if (this.type == 'GCT' && !this.rowItemTtc.giaQdBtc) {
        this.notification.error(MESSAGE.ERROR, 'Không tìm thấy giá BTC cho loại hàng này')
        return;
      }
      if (!this.tenLoaiVthh || (!this.rowItemTtc.cloaiVthh && this.listCloaiVthh.length > 0) || !this.rowItemTtc.soLuong || !this.rowItemTtc.giaDn) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng nhập đủ thông tin')
        return;
      }

      if (this.listCloaiVthh && this.listCloaiVthh.length > 0) {
        let cloaiMap = this.pagTtChungs.map(item => item.cloaiVthh);
        if (cloaiMap && cloaiMap.length > 0 && cloaiMap.includes(this.rowItemTtc.cloaiVthh)) {
          this.notification.error(MESSAGE.ERROR, 'Vui lòng không nhập trùng chủng loại hàng hóa');
          return;
        }
      } else {
        if (this.pagTtChungs && this.pagTtChungs.length == 1) {
          this.notification.error(MESSAGE.ERROR, 'Không thể thêm mới dữ liệu');
          return;
        }
      }
      this.rowItemTtc.maDvi = this.userInfo.MA_DVI
      this.rowItemTtc.loaiVthh = this.formData.value.loaiVthh
      this.rowItemTtc.tenLoaiVthh = this.tenLoaiVthh;
      if (!this.rowItemTtc.cloaiVthh) {
        let resp = await this.danhMucService.getDetail(this.formData.value.loaiVthh);
        if (resp.msg == MESSAGE.SUCCESS) {
          this.rowItemTtc.tchuanCluong = resp.data && resp.data.tieuChuanCl ? resp.data.tieuChuanCl : "";
          this.rowItemTtc.donViTinh = resp.data && resp.data.donViTinh ? resp.data.donViTinh : "";
        }
      }
      this.pagTtChungs = [...this.pagTtChungs, this.rowItemTtc];
      this.rowItemTtc = new ThongTinChungPag();
      this.updateEditCache(page);
      console.log(this.pagTtChungs, 11111);
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
      console.log(data.vat, 111)
      console.log(this.listVat, 222)
      this.maDx = data.soDeXuat ? '/' + data.soDeXuat.split('/')[1] : '/TCDT-KH';
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
        maPphapXdg: data.maPphapXdg,
        vat: data.vat ? data.vat.toString() : '',
      })
      this.tenLoaiVthh = res.data && res.data.tenLoaiVthh ? res.data.tenLoaiVthh : null;
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
    let loaiHangHoa = this.listVthh.filter(item => item.ma == event);
    if (loaiHangHoa && loaiHangHoa.length > 0) {
      this.tenLoaiVthh = loaiHangHoa[0].ten
    }
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.listCloaiVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangeCloaiVthh(event) {
    this.rowItemTtc.giaQdBtc = null;
    this.rowItemTtc.giaQdBtcVat = null;
    this.rowItemTtc.tchuanCluong = null;
    this.rowItemTtc.donViTinh = null;
    this.rowItemTtc.vat = null;
    let list = this.listCloaiVthh.filter(item => item.ma == event)
    this.rowItemTtc.tenCloaiVthh = list && list.length > 0 ? list[0].ten : ''
    if (this.type == 'GCT') {
      if (!this.formData.value.loaiGia) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại giá')
        return;
      }
      let body = {
        namKeHoach: this.formData.value.namKeHoach,
        loaiGia: this.formData.value.loaiGia == 'LG03' ? 'LG01' : 'LG02',
        loaiVthh: this.formData.value.loaiVthh,
        cloaiVthh: event
      }
      let res = await this.quyetDinhGiaCuaBtcService.getQdGiaVattu(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let qdBtc = res.data
        if (qdBtc) {
          this.rowItemTtc.giaQdBtc = qdBtc.giaQdBtc;
          this.rowItemTtc.giaQdBtcVat = qdBtc.giaQdBtcVat;
          this.rowItemTtc.tchuanCluong = qdBtc.tchuanCluong;
          this.rowItemTtc.donViTinh = qdBtc.donViTinh;
          this.rowItemTtc.vat = qdBtc.vat;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, 'Không tìm thấy giá BTC cho loại hàng này')
        return;
      }
    } else {
      let resp = await this.danhMucService.getDetail(event);
      if (resp.msg == MESSAGE.SUCCESS) {
        this.rowItemTtc.tchuanCluong = resp.data && resp.data.tieuChuanCl ? resp.data.tieuChuanCl : "";
        this.rowItemTtc.donViTinh = resp.data && resp.data.donViTinh ? resp.data.donViTinh : "";
      }
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


  setValidator() {
    this.formData.controls["namKeHoach"].setValidators([Validators.required]);
    this.formData.controls["soDeXuat"].setValidators([Validators.required]);
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["ngayKy"].setValidators([Validators.required]);
    this.formData.controls["loaiGia"].setValidators([Validators.required]);
    this.formData.controls["maPphapXdg"].setValidators([Validators.required]);
    if ((this.formData.value.loaiGia == 'LG01' || this.formData.value.loaiGia == 'LG03') && this.type == 'GMTDBTT') {
      this.formData.controls["vat"].setValidators([Validators.required]);
    }
  }


  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.removeValidators(this.formData);
    this.setValidator()
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    this.pagTtChungs.forEach(item => {
      if (this.type == 'GCT') {
        item.giaDnVat = item.giaDn + item.giaDn * item.vat;
      } else {
        if (this.formData.value.vat && ((this.formData.value.loaiGia == 'LG01' || this.formData.value.loaiGia == 'LG03'))) {
          item.vat = this.formData.value.vat;
          item.giaDnVat = item.giaDn + item.giaDn * this.formData.value.vat;
        }
      }
    })
    let body = this.formData.value;
    body.maDvi = this.userInfo.MA_DVI;
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

  refresh(page: string) {
    if (page == 'ttc') {
      this.rowItemTtc = new ThongTinChungPag();
    }
  }

  downloadPdf() {
    if (this.type == 'GCT') {
      saveAs(this.pdfSrc, "de_xuat_phuong_an_gia.pdf");
    } else {
      saveAs(this.pdfSrc, "de_xuat_phuong_an_gia.pdf");
    }
  }

  async downloadExcel() {
    saveAs(this.excelSrc, "de_xuat_phuong_an_gia.xlsx");
  }

  async preview() {
    this.spinner.show();
    try {
      let body = {
        reportTemplateRequest: this.reportTemplate,
        id : this.idInput
      }
      await this.giaDeXuatGiaService.preview(body).then(async s => {
        this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
        this.printSrc = s.data.pdfSrc;
        this.showDlgPreview = true;
        this
      });
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  doPrint() {
    printJS({printable: this.printSrc, type: 'pdf', base64: true});
  }
}
