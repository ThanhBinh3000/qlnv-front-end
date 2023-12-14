import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DonviService } from "src/app/services/donvi.service";
import { OldResponseData } from "src/app/interfaces/response";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { MESSAGE } from "src/app/constants/message";
import { HelperService } from "src/app/services/helper.service";
import { NzTreeSelectComponent } from "ng-zorro-antd/tree-select";
import { LOAI_DON_VI, TrangThaiHoatDong } from "src/app/constants/status";
import { NzModalService } from "ng-zorro-antd/modal";
import { NewDonViComponent } from "./new-don-vi/new-don-vi.component";
import { NgxSpinnerService } from "ngx-spinner";
import { UserLogin } from "../../../models/userlogin";
import { UserService } from "../../../services/user.service";
import { DanhMucService } from "../../../services/danhmuc.service";


@Component({
  selector: "app-danh-muc-don-vi",
  templateUrl: "./danh-muc-don-vi.component.html",
  styleUrls: ["./danh-muc-don-vi.component.scss"]
})
export class DanhMucDonViComponent implements OnInit {
  @ViewChild("nzTreeSelectComponent", { static: false }) nzTreeSelectComponent!: NzTreeSelectComponent;
  searchValue = "";
  searchFilter = {
    soQD: "",
    maDonVi: ""
  };
  keySelected: any;
  res: any;
  nodes: any = [];
  nodeDetail: any;
  defaultExpandedKeys: any = [];
  nodeSelected: any = [];
  detailDonVi: FormGroup;
  levelNode: number = 0;
  isEditData: boolean = false;
  userInfo: UserLogin;
  listVungMien: any[] = [];
  listTinhThanh: any[] = [];
  listQuanHuyen: any[] = [];
  listPhuongXa: any[] = [];
  listAllDiaDanh: any[] = [];
  constructor(
    private router: Router,
    private donviService: DonviService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private _modalService: NzModalService,
    private spinner: NgxSpinnerService,
    private danhMucService: DanhMucService,
    public userService: UserService
  ) {
    this.detailDonVi = this.formBuilder.group({
      id: [""],
      maDviCha: [""],
      tenDvi: ["", Validators.required],
      maDvi: [""],
      tenVietTat: [""],
      diaChi: [""],
      capDvi: [""],
      fax: [""],
      sdt: [""],
      mst: [""],
      stk: [""],
      moTai: [""],
      maTuDinhNghia: [""],
      trangThai: [""],
      type: [],
      ghiChu: [""],
      vungMien: [""],
      tinhThanhList: [],
      tinhThanh: [""],
      quanHuyen: [""],
      phuongXa: [""]
    });
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QTDM_DM_DON_VI')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.layTatCaDonViTheoTree();
    this.loadDsKhuVuc();
    this.loadDsVungMien();
    this.spinner.hide();
  }

  /**
   * call api init
   */

  listType = ["PB", "DV"];

  layTatCaDonViTheoTree(id?) {
    let body = {
      type: this.listType
    };
    this.donviService.layTatCaDonViCha(body).then((res: OldResponseData) => {
      // let body = {
      //   maDviCha: this.userInfo.MA_DVI,
      //   trangThai: '01',
      // }
      // await this.donviService.layTatCaDangTree(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.nodes = res.data;
        this.nodes[0].expanded = true;
        //  lúc đầu mắc định lấy node gốc to nhất
        this.nodeSelected = res.data[0].id;
        // lấy detail đon vị hiện tại
        if (id) {
          this.showDetailDonVi(id);
        } else {
          this.showDetailDonVi(res.data[0].id);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    });
  }


  async loadDsKhuVuc() {
    let res = await this.danhMucService.loadDsDiaDanhByCap({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listAllDiaDanh = res.data;
      if (this.listAllDiaDanh && this.listAllDiaDanh.length > 0) {
        this.listTinhThanh = this.listAllDiaDanh.filter(item => item.capDiaDanh === 1);
      }
    }
  }

  async loadDsVungMien() {
    let res = await this.danhMucService.danhMucChungGetAll('VUNG_MIEN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVungMien = res.data;
    }
  }

  parentNodeSelected: any = [];

  nzClickNodeTree(event: any): void {
    if (event.keys.length > 0) {
      this.nodeSelected = event.node.origin.id;
      this.parentNodeSelected = event?.parentNode?.origin;
      this.showDetailDonVi(event.node.origin.id);
    }
  }

  async getDetailDiaDanh(data: any) {
    this.detailDonVi.patchValue({
      tinhThanhList : [],
      tinhThanh : null,
      quanHuyen : null,
      phuongXa : null,
    })
    if (data && data.diaDanhList && data.diaDanhList.length > 0) {
      let result = data.diaDanhList;
      if (result && result.length > 0) {
        if (data.capDvi == "2") {
          this.detailDonVi.patchValue({
          tinhThanhList : result.map(item => item.idDiaDanh)
          })
        }
        if (data.capDvi == "3") {
          let tinhThanh = result.filter(item => item.capDiaDanh == 1);
          let quanHuyen = result.filter(item => item.capDiaDanh == 2);
          let phuongXa = result.filter(item => item.capDiaDanh == 3);
          this.detailDonVi.patchValue({
            tinhThanh : tinhThanh && tinhThanh.length > 0 ? tinhThanh[0].idDiaDanh : null,
            quanHuyen : quanHuyen && quanHuyen.length > 0 ? quanHuyen[0].idDiaDanh : null,
            phuongXa : phuongXa && phuongXa.length > 0 ? phuongXa[0].idDiaDanh : null,
          })
          await this.changeTinhThanh(this.detailDonVi.value.tinhThanh)
          await this.changeQuanHuyen(this.detailDonVi.value.quanHuyen)
        }
      }
    }
  }

  showDetailDonVi(id?: any) {
    this.spinner.show();
    if (id) {
      this.donviService.getDetail(id).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.nodeDetail = res.data;
          // gán giá trị vào form
          this.levelNode = +res.data.capDvi;
          this.detailDonVi.patchValue({
            id: res.data.id,
            maDviCha: res.data.maDviCha,
            tenVietTat: res.data.tenVietTat,
            tenDvi: res.data.tenDvi,
            maDvi: res.data.maDvi,
            capDvi: res.data.capDvi,
            diaChi: res.data.diaChi,
            sdt: res.data.sdt,
            fax: res.data.fax,
            stk: res.data.stk,
            mst: res.data.mst,
            moTai: res.data.moTai,
            maTuDinhNghia: res.data.maTuDinhNghia,
            trangThai: res.data.trangThai == TrangThaiHoatDong.HOAT_DONG,
            type: res.data.type == LOAI_DON_VI.PB,
            ghiChu: res.data.ghiChu,
            vaiTro: res.data.vaiTro,
            vungMien: res.data.vungMien
          });
          this.getDetailDiaDanh(res.data);
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      });
    }
    this.spinner.hide();
  }

  showEdit(editData: boolean) {
    this.isEditData = editData;
  }

  convertListDiaDanh(): any[] {
    let arr = [];
    if (this.detailDonVi.value.capDvi == 2) {
      arr = this.detailDonVi.value.tinhThanhList;
    }
    if (this.detailDonVi.value.capDvi == 3) {
      arr.push(this.detailDonVi.value.tinhThanh);
      arr.push(this.detailDonVi.value.quanHuyen);
      arr.push(this.detailDonVi.value.phuongXa);
    }
    return arr;
  }

  setValidators() {
    if (this.detailDonVi.value.capDvi == 2) {
      this.detailDonVi.controls["tinhThanhList"].setValidators([Validators.required]);
      this.detailDonVi.controls["tinhThanh"].clearValidators();
      this.detailDonVi.controls["quanHuyen"].clearValidators();
      this.detailDonVi.controls["phuongXa"].clearValidators();
    } else if (this.detailDonVi.value.capDvi == 3) {
      this.detailDonVi.controls["tinhThanhList"].clearValidators()
      this.detailDonVi.controls["quanHuyen"].setValidators([Validators.required]);
      this.detailDonVi.controls["phuongXa"].setValidators([Validators.required]);
    } else {
      this.detailDonVi.controls["tinhThanhList"].clearValidators()
      this.detailDonVi.controls["tinhThanh"].clearValidators();
      this.detailDonVi.controls["quanHuyen"].clearValidators();
      this.detailDonVi.controls["phuongXa"].clearValidators();
    }
  }

  update() {
    this.helperService.markFormGroupTouched(this.detailDonVi);
    if (this.detailDonVi.invalid) {
      return;
    }
    let body = {
      ...this.detailDonVi.value,
      trangThai: this.detailDonVi.value.trangThai ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG,
      type: this.detailDonVi.value.type ? LOAI_DON_VI.PB : LOAI_DON_VI.DV
    };
    body.listIdDiaDanh = this.convertListDiaDanh();
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn sửa ?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.donviService.update(body).then((res: OldResponseData) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.isEditData = false;
            this.ngOnInit();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        });
      }
    });
  }

  delete(id) {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa ?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.donviService.delete({id : id}).then((res: OldResponseData) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            // xét node về không
            this.nodeSelected = [];
            this.layTatCaDonViTheoTree();
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
      nzTitle: "Thêm mới đơn vị",
      nzContent: NewDonViComponent,
      nzClosable: true,
      nzFooter: null,
      nzStyle: { top: "50px" },
      nzWidth: 900,
      nzComponentParams: { nodesTree }
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        this.ngOnInit();
      }
    });
  }

  changeTinhThanh(event) {
    if (event) {
      if (this.listAllDiaDanh && this.listAllDiaDanh.length > 0) {
        this.listQuanHuyen = this.listAllDiaDanh.filter(item => item.maCha == event && item.capDiaDanh === 2);
      }
    }
  }

  changeQuanHuyen(event) {
    if (event) {
      if (this.listAllDiaDanh && this.listAllDiaDanh.length > 0) {
        this.listPhuongXa = this.listAllDiaDanh.filter(item => item.maCha == event && item.capDiaDanh === 3);
      }
    }
  }
}
