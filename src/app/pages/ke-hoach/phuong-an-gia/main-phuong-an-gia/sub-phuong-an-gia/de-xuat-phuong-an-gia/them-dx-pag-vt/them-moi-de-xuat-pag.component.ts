import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserLogin } from "../../../../../../../models/userlogin";
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { UserService } from "../../../../../../../services/user.service";
import { Globals } from "../../../../../../../shared/globals";
import { HelperService } from "../../../../../../../services/helper.service";
import { DeXuatPAGService } from "../../../../../../../services/ke-hoach/phuong-an-gia/deXuatPAG.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import dayjs from "dayjs";
import {API_STATUS_CODE, LIST_VAT_TU_HANG_HOA} from "../../../../../../../constants/config";
import { MESSAGE } from "../../../../../../../constants/message";
import {DanhMucTieuChuanService} from "../../../../../../../services/danhMucTieuChuan.service";
import {UploadFileService} from "../../../../../../../services/uploaFile.service";
import {ChiTieuKeHoachNamCapTongCucService} from "../../../../../../../services/chiTieuKeHoachNamCapTongCuc.service";
import {QuyetDinhPheDuyetKeHoachLCNTService} from "../../../../../../../services/quyetDinhPheDuyetKeHoachLCNT.service";
import { saveAs } from 'file-saver';
import {
  CanCuXacDinhPag,
  PhuongPhapXacDinhGia,
  ThongTinChungPag,
  ThongTinKhaoSatGia
} from "../../../../../../../models/DeXuatPhuongAnGia";
import {FileDinhKem} from "../../../../../../../models/FileDinhKem";

@Component({
  selector: 'app-them-moi-de-xuat-pag',
  templateUrl: './them-moi-de-xuat-pag.component.html',
  styleUrls: ['./them-moi-de-xuat-pag.component.scss']
})
export class ThemMoiDeXuatPagComponent implements OnInit {
  isGiaMuaToiDa: boolean = false;
  @Input() loaiVthh: string;
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Input()
  type: string;
  @Output('onClose') onClose = new EventEmitter<any>();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinChungPag } } = {};
  formData: FormGroup;
  pagPpXacDinhGias:  any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  dataTableKsGia: any[] = [];
  dataTableCanCuXdg: any[] = [];
  dataTableKqGia: any[] = [];
  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];
  dsQdPdKhlcnt: any[] = [];
  userInfo: UserLogin;
  soDeXuat: string;
  dsLoaiGia: any[] = [];
  rowItemCcXdg: CanCuXacDinhPag = new CanCuXacDinhPag();
  rowItemTtc: ThongTinChungPag = new ThongTinChungPag();
  rowItemPpxdg: PhuongPhapXacDinhGia =  new PhuongPhapXacDinhGia();
  pagTtChungs: any[] = []
  maDx: string;
  dataTable: any[] = [];
  dsPhuongAnGia: any[] = [];
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
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,

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
        cloaiVthh: [null, [Validators.required]],
        ghiChu: [],
        loaiHangXdg: [],
        noiDung: [null],
        lyDoTuChoi: [],
        qdCtKhNam:[null, [Validators.required] ],
        maPphapXdg:[null, [Validators.required] ]
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
    await Promise.all([
      this.loadDsQdPduyetKhlcnt(),
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.loadDsPhuongAnGia(),
      this.loadDsVthh(),
      this.loadDsLoaiGia(),
      this.maDx = '/TCDT-KH',
      this.getDataDetail(this.idInput)
    ])
    this.spinner.hide();
  }

  async onChangeCloaiVthh(event) {
    let res = await this.danhMucTieuChuanService.getDetailByMaHh(event);
    if (res.statusCode == API_STATUS_CODE.SUCCESS) {
      this.formData.get('tchuanCluong').setValue(res.data.tenQchuan)
    }
  }

  deleteItem(index: number) {
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
          this.pagTtChungs.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  updateEditCache(): void {
    if (this.dataTableCanCuXdg) {
      let i = 0;
      this.pagTtChungs.forEach((item) => {
        this.dataEdit[i] = {
          edit: false,
          data: { ...item },
        };
        i++
      });
    }
  }

  themDataTableTtc() {
    this.pagTtChungs = [...this.pagTtChungs, this.rowItemTtc];
    this.rowItemTtc = new ThongTinChungPag();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.giaDeXuatGiaService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soDeXuat: data.soDeXuat,
        loaiVthh: data.loaiVthh,
        ngayKy: data.ngayKy,
        nguoiKy: data.nguoiKy,
        loaiGia: data.loaiGia,
        trichYeu: data.trichYeu,
        trangThai:data.trangThai,
        tenTrangThai: data.tenTrangThai,
        cloaiVthh: data.cloaiVthh,
        ghiChu: data.ghiChu,
        loaiHangXdg: data.loaiHangXdg,
        noiDung: data.noiDung,
        lyDoTuChoi: data.lyDoTuChoi,
        qdCtKhNam: data.qdCtKh,
        maPphapXdg: data.maPphapXdg
      })
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
          }
          else {
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

  themDataTable(tableName: String) {
    if (tableName == 'ccXdg') {
      this.dataTableCanCuXdg = [...this.dataTableCanCuXdg, this.rowItemCcXdg];
      this.rowItemCcXdg = new CanCuXacDinhPag();
    }
    if (tableName == 'ppxdg') {
      this.rowItemPpxdg.tongChiPhi = this.rowItemPpxdg.giaVonNk + this.rowItemPpxdg.chiPhiChung
      this.pagPpXacDinhGias = [...this.pagPpXacDinhGias, this.rowItemPpxdg];
      this.rowItemPpxdg = new PhuongPhapXacDinhGia();
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
      this.dsLoaiGia = res.data;
    }
  }
  async onChangeSoQd($event) {
    // let dataQd = this.dsQdPdKhlcnt.filter(item => item.soQd == $event);
    // if (dataQd.length > 0) {
    //   let dataDetail = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(dataQd[0].id);
    //   const data = dataDetail.data;
    //   this.formData.patchValue({
    //     loaiVthh: data.loaiVthh,
    //     cloaiVthh: data.cloaiVthh,
    //     tgianNhang: data.tgianNhang
    //   })
    // }
  }

  async loadDsVthh() {
    let body = {
      "str" : "02"
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
      "str" : event
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.listCloaiVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    console.log(this.listCloaiVthh)
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

  downloadFileKeHoach(event) { }

  quayLai() {
    this.onClose.emit();
  }

  banHanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: '11',
          };
          let res =
            await this.giaDeXuatGiaService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
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

  async loadDsQdPduyetKhlcnt() {
    let body = {
      namKhoach: this.formData.get('namKeHoach').value,
      lastest: 1,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
    };
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsQdPdKhlcnt = res.data.content;
    }
  }
  async save() {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
      console.log(this.formData.value)
    }
    let body = this.formData.value;
    body.fileDinhKems = this.taiLieuDinhKemList;
    body.soDeXuat = body.soDeXuat + this.maDx;
    body.pagTtChungs = this.pagTtChungs;
    body.pagPpXacDinhGias = this.pagPpXacDinhGias;
    body.canCuPhapLy = this.dataTableCanCuXdg;
    body.ketQuaKhaoSatGiaThiTruong = this.dataTableKsGia;
    body.ketQuaThamDinhGia = this.dataTableKqGia;
    body.type = this.type;
    let res
    if (this.idInput > 0) {
      res = await this.giaDeXuatGiaService.update(body);
    } else {
      res = await this.giaDeXuatGiaService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.idInput > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
    console.log(this.formData)
  }


}
