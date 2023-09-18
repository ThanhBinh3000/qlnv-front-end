import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "src/app/services/donvi.service";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {
  TongHopPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "src/app/constants/status";
import {FileDinhKem} from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import {MESSAGE} from "src/app/constants/message";
import {v4 as uuidv4} from "uuid";
import {chain, cloneDeep} from 'lodash';
import {UserLogin} from "src/app/models/userlogin";
import {DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan} from "src/app/models/KeHoachBanDauGia";
import {DatePipe} from "@angular/common";
import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import {PREVIEW} from "../../../../../../constants/fileType";

@Component({
  selector: 'app-chi-tiet-quyet-dinh-pd',
  templateUrl: './chi-tiet-quyet-dinh-pd.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-pd.component.scss']
})
export class ChiTietQuyetDinhPdComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  radioValue: any;
  cacheData: any[] = [];
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  listLoaiHangHoa: any[] = [];
  userInfo: UserLogin;
  expandSetView = new Set<number>();
  expandSetEdit = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maKeHoach: string;
  listLoaiHopDong: any[] = [];
  listLoaiHinhNhapXuat: any[] = [];
  thongTinChiTiet: any[];
  thongTinChiTietTh: any[];
  tongSoLuongDxuat = 0;
  tongSoLuongTongHop = 0;
  tongThanhTienDxuat = 0;
  tongThanhTienTongHop = 0;
  tongHopEdit: any = [];
  datePipe = new DatePipe('en-US');
  isVisible = false;

  isVisibleTuChoiDialog = false;
  isQuyetDinh: boolean = false;
  listThanhTien: number[];
  listSoLuong: number[];
  phuongAnView: any;
  phuongAnHdrView: any;
  phuongAnViewCache: any;
  phuongAnHdrViewCache: any;
  expandSetString = new Set<string>();
  expandSetStringCache = new Set<string>();
  listKieuNhapXuat: any;
  listHangHoaAll: any;
  dsDonVi: any;
  tongThanhTien: any;
  tongSoLuong: any;
  tongSoLuongDeXuat: any;
  tongSoLuongXuatCap: any;
  listVatTuHangHoa: any[] = [];
  quyetDinhPdDtlCache: any[] = [];
  maHauTo: any;
  templateName = "Quyết định phê duyệt phương án";
  templateNameVt = "Quyết định phê duyệt phương án vật tư";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private tongHopPhuongAnCuuTroService: TongHopPhuongAnCuuTroService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetPhuongAnCuuTroService);
    this.formData = this.fb.group({
        id: [],
        maDvi: [],
        nam: [dayjs().get("year"), [Validators.required]],
        soBbQd: [],
        ngayKy: [],
        ngayHluc: [],
        idTongHop: [],
        maTongHop: [],
        ngayThop: [],
        idDx: [],
        soDx: [],
        idXc: [],
        soXc: [],
        ngayDx: [],
        tongSoLuongDx: [],
        tongSoLuong: [],
        thanhTien: [],
        soLuongXuaCap: [],
        loaiVthh: [],
        cloaiVthh: [],
        tenVthh: [],
        loaiNhapXuat: [],
        kieuNhapXuat: [],
        mucDichXuat: [],
        trichYeu: [],
        trangThai: [STATUS.DU_THAO],
        lyDoTuChoi: [],
        xuatCap: [false],
        type: [],
        ngayPduyet: [],
        nguoiPduyetId: [],
        donViTinh: [],
        idQdGiaoNv: [],
        soQdGiaoNv: [],
        tenDvi: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenTrangThai: ['Dự thảo'],
        quyetDinhPdDtl: [new Array()],
        fileDinhKem: [new Array<FileDinhKem>()],
        canCu: [new Array<FileDinhKem>()]
      }
    );
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/QĐPDCTVT-' + this.userInfo.DON_VI.tenVietTat;
      await Promise.all([]);
      await this.loadDetail();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDetail() {
    if (this.idSelected > 0) {
      await this.quyetDinhPheDuyetPhuongAnCuuTroService.getDetail(this.idSelected)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data.soBbQd) {
              this.maHauTo = '/' + res.data.soBbQd?.split("/")[1];
              res.data.soBbQd = res.data.soBbQd?.split("/")[0];
            }
            res.data.quyetDinhPdDtl.forEach(s => s.idVirtual = uuidv4());
            this.formData.patchValue(res.data);


            //get cache
            if (this.formData.value.type == 'TTr') {
              let res = await this.deXuatPhuongAnCuuTroService.getDetail(this.formData.value.idDx);
              let detail = res.data;
              detail.deXuatPhuongAn.forEach(s => {
                s.noiDungDx = s.noiDung;
                s.soDx = detail.soDx;
                s.ngayKyDx = detail.ngayDx;
                s.trichYeuDx = detail.trichYeu;
                s.soLuongDx = s.soLuong;
                s.loaiNhapXuat = detail.loaiNhapXuat;
                s.kieuNhapXuat = detail.kieuNhapXuat;
                s.mucDichXuat = detail.mucDichXuat;
              });
              this.quyetDinhPdDtlCache = cloneDeep(detail.deXuatPhuongAn);
            } else {
              let res = await this.tongHopPhuongAnCuuTroService.getDetail(this.formData.value.idTongHop);
              let detail = res.data;
              this.quyetDinhPdDtlCache = cloneDeep(detail.deXuatCuuTro);
            }

            await this.buildTableView();
            if (this.phuongAnHdrView) {
              await this.selectRow(this.phuongAnHdrView[0])
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({type: 'TTr', tenDvi: this.userInfo.TEN_DVI,});
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    // this.formData.controls.soQdGnv.setValidators([Validators.required]);
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
    }
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = {...this.formData.value, soBbQd: this.formData.value.soBbQd + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async openDialogTh() {
    if (this.formData.get('type').value != 'TH') {
      return;
    }
    try {
      await this.spinner.show();
      let res = await this.tongHopPhuongAnCuuTroService.search({
        trangThai: STATUS.DA_DUYET_LDV,
        nam: this.formData.get('nam').value,
        idQdPdNull: true,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0
        },
      });
      if (res.msg == MESSAGE.SUCCESS) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách tổng hợp đề xuất phương án cứu trợ, viện trợ',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data.content,
            dataHeader: ['Số tổng hợp', 'Ngày tổng hợp', 'Nội dung tổng hợp'],
            dataColumn: ['id', 'ngayTao', 'noiDungThop']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.formData.patchValue({
              idTongHop: data.id,
              maTongHop: data.maTongHop,
              ngayThop: data.ngayTao
            });
            let res = await this.tongHopPhuongAnCuuTroService.getDetail(data.id);
            let detail = res.data;
            this.quyetDinhPdDtlCache = cloneDeep(detail.deXuatCuuTro);
            if (!this.formData.value.id) {
              this.formData.patchValue({quyetDinhPdDtl: detail.deXuatCuuTro});
            }

            delete data.id;
            delete data.trangThai;
            delete data.tenTrangThai;
            delete data.type;
            delete data.canCu;
            delete data.fileDinhKem;
            this.formData.value.quyetDinhPdDtl.forEach(s => delete s.id);

            this.formData.patchValue(data);
            await this.buildTableView();
            await this.selectRow(this.phuongAnHdrViewCache[0]);
          }

        });
      }
    } catch (e) {
      console.log(e)
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      await this.spinner.hide();
    }
  }

  async openDialogTr() {
    if (this.formData.get('type').value != 'TTr') {
      return
    }
    await this.spinner.show();
    // Get data tờ trình
    try {
      let res = await this.deXuatPhuongAnCuuTroService.search({
        trangThaiList: [STATUS.DA_DUYET_LDV, STATUS.DA_DUYET_LDC, STATUS.DA_TAO_CBV],
        maTongHop: null,
        // nam: this.formData.get('2022').value,
        //loaiVthh: this.loaiVthh,
        idQdPdNull: true,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0
        },
      });
      if (res.msg == MESSAGE.SUCCESS) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách đề xuất phương án cứu trợ, viện trợ',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data.content,
            dataHeader: ['Số tờ trình đề xuất', 'Ngày đề xuất', 'Nội dung'],
            dataColumn: ['soDx', 'ngayDx', 'noiDung']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            let res = await this.deXuatPhuongAnCuuTroService.getDetail(data.id);
            let detail = res.data;
            detail.deXuatPhuongAn.forEach(s => {
              s.noiDungDx = s.noiDung;
              s.soDx = detail.soDx;
              s.ngayKyDx = detail.ngayDx;
              s.trichYeuDx = detail.trichYeu;
              s.soLuongDx = s.soLuong;
              s.loaiNhapXuat = detail.loaiNhapXuat;
              s.kieuNhapXuat = detail.kieuNhapXuat;
              s.mucDichXuat = detail.mucDichXuat;
              s.tenVthh = detail.tenVthh;
            });
            this.quyetDinhPdDtlCache = cloneDeep(detail.deXuatPhuongAn);
            if (!this.formData.value.id) {
              this.formData.patchValue({quyetDinhPdDtl: detail.deXuatPhuongAn});
            }

            data.idDx = data.id;
            delete data.id;
            delete data.trangThai;
            delete data.tenTrangThai;
            delete data.type;
            delete data.canCu;
            delete data.fileDinhKem;
            this.formData.value.quyetDinhPdDtl.forEach(s => delete s.id);

            this.formData.patchValue(data);
            await this.buildTableView();
            await this.selectRow(this.phuongAnHdrViewCache[0]);
            await this.expandAll();
          }
        });
      }
    } catch (e) {
      console.log(e)
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      await this.spinner.hide();
    }
  }

  async buildTableView() {
    this.phuongAnHdrView = chain(this.formData.value.quyetDinhPdDtl)
      .groupBy("soDx")
      .map((value, key) => {
        let row = value.find(s => s.soDx === key);
        let rs = chain(value)
          .groupBy("noiDungDx")
          .map((v, k) => {
            let row1 = v.find(s => s.noiDungDx === k);
            let rs = chain(v)
              .groupBy("loaiVthh")
              .map((v1, k1) => {
                let row2 = v1.find(s => s.loaiVthh === k1);
                let tonKhoCloaiVthh = v.reduce((prev, next) => prev + next.tonKhoCloaiVthh, 0);
                return {
                  idVirtual: uuidv4(),
                  loaiVthh: k1,
                  tenLoaiVthh: row2.tenLoaiVthh,
                  donViTinh: row2.donViTinh,
                  soLuong: row2.soLuong,
                  soLuongDx: row2.soLuongDx,
                  tonKho: row2.tonKhoLoaiVthh || tonKhoCloaiVthh,
                  tenCloaiVthh: row2.tenCloaiVthh,
                  childData: v1
                }
              }).value();
            return {
              idVirtual: uuidv4(),
              noiDungDx: k,
              soLuong: 0,
              soLuongDx: 0,
              childData: rs
            }
          }).value();
        return {
          idVirtual: uuidv4(),
          tenDvi: row.tenDvi,
          maDvi: row.maDvi,
          soDx: row.soDx,
          trichYeuDx: row.trichYeuDx,
          mucDichXuat: row.mucDichXuat,
          ngayKyDx: row.ngayKyDx,
          thoiGian: row.ngayKyDx,
          childData: rs
        };
      }).value();

    //
    this.phuongAnHdrViewCache = chain(this.quyetDinhPdDtlCache)
      .groupBy("soDx")
      .map((value, key) => {
        let row = value.find(s => s.soDx === key);
        let rs = chain(value)
          .groupBy("noiDungDx")
          .map((v, k) => {
            let row1 = v.find(s => s.noiDungDx === k);
            let rs = chain(v)
              .groupBy("loaiVthh")
              .map((v1, k1) => {
                let row2 = v1.find(s => s.loaiVthh === k1);
                let tonKhoCloaiVthh = v.reduce((prev, next) => prev + next.tonKhoCloaiVthh, 0);
                return {
                  idVirtual: uuidv4(),
                  loaiVthh: k1,
                  tenLoaiVthh: row2.tenLoaiVthh,
                  donViTinh: row2.donViTinh,
                  soLuong: row2.soLuong,
                  soLuongDx: row2.soLuongDx,
                  tonKho: row2.tonKhoLoaiVthh || tonKhoCloaiVthh,
                  tenCloaiVthh: row2.tenCloaiVthh,
                  childData: v1
                }
              }).value();
            return {
              idVirtual: uuidv4(),
              noiDungDx: k,
              soLuong: 0,
              soLuongDx: 0,
              childData: rs
            }
          }).value();
        return {
          idVirtual: uuidv4(),
          tenDvi: row.tenDvi,
          maDvi: row.maDvi,
          soDx: row.soDx,
          trichYeuDx: row.trichYeuDx,
          mucDichXuat: row.mucDichXuat,
          ngayKyDx: row.ngayKyDx,
          thoiGian: row.ngayKyDx,
          childData: rs
        };
      }).value();
    console.log(this.phuongAnHdrView, this.formData.value.quyetDinhPdDtl, '123')
    console.log(this.phuongAnHdrViewCache, this.quyetDinhPdDtlCache, '123')
    this.expandAll();
  }

  async selectRow(item: any) {
    if (!item.selected) {
      console.log(this.phuongAnHdrView);
      console.log(this.phuongAnHdrViewCache);
      this.phuongAnHdrViewCache.forEach(i => i.selected = false);
      item.selected = true;
      this.phuongAnView = (this.phuongAnHdrView.find(s => s.soDx == item.soDx)).childData;
      this.phuongAnViewCache = (this.phuongAnHdrViewCache.find(s => s.soDx == item.soDx)).childData;
      // this.phuongAnView = currentCuc.childData;
      // this.phuongAnViewCache = currentCucCache.childData;
      console.log(this.phuongAnView, 'phuongAnView')
      console.log(this.phuongAnViewCache, 'phuongAnViewCache')
    }
  }

  expandAll() {
    this.phuongAnHdrView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
      s.childData.forEach(s1 => {
        this.expandSetString.add(s1.idVirtual);
      })
    });

    this.phuongAnHdrViewCache.forEach(s => {
      this.expandSetStringCache.add(s.idVirtual);
      s.childData.forEach(s1 => {
        this.expandSetStringCache.add(s1.idVirtual);
      })
    })
    console.log(this.phuongAnHdrViewCache)
    console.log(this.expandSetStringCache)
  }

  onExpandStringChange(id: string, checked: boolean) {

    if (checked) {
      this.expandSetString.add(id);
      this.expandSetStringCache.add(id);
    } else {
      this.expandSetString.delete(id);
      this.expandSetStringCache.delete(id);
    }
    console.log(this.expandSetStringCache, 'expandSetStringCache')
  }

  async xemTruocPd(id, tenBaoCao, children) {
    await this.tongHopPhuongAnCuuTroService.preview({
      tenBaoCao: tenBaoCao + '.docx',
      id: id,
      children: children
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }
}
