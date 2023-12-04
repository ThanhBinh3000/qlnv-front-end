import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {DonviService} from "src/app/services/donvi.service";
import {OldResponseData} from "src/app/interfaces/response";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {MESSAGE} from "src/app/constants/message";
import {HelperService} from "src/app/services/helper.service";
import {NzTreeSelectComponent} from "ng-zorro-antd/tree-select";
import {LOAI_DON_VI, TrangThaiHoatDong} from "src/app/constants/status";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain, debounce} from "lodash";
import * as uuid from "uuid";
import {NgxSpinnerService} from "ngx-spinner";
import {MangLuoiKhoService} from "src/app/services/qlnv-kho/mangLuoiKho.service";
import {Globals} from "src/app/shared/globals";
import dayjs from "dayjs";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {ThemMoiKhoComponent} from "./them-moi-kho/them-moi-kho.component";
import {UserLogin} from "../../../models/userlogin";
import {UserService} from "../../../services/user.service";
import {
  DialogThemMoiSoDuDauKyComponent
} from "../../../components/dialog/dialog-them-moi-so-du-dau-ky/dialog-them-moi-so-du-dau-ky.component";
import {Tcdtnn} from "../../../models/Tcdtnn";
import {DialogKtGiaoKhoComponent} from "../../../components/dialog/dialog-kt-giao-kho/dialog-kt-giao-kho.component";
import {NzFormatEmitEvent} from "ng-zorro-antd/tree";
import {NzTreeNodeOptions} from "ng-zorro-antd/core/tree";
import {Subject} from "rxjs";


@Component({
  selector: "app-mang-luoi-kho",
  templateUrl: "./mang-luoi-kho.component.html",
  styleUrls: ["./mang-luoi-kho.component.scss"]
})
export class MangLuoiKhoComponent implements OnInit {
  expandSet = new Set<number>();
  @ViewChild("nzTreeSelectComponent", {static: false}) nzTreeSelectComponent!: NzTreeSelectComponent;
  inputSearch = "";
  searchValue = "";
  debouncedSearch: Function;
  searchFilter = {
    soQD: "",
    maDonVi: ""
  };

  loaiHangHoa: any = {
    "type": "",
    "loaiVthh": null,
    "cloaiVthh": null,
    "thoc": false,
    "gao": false,
    "muoi": false,
    "vattu": false,
  };

  detailTcdtnn: Tcdtnn = new Tcdtnn();
  userInfo: UserLogin;
  keySelected: any;
  res: any;

  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  nodes: any = [];
  nodeDetail: any;
  defaultExpandedKeys: any = [];
  nodeSelected: any;
  detailDonVi: FormGroup;
  levelNode: number = 0;
  isEditData: boolean = true;
  dataTable: any[] = [];
  dataTableHh: any[] = [];
  dataTableHhCtiet: any[] = [];
  fileDinhKems: any[] = [];
  listNam: any[] = [];
  dvi: string = "Tấn kho";
  checkLoKho: boolean;

  constructor(
    private router: Router,
    private donviService: DonviService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private _modalService: NzModalService,
    private spinner: NgxSpinnerService,
    private mangLuoiKhoService: MangLuoiKhoService,
    public globals: Globals,
    private userService: UserService,
    private danhMucService: DanhMucService,
    private modals: NzModalService
  ) {
    this.debouncedSearch = debounce((searchValue) => {
      this.searchValue = searchValue
    }, 300); // Sử dụng debounce với thời gian trễ 300 miligiây

    this.detailDonVi = this.formBuilder.group({
      id: [""],
      maCha: [null],
      maDtqgkv: [],
      tenDtqgkv: [],
      maTongKho: [],
      soChiCuc: [],
      nganKhoId: [""],
      diaChi: [""],
      tenTongKho: [""],
      tongkhoId: [""],
      tenNganlo: [""],
      maNganlo: [""],
      ngankhoId: [""],
      tenDiemkho: [""],
      maDiemkho: [""],
      diemkhoId: [""],
      tenNhakho: [""],
      maNhakho: [""],
      tenNgankho: [""],
      maNgankho: [""],
      soNganKhoTk: [""],
      dienTichNganKhoTk: [""],
      loaikhoId: [""],
      nhakhoId: [""],
      loaiVthh: [null],
      cloaiVthh: [null],
      tenLoaiVthh: [null],
      tenCloaiVthh: [null],
      trangThai: [true],
      diaDiem: [""],
      type: [true],
      coLoKho: [false],
      ghiChu: [""],
      nhiemVu: [""],
      tichLuongTkLt: [""],
      tichLuongTkVt: [""],
      tichLuongSdLt: [""],
      tichLuongSdVt: [""],
      theTichSdLt: [""],
      theTichSdVt: [""],
      namSudung: [""],
      dienTichDat: [""],
      tichLuongKdLt: [""],
      tichLuongKdVt: [""],
      theTichKdLt: [""],
      theTichKdVt: [""],
      theTichTk: [""],
      theTichTkLt: [""],
      theTichTkVt: [""],
      namNhap: [""],
      tinhtrangId: [""],
      chatluongId: [""],
      soLuongTonKho: [""],
      dviTinh: [""],
      soDiemkho: [""],
      soNhakho: [""],
      soNgankho: [""],
      soLokho: [""],
      tenThuKho: [""],
      slTon: [""],
      ngayNhapDay: [""],
      sdt: [""],
      idParent: [""],
      isKhoiTao: [false],
      dviReq: [null],
      loaiHangHoa: [],
      kieuHang: [""],
      idDmDonVi: []
    });
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get("year") - i,
          text: dayjs().get("year") - i
        });
      }

      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        // this.layTatCaDonViTheoTree(),
        this.loadDsDviTree(),
        this.getAllLoaiVthh(),
        this.getListLoaiKho(),
        this.getListClKho(),
        this.getListTtKho(),
        this.loadTinhTrangLoKho()
      ]);
      let node = this.nzTreeSelectComponent.getTreeNodeByKey(this.nodes[0].maDvi);
      if (node) {
        this.nzClickNodeTree(node, true);
      }

    } catch (e) {
      console.log(e)
    } finally {
      this.spinner.hide();
    }
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async loadTinhTrangLoKho() {
    this.listTinhTrang = [];
    let res = await this.danhMucService.danhMucChungGetAll("TT_KHO");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listTinhTrang = res.data;
    }
  }

  listLoaiKho: any[] = [];

  async getListLoaiKho() {
    this.listLoaiKho = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_KHO");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiKho = res.data;
    }
  }

  listChatLuongKho: any[] = [];

  async getListClKho() {
    this.listChatLuongKho = [];
    let res = await this.danhMucService.danhMucChungGetAll("CL_KHO");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChatLuongKho = res.data;
    }
  }

  listTinhTrangKho: any[] = [];

  async getListTtKho() {
    this.listTinhTrangKho = [];
    let res = await this.danhMucService.danhMucChungGetAll("TT_KHO");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listTinhTrangKho = res.data;
    }
  }

  /**
   * call api init
   */

  listType = ["MLK", "DV"];

  async layTatCaDonViTheoTree(id?) {
    let body = {
      maDvi: this.userInfo.MA_DVI,
      type: this.listType
    };
    await this.donviService.layTatCaByMaDvi(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res && res.data && res.data.length > 0) {
          this.nodes = res.data;
          this.nodes[0].expanded = true;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    });
  }

  async loadDsDviTree(id?) {
    let body = {
      maDvi: this.userInfo.MA_DVI,
    };
    await this.donviService.getDviTree(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res && res.data && res.data.length > 0) {
          this.nodes = res.data;
          this.nodes[0].expanded = true;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    });
  }

  convertDataToTree() {
    this.dataTableHhCtiet = chain(this.dataTableHhCtiet)
      .groupBy("tenDiemKho")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenNhaKho")
          .map((v, k) => {
              let rs1 = chain(v)
                .groupBy("tenNganKho")
                .map((v1, k1) => {
                  let rs2 = chain(v1)
                    .groupBy("tenNganLo")
                    .map((v2, k2) => {
                      return {
                        idVirtual: uuid.v4(),
                        tenDviCha: k2,
                        childData: v2
                      };
                    }).value();
                  return {
                    idVirtual: uuid.v4(),
                    tenDviCha: k1,
                    childData: rs2
                  };
                }).value();
              return {
                idVirtual: uuid.v4(),
                tenDviCha: k,
                childData: rs1
              };
            }
          ).value();
        return {
          idVirtual: uuid.v4(),
          tenDviCha: key,
          childData: rs
        };
      }).value();
  }


  // parentNodeSelected: any = [];
  theTich: string = "m3";
  listTinhTrang: any[] = [];

  nzClickNodeTree(event: any, type?: any): void {
    try {
      this.spinner.show();
      this.detailDonVi.reset();
      this.fileDinhKems = [];
      this.loaiHangHoa.gao = false;
      this.loaiHangHoa.thoc = false;
      this.loaiHangHoa.vattu = false;
      this.loaiHangHoa.muoi = false;
      if (event) {
        if (type) {
          this.isEditData = true;
          this.nodeSelected = event.origin;
          this.nodeSelected.maDvi = this.nodeSelected.key;
          this.levelNode = this.nodeSelected.capDvi;
          this.getDetailMlkByKey(event);
        } else {
          this.isEditData = true;
          this.nodeSelected = event.node.origin;
          this.nodeSelected.maDvi = this.nodeSelected.key;
          this.levelNode = this.nodeSelected.capDvi;
          this.getDetailMlkByKey(event.node);
        }
      }
    } catch (e) {
      console.log(e)
    } finally {
      this.spinner.hide();
    }
  }

  async getAllLoaiVthh() {
    let res = await this.danhMucService.getAllVthhByCap("2");
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listVthh = res.data
      }
    }
  }

  async onChangeLoaiVthh(event) {
    if (event) {
      let body = {
        "str": event
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
    }
  }

  async onChangCloaiVthh(event) {
    if (event) {
      let res = await this.danhMucService.getDetail(event);
      if (res.msg == MESSAGE.SUCCESS) {
        this.detailDonVi.patchValue({
          dviTinh: res.data ? res.data.maDviTinh : null
        });
      }
    }
  }

  updateCheckboxHh(listHh: any[], kieuHang: string) {
    this.loaiHangHoa.type = kieuHang;
    if (kieuHang == 'LT') {
      if (listHh && listHh.length > 0) {
        listHh.forEach(item => {
          if (item == "0101") {
            this.loaiHangHoa.thoc = true;
          }
          if (item == "0102") {
            this.loaiHangHoa.gao = true;
          }
          if (item == "04") {
            this.loaiHangHoa.muoi = true;
          }
        });
      }
    } else {
      if (kieuHang == 'VT') {
        if (listHh && listHh.length > 0) {
          listHh.forEach(item => {
            if (item.length == 4) {
              this.loaiHangHoa.loaiVthh = item;
              this.onChangeLoaiVthh(item);
            }
            if (item.length == 6) {
              this.loaiHangHoa.cloaiVthh = item;
            }
          });
        }
      }
    }
  }

  checkStatusSurplus(): boolean {
    let check = false;
    if ((this.levelNode == 7 && !this.detailDonVi.value.loaiVthh) || (this.levelNode == 6 && this.detailDonVi.value.coLoKho == false && !this.detailDonVi.value.loaiVthh)) {
      check = true;
    }
    return check;
  }

  async getDetailMlkByKey(dataNode) {
    if (dataNode) {
      this.keySelected = dataNode;
      let body = {
        maDvi: dataNode.origin.key,
        capDvi: this.nodeSelected.capDvi
      };
      await this.mangLuoiKhoService.getDetailByMa(body).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.detailDonVi.reset();
          const dataNodeRes = res.data.object;
          this.bindingDataDetail(dataNodeRes);
          // this.showDetailDonVi(dataNode.origin.id);
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      });
    }
  }

  bindingDataDetail(dataNode) {
    if (this.levelNode != 1) {
      this.convertDataChild(dataNode);
      this.loaiHangHoa = {
        "type": "",
        "loaiVthh": null,
        "cloaiVthh": null,
        "thoc": false,
        "gao": false,
        "muoi": false,
        "vattu": false,
      }
      if (dataNode.loaiHangHoa && dataNode.kieuHang) {
        let arr = dataNode.loaiHangHoa.split(",");
        this.updateCheckboxHh(arr && arr.length > 0 ? arr : [], dataNode.kieuHang);
      }
      this.detailDonVi.patchValue({
        id: dataNode && dataNode.id ? dataNode.id : null,
        // maCha:dataNode && dataNode.id ? dataNode.id : null,
        tichLuongTkLt: dataNode.tichLuongTkLt ? dataNode.tichLuongTkLt : 0,
        dienTichDat: dataNode.dienTichDat ? dataNode.dienTichDat : 0,
        tichLuongTkVt: dataNode.tichLuongTkVt ? dataNode.tichLuongTkVt : 0,
        theTichTkLt: dataNode.theTichTkLt ? dataNode.theTichTkLt : 0,
        theTichTkVt: dataNode.theTichTkVt ? dataNode.theTichTkVt : 0,
        tichLuongKdLt: dataNode.tichLuongKdLt ? dataNode.tichLuongKdLt : 0,
        tichLuongKdVt: dataNode.tichLuongKdVt ? dataNode.tichLuongKdVt : 0,
        tichLuongSdLt: (dataNode.tichLuongTkLt - dataNode.tichLuongKdLt) > 0 ? dataNode.tichLuongTkLt - dataNode.tichLuongKdLt : 0,
        tichLuongSdVt: (dataNode.tichLuongTkVt - dataNode.tichLuongKdVt) ? dataNode.tichLuongTkVt - dataNode.tichLuongKdVt : 0,
        theTichSdLt: (dataNode.theTichTkLt - dataNode.theTichKdLt) > 0 ? (dataNode.theTichTkLt - dataNode.theTichKdLt) : 0,
        theTichSdVt: (dataNode.theTichTkVt - dataNode.theTichKdVt) > 0 ? (dataNode.theTichTkVt - dataNode.theTichKdVt) : 0,
        theTichKdLt: dataNode.theTichKdLt ? dataNode.theTichKdLt : 0,
        theTichKdVt: dataNode.theTichKdVt ? dataNode.theTichKdVt : 0,
        ghiChu: dataNode.ghiChu ? dataNode.ghiChu : null,
        nhiemVu: dataNode.nhiemVu ? dataNode.nhiemVu : null,
        namSudung: dataNode.namSudung ? dataNode.namSudung : null,
        tinhtrangId: dataNode.tinhtrangId,
        chatluongId: dataNode.chatluongId,
        loaiVthh: dataNode.loaiVthh ? dataNode.loaiVthh : null,
        cloaiVthh: dataNode.cloaiVthh ? dataNode.cloaiVthh : null,
        tenLoaiVthh: dataNode.tenLoaiVthh ?? null,
        tenCloaiVthh: dataNode.tenCloaiVthh ?? null,
        slTon: dataNode.slTon ? dataNode.slTon : 0,
        dviTinh: dataNode.dviTinh ? dataNode.dviTinh : null,
        ngayNhapDay: dataNode.ngayNhapDay ? dataNode.ngayNhapDay : null,
        loaikhoId: dataNode.loaikhoId,
        trangThai: dataNode.trangThai == TrangThaiHoatDong.HOAT_DONG ? true : false,
        loaiHangHoa: dataNode.loaiHangHoa,
        kieuHang: dataNode.kieuHang,
        diaChi: dataNode.diaChi ?? '',
        idDmDonVi: dataNode.idDmDonVi ?? '',
      });
      if (this.levelNode == 7) {
        this.detailDonVi.patchValue({
          ngankhoId: dataNode.idParent,
          tenNgankho: dataNode.tenNgankho,
          tenNhakho: dataNode.tenNhakho,
          tenDiemkho: dataNode.tenDiemkho,
          tenTongKho: dataNode.tenTongKho,
          namNhap: dataNode.namNhap ?? null,
          maNganlo: dataNode.maNganlo ?? '',
          tenNganlo: dataNode.tenNganlo ?? '',
        });
      }
      if (this.levelNode == 6) {
        this.dataTableHh = dataNode.hangHoaTrongKho;
        this.dataTableHhCtiet = dataNode.ctietHhTrongKho;
        this.detailDonVi.patchValue({
          nhakhoId: dataNode.idParent,
          tenNhakho: dataNode.tenNhakho,
          tenDiemkho: dataNode.tenDiemkho,
          tenTongKho: dataNode.tenTongKho,
          soLokho: dataNode.soLokho,
          coLoKho: dataNode.coLoKho,
          namNhap: dataNode.namNhap ?? null,
          maNgankho: dataNode.maNgankho ?? '',
          tenNgankho: dataNode.tenNgankho ?? '',
        });
      }
      if (this.levelNode == 5) {
        this.dataTableHh = dataNode.hangHoaTrongKho;
        this.dataTableHhCtiet = dataNode.ctietHhTrongKho;
        this.convertDataToTree();
        this.detailDonVi.patchValue({
          diemkhoId: dataNode.idParent,
          tenThuKho: dataNode.tenThuKho,
          tenDiemkho: dataNode.tenDiemkho,
          tenTongKho: dataNode.tenTongKho,
          soNgankho: dataNode.soNgankho,
          soLokho: dataNode.soLokho,
          soNganKhoTk: dataNode.soNganKhoTk,
          dienTichNganKhoTk: dataNode.dienTichNganKhoTk,
          maNhakho: dataNode.maNhakho ?? '',
          tenNhakho: dataNode.tenNhakho ?? '',
        });
      }
      if (this.levelNode == 4) {
        this.dataTableHh = dataNode.hangHoaTrongKho;
        this.dataTableHhCtiet = dataNode.ctietHhTrongKho;
        this.convertDataToTree();
        this.detailDonVi.patchValue({
          tongkhoId: dataNode.idParent,
          tenTongKho: dataNode.tenTongKho,
          soNhakho: dataNode.soNhakho,
          soNgankho: dataNode.soNgankho,
          soLokho: dataNode.soLokho,
          tenThuKho: dataNode.tenThuKho,
          maDiemkho: dataNode.maDiemkho ?? '',
          tenDiemkho: dataNode.tenDiemkho ?? '',
        });
      }
      if (this.levelNode == 3) {
        this.dataTableHh = dataNode.hangHoaTrongKho;
        this.dataTableHhCtiet = dataNode.ctietHhTrongKho;
        this.convertDataToTree();
        this.detailDonVi.patchValue({
          tongkhoId: dataNode.idParent,
          soDiemkho: dataNode.soDiemkho,
          soNhakho: dataNode.soNhakho,
          soNgankho: dataNode.soNgankho,
          soLokho: dataNode.soLokho,
          maTongKho: dataNode.maTongKho ?? '',
          tenTongKho: dataNode.tenTongKho ?? '',
        });
      }
      if (this.levelNode == 2) {
        this.dataTableHh = dataNode.hangHoaTrongKho;
        this.dataTableHhCtiet = dataNode.ctietHhTrongKho;
        this.convertDataToTree();
        this.detailDonVi.patchValue({
          soChiCuc: dataNode.soChiCuc,
          soDiemkho: dataNode.soDiemkho,
          soNhakho: dataNode.soNhakho,
          soNgankho: dataNode.soNgankho,
          soLokho: dataNode.soLokho,
          maDtqgkv: dataNode.maDtqgkv ?? '',
          tenDtqgkv: dataNode.tenDtqgkv ?? '',
        });
      }
      this.checkLoKho = dataNode.coLoKho == true ? true : false;
      this.fileDinhKems = dataNode.fileDinhkems ? dataNode.fileDinhkems : null;
    }
    if (this.levelNode == 1) {
      this.detailTcdtnn.soCuc = dataNode.soCuc ? dataNode.soCuc : 0;
      this.detailTcdtnn.soChiCuc = dataNode.soChiCuc;
      this.detailTcdtnn.soDiemKho = dataNode.soDiemKho;
      this.detailTcdtnn.soNganKho = dataNode.soNganKho;
      this.detailTcdtnn.soNhaKho = dataNode.soNhaKho;
      this.detailTcdtnn.tichLuongTk = dataNode.tichLuongTk;
      this.detailTcdtnn.tichLuongKd = dataNode.tichLuongKd;
      this.detailTcdtnn.tichLuongSd = (dataNode.tichLuongTk - dataNode.tichLuongKd) > 0 ? (dataNode.tichLuongTk - dataNode.tichLuongKd) : 0;
      this.detailTcdtnn.diaChi = dataNode.diaChi;
      this.detailTcdtnn.sdt = dataNode.sdt;
    }
    this.convertDanhSachHangHoa();
  }

  convertDataChild(dataNode) {
    this.dataTable = [];
    if (dataNode && dataNode.child) {
      dataNode.child.forEach(element => {
        let dataChild = {
          tenDvi: null,
          tichLuongTkLt: element.tichLuongTkLt ? element.tichLuongTkLt : 0,
          tichLuongTkVt: element.tichLuongTkVt ? element.tichLuongTkVt : 0,
          tichLuongSdLt: (element.tichLuongTkLt - element.tichLuongKdLt) > 0 ? (element.tichLuongTkLt - element.tichLuongKdLt) : 0,
          tichLuongSdVt: (element.tichLuongTkVt - element.tichLuongKdVt) > 0 ? element.tichLuongTkVt - element.tichLuongKdVt : 0,
          tichLuongKdLt: element.tichLuongKdLt ? element.tichLuongKdLt : 0,
          tichLuongKdVt: element.tichLuongKdVt ? element.tichLuongKdVt : 0
        };
        dataChild.tenDvi = element.tenTongKho ?? element.tenDiemkho ?? element.tenNhakho ?? element.tenNgankho ?? element.tenNganlo;
        this.dataTable = [...this.dataTable, dataChild];
      });
    }
  }

  showDetailDonVi(id?: any) {
    this.levelNode = this.nodeSelected.capDvi;
    if (id) {
      this.donviService.getDetail(id).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.nodeDetail = res.data;
          if (this.nodeDetail) {
            this.patchValueFormData(this.levelNode);
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      });
    }
  }


  showEdit(editData: boolean) {
    this.isEditData = editData;
  }

  update() {
    console.log(this.detailDonVi, 'this.detailDonVithis.detailDonVithis.detailDonVi')
    this.helperService.markFormGroupTouched(this.detailDonVi);
    if (this.detailDonVi.invalid) {
      return;
    }

    this._modalService.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn sửa ?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        let body = {
          ...this.detailDonVi.value,
          trangThai: this.detailDonVi.value.trangThai ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG,
          type: this.detailDonVi.value.type ? LOAI_DON_VI.PB : null
        };
        body.loaiHangHoa = this.setLoaiHangHoa();
        body.kieuHang = this.loaiHangHoa.type;
        body.isKhoiTao = false;
        let dviReq = {
          "diaChi": this.detailDonVi.value.diaChi,
          "fax": this.detailDonVi.value.fax,
          "id": this.detailDonVi.value.idDmDonVi,
          "maDvi": this.detailDonVi.value.maDvi,
          "maDviCha": this.detailDonVi.value.maDviCha,
          "maKhqlh": this.detailDonVi.value.maKhqlh,
          "maKtbq": this.detailDonVi.value.maKtbq,
          "maQd": this.detailDonVi.value.maQd,
          "maQhns": this.detailDonVi.value.maQhns,
          "maTckt": this.detailDonVi.value.maTckt,
          "maTr": this.detailDonVi.value.maTr,
          "sdt": this.detailDonVi.value.sdt,
          "tenDvi": this.levelNode == 4 ? this.detailDonVi.value.tenDiemkho : this.levelNode == 5 ? this.detailDonVi.value.tenNhakho : this.levelNode == 6 ? this.detailDonVi.value.tenNgankho : this.detailDonVi.value.tenNganlo,
          "tenVietTat": this.detailDonVi.value.tenVietTat,
          // "trangThai": this.detailDonVi.value.trangThai,
          "type": this.levelNode < 4 ? 'DV' : 'MLK'
        };
        body.trangThai = this.detailDonVi.get("trangThai").value ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG;
        body.dviReq = dviReq;
        body.fileDinhkems = this.fileDinhKems;
        let type;
        if (this.levelNode == 4) {
          type = "diem-kho";
        }
        if (this.levelNode == 5) {
          type = "nha-kho";
        }
        if (this.levelNode == 6) {
          body.slTon = body.slTon ? body.slTon : 0;
          type = "ngan-kho";
        }
        if (this.levelNode == 7) {
          type = "ngan-lo";
        }
        this.mangLuoiKhoService.updateKho(type, body).then((res: OldResponseData) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.getDetailMlkByKey(this.keySelected);
            this.isEditData = true;
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.spinner.hide();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        });
        this.spinner.hide();
      }
    });
  }


  delete() {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa ?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        let body = {
          maDvi: this.nodeSelected.maDvi,
          capDvi: this.nodeSelected.capDvi
        };
        this.mangLuoiKhoService.delete(body).then((res: OldResponseData) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            // set node về không
            this.nodeSelected = [];
            this.layTatCaDonViTheoTree();
            this.levelNode = 0;
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        });
      }
    });
  }

  create() {
    var nodesTree = this.nodes;
    let modal = this._modalService.create({
      nzTitle: "THÊM MỚI TỔ CHỨC KHO",
      nzContent: ThemMoiKhoComponent,
      nzClosable: true,
      nzFooter: null,
      nzStyle: {top: "50px", backgroud: "red"},
      nzWidth: 1600
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        this.ngOnInit();
      }
    });
  }


  calcTong(dataColumn: string) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[dataColumn];
        return prev;
      }, null);
      return sum;
    }
  }

  themSoDuDauKy() {
    if (!this.loaiHangHoa.type) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng có thể chứa');
      return;
    }
    let dviReq = {
      "diaChi": this.detailDonVi.value.diaChi,
      "fax": this.detailDonVi.value.fax,
      "id": this.detailDonVi.value.idDmDonVi,
      "maDvi": this.detailDonVi.value.maDvi,
      "maDviCha": this.detailDonVi.value.maDviCha,
      "maKhqlh": this.detailDonVi.value.maKhqlh,
      "maKtbq": this.detailDonVi.value.maKtbq,
      "maQd": this.detailDonVi.value.maQd,
      "maQhns": this.detailDonVi.value.maQhns,
      "maTckt": this.detailDonVi.value.maTckt,
      "maTr": this.detailDonVi.value.maTr,
      "sdt": this.detailDonVi.value.sdt,
      "tenDvi": this.levelNode == 4 ? this.detailDonVi.value.tenDiemkho : this.levelNode == 5 ? this.detailDonVi.value.tenNhakho : this.levelNode == 6 ? this.detailDonVi.value.tenNgankho : this.detailDonVi.value.tenNganlo,
      "tenVietTat": this.detailDonVi.value.tenVietTat,
      // "trangThai": this.detailDonVi.value.trangThai,
      "type": this.levelNode < 4 ? 'DV' : 'MLK'
    };
    this.detailDonVi.value.dviReq = dviReq;
    const modalQD = this.modals.create({
      nzTitle: "KHỞI TẠO SỐ DƯ ĐẦU KỲ CHO NGĂN/LÔ KHO",
      nzContent: DialogThemMoiSoDuDauKyComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzStyle: {top: "50px"},
      nzComponentParams: {
        detail: this.detailDonVi.value,
        levelNode: this.levelNode,
        loaiHang: this.loaiHangHoa
      }
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.getDetailMlkByKey(this.keySelected);
      }
    });
  }

  changeLoKho() {
    if (this.detailDonVi.value.coLoKho) {
      this.checkLoKho = true;
    } else {
      this.checkLoKho = false;
    }
  }

  patchValueFormData(level) {
    switch (level) {
      case "2": {
        this.detailDonVi.patchValue({
          tenDtqgkv: this.nodeDetail.tenDvi,
          maDtqgkv: this.nodeDetail.maDvi,
          ghiChu: this.nodeDetail.ghiChu,
          diaChi: this.nodeDetail.diaChi
        });
        break;
      }
      case "3": {
        this.detailDonVi.patchValue({
          tenTongKho: this.nodeDetail.tenDvi,
          maTongKho: this.nodeDetail.maDvi,
          diaChi: this.nodeDetail.diaChi
        });
        break;
      }
      case "4": {
        this.detailDonVi.patchValue({
          tenDiemkho: this.nodeDetail.tenDvi,
          maDiemkho: this.nodeDetail.maDvi,
          diaChi: this.nodeDetail.diaChi
        });
        break;
      }
      case "5": {
        this.detailDonVi.patchValue({
          tenNhakho: this.nodeDetail.tenDvi,
          maNhakho: this.nodeDetail.maDvi,
          diaChi: this.nodeDetail.diaChi
        });
        break;
      }
      case "6": {
        this.detailDonVi.patchValue({
          tenNgankho: this.nodeDetail.tenDvi,
          maNgankho: this.nodeDetail.maDvi,
          diaChi: this.nodeDetail.diaChi
        });
        break;
      }
      case "7": {
        this.detailDonVi.patchValue({
          tenNganlo: this.nodeDetail.tenDvi,
          maNganlo: this.nodeDetail.maDvi,
          diaChi: this.nodeDetail.diaChi
        });
        break;
      }
    }
  }

  openDialogGiaoKho() {
    this.donviService.layTatCaDangTree({'maDviCha': this.detailDonVi.value.maNhakho}).then((res) => {
      this.spinner.hide();
      console.log(res);
      const modalQD = this.modals.create({
        nzTitle: 'Giao kho cho thủ kho',
        nzContent: DialogKtGiaoKhoComponent,
        nzMaskClosable: false,
        nzClosable: true,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTree: res.data,
        },
      });
    });

    // const modalQD = this.modals.create({
    //   nzTitle: "",
    //   nzContent: DialogKtGiaoKhoComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzWidth: "1500px",
    //   nzFooter: null,
    //   nzStyle: { top: "100px" },
    //   nzComponentParams: {
    //     maNhaKho: this.detailDonVi.value.maNhakho
    //   }
    // });
    // modalQD.afterClose.subscribe((data) => {
    //   if (data) {
    //   }
    // });
  }

  async loadChildren(event: NzFormatEmitEvent) {
    this.spinner.show();
    let data = event.node.origin;
    let body = {
      maDvi: data.maDvi,
      type: this.listType
    };
    if (event.keys.length > 0) {
      await this.donviService.getAllChildrenByMadvi(body).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res && res.data && res.data.length > 0) {
            let children = res.data;
            this.loadNode(children).then(children => {
              event.node.children = [];
              event.node.addChildren(children);
            });
          }
          this.spinner.hide();
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
          this.spinner.hide();
          return;
        }
      });
    }
    this.spinner.hide();
  }

  loadNode(data): Promise<NzTreeNodeOptions[]> {
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve(data)
      );
    });
  }

  setLoaiHangHoa(): string {
    let arr = [];
    if (this.loaiHangHoa.type == 'LT') {
      if (this.loaiHangHoa.gao) {
        arr.push("0102")
      }
      if (this.loaiHangHoa.thoc) {
        arr.push("0101")
      }
      if (this.loaiHangHoa.muoi) {
        arr.push("04")
      }
    } else {
      if (this.loaiHangHoa.loaiVthh) {
        arr.push(this.loaiHangHoa.loaiVthh)
      }
      if (this.loaiHangHoa.cloaiVthh) {
        arr.push(this.loaiHangHoa.cloaiVthh)
      }
    }
    let string = ''
    if (arr && arr.length > 0) {
      string = arr.toString()
    }
    return string;
  }

  convertDanhSachHangHoa() {
    if (this.dataTableHh && this.dataTableHh.length > 0) {
      this.dataTableHh = chain(this.dataTableHh).groupBy("tenLoaiVthh").map((value, key) => {
        let rs = chain(value).groupBy("tenCloaiVthh").map((v, k) => {
          let row = v.find(s => s.tenCloaiVthh === k);
          let slHienThoi = v.reduce((prev, next) => prev + next.slHienThoi, 0);
          return {
            tenCloaiVthh: row?.tenCloaiVthh ?? key,
            slHienThoi: slHienThoi ?? 0,
            tenDonViTinh: row?.tenDonViTinh ?? '',
            dataChild: v
          }
        }).value();
        return {
          tenLoaiVthh: key,
          dataChild: rs,
          idVirtual: uuid.v4()
        }
      }).value();
    }
    console.log(this.dataTableHh);
  }

  sumTableDanhSachHh(item): number {
    let result = 0;
    if (item && item.dataChild.length > 0) {
      const sumChild = item.dataChild.reduce((prev, cur) => {
        prev += cur.slHienThoi;
        return prev;
      }, 0);
      result = sumChild
    }
    return result;
  }

  beforeSearch(searchValue) {
    let value = searchValue.target.value;
    console.log(value)
    if (value) {
      this.searchValue = value;
    } else {
      let node = this.nzTreeSelectComponent.getTreeNodeByKey(this.nodes[0].maDvi);
      if (node) {
        this.nzClickNodeTree(node, true);
      }
    }
    // console.log(searchValue)
    // this.debouncedSearch(searchValue);

  }
}
