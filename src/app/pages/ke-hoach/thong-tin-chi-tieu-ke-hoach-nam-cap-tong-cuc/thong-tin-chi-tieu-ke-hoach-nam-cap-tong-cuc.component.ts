import { LEVEL_USER, PAGE_SIZE_DEFAULT } from './../../../constants/config';
import { FileDinhKem } from './../../../models/FileDinhKem';
import { UploadFileService } from './../../../services/uploaFile.service';
import { DialogVanBanSanSangBanHanhComponent } from './../../../components/dialog/dialog-van-ban-san-sang-ban-hanh/dialog-van-ban-san-sang-ban-hanh.component';
import { DialogGuiDuyetComponent } from './../../../components/dialog/dialog-gui-duyet/dialog-gui-duyet.component';
import { LEVEL } from 'src/app/constants/config';
import { DanhMucService } from './../../../services/danhmuc.service';
import { DialogQuyetDinhGiaoChiTieuComponent } from './../../../components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { Globals } from './../../../shared/globals';
import { DonviService } from 'src/app/services/donvi.service';
import { saveAs } from 'file-saver';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogLuaChonInComponent } from 'src/app/components/dialog/dialog-lua-chon-in/dialog-lua-chon-in.component';
import { DialogThemThongTinMuoiComponent } from 'src/app/components/dialog/dialog-them-thong-tin-muoi/dialog-them-thong-tin-muoi.component';
import { DialogThemThongTinVatTuTrongNamComponent } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/dialog-them-thong-tin-vat-tu-trong-nam.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { KeHoachLuongThuc } from 'src/app/models/KeHoachLuongThuc';
import { KeHoachMuoi } from 'src/app/models/KeHoachMuoi';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { HelperService } from 'src/app/services/helper.service';
import * as XLSX from 'xlsx';
import { DialogThongTinLuongThucComponent } from './../../../components/dialog/dialog-thong-tin-luong-thuc/dialog-thong-tin-luong-thuc.component';
import { KeHoachVatTu, VatTuThietBi } from './../../../models/KeHoachVatTu';
import { ThongTinChiTieuKeHoachNam } from './../../../models/ThongTinChiTieuKHNam';
import { TAB_SELECTED } from './thong-tin-chi-tieu-ke-hoach-nam.constant';
import { cloneDeep } from 'lodash';
import * as dayjs from 'dayjs';
import { ItemDetail } from 'src/app/models/ItemDetail';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThongTinChiTieuKeHoachNamComponent implements OnInit {
  listThoc: any[] = [];
  listMuoi: any[] = [];
  listVatTu = [];
  options: any[] = [];
  optionsDonVi: any[] = [];
  modals = {
    luaChonIn: false,
    thongTinLuongThuc: false,
    thongTinVatTuTrongNam: false,
  };
  xuongCaoTocCacLoais = new Array(4);
  id: number;
  tabSelected: string = TAB_SELECTED.luongThuc;
  detail = {
    soQD: null,
    ngayKy: null,
    ngayHieuLuc: null,
    namKeHoach: null,
    trichYeu: null,
  };
  tab = TAB_SELECTED;
  yearNow: number = 0;
  thongTinChiTieuKeHoachNam: ThongTinChiTieuKeHoachNam =
    new ThongTinChiTieuKeHoachNam();
  thongTinChiTieuKeHoachNamInput: ThongTinChiTieuKeHoachNam =
    new ThongTinChiTieuKeHoachNam();
  tableExist: boolean = false;
  keHoachLuongThucDialog: KeHoachLuongThuc;
  keHoachMuoiDialog: KeHoachMuoi;
  keHoachVatTuDialog: KeHoachVatTu;
  fileDinhKem: string = null;
  qdTCDT: string = MESSAGE.QD_TCDT;
  formData: FormGroup;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  listNam: any[] = [];
  mapOfExpandedData: { [key: string]: any[] } = {};
  dsKeHoachLuongThucClone: Array<KeHoachLuongThuc> = [];
  dsMuoiClone: Array<KeHoachMuoi> = [];
  dsVatTuClone: Array<KeHoachVatTu> = [];
  keHoachLuongThuc: KeHoachLuongThuc = new KeHoachLuongThuc();
  keHoachLuongThucCreate: KeHoachLuongThuc;
  isAddLuongThuc: boolean = true;
  keHoachMuoiCreate: KeHoachMuoi;
  isAddMuoi: boolean = false;
  keHoachVatTuCreate: KeHoachVatTu;
  isAddVatTu: boolean = false;
  dataVatTuCha: any[] = [];
  dataVatTuChaShow: any[] = [];
  dataVatTuCon: any[] = [];
  dataVatTuConClone: any[] = [];
  dataVatTuConShow: any[] = [];
  lastBreadcrumb: string;
  canCuList: any[] = [];
  taiLieuDinhKemList: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  keHoachLuongThucShow: Array<KeHoachLuongThuc> = [];
  keHoachMuoiShow: Array<KeHoachMuoi> = [];
  keHoachVatTuShow: Array<KeHoachVatTu> = [];
  userInfo: UserLogin;
  levelCuc: any = LEVEL_USER;
  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private donViService: DonviService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private uploadFileService: UploadFileService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userInfo = this.userService.getUserLogin();
    if (this.userInfo.sub == LEVEL_USER.CUC) {
      this.donViService
        .getDonVi(this.userInfo.MA_DVI)
        .then((rs) => {
          console.log('rs:  ', rs);
          this.keHoachLuongThucCreate.tenDonvi = 'don vi cuc';
          this.keHoachMuoiCreate.tenDonVi = 'don vi cuc';
          this.keHoachVatTuCreate.tenDonVi = 'don vi cuc';
        })
        .catch((err) => {
          this.notification.error(MESSAGE.ERROR, err.msg);
          this.spinner.hide();
        });
    }
    if (this.router.url.includes(LEVEL.TONG_CUC)) {
      this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
    } else if (this.router.url.includes(LEVEL.CHI_CUC)) {
      this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
    } else if (this.router.url.includes(LEVEL.CUC)) {
      this.lastBreadcrumb = LEVEL.CUC_SHOW;
    }
    this.newObjectLuongThuc();
    this.newObjectMuoi();
    this.newObjectVatTu();
    this.loadDanhMucHang();
    this.yearNow = dayjs().get('year');
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: this.yearNow - i,
        text: this.yearNow - i,
      });
    }
    this.loadDonVi();
    this.initForm();
    this.formData.patchValue({
      namKeHoach: (this.yearNow = dayjs().get('year')),
    });
    if (this.id > 0) {
      this.loadThongTinChiTieuKeHoachNam(this.id);
    }
  }
  newObjectLuongThuc() {
    this.keHoachLuongThucCreate = new KeHoachLuongThuc();
    this.keHoachLuongThucCreate.xtnThoc = [
      new ItemDetail(0),
      new ItemDetail(0),
      new ItemDetail(0),
    ];
    this.keHoachLuongThucCreate.tkdnThoc = [
      new ItemDetail(0),
      new ItemDetail(0),
      new ItemDetail(0),
    ];
    this.keHoachLuongThucCreate.xtnGao = [new ItemDetail(0), new ItemDetail(0)];
    this.keHoachLuongThucCreate.tkdnGao = [
      new ItemDetail(0),
      new ItemDetail(0),
    ];
    this.keHoachLuongThucCreate.ntnThoc = 0;
    this.keHoachLuongThucCreate.ntnGao = 0;
  }
  newObjectMuoi() {
    this.keHoachMuoiCreate = new KeHoachMuoi();
    this.keHoachMuoiCreate.xtnMuoi = [
      new ItemDetail(0),
      new ItemDetail(0),
      new ItemDetail(0),
    ];
    this.keHoachMuoiCreate.tkdnMuoi = [
      new ItemDetail(0),
      new ItemDetail(0),
      new ItemDetail(0),
    ];
    this.keHoachMuoiCreate.ntnTongSoMuoi = 0;
  }

  newObjectVatTu() {
    this.keHoachVatTuCreate = new KeHoachVatTu();
    this.keHoachVatTuCreate.vatTuThietBi[0].cacNamTruoc = [
      new ItemDetail(0),
      new ItemDetail(0),
      new ItemDetail(0),
    ];
    this.keHoachVatTuCreate.vatTuThietBi[0].tongCacNamTruoc = 0;
    this.keHoachVatTuCreate.vatTuThietBi[0].tongNhap = 0;
  }
  updateDataListVatTu(data: any) {
    for (let j = 0; j < data.length; j++) {
      let res = [];
      let parentList = data[j].vatTuThietBi.filter((x) => x.maVatTuCha == null);
      for (let i = 0; i < parentList.length; i++) {
        let tempt = [];
        let hasChild = false;
        let checkChild = data[j].vatTuThietBi.filter(
          (x) => x.maVatTuCha == parentList[i].maVatTu,
        );
        if (checkChild && checkChild.length > 0) {
          hasChild = true;
        }
        let item = {
          ...parentList[i],
          level: 0,
          hasChild: hasChild,
          expand: false,
          display: true,
        };
        tempt.push(item);
        let dataChild = this.updateDataChaCon(
          data[j].vatTuThietBi,
          item,
          tempt,
        );
        res = [...res, ...dataChild];
      }
      data[j].listDisplay = [];
      if (res && res.length > 0) {
        data[j].listDisplay = res;
      }
    }
    return data;
  }

  updateDataChaCon(dataList: any, dataCha: any, dataReturn: any) {
    let listChild = dataList.filter((x) => x.maVatTuCha == dataCha.maVatTu);
    for (let i = 0; i < listChild.length; i++) {
      let hasChild = false;
      let checkChild = dataList.filter(
        (x) => x.maVatTuCha == listChild[i].maVatTu,
      );
      if (checkChild && checkChild.length > 0) {
        hasChild = true;
      }
      let item = {
        ...listChild[i],
        level: dataCha.level + 1,
        hasChild: hasChild,
        expand: false,
        display: dataCha.level + 1 == 1 ? true : false,
      };
      dataReturn.push(item);
      this.updateDataChaCon(dataList, item, dataReturn);
    }
    return dataReturn;
  }

  displayChild(item: any, listCha: any, expand: boolean) {
    for (let i = 0; i < this.thongTinChiTieuKeHoachNam.khVatTu.length; i++) {
      if (
        this.thongTinChiTieuKeHoachNam.khVatTu[i].donViId == listCha.donViId
      ) {
        for (
          let j = 0;
          j < this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay.length;
          j++
        ) {
          if (
            this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay[j].maVatTu ==
            item.maVatTu
          ) {
            this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay[j].expand =
              expand;
          }
          if (
            this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay[j]
              .maVatTuCha == item.maVatTu
          ) {
            this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay[j].display =
              expand;
          }
        }
        if (!expand) {
          this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay =
            this.updateHideDisplayChild(
              item,
              this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay,
            );
        }
        break;
      }
    }
  }

  updateHideDisplayChild(itemCha: any, dataReturn: any) {
    for (let i = 0; i < dataReturn.length; i++) {
      if (dataReturn[i].maVatTuCha == itemCha.maVatTu) {
        dataReturn[i].display = false;
        dataReturn[i].expand = false;
        this.updateHideDisplayChild(dataReturn[i], dataReturn);
      }
    }
    return dataReturn;
  }

  initForm() {
    this.formData = this.fb.group({
      soQD: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.soQuyetDinh
          : null,
        [Validators.required],
      ],
      ngayKy: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.ngayKy
          : null,
        [Validators.required],
      ],
      ngayHieuLuc: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.ngayHieuLuc
          : null,
        [Validators.required],
      ],
      namKeHoach: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.namKeHoach
          : null,
        [Validators.required],
      ],
      trichYeu: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.trichYeu
          : null,
      ],
      ghiChu: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.ghiChu
          : null,
        [Validators.required],
      ],
      canCu: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.canCu
          : null,
      ],
    });
  }

  themMoi(data?: any) {
    if (this.tabSelected == TAB_SELECTED.luongThuc) {
      const modalLuongThuc = this.modal.create({
        nzTitle: 'Thông tin lương thực',
        nzContent: DialogThongTinLuongThucComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          keHoachLuongThuc: data,
          yearNow: this.yearNow,
        },
      });
      modalLuongThuc.afterClose.subscribe((luongThuc) => {
        if (luongThuc) {
          this.keHoachLuongThucDialog = new KeHoachLuongThuc();
          this.keHoachLuongThucDialog.tenDonvi = luongThuc.value.tenDonvi;
          this.keHoachLuongThucDialog.maDonVi = luongThuc.value.maDonVi;
          this.keHoachLuongThucDialog.tkdnTongSoQuyThoc =
            +luongThuc.value.tkdnTongSoQuyThoc;
          this.keHoachLuongThucDialog.tkdnTongThoc =
            +luongThuc.value.tkdnThocSoLuong1 +
            +luongThuc.value.tkdnThocSoLuong2 +
            +luongThuc.value.tkdnThocSoLuong3;
          const tkdnThoc1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +luongThuc.value.tkdnThocSoLuong1,
            vatTuId: null,
          };
          const tkdnThoc2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +luongThuc.value.tkdnThocSoLuong2,
            vatTuId: null,
          };
          const tkdnThoc3 = {
            id: null,
            nam: this.yearNow - 3,
            soLuong: +luongThuc.value.tkdnThocSoLuong3,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.tkdnThoc = [
            tkdnThoc1,
            tkdnThoc2,
            tkdnThoc3,
          ];
          this.keHoachLuongThucDialog.tkdnTongGao =
            +luongThuc.value.tkdnGaoSoLuong1 + +luongThuc.value.tkdnGaoSoLuong2;
          const tkdnGao1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +luongThuc.value.tkdnGaoSoLuong1,
            vatTuId: null,
          };
          const tkdnGao2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +luongThuc.value.tkdnGaoSoLuong2,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.tkdnGao = [tkdnGao1, tkdnGao2];
          this.keHoachLuongThucDialog.ntnTongSoQuyThoc =
            +luongThuc.value.ntnTongSoQuyThoc;
          this.keHoachLuongThucDialog.ntnThoc = +luongThuc.value.ntnThoc;
          this.keHoachLuongThucDialog.ntnGao = +luongThuc.value.ntnGao;
          this.keHoachLuongThucDialog.xtnTongSoQuyThoc =
            +luongThuc.value.xtnTongSoQuyThoc;
          this.keHoachLuongThucDialog.xtnTongThoc =
            +luongThuc.value.xtnThocSoLuong1 +
            +luongThuc.value.xtnThocSoLuong2 +
            +luongThuc.value.xtnThocSoLuong3;
          const xtnThoc1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +luongThuc.value.xtnThocSoLuong1,
            vatTuId: null,
          };
          const xtnThoc2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +luongThuc.value.xtnThocSoLuong2,
            vatTuId: null,
          };
          const xtnThoc3 = {
            id: null,
            nam: this.yearNow - 3,
            soLuong: +luongThuc.value.xtnThocSoLuong3,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.xtnThoc = [xtnThoc1, xtnThoc2, xtnThoc3];
          this.keHoachLuongThucDialog.xtnTongGao =
            +luongThuc.value.xtnGaoSoLuong1 + +luongThuc.value.xtnGaoSoLuong2;
          const xtnGao1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +luongThuc.value.xtnGaoSoLuong1,
            vatTuId: null,
          };
          const xtnGao2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +luongThuc.value.xtnGaoSoLuong2,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.xtnGao = [xtnGao1, xtnGao2];
          this.keHoachLuongThucDialog.tkcnTongSoQuyThoc =
            +luongThuc.value.tkcnTongSoQuyThoc;
          this.keHoachLuongThucDialog.tkcnTongThoc =
            +luongThuc.value.tkcnTongThoc;
          this.keHoachLuongThucDialog.tkcnTongGao =
            +luongThuc.value.tkcnTongGao;
          this.keHoachLuongThucDialog.stt =
            this.thongTinChiTieuKeHoachNam.khLuongThuc?.length + 1;
          this.keHoachLuongThucDialog.donViId = luongThuc.value.donViId;
          this.keHoachLuongThucDialog.khGaoId = luongThuc.value.khGaoId;
          this.keHoachLuongThucDialog.khThocId = luongThuc.value.khThocId;
          this.keHoachLuongThucDialog.donViTinh = luongThuc.value.donViTinh;
          this.checkDataExistLuongThuc(this.keHoachLuongThucDialog);
        }
      });
    } else if (this.tabSelected == TAB_SELECTED.vatTu) {
      const modalVatTu = this.modal.create({
        nzTitle: 'Thông tin vật tư trong năm',
        nzContent: DialogThemThongTinVatTuTrongNamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          yearNow: this.yearNow,
        },
      });
      modalVatTu.afterClose.subscribe((vatTu) => {
        if (vatTu) {
          this.keHoachVatTuDialog = new KeHoachVatTu();
          this.keHoachVatTuDialog.tenDonVi = vatTu.value.tenDonVi;
          this.keHoachVatTuDialog.maDvi = vatTu.value.maDonVi;
          this.keHoachVatTuDialog.donViId = vatTu.value.donViId;
          this.keHoachVatTuDialog.donViTinh = vatTu.value.donViTinh;
          this.keHoachVatTuDialog.stt =
            this.thongTinChiTieuKeHoachNam.khVatTu?.length + 1;
          this.keHoachVatTuDialog.vatTuThietBi = [];
          // let cacNam = [
          //   {
          //     id: null,
          //     nam: this.yearNow - 3,
          //     soLuong: +vatTu.value.soLuongTheoNam1,
          //     vatTuId: +vatTu.value.vatTuId,
          //   },
          //   {
          //     id: null,
          //     nam: this.yearNow - 2,
          //     soLuong: +vatTu.value.soLuongTheoNam2,
          //     vatTuId: +vatTu.value.vatTuId,
          //   },
          //   {
          //     id: null,
          //     nam: this.yearNow - 1,
          //     soLuong: +vatTu.value.soLuongTheoNam3,
          //     vatTuId: +vatTu.value.vatTuId,
          //   },
          // ];
          // let temp = [];
          // temp = this.getListVatTuThietBi(vatTu.value.vatTu, temp);
          // if (temp && temp.length > 0) {
          //   for (let i = 0; i < temp.length; i++) {
          //     let vatTuThietBi1 = new VatTuThietBi();
          //     vatTuThietBi1.cacNamTruoc = cacNam;
          //     vatTuThietBi1.donViTinh = vatTu.value.donViTinh;
          //     vatTuThietBi1.maVatTu = temp[i].maVatTu;
          //     vatTuThietBi1.maVatTuCha = temp[i].maVatTuCha;
          //     vatTuThietBi1.nhapTrongNam = vatTu.value.soLuong;
          //     vatTuThietBi1.stt = 1;
          //     vatTuThietBi1.tenVatTu = temp[i].tenVatTu;
          //     vatTuThietBi1.tenVatTuCha = temp[i].tenVatTuCha;
          //     vatTuThietBi1.tongCacNamTruoc =
          //       +vatTu.value.soLuongTheoNam1 +
          //       +vatTu.value.soLuongTheoNam2 +
          //       +vatTu.value.soLuongTheoNam3;
          //     vatTuThietBi1.tongNhap =
          //       +vatTu.value.tongSo + vatTuThietBi1.tongCacNamTruoc;
          //     vatTuThietBi1.vatTuChaId = +temp[i].vatTuChaId;
          //     vatTuThietBi1.vatTuId = +temp[i].vatTuId;
          //     this.keHoachVatTuDialog.vatTuThietBi.push(vatTuThietBi1);
          //   }
          // }
          this.checkDataExistVatTu(this.keHoachVatTuDialog);
          // this.thongTinChiTieuKeHoachNam.khVatTu = this.updateDataListVatTu(
          //   this.thongTinChiTieuKeHoachNam.khVatTu,
          // );
        }
      });
    } else if (this.tabSelected == TAB_SELECTED.muoi) {
      const modalMuoi = this.modal.create({
        nzTitle: 'Thông tin muối',
        nzContent: DialogThemThongTinMuoiComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          thongTinMuoi: data,
          yearNow: this.yearNow,
        },
      });
      modalMuoi.afterClose.subscribe((muoi) => {
        if (muoi) {
          this.keHoachMuoiDialog = new KeHoachMuoi();
          this.keHoachMuoiDialog.maDonVi = muoi.value.maDonVi;
          this.keHoachMuoiDialog.ntnTongSoMuoi = muoi.value.ntnTongSo;
          this.keHoachMuoiDialog.tenDonVi = muoi.value.tenDonVi;
          this.keHoachMuoiDialog.tkcnTongSoMuoi = +muoi.value.tkcnTongSo;
          this.keHoachMuoiDialog.donViTinh = muoi.value.donViTinh;
          const tkdnMuoi1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +muoi.value.tkdnSoLuong1,
            vatTuId: null,
          };
          const tkdnMuoi2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +muoi.value.tkdnSoLuong2,
            vatTuId: null,
          };
          const tkdnMuoi3 = {
            id: null,
            nam: this.yearNow - 3,
            soLuong: +muoi.value.tkdnSoLuong3,
            vatTuId: null,
          };
          this.keHoachMuoiDialog.tkdnMuoi = [tkdnMuoi1, tkdnMuoi2, tkdnMuoi3];
          this.keHoachMuoiDialog.tkdnTongSoMuoi = +muoi.value.tkdnTongSo;
          const xtnMuoi1 = {
            id: null,
            nam: this.yearNow - 1,
            soLuong: +muoi.value.xtnSoLuong1,
            vatTuId: null,
          };
          const xtnMuoi2 = {
            id: null,
            nam: this.yearNow - 2,
            soLuong: +muoi.value.xtnSoLuong2,
            vatTuId: null,
          };
          const xtnMuoi3 = {
            id: null,
            nam: this.yearNow - 3,
            soLuong: +muoi.value.xtnSoLuong3,
            vatTuId: null,
          };
          this.keHoachMuoiDialog.xtnMuoi = [xtnMuoi1, xtnMuoi2, xtnMuoi3];
          this.keHoachMuoiDialog.xtnTongSoMuoi = +muoi.value.xtnTongSo;
          this.keHoachMuoiDialog.stt =
            this.thongTinChiTieuKeHoachNam.khMuoiDuTru?.length + 1;
          this.keHoachMuoiDialog.donViId = muoi.value.donViId;
          this.keHoachMuoiDialog.id = muoi.value.id;
          this.checkDataExistMuoi(this.keHoachMuoiDialog);
        }
      });
    }
  }

  getListVatTuThietBi(dataCon: any, dataReturn: any) {
    if (!dataReturn) {
      dataReturn = [];
    }
    if (dataCon) {
      let item = {
        maVatTu: dataCon.ma,
        maVatTuCha: null,
        vatTuId: dataCon.id,
        vatTuChaId: null,
        tenVatTu: dataCon.ten,
        tenVatTuCha: null,
      };
      if (dataCon.parent) {
        item.maVatTuCha = dataCon.parent.ma;
        item.vatTuChaId = dataCon.parent.id;
        item.tenVatTuCha = dataCon.parent.ten;
        dataReturn.push(item);
        this.getListVatTuThietBi(dataCon.parent, dataReturn);
      } else {
        dataReturn.push(item);
      }
    }
    return dataReturn;
  }

  redirectChiTieuKeHoachNam() {
    this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
  }

  loadThongTinChiTieuKeHoachNam(id: number) {
    this.chiTieuKeHoachNamService
      .loadThongTinChiTieuKeHoachNam(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.thongTinChiTieuKeHoachNam = res.data;
          this.thongTinChiTieuKeHoachNam.fileDinhKemReqs =
            res.data.fileDinhKems;
          if (this.thongTinChiTieuKeHoachNam?.fileDinhKemReqs?.length > 0) {
            this.thongTinChiTieuKeHoachNam.fileDinhKemReqs.forEach((file) => {
              const item = {
                id: file.id,
                text: file.fileName,
              };
              this.taiLieuDinhKemList.push(item);
            });
          }
          if (this.thongTinChiTieuKeHoachNam?.canCu) {
            const itemCanCu = {
              id: new Date().getTime(),
              text: this.thongTinChiTieuKeHoachNam.canCu,
            };
            this.canCuList.push(itemCanCu);
          }
          this.dsKeHoachLuongThucClone = cloneDeep(
            this.thongTinChiTieuKeHoachNam.khLuongThuc,
          );
          this.keHoachLuongThucShow = cloneDeep(
            this.thongTinChiTieuKeHoachNam.khLuongThuc,
          );
          this.dsMuoiClone = cloneDeep(
            this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
          );
          this.keHoachMuoiShow = cloneDeep(
            this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
          );

          this.convertKhVatTuList(this.thongTinChiTieuKeHoachNam.khVatTu);
          this.dsVatTuClone = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTu);
          this.keHoachVatTuShow = cloneDeep(
            this.thongTinChiTieuKeHoachNam.khVatTu,
          );
          // this.thongTinChiTieuKeHoachNam.khVatTu = this.updateDataListVatTu(
          //   this.thongTinChiTieuKeHoachNam.khVatTu,
          // );
          this.yearNow = this.thongTinChiTieuKeHoachNam.namKeHoach;
          this.initForm();
          this.loadData();
          this.formData.patchValue({
            soQD: this.formData.get('soQD').value.split('/')[0],
          });
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }

  convertKhVatTuList(khVatTus: Array<KeHoachVatTu>) {
    const khVatTuList = new Array<KeHoachVatTu>();
    let khVatTu = khVatTus;
    for (let i = 0; i < khVatTu.length; i++) {
      for (let j = 0; j < khVatTu[i].vatTuThietBi.length; j++) {
        const vatTuTemp = new KeHoachVatTu();
        vatTuTemp.donViId = khVatTu[i].donViId;
        vatTuTemp.maDvi = khVatTu[i].maDonVi;
        vatTuTemp.stt = khVatTu[i].stt;
        vatTuTemp.tenDonVi = khVatTu[i].tenDonVi;
        vatTuTemp.vatTuThietBi[0] = khVatTu[i].vatTuThietBi[j];
        khVatTuList.push(vatTuTemp);
      }
    }
    khVatTuList.forEach((vt, i) => {
      vt.stt = i + 1;
      vt.isEdit = false;
    });
    this.thongTinChiTieuKeHoachNam.khVatTu = khVatTuList;
  }
  ngAfterViewChecked(): void {
    const table = document.getElementsByTagName('table');
    this.tableExist = table && table.length > 0 ? true : false;
    this.cdr.detectChanges();
  }

  reduceRowData(
    indexTable: number,
    indexCell: number,
    indexRow: number,
    stringReplace: string,
    idTable: string,
  ): string {
    let sumVal = 0;
    const listTable = document
      .getElementById(idTable)
      ?.getElementsByTagName('table');

    if (listTable && listTable.length >= indexTable) {
      const table = listTable[indexTable];
      for (let i = indexRow; i < table.rows.length - 1; i++) {
        if (
          table.rows[i]?.cells[indexCell]?.innerHTML &&
          table.rows[i]?.cells[indexCell]?.innerHTML != ''
        ) {
          sumVal =
            sumVal +
            parseFloat(
              this.helperService.replaceAll(
                table.rows[i].cells[indexCell].innerHTML,
                stringReplace,
                '',
              ),
            );
        }
      }
    }
    return sumVal ? Intl.NumberFormat('en-US').format(sumVal) : '0';
  }

  reduceRowDataVatTu(
    indexTable: number,
    indexCell: number,
    indexRow: number,
    stringReplace: string,
    idTable: string,
  ): number {
    let sumVal = 0;
    const listTable = document
      .getElementById(idTable)
      ?.getElementsByTagName('table');

    if (listTable && listTable.length >= indexTable) {
      const table = listTable[indexTable];

      for (let i = indexRow; i < table.rows.length - 1; i++) {
        if (
          table?.rows[i]?.className.includes('table__header-vat-tu') &&
          table.rows[i]?.cells[indexCell]?.innerHTML &&
          table.rows[i]?.cells[indexCell]?.innerHTML != ''
        ) {
          sumVal =
            sumVal +
            parseFloat(
              this.helperService.replaceAll(
                table.rows[i].cells[indexCell].innerHTML,
                stringReplace,
                '',
              ),
            );
        }
      }
    }
    return sumVal;
  }

  rowSpanVatTu(data: any): number {
    let rowspan = 1;
    if (data && data?.listDisplay && data?.listDisplay?.length > 0) {
      let getDisplay = data?.listDisplay.filter((x) => x.display == true);
      if (getDisplay && getDisplay.length > 0) {
        rowspan = getDisplay.length + 1;
      }
    }
    return rowspan;
  }

  exportData() {
    var workbook = XLSX.utils.book_new();
    const tableLuongThuc = document
      .getElementById('table-luong-thuc')
      .getElementsByTagName('table');
    if (tableLuongThuc && tableLuongThuc.length > 0) {
      let sheetLuongThuc = XLSX.utils.table_to_sheet(tableLuongThuc[0]);
      sheetLuongThuc['!cols'] = [];
      sheetLuongThuc['!cols'][24] = { hidden: true };
      sheetLuongThuc['!cols'][25] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetLuongThuc, 'sheetLuongThuc');
    }
    const tableMuoi = document
      .getElementById('table-muoi')
      .getElementsByTagName('table');
    if (tableMuoi && tableMuoi.length > 0) {
      let sheetMuoi = XLSX.utils.table_to_sheet(tableMuoi[0]);
      sheetMuoi['!cols'] = [];
      sheetMuoi['!cols'][12] = { hidden: true };
      sheetMuoi['!cols'][13] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetMuoi, 'sheetMuoi');
    }
    const tableVatTu = document
      .getElementById('table-vat-tu')
      .getElementsByTagName('table');
    if (tableVatTu && tableVatTu.length > 0) {
      let sheetVatTu = XLSX.utils.table_to_sheet(tableVatTu[0]);
      XLSX.utils.book_append_sheet(workbook, sheetVatTu, 'sheetVatTu');
    }
    XLSX.writeFile(workbook, 'thong-tin-chi-tieu-ke-hoach-nam.xlsx');
  }

  deleteKeHoachLuongThuc(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.thongTinChiTieuKeHoachNam.khLuongThuc =
          this.thongTinChiTieuKeHoachNam.khLuongThuc.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.thongTinChiTieuKeHoachNam?.khLuongThuc.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsMuoiClone = cloneDeep(
          this.thongTinChiTieuKeHoachNam.khLuongThuc,
        );
        this.loadData();
      },
    });
  }

  deleteKeHoachMuoi(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.thongTinChiTieuKeHoachNam.khMuoiDuTru =
          this.thongTinChiTieuKeHoachNam.khMuoiDuTru.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.thongTinChiTieuKeHoachNam?.khMuoiDuTru.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsMuoiClone = cloneDeep(
          this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
        );
        this.loadData();
      },
    });
  }
  deleteKeHoachVatTu(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.thongTinChiTieuKeHoachNam.khVatTu =
          this.thongTinChiTieuKeHoachNam.khVatTu.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.thongTinChiTieuKeHoachNam?.khVatTu.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsMuoiClone = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTu);
        this.loadData();
      },
    });
  }

  selectFile(idElement: string) {
    document.getElementById(idElement).click();
  }

  uploadFile(event: any) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.fileDinhKem = fileList[0].name;
    }
  }

  async importFileData(event: any) {
    this.spinner.show();
    try {
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
      if (fileList) {
        let res = await this.chiTieuKeHoachNamService.importFile(fileList[0]);
        if (res.msg == MESSAGE.SUCCESS) {
          let temptData = res.data;
          if (temptData) {
            if (temptData.khluongthuc && temptData.khluongthuc.length > 0) {
              for (let i = 0; i < temptData.khluongthuc.length; i++) {
                this.checkDataExistLuongThuc(temptData.khluongthuc[i]);
              }
              this.dsKeHoachLuongThucClone = cloneDeep(
                this.thongTinChiTieuKeHoachNam.khLuongThuc,
              );
            }
            if (temptData.khMuoi && temptData.khMuoi.length > 0) {
              for (let i = 0; i < temptData.khMuoi.length; i++) {
                this.checkDataExistMuoi(temptData.khMuoi[i]);
              }
              this.dsMuoiClone = cloneDeep(
                this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
              );
            }
            if (temptData.khVatTu && temptData.khVatTu.length > 0) {
              for (let i = 0; i < temptData.khVatTu.length; i++) {
                this.checkDataExistVatTu(temptData.khVatTu[i]);
              }
              this.convertKhVatTuList(temptData.khVatTu);
              this.dsVatTuClone = cloneDeep(
                this.thongTinChiTieuKeHoachNam.khVatTu,
              );
              // this.thongTinChiTieuKeHoachNam.khVatTu = this.updateDataListVatTu(
              //   this.thongTinChiTieuKeHoachNam.khVatTu,
              // );
            }
            this.loadData();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }

      element.value = null;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  checkDataExistLuongThuc(data: any) {
    if (this.thongTinChiTieuKeHoachNam.khLuongThuc) {
      let indexExist = this.thongTinChiTieuKeHoachNam.khLuongThuc.findIndex(
        (x) => x.maDonVi == data.maDonVi,
      );
      if (indexExist != -1) {
        this.thongTinChiTieuKeHoachNam.khLuongThuc.splice(indexExist, 1);
      }
    } else {
      this.thongTinChiTieuKeHoachNam.khLuongThuc = [];
    }
    this.thongTinChiTieuKeHoachNam.khLuongThuc = [
      ...this.thongTinChiTieuKeHoachNam.khLuongThuc,
      data,
    ];
    this.thongTinChiTieuKeHoachNam.khLuongThuc.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  checkDataExistMuoi(data: any) {
    if (this.thongTinChiTieuKeHoachNam.khMuoiDuTru) {
      let indexExist = this.thongTinChiTieuKeHoachNam.khMuoiDuTru.findIndex(
        (x) => x.maDonVi == data.maDonVi,
      );
      if (indexExist != -1) {
        this.thongTinChiTieuKeHoachNam.khMuoiDuTru.splice(indexExist, 1);
      }
    } else {
      this.thongTinChiTieuKeHoachNam.khMuoiDuTru = [];
    }
    this.thongTinChiTieuKeHoachNam.khMuoiDuTru = [
      ...this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
      data,
    ];
    this.thongTinChiTieuKeHoachNam.khMuoiDuTru.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }
  checkDataExistVatTu(data: any) {
    if (this.thongTinChiTieuKeHoachNam.khVatTu) {
      let indexExist = this.thongTinChiTieuKeHoachNam.khVatTu.findIndex(
        (x) =>
          x.maDvi === data.maDvi &&
          x.vatTuThietBi[0].vatTuId === data.vatTuThietBi[0].vatTuId,
      );
      if (indexExist != -1) {
        this.thongTinChiTieuKeHoachNam.khVatTu.splice(indexExist, 1);
      }
    } else {
      this.thongTinChiTieuKeHoachNam.khVatTu = [];
    }
    this.thongTinChiTieuKeHoachNam.khVatTu = [
      ...this.thongTinChiTieuKeHoachNam.khVatTu,
      data,
    ];
    const khVatTuList = new Array<KeHoachVatTu>();
    let khVatTu = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTu);
    for (let i = 0; i < khVatTu.length; i++) {
      khVatTuList.push(khVatTu[i]);
      for (let j = i + 1; j <= khVatTu.length - 1; j++) {
        if (khVatTu[i].donViId === khVatTu[j].donViId) {
          khVatTuList.push(khVatTu[j]);
          khVatTu.splice(j, 1);
        }
      }
    }
    this.thongTinChiTieuKeHoachNam.khVatTu = khVatTuList;

    this.thongTinChiTieuKeHoachNam.khVatTu.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  // checkDataExistVatTu(data: any) {
  //   if (this.thongTinChiTieuKeHoachNam.khVatTu) {
  //     let indexExist = this.thongTinChiTieuKeHoachNam.khVatTu.findIndex(
  //       (x) => x.maDonVi == data.maDonVi,
  //     );
  //     if (indexExist != -1) {
  //       let nhomVatTuTemp = [];
  //       if (
  //         this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].vatTuThietBi &&
  //         this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].vatTuThietBi
  //           .length > 0
  //       ) {
  //         nhomVatTuTemp =
  //           this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].vatTuThietBi;
  //       }
  //       for (let i = 0; i < data.vatTuThietBi.length; i++) {
  //         let indexNhom = nhomVatTuTemp.findIndex(
  //           (x) => x.maVatTu == data.vatTuThietBi[i].maVatTu,
  //         );
  //         if (indexNhom != -1) {
  //           this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].vatTuThietBi[
  //             indexNhom
  //           ] = data.vatTuThietBi[i];
  //         } else {
  //           this.thongTinChiTieuKeHoachNam.khVatTu[
  //             indexExist
  //           ].vatTuThietBi.push(data.vatTuThietBi[i]);
  //         }
  //       }
  //     } else {
  //       this.thongTinChiTieuKeHoachNam.khVatTu = [
  //         ...this.thongTinChiTieuKeHoachNam.khVatTu,
  //         data,
  //       ];
  //     }
  //   } else {
  //     this.thongTinChiTieuKeHoachNam.khVatTu = [];
  //     this.thongTinChiTieuKeHoachNam.khVatTu = [
  //       ...this.thongTinChiTieuKeHoachNam.khVatTu,
  //       data,
  //     ];
  //   }
  //   this.thongTinChiTieuKeHoachNam.khVatTu.forEach((lt, i) => {
  //     lt.stt = i + 1;
  //   });
  // }

  printTable() {
    const modalIn = this.modal.create({
      nzTitle: 'Lựa chọn in',
      nzContent: DialogLuaChonInComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '600px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        let WindowPrt = window.open(
          '',
          '',
          'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
        );
        let printContent = '';
        if (res.luongThuc) {
          printContent = printContent + '<div>';
          printContent =
            printContent +
            document.getElementById('table-luong-thuc').innerHTML;
          printContent = printContent + '</div>';
        }
        if (res.muoi) {
          printContent = printContent + '<div>';
          printContent =
            printContent + document.getElementById('table-muoi').innerHTML;
          printContent = printContent + '</div>';
        }
        if (res.vatTu) {
          printContent = printContent + '<div>';
          printContent =
            printContent + document.getElementById('table-vat-tu').innerHTML;
          printContent = printContent + '</div>';
        }
        WindowPrt.document.write(printContent);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
      }
    });
  }

  guiDuyet() {
    const modalGuiDuyet = this.modal.create({
      nzTitle: '',
      nzContent: DialogGuiDuyetComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '428px',
      nzFooter: null,
      nzClassName: 'open-dialog-gui-duyet',
      nzComponentParams: {},
    });
    modalGuiDuyet.afterClose.subscribe(async (text) => {
      this.spinner.show();
      try {
        this.save(true);
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    });
    // this.modal.confirm({
    //   nzClosable: false,
    //   nzTitle: 'Xác nhận',
    //   nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
    //   nzOkText: 'Đồng ý',
    //   nzCancelText: 'Không',
    //   nzOkDanger: true,
    //   nzWidth: 310,
    //   nzOnOk: async () => {
    //     this.spinner.show();
    //     try {
    //       this.save(true);
    //       this.spinner.hide();
    //     } catch (e) {
    //       console.log('error: ', e);
    //       this.spinner.hide();
    //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //     }
    //   },
    // });
  }

  pheDuyet() {
    const modalPheDuyet = this.modal.create({
      nzTitle: '',
      nzContent: DialogVanBanSanSangBanHanhComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '428px',
      nzFooter: null,
      nzClassName: 'open-dialog-gui-duyet',
      nzComponentParams: {},
    });

    modalPheDuyet.afterClose.subscribe(async (text) => {
      this.spinner.show();
      try {
        this.save(true);
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    });

    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '02',
          };
          const res = await this.chiTieuKeHoachNamService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectChiTieuKeHoachNam();
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
            id: this.id,
            lyDoTuChoi: text,
            trangThai: '03',
          };
          const res = await this.chiTieuKeHoachNamService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectChiTieuKeHoachNam();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
      },
    });
  }

  save(isGuiDuyet?: boolean) {
    this.thongTinChiTieuKeHoachNam.soQuyetDinh = `${
      this.formData.get('soQD').value
    }${this.qdTCDT}`;
    this.thongTinChiTieuKeHoachNam.ngayKy = this.formData.get('ngayKy').value;
    this.thongTinChiTieuKeHoachNam.ngayHieuLuc =
      this.formData.get('ngayHieuLuc').value;
    this.thongTinChiTieuKeHoachNam.namKeHoach =
      this.formData.get('namKeHoach').value;
    this.thongTinChiTieuKeHoachNam.trichYeu =
      this.formData.get('trichYeu').value;
    this.thongTinChiTieuKeHoachNam.ghiChu = this.formData
      .get('ghiChu')
      .value.trim();

    this.thongTinChiTieuKeHoachNamInput = cloneDeep(
      this.thongTinChiTieuKeHoachNam,
    );
    this.thongTinChiTieuKeHoachNamInput.khMuoi = [];
    this.thongTinChiTieuKeHoachNamInput.khMuoi = cloneDeep(
      this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
    );

    this.thongTinChiTieuKeHoachNamInput.khMuoi.forEach((muoi) => {
      delete muoi.maDonVi;
      delete muoi.tkdnTongSoMuoi;
      delete muoi.tkdnMuoi;
      delete muoi.tkcnTongSoMuoi;
      muoi.xuatTrongNam = cloneDeep(muoi.xtnMuoi);
      delete muoi.xtnMuoi;
      muoi.nhapTrongNam = cloneDeep(muoi.ntnTongSoMuoi);
      delete muoi.ntnTongSoMuoi;
      delete muoi.xtnTongSoMuoi;
      delete muoi.id;
    });
    delete this.thongTinChiTieuKeHoachNamInput.khMuoiDuTru;
    const khVatTu = this.thongTinChiTieuKeHoachNamInput.khVatTu;
    for (let i = 0; i < khVatTu.length; i++) {
      for (let j = i + 1; j <= khVatTu.length - 1; j++) {
        if (khVatTu[i].donViId === khVatTu[j].donViId) {
          khVatTu[i].vatTuThietBi.push(khVatTu[j].vatTuThietBi[0]);
          khVatTu.splice(j, 1);
        }
      }
    }
    this.thongTinChiTieuKeHoachNamInput.khVatTu = khVatTu;
    this.thongTinChiTieuKeHoachNamInput.khVatTu.forEach((vatTu) => {
      delete vatTu.listDisplay;
      vatTu.vatTuThietBi.forEach((thietbi, index) => {
        delete thietbi.cacNamTruoc;
        delete thietbi.tenVatTu;
        delete thietbi.tenVatTuCha;
        delete thietbi.tongCacNamTruoc;
        delete thietbi.tongNhap;
      });
    });
    if (this.thongTinChiTieuKeHoachNam.id > 0) {
      this.chiTieuKeHoachNamService
        .chinhSuaChiTieuKeHoach(this.thongTinChiTieuKeHoachNamInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDoTuChoi: null,
                trangThai: '01',
              };
              this.chiTieuKeHoachNamService.updateStatus(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(
                  MESSAGE.SUCCESS,
                  MESSAGE.UPDATE_SUCCESS,
                );
                this.redirectChiTieuKeHoachNam();
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            } else {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.redirectChiTieuKeHoachNam();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.chiTieuKeHoachNamService
        .themMoiChiTieuKeHoach(this.thongTinChiTieuKeHoachNamInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDoTuChoi: null,
                trangThai: '01',
              };
              this.chiTieuKeHoachNamService.updateStatus(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                this.redirectChiTieuKeHoachNam();
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectChiTieuKeHoachNam();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(
            MESSAGE.ERROR,
            e.error.errors[0].defaultMessage,
          );
        })
        .finally(() => {
          this.spinner.hide();
        });
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.formData.controls['ngayHieuLuc'].value) {
      return false;
    }
    return startValue.getTime() > this.formData.controls['ngayHieuLuc'].value;
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.formData.controls['ngayKy'].value) {
      return false;
    }
    return endValue.getTime() <= this.formData.controls['ngayKy'].value;
  };
  downloadTemplate() {
    this.chiTieuKeHoachNamService.downloadFile().subscribe((blob) => {
      saveAs(blob, 'biểu mẫu nhập dữ liệu Lương thực.xlsx');
    });
  }
  selectNam() {
    this.yearNow = this.formData.get('namKeHoach').value;
    if (this.thongTinChiTieuKeHoachNam?.khLuongThuc.length > 0) {
      this.thongTinChiTieuKeHoachNam?.khLuongThuc.forEach((luongThuc) => {
        luongThuc.tkdnGao[0].nam = this.yearNow - 1;
        luongThuc.tkdnGao[1].nam = this.yearNow - 2;
        luongThuc.tkdnThoc[0].nam = this.yearNow - 1;
        luongThuc.tkdnThoc[1].nam = this.yearNow - 2;
        luongThuc.tkdnThoc[2].nam = this.yearNow - 3;
        luongThuc.xtnGao[0].nam = this.yearNow - 1;
        luongThuc.xtnGao[1].nam = this.yearNow - 2;
        luongThuc.xtnThoc[0].nam = this.yearNow - 1;
        luongThuc.xtnThoc[1].nam = this.yearNow - 2;
        luongThuc.xtnThoc[2].nam = this.yearNow - 3;
      });
    }
    if (this.thongTinChiTieuKeHoachNam?.khMuoiDuTru.length > 0) {
      this.thongTinChiTieuKeHoachNam?.khMuoiDuTru.forEach((muoi) => {
        muoi.tkdnMuoi[0].nam = this.yearNow - 1;
        muoi.tkdnMuoi[1].nam = this.yearNow - 2;
        muoi.tkdnMuoi[2].nam = this.yearNow - 3;
        muoi.xtnMuoi[0].nam = this.yearNow - 1;
        muoi.xtnMuoi[1].nam = this.yearNow - 2;
        muoi.xtnMuoi[2].nam = this.yearNow - 3;
      });
    }
  }
  convertTrangThai(status: string) {
    if (status == '00') {
      return 'Dự thảo';
    } else if (status == '01') {
      return 'Chờ duyệt';
    } else if (status == '02') {
      return 'Đã duyệt';
    } else if (status == '03') {
      return 'Từ chối';
    }
  }

  startEdit(index: number): void {
    this.dsKeHoachLuongThucClone[index].isEdit = true;
  }
  cancelEdit(index: number): void {
    this.dsKeHoachLuongThucClone = cloneDeep(
      this.thongTinChiTieuKeHoachNam.khLuongThuc,
    );
    this.dsKeHoachLuongThucClone[index].isEdit = false;
    this.cdr.detectChanges();
  }

  saveEdit(i: number): void {
    this.dsKeHoachLuongThucClone[i].isEdit = false;
    Object.assign(
      this.thongTinChiTieuKeHoachNam.khLuongThuc[i],
      this.dsKeHoachLuongThucClone[i],
    );
    this.cdr.detectChanges();
  }
  calculatorxtnTongThoc(i: number): number {
    this.dsKeHoachLuongThucClone[i].xtnTongThoc = this.dsKeHoachLuongThucClone[
      i
    ].xtnThoc.reduce((a, b) => a + +b.soLuong, 0);
    return this.dsKeHoachLuongThucClone[i].xtnTongThoc;
  }
  calculatorxtnTongGao(i: number): number {
    this.dsKeHoachLuongThucClone[i].xtnTongGao = this.dsKeHoachLuongThucClone[
      i
    ].xtnGao.reduce((a, b) => a + +b.soLuong, 0);
    return this.dsKeHoachLuongThucClone[i].xtnTongGao;
  }
  calculatortkcnTongThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].tkcnTongThoc =
      this.dsKeHoachLuongThucClone[i].tkdnTongThoc +
      +this.dsKeHoachLuongThucClone[i].ntnThoc -
      +this.dsKeHoachLuongThucClone[i].xtnTongThoc;
    return this.dsKeHoachLuongThucClone[i].tkcnTongThoc
      ? Intl.NumberFormat('en-US').format(
          this.dsKeHoachLuongThucClone[i].tkcnTongThoc,
        )
      : '0';
  }
  calculatortkcnTongGao(i: number): string {
    this.dsKeHoachLuongThucClone[i].tkcnTongGao =
      this.dsKeHoachLuongThucClone[i].tkdnTongGao +
      this.dsKeHoachLuongThucClone[i].ntnGao -
      this.dsKeHoachLuongThucClone[i].xtnTongGao;

    return this.dsKeHoachLuongThucClone[i].tkcnTongGao
      ? Intl.NumberFormat('en-US').format(
          this.dsKeHoachLuongThucClone[i].tkcnTongGao,
        )
      : '0';
  }
  calculatorxtnTongSoQuyThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].xtnTongSoQuyThoc =
      +this.dsKeHoachLuongThucClone[i].xtnTongThoc +
      +this.dsKeHoachLuongThucClone[i].xtnTongGao * 2;
    return this.dsKeHoachLuongThucClone[i].xtnTongSoQuyThoc
      ? Intl.NumberFormat('en-US').format(
          this.dsKeHoachLuongThucClone[i].xtnTongSoQuyThoc,
        )
      : '0';
  }
  calculatortkcnTongSoQuyThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].tkcnTongSoQuyThoc =
      this.dsKeHoachLuongThucClone[i].tkcnTongThoc +
      this.dsKeHoachLuongThucClone[i].tkcnTongGao * 2;
    return this.dsKeHoachLuongThucClone[i].tkcnTongSoQuyThoc
      ? Intl.NumberFormat('en-US').format(
          this.dsKeHoachLuongThucClone[i].tkcnTongSoQuyThoc,
        )
      : '0';
  }
  calculatorntnTongSoQuyThoc(i: number): string {
    this.dsKeHoachLuongThucClone[i].ntnTongSoQuyThoc =
      +this.dsKeHoachLuongThucClone[i].ntnThoc +
      +this.dsKeHoachLuongThucClone[i].ntnGao * 2;
    return this.dsKeHoachLuongThucClone[i].ntnTongSoQuyThoc
      ? Intl.NumberFormat('en-US').format(
          this.dsKeHoachLuongThucClone[i].ntnTongSoQuyThoc,
        )
      : '0';
  }
  onInput(e: Event, data: string): void {
    switch (data) {
      case 'luong-thuc':
        this.isAddLuongThuc = false;
        break;
      case 'muoi':
        this.isAddMuoi = false;
        break;
      case 'vat-tu':
        this.isAddVatTu = false;
        break;
      default:
        break;
    }
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      // this.options = [];
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }
  onInputTenHang(e: Event): void {
    this.isAddVatTu = false;
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      // this.dataVatTuChaShow = [];
      this.keHoachVatTuCreate.maHang = '';
      this.keHoachVatTuCreate.kyHieu = '';
      this.keHoachVatTuCreate.chungLoaiHang = '';
      this.keHoachVatTuCreate.donViTinh = '';
      this.dataVatTuConClone = this.dataVatTuCon;
      // this.dataVatTuConShow = [];
    } else {
      this.dataVatTuChaShow = this.dataVatTuCha.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }
  onInputChungLoaiHang(e: Event): void {
    this.isAddVatTu = false;
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      // this.dataVatTuConShow = [];
      this.keHoachVatTuCreate.donViTinh = '';
    } else {
      this.dataVatTuConShow = this.dataVatTuConClone.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }
  selectDonViKHLT(donVi) {
    this.isAddLuongThuc = true;
    this.keHoachLuongThucCreate.maDonVi = donVi.maDvi;
    this.keHoachLuongThucCreate.tenDonvi = donVi.tenDvi;
    this.keHoachLuongThucCreate.donViId = donVi.id;
    this.chiTieuKeHoachNamService
      .tonKhoDauNam({ maDvi: donVi.maDvi, maVthhList: ['010103', '010101'] })
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            res.data.forEach((tonKho) => {
              if (tonKho.maVthh == '010101') {
                switch (tonKho.nam) {
                  case (this.yearNow - 1).toString():
                    this.keHoachLuongThucCreate.tkdnThoc[0].soLuong =
                      tonKho.slHienThoi;
                    break;
                  case (this.yearNow - 2).toString():
                    this.keHoachLuongThucCreate.tkdnThoc[1].soLuong =
                      tonKho.slHienThoi;
                    break;
                  case (this.yearNow - 3).toString():
                    this.keHoachLuongThucCreate.tkdnThoc[2].soLuong =
                      tonKho.slHienThoi;
                    break;
                  default:
                    break;
                }
              } else if (tonKho.maVthh == '010103') {
                switch (tonKho.nam) {
                  case (this.yearNow - 1).toString():
                    this.keHoachLuongThucCreate.tkdnGao[0].soLuong =
                      tonKho.slHienThoi;
                    break;
                  case (this.yearNow - 2).toString():
                    this.keHoachLuongThucCreate.tkdnGao[1].soLuong =
                      tonKho.slHienThoi;
                    break;
                  default:
                    break;
                }
              }
            });
          } else {
            this.keHoachLuongThucCreate.tkdnThoc.forEach((thoc) => {
              thoc.soLuong = 0;
            });
            this.keHoachLuongThucCreate.tkdnGao.forEach((gao) => {
              gao.soLuong = 0;
            });
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }
  async loadDonVi() {
    try {
      const res = await this.donViService.layTatCaDonVi();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
        }
        this.options = cloneDeep(this.optionsDonVi);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }
  calculatorntnTongQuyThocCreate(): string {
    this.keHoachLuongThucCreate.ntnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.ntnThoc +
      +this.keHoachLuongThucCreate.ntnGao * 2;
    return this.keHoachLuongThucCreate.ntnTongSoQuyThoc
      ? Intl.NumberFormat('en-US').format(
          this.keHoachLuongThucCreate.ntnTongSoQuyThoc,
        )
      : '0';
  }
  calculatorxtnTongThocCreate(): string {
    if (this.keHoachLuongThucCreate.xtnThoc) {
      this.keHoachLuongThucCreate.xtnTongThoc =
        this.keHoachLuongThucCreate?.xtnThoc.reduce(
          (a, b) => a + +b.soLuong,
          0,
        );
      return this.keHoachLuongThucCreate.xtnTongThoc
        ? Intl.NumberFormat('en-US').format(
            this.keHoachLuongThucCreate.xtnTongThoc,
          )
        : '0';
    }
  }
  calculatorxtnTongGaoCreate(): string {
    if (this.keHoachLuongThucCreate.xtnGao) {
      this.keHoachLuongThucCreate.xtnTongGao =
        this.keHoachLuongThucCreate?.xtnGao.reduce((a, b) => a + +b.soLuong, 0);
      return this.keHoachLuongThucCreate.xtnTongGao
        ? Intl.NumberFormat('en-US').format(
            this.keHoachLuongThucCreate.xtnTongGao,
          )
        : '0';
    }
  }
  calculatorxtnTongSoQuyThocCreate(): string {
    this.keHoachLuongThucCreate.xtnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.xtnTongThoc +
      +this.keHoachLuongThucCreate.xtnTongGao * 2;
    return this.keHoachLuongThucCreate.xtnTongSoQuyThoc
      ? Intl.NumberFormat('en-US').format(
          this.keHoachLuongThucCreate.xtnTongSoQuyThoc,
        )
      : '0';
  }
  calculatortkdnTongQuyThocCreate(): string {
    this.keHoachLuongThucCreate.tkdnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.tkdnTongThoc +
      +this.keHoachLuongThucCreate.tkdnTongGao * 2;
    return this.keHoachLuongThucCreate.tkdnTongSoQuyThoc
      ? Intl.NumberFormat('en-US').format(
          this.keHoachLuongThucCreate.tkdnTongSoQuyThoc,
        )
      : '0';
  }
  calculatortkdnTongThocCreate(): string {
    this.keHoachLuongThucCreate.tkdnTongThoc =
      this.keHoachLuongThucCreate?.tkdnThoc.reduce((a, b) => a + +b.soLuong, 0);
    return this.keHoachLuongThucCreate.tkdnTongThoc
      ? Intl.NumberFormat('en-US').format(
          this.keHoachLuongThucCreate.tkdnTongThoc,
        )
      : '0';
  }
  calculatortkdnTongGaoCreate(): string {
    this.keHoachLuongThucCreate.tkdnTongGao =
      this.keHoachLuongThucCreate?.tkdnThoc.reduce((a, b) => a + +b.soLuong, 0);
    return this.keHoachLuongThucCreate.tkdnTongGao
      ? Intl.NumberFormat('en-US').format(
          this.keHoachLuongThucCreate.tkdnTongGao,
        )
      : '0';
  }
  calculatortkcnTongThocCreate(): string {
    this.keHoachLuongThucCreate.tkcnTongThoc =
      this.keHoachLuongThucCreate.tkdnTongThoc +
      +this.keHoachLuongThucCreate.ntnThoc -
      +this.keHoachLuongThucCreate.xtnTongThoc;
    return this.keHoachLuongThucCreate.tkcnTongThoc
      ? Intl.NumberFormat('en-US').format(
          this.keHoachLuongThucCreate.tkcnTongThoc,
        )
      : '0';
  }
  calculatortkcnTongGaoCreate(): string {
    this.keHoachLuongThucCreate.tkcnTongGao =
      this.keHoachLuongThucCreate.tkdnTongGao +
      +this.keHoachLuongThucCreate.ntnGao -
      +this.keHoachLuongThucCreate.xtnTongGao;
    return this.keHoachLuongThucCreate.tkcnTongGao
      ? Intl.NumberFormat('en-US').format(
          this.keHoachLuongThucCreate.tkcnTongGao,
        )
      : '0';
  }
  calculatortkcnTongSoQuyThocCreate(): string {
    this.keHoachLuongThucCreate.tkcnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.tkcnTongThoc +
      +this.keHoachLuongThucCreate.tkcnTongGao * 2;
    return this.keHoachLuongThucCreate.tkcnTongSoQuyThoc
      ? Intl.NumberFormat('en-US').format(
          this.keHoachLuongThucCreate.tkcnTongSoQuyThoc,
        )
      : '0';
  }
  themMoiKHLT() {
    if (!this.isAddLuongThuc) {
      return;
    }
    this.keHoachLuongThucDialog = new KeHoachLuongThuc();
    this.keHoachLuongThucDialog.tenDonvi = this.keHoachLuongThucCreate.tenDonvi;
    this.keHoachLuongThucDialog.maDonVi = this.keHoachLuongThucCreate.maDonVi;
    this.keHoachLuongThucDialog.tkdnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.tkdnTongSoQuyThoc;
    this.keHoachLuongThucDialog.tkdnTongThoc =
      +this.keHoachLuongThucCreate.tkdnThoc[0].soLuong +
      +this.keHoachLuongThucCreate.tkdnThoc[1].soLuong +
      +this.keHoachLuongThucCreate.tkdnThoc[2].soLuong;
    const tkdnThoc1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: +this.keHoachLuongThucCreate.tkdnThoc[0].soLuong,
      vatTuId: null,
    };
    const tkdnThoc2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: +this.keHoachLuongThucCreate.tkdnThoc[1].soLuong,
      vatTuId: null,
    };
    const tkdnThoc3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: +this.keHoachLuongThucCreate.tkdnThoc[2].soLuong,
      vatTuId: null,
    };
    this.keHoachLuongThucDialog.tkdnThoc = [tkdnThoc1, tkdnThoc2, tkdnThoc3];
    this.keHoachLuongThucDialog.tkdnTongGao =
      +this.keHoachLuongThucCreate.tkdnGao[0].soLuong +
      +this.keHoachLuongThucCreate.tkdnGao[1].soLuong;
    const tkdnGao1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: +this.keHoachLuongThucCreate.tkdnGao[0].soLuong,
      vatTuId: null,
    };
    const tkdnGao2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: +this.keHoachLuongThucCreate.tkdnGao[1].soLuong,
      vatTuId: null,
    };
    this.keHoachLuongThucDialog.tkdnGao = [tkdnGao1, tkdnGao2];
    this.keHoachLuongThucDialog.ntnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.ntnTongSoQuyThoc;
    this.keHoachLuongThucDialog.ntnThoc = +this.keHoachLuongThucCreate.ntnThoc;
    this.keHoachLuongThucDialog.ntnGao = +this.keHoachLuongThucCreate.ntnGao;
    this.keHoachLuongThucDialog.xtnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.xtnTongSoQuyThoc;
    this.keHoachLuongThucDialog.xtnTongThoc =
      +this.keHoachLuongThucCreate.xtnThoc[0].soLuong +
      +this.keHoachLuongThucCreate.xtnThoc[1].soLuong +
      +this.keHoachLuongThucCreate.xtnThoc[2].soLuong;
    const xtnThoc1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: +this.keHoachLuongThucCreate.xtnThoc[0].soLuong,
      vatTuId: null,
    };
    const xtnThoc2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: +this.keHoachLuongThucCreate.xtnThoc[1].soLuong,
      vatTuId: null,
    };
    const xtnThoc3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: +this.keHoachLuongThucCreate.xtnThoc[2].soLuong,
      vatTuId: null,
    };
    this.keHoachLuongThucDialog.xtnThoc = [xtnThoc1, xtnThoc2, xtnThoc3];
    this.keHoachLuongThucDialog.xtnTongGao =
      +this.keHoachLuongThucCreate.xtnGao[0].soLuong +
      +this.keHoachLuongThucCreate.xtnGao[1].soLuong;
    const xtnGao1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: +this.keHoachLuongThucCreate.xtnGao[0].soLuong,
      vatTuId: null,
    };
    const xtnGao2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: +this.keHoachLuongThucCreate.xtnGao[1].soLuong,
      vatTuId: null,
    };
    this.keHoachLuongThucDialog.xtnGao = [xtnGao1, xtnGao2];
    this.keHoachLuongThucDialog.tkcnTongSoQuyThoc =
      +this.keHoachLuongThucCreate.tkcnTongSoQuyThoc;
    this.keHoachLuongThucDialog.tkcnTongThoc =
      +this.keHoachLuongThucCreate.tkcnTongThoc;
    this.keHoachLuongThucDialog.tkcnTongGao =
      +this.keHoachLuongThucCreate.tkcnTongGao;
    this.keHoachLuongThucDialog.stt =
      this.thongTinChiTieuKeHoachNam.khLuongThuc?.length + 1;
    this.keHoachLuongThucDialog.donViId = this.keHoachLuongThucCreate.donViId;
    this.keHoachLuongThucDialog.khGaoId = this.keHoachLuongThucCreate.khGaoId;
    this.keHoachLuongThucDialog.khThocId = this.keHoachLuongThucCreate.khThocId;
    this.keHoachLuongThucDialog.donViTinh = MESSAGE.DON_VI_TINH_LUONG_THUC;
    this.checkDataExistLuongThuc(this.keHoachLuongThucDialog);
    this.isAddLuongThuc = false;
    this.newObjectLuongThuc();
    this.dsKeHoachLuongThucClone = cloneDeep(
      this.thongTinChiTieuKeHoachNam.khLuongThuc,
    );
    this.loadData();
  }
  changeDonViMuoi() {
    this.isAddMuoi = false;
  }
  clearKHLT() {
    this.isAddLuongThuc = false;
    this.newObjectLuongThuc();
  }
  themMoiMuoiDuTru() {
    if (!this.isAddMuoi) {
      return;
    }
    this.keHoachMuoiDialog = new KeHoachMuoi();
    this.keHoachMuoiDialog.maDonVi = this.keHoachMuoiCreate.maDonVi;
    this.keHoachMuoiDialog.ntnTongSoMuoi = this.keHoachMuoiCreate.ntnTongSoMuoi;
    this.keHoachMuoiDialog.tenDonVi = this.keHoachMuoiCreate.tenDonVi;
    this.keHoachMuoiDialog.tkcnTongSoMuoi =
      this.keHoachMuoiCreate.tkcnTongSoMuoi;
    this.keHoachMuoiDialog.donViTinh = MESSAGE.DON_VI_TINH_LUONG_THUC;
    const tkdnMuoi1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: this.keHoachMuoiCreate.tkdnMuoi[0].soLuong,
      vatTuId: null,
    };
    const tkdnMuoi2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: this.keHoachMuoiCreate.tkdnMuoi[1].soLuong,
      vatTuId: null,
    };
    const tkdnMuoi3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: this.keHoachMuoiCreate.tkdnMuoi[2].soLuong,
      vatTuId: null,
    };
    this.keHoachMuoiDialog.tkdnMuoi = [tkdnMuoi1, tkdnMuoi2, tkdnMuoi3];
    this.keHoachMuoiDialog.tkdnTongSoMuoi =
      this.keHoachMuoiCreate.tkdnTongSoMuoi;
    const xtnMuoi1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: this.keHoachMuoiCreate.xtnMuoi[0].soLuong,
      vatTuId: null,
    };
    const xtnMuoi2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: this.keHoachMuoiCreate.xtnMuoi[1].soLuong,
      vatTuId: null,
    };
    const xtnMuoi3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: this.keHoachMuoiCreate.xtnMuoi[2].soLuong,
      vatTuId: null,
    };
    this.keHoachMuoiDialog.xtnMuoi = [xtnMuoi1, xtnMuoi2, xtnMuoi3];
    this.keHoachMuoiDialog.xtnTongSoMuoi = this.keHoachMuoiCreate.xtnTongSoMuoi;
    this.keHoachMuoiDialog.stt =
      this.thongTinChiTieuKeHoachNam.khMuoiDuTru?.length + 1;
    this.keHoachMuoiDialog.donViId = this.keHoachMuoiCreate.donViId;
    this.keHoachMuoiDialog.id = this.keHoachMuoiCreate.id;
    this.checkDataExistMuoi(this.keHoachMuoiDialog);
    this.isAddMuoi = false;
    this.newObjectMuoi();
    this.dsMuoiClone = cloneDeep(this.thongTinChiTieuKeHoachNam.khMuoiDuTru);
    this.loadData();
  }
  clearMuoiDuTru() {
    this.isAddMuoi = false;
    this.newObjectMuoi();
  }
  selectDonViMuoi(muoi) {
    this.isAddMuoi = true;
    this.keHoachMuoiCreate.maDonVi = muoi.maDvi;
    this.keHoachMuoiCreate.tenDonVi = muoi.tenDvi;
    this.keHoachMuoiCreate.donViId = muoi.id;
    this.chiTieuKeHoachNamService
      .tonKhoDauNam({ maDvi: muoi.maDvi, maVthhList: ['04'] })
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            res.data.forEach((tonKho) => {
              if (tonKho.maVthh == '04') {
                switch (tonKho.nam) {
                  case (this.yearNow - 1).toString():
                    this.keHoachMuoiCreate.tkdnMuoi[0].soLuong =
                      tonKho.slHienThoi;
                    break;
                  case (this.yearNow - 2).toString():
                    this.keHoachMuoiCreate.tkdnMuoi[1].soLuong =
                      tonKho.slHienThoi;
                    break;
                  case (this.yearNow - 3).toString():
                    this.keHoachMuoiCreate.tkdnMuoi[2].soLuong =
                      tonKho.slHienThoi;
                    break;
                  default:
                    break;
                }
              }
            });
          } else {
            this.keHoachMuoiCreate.tkdnMuoi.forEach((thoc) => {
              thoc.soLuong = 0;
            });
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }
  selectDonViVatTu(vatTu) {
    this.isAddVatTu = true;
    this.keHoachVatTuCreate.maDvi = vatTu.maDvi;
    this.keHoachVatTuCreate.tenDonVi = vatTu.tenDvi;
    this.keHoachVatTuCreate.donViId = vatTu.id;
    if (this.keHoachVatTuCreate.maHang) {
      this.getTonKhoDauNam();
    }
  }
  selectTenHang(vatTu) {
    if (this.keHoachVatTuCreate.maDvi) {
      this.isAddVatTu = true;
      this.getTonKhoDauNam();
    }
    this.dataVatTuConClone = vatTu.child;
    this.dataVatTuConShow = this.dataVatTuConClone;
    this.keHoachVatTuCreate.vatTuThietBi[0].kyHieu = vatTu.kyHieu;
    this.keHoachVatTuCreate.donViTinh = vatTu.donViTinh;
    this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh = vatTu.donViTinh;
    this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha = vatTu.maHang;
    this.keHoachVatTuCreate.vatTuThietBi[0].vatTuChaId = vatTu.id;
  }
  selectChungLoaiHang(chungLoaiHang) {
    if (this.keHoachVatTuCreate.maDvi) {
      this.isAddVatTu = true;
    }
    this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh = chungLoaiHang.donViTinh;
    this.keHoachVatTuCreate.vatTuThietBi[0].maVatTu = chungLoaiHang.maHang;
    this.keHoachVatTuCreate.vatTuThietBi[0].vatTuId = chungLoaiHang.id;
    const vatTuChaFilter = this.dataVatTuCha.find(
      (vaTuCha) => vaTuCha.id === chungLoaiHang.idParent,
    );
    if (vatTuChaFilter) {
      this.keHoachVatTuCreate.vatTuThietBi[0].kyHieu = vatTuChaFilter.kyHieu;
      this.keHoachVatTuCreate.donViTinh = vatTuChaFilter.donViTinh;
      this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh =
        vatTuChaFilter.donViTinh;
      this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha =
        vatTuChaFilter.maHang;
      this.keHoachVatTuCreate.vatTuThietBi[0].tenVatTuCha = vatTuChaFilter.ten;
    } else {
      this.keHoachVatTuCreate.vatTuThietBi[0].kyHieu = chungLoaiHang.kyHieu;
      this.keHoachVatTuCreate.donViTinh = chungLoaiHang.donViTinh;
      this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh =
        chungLoaiHang.donViTinh;
      this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha = chungLoaiHang.maHang;
      this.keHoachVatTuCreate.vatTuThietBi[0].tenVatTuCha = '';
    }
  }
  calculatortkdnTongMuoiCreate() {
    this.keHoachMuoiCreate.tkdnTongSoMuoi =
      this.keHoachMuoiCreate?.tkdnMuoi.reduce((a, b) => a + +b.soLuong, 0);
    return this.keHoachMuoiCreate.tkdnTongSoMuoi
      ? Intl.NumberFormat('en-US').format(this.keHoachMuoiCreate.tkdnTongSoMuoi)
      : '0';
  }
  calculatorxtnTongMuoiCreate() {
    this.keHoachMuoiCreate.xtnTongSoMuoi =
      this.keHoachMuoiCreate?.xtnMuoi.reduce((a, b) => a + +b.soLuong, 0);
    return this.keHoachMuoiCreate.xtnTongSoMuoi
      ? Intl.NumberFormat('en-US').format(this.keHoachMuoiCreate.xtnTongSoMuoi)
      : '0';
  }
  calculatortkcnTongMuoiCreate(): string {
    this.keHoachMuoiCreate.tkcnTongSoMuoi =
      this.keHoachMuoiCreate.tkdnTongSoMuoi +
      this.keHoachMuoiCreate.ntnTongSoMuoi -
      this.keHoachMuoiCreate.xtnTongSoMuoi;
    return this.keHoachMuoiCreate.tkcnTongSoMuoi
      ? Intl.NumberFormat('en-US').format(this.keHoachMuoiCreate.tkcnTongSoMuoi)
      : '0';
  }
  saveEditMuoi(i: number) {
    this.dsMuoiClone[i].isEdit = false;
    Object.assign(
      this.thongTinChiTieuKeHoachNam.khMuoiDuTru[i],
      this.dsMuoiClone[i],
    );
    this.cdr.detectChanges();
  }
  cancelEditMuoi(index: number) {
    this.dsMuoiClone = cloneDeep(this.thongTinChiTieuKeHoachNam.khMuoiDuTru);
    this.dsMuoiClone[index].isEdit = false;
  }
  saveEditVatTu(i: number) {
    this.dsVatTuClone[i].isEdit = false;
    Object.assign(
      this.thongTinChiTieuKeHoachNam.khVatTu[i],
      this.dsVatTuClone[i],
    );
    this.cdr.detectChanges();
  }
  cancelEditVatTu(index: number) {
    this.dsVatTuClone = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTu);
    this.dsVatTuClone[index].isEdit = false;
    this.cdr.detectChanges();
  }
  startEditMuoi(index: number): void {
    this.dsMuoiClone[index].isEdit = true;
  }
  startEditVatTu(index: number): void {
    this.dsVatTuClone[index].isEdit = true;
  }
  calculatorxtnTongSoMuoi(i: number): string {
    this.dsMuoiClone[i].xtnTongSoMuoi = this.dsMuoiClone[i].xtnMuoi.reduce(
      (a, b) => a + +b.soLuong,
      0,
    );
    return this.dsMuoiClone[i].xtnTongSoMuoi
      ? Intl.NumberFormat('en-US').format(this.dsMuoiClone[i].xtnTongSoMuoi)
      : '0';
  }
  calculatortkcnTongSoMuoi(i: number): string {
    this.dsMuoiClone[i].tkcnTongSoMuoi =
      this.dsMuoiClone[i].tkdnTongSoMuoi +
      this.dsMuoiClone[i].ntnTongSoMuoi -
      this.dsMuoiClone[i].xtnTongSoMuoi;
    return this.dsMuoiClone[i].tkcnTongSoMuoi
      ? Intl.NumberFormat('en-US').format(this.dsMuoiClone[i].tkcnTongSoMuoi)
      : '0';
  }
  openDialogQuyetDinhGiaoChiTieu() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
      nzContent: DialogQuyetDinhGiaoChiTieuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.thongTinChiTieuKeHoachNam.canCu = data.soQuyetDinh;
        let item = {
          id: data.id,
          text: data.soQuyetDinh,
        };
        if (!this.canCuList.find((x) => x.id === item.id)) {
          this.canCuList.push(item);
        }
        this.formData.patchValue({
          canCu: data.soQuyetDinh,
        });
      }
    });
  }
  themMoiVatTu() {
    if (!this.isAddVatTu) {
      return;
    }
    this.keHoachVatTuDialog = new KeHoachVatTu();
    this.keHoachVatTuDialog.tenDonVi = this.keHoachVatTuCreate.tenDonVi;
    this.keHoachVatTuDialog.maDvi = this.keHoachVatTuCreate.maDvi;
    this.keHoachVatTuDialog.donViId = this.keHoachVatTuCreate.donViId;
    this.keHoachVatTuDialog.donViTinh = this.keHoachVatTuCreate.donViTinh;
    this.keHoachVatTuDialog.stt =
      this.thongTinChiTieuKeHoachNam.khVatTu?.length + 1;
    this.keHoachVatTuDialog.vatTuThietBi = [];
    const vatTuTemp = new VatTuThietBi();
    vatTuTemp.kyHieu = this.keHoachVatTuCreate.vatTuThietBi[0].kyHieu;
    vatTuTemp.tenVatTuCha = this.keHoachVatTuCreate.vatTuThietBi[0].tenVatTuCha;
    vatTuTemp.tenVatTu = this.keHoachVatTuCreate.vatTuThietBi[0].tenVatTu;
    vatTuTemp.donViTinh = this.keHoachVatTuCreate.vatTuThietBi[0].donViTinh;
    vatTuTemp.maVatTu = this.keHoachVatTuCreate.vatTuThietBi[0].maVatTu;
    vatTuTemp.maVatTuCha = this.keHoachVatTuCreate.vatTuThietBi[0].maVatTuCha;
    vatTuTemp.vatTuId = this.keHoachVatTuCreate.vatTuThietBi[0].vatTuId;
    vatTuTemp.vatTuChaId = this.keHoachVatTuCreate.vatTuThietBi[0].vatTuChaId;
    vatTuTemp.nhapTrongNam = this.keHoachVatTuCreate.vatTuThietBi[0]
      .nhapTrongNam
      ? this.keHoachVatTuCreate.vatTuThietBi[0].nhapTrongNam
      : 0;
    vatTuTemp.cacNamTruoc = this.keHoachVatTuCreate.vatTuThietBi[0].cacNamTruoc;
    vatTuTemp.tongCacNamTruoc =
      this.keHoachVatTuCreate.vatTuThietBi[0].cacNamTruoc[0].soLuong +
      this.keHoachVatTuCreate.vatTuThietBi[0].cacNamTruoc[1].soLuong +
      this.keHoachVatTuCreate.vatTuThietBi[0].cacNamTruoc[2].soLuong;
    vatTuTemp.tongNhap = this.keHoachVatTuCreate.vatTuThietBi[0].nhapTrongNam
      ? this.keHoachVatTuCreate.vatTuThietBi[0].nhapTrongNam +
        this.keHoachVatTuCreate.vatTuThietBi[0].tongCacNamTruoc
      : 0;
    this.keHoachVatTuDialog.vatTuThietBi.push(vatTuTemp);
    this.isAddVatTu = false;
    this.newObjectVatTu();
    this.checkDataExistVatTu(this.keHoachVatTuDialog);

    this.dsVatTuClone = cloneDeep(this.thongTinChiTieuKeHoachNam.khVatTu);
    this.loadData();
  }
  clearVatTu() {
    this.isAddVatTu = false;
    this.newObjectVatTu();
  }
  async loadDanhMucHang() {
    let res = await this.danhMucService.loadDanhMucHangGiaoChiTieu();
    let data = res.data;
    for (let i = 0; i < data.length; i++) {
      if (data[i].cap == 2) {
        let child = [];
        if (data[i].child && data[i].child.length > 0) {
          for (let j = 0; j < data[i].child.length; j++) {
            let itemChild = {
              id: data[i].child[j].id,
              ten: data[i].child[j].ten,
              idParent: data[i].id,
              tenParent: data[i].ten,
              donViTinh: data[i].child[j].maDviTinh,
              maHang: data[i].child[j].ma,
              kyHieu: data[i].kyHieu,
            };
            child.push(itemChild);
            this.dataVatTuCon.push(itemChild);
          }
        }
        let item = {
          id: data[i].id,
          ten: data[i].ten,
          child: child,
          maHang: data[i].ma,
          kyHieu: data[i].kyHieu,
          donViTinh: data[i].maDviTinh,
        };
        this.dataVatTuCha.push(item);
      } else if (data[i].cap == 3) {
        let itemCon = {
          id: data[i].id,
          ten: data[i].ten,
          idParent: 0,
          tenParent: '',
          donViTinh: data[i].maDviTinh,
          maHang: data[i].ma,
          kyHieu: data[i].kyHieu,
        };
        this.dataVatTuCon.push(itemCon);
      }
    }
    this.dataVatTuConClone = cloneDeep(this.dataVatTuCon);
    this.dataVatTuConShow = this.dataVatTuConClone;
    this.dataVatTuChaShow = this.dataVatTuCha;
  }
  getTonKhoDauNam() {
    this.chiTieuKeHoachNamService
      .tonKhoDauNam({
        maDvi: this.keHoachVatTuCreate.maDvi,
        maVthhList: [this.keHoachVatTuCreate.maHang],
      })
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          res?.data.forEach((tonKho) => {
            switch (tonKho.nam) {
              case (this.yearNow - 1).toString():
                this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[0].soLuong =
                  tonKho.slHienThoi;
                break;
              case (this.yearNow - 2).toString():
                this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[1].soLuong =
                  tonKho.slHienThoi;
                break;
              case (this.yearNow - 3).toString():
                this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[2].soLuong =
                  tonKho.slHienThoi;
                break;
              default:
                break;
            }
            this.keHoachVatTuCreate.tongChiTieuCacnamTruoc =
              this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[0].soLuong +
              this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[1].soLuong +
              this.keHoachVatTuCreate.chiTieuNhapCacNamTruoc[2].soLuong;
          });
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }
  calculatorTongChiTieuNtn() {
    this.keHoachVatTuCreate.vatTuThietBi[0].tongNhap =
      this.keHoachVatTuCreate.vatTuThietBi[0].tongCacNamTruoc +
      this.keHoachVatTuCreate.vatTuThietBi[0].nhapTrongNam;
  }
  calculatorTongChiTieuNhaptrongNam(i: number): string {
    this.dsVatTuClone[i].vatTuThietBi[0].tongNhap =
      this.dsVatTuClone[i].vatTuThietBi[0].tongCacNamTruoc +
      this.dsVatTuClone[i].vatTuThietBi[0].nhapTrongNam;
    return this.dsVatTuClone[i].vatTuThietBi[0].tongNhap
      ? Intl.NumberFormat('en-US').format(
          this.dsVatTuClone[i].vatTuThietBi[0].tongNhap,
        )
      : '0';
  }
  calculatorTongChiTieuCacNamTruoc(i: number): string {
    this.dsVatTuClone[i].tongChiTieuCacnamTruoc =
      this.dsVatTuClone[i].vatTuThietBi[0].cacNamTruoc[0].soLuong +
      this.dsVatTuClone[i].vatTuThietBi[0].cacNamTruoc[1].soLuong +
      this.dsVatTuClone[i].vatTuThietBi[0].cacNamTruoc[2].soLuong;
    return this.dsVatTuClone[i].tongChiTieuCacnamTruoc
      ? Intl.NumberFormat('en-US').format(
          this.dsVatTuClone[i].tongChiTieuCacnamTruoc,
        )
      : '0';
  }
  deleteDataMultipleTag(data: any) {
    this.canCuList = this.canCuList.filter((x) => x.id !== data.id);
  }
  deleteTaiLieuDinhKemTag(data: any) {
    this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
      (x) => x.id !== data.id,
    );
  }
  openFile(event) {
    let item = {
      id: new Date().getTime(),
      text: event.name,
    };
    if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
      this.uploadFileService
        .uploadFile(event.file, event.name)
        .then((resUpload) => {
          const fileDinhKem = new FileDinhKem();
          fileDinhKem.fileName = resUpload.filename;
          fileDinhKem.fileSize = resUpload.size;
          fileDinhKem.fileUrl = resUpload.url;
          this.thongTinChiTieuKeHoachNam.fileDinhKemReqs.push(fileDinhKem);
          this.taiLieuDinhKemList.push(item);
        });
    }
  }
  thongTinTrangThai(trangThai: string): string {
    if (trangThai === '00' || trangThai === '01' || trangThai === '03') {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === '02') {
      return 'da-ban-hanh';
    }
  }
  async changePageIndex(event) {
    this.page = event;
    this.loadData();
  }

  async changePageSize(event) {
    this.pageSize = event;
    this.loadData();
  }
  loadData() {
    if (this.tabSelected == this.tab.luongThuc) {
      this.dsKeHoachLuongThucClone =
        this.thongTinChiTieuKeHoachNam.khLuongThuc.slice(
          this.pageSize * (this.page - 1),
          this.pageSize * this.page,
        );
      this.totalRecord = this.thongTinChiTieuKeHoachNam.khLuongThuc?.length;
    } else if (this.tabSelected == this.tab.muoi) {
      this.dsMuoiClone = this.thongTinChiTieuKeHoachNam.khMuoiDuTru?.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page,
      );
      this.totalRecord = this.thongTinChiTieuKeHoachNam.khMuoiDuTru?.length;
    } else if (this.tabSelected == this.tab.vatTu) {
      this.dsVatTuClone = this.thongTinChiTieuKeHoachNam.khVatTu?.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page,
      );
      this.totalRecord = this.thongTinChiTieuKeHoachNam.khVatTu?.length;
    }
  }
  selectTabData(tabName: string) {
    this.tabSelected = tabName;
    this.loadData();
  }
}
