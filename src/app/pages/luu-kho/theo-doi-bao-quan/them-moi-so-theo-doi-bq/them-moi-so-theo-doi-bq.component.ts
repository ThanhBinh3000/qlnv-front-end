
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {STATUS} from "../../../../constants/status";
import dayjs from "dayjs";
import {UserLogin} from "../../../../models/userlogin";
import {MESSAGE} from "../../../../constants/message";
import {DANH_MUC_LEVEL} from "../../luu-kho.constant";
import {DonviService} from "../../../../services/donvi.service";
import {TheoDoiBqService} from "../../../../services/luu-kho/theo-doi-bq.service";
import {DialogTuChoiComponent} from "../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {BangKeNhapScService} from "../../../../services/sua-chua/bangKeNhapSc.service";
import {PhieuNhapKhoScService} from "../../../../services/sua-chua/phieuNhapKhoSc.service";
import {QuyetDinhNhService} from "../../../../services/sua-chua/quyetDinhNh.service";
import {
  DialogTableSelectionComponent
} from "../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {convertTienTobangChu} from "../../../../shared/commonFunction";
import {Base3Component} from "../../../../components/base3/base3.component";
import { cloneDeep, chain } from 'lodash';
import {QuanLySoKhoTheKhoService} from "../../../../services/quan-ly-so-kho-the-kho.service";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {ThemmoiThComponent} from "../../../sua-chua/tong-hop/themmoi-th/themmoi-th.component";
import {ThemMoiCtietTdbqComponent} from "./them-moi-ctiet-tdbq/them-moi-ctiet-tdbq.component";
import {TheoDoiBqDtlService} from "../../../../services/luu-kho/theoDoiBqDtl.service";
import {QuanLyHangTrongKhoService} from "../../../../services/quanLyHangTrongKho.service";

@Component({
  selector: 'app-them-moi-so-theo-doi-bq',
  templateUrl: './them-moi-so-theo-doi-bq.component.html',
  styleUrls: ['./them-moi-so-theo-doi-bq.component.scss']
})
export class ThemMoiSoTheoDoiBqComponent extends Base3Component implements OnInit {

  rowItem: any = {};

  listPhuongThucBaoQuan : any[] = []
  listHinhThucBaoQuan : any[] = []
  monthFormat = 'MM/yyyy'
  monthSelect = new Date().getDate() >= 25 ? new Date(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate()) : new Date();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private theoDoiBqService: TheoDoiBqService,
    private theoDoiBqDtlService: TheoDoiBqDtlService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
    private danhMucService : DanhMucService,
    private quanLyHangTrongKhoService : QuanLyHangTrongKhoService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, theoDoiBqService);
    this.defaultURL = 'luu-kho/theo-doi-bao-quan'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      trangThai: ['00'],
      trangThaiSoKho: [null],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().year(), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      tenKtv: [''],
      soSoTdbq: ['', [Validators.required]],
      tenSoTdbq: ['', [Validators.required]],
      soKho: ['', [Validators.required]],
      idSoKho: ['', [Validators.required]],
      ngayLapSoKho: ['', [Validators.required]],
      maDiemKho : [''],
      tenDiemKho: ['',],
      maNhaKho : [''],
      tenNhaKho: ['',],
      maNganKho : [''],
      tenNganKho: ['',],
      maLoKho : [''],
      tenLoKho: ['',],
      tenThuKho : [''],
      loaiVthh : [''],
      tenLoaiVthh: [''],
      cloaiVthh : [''],
      tenCloaiVthh: [''],
      tenHangHoa : [''],
      soLuong: [''],
      dviTinh: [''],
      ngayNhapDayKho: [''],
      ngayNhapTu: [''],
      ngayNhapDen: [''],
      quyCach: [''],
      thoiHanLk: [''],
      thoiHanBh: [''],
      ngayHetHanLk: [''],
      ngayHetHanBh: [''],
      pthucBquan: [''],
      hthucBquan: [''],
      lyDoTuChoi: ['']
    });
    // this.formData.controls.cloaiVthh.valueChanges.subscribe(value => {
    //     this.loadDataComboBox();
    // });
  };

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.getId(),
      await this.initForm()
    ]);
    this.spinner.hide();
  }

  async initForm() {
    if (this.id) {
      this.spinner.show();
      await this.detail(this.id).then((res) => {
        this.spinner.hide();
        if (res) {
          this.changeMonth(this.monthSelect)
          this.loadDataComboBox();
          this.bindingDataSoKho(res.idSoKho);
        }
      })
    } else {
      await this.userService.getId("LK_THEO_DOI_BAO_QUAN_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soSoTdbq: res + '/' + this.formData.value.nam + '/STDBQ-CCDTVT',
          tenDvi: this.userInfo.TEN_DVI,
          tenKtv: this.userInfo.TEN_DAY_DU
        })
      });
    }
  }

  async loadDataComboBox() {
    if (this.formData.value.cloaiVthh) {
      let res = await this.danhMucService.getDetail(this.formData.value.cloaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
        this.listHinhThucBaoQuan = res.data?.loaiHinhBq
        this.formData.patchValue({
          thoiHanLk : res.data.thoiHanLk,
          thoiHanBh : res.data.thoiHanBh
        })
      }
    }else{
      if (this.formData.value.loaiVthh) {
        let res = await this.danhMucService.getDetail(this.formData.value.loaiVthh);
        if (res.msg == MESSAGE.SUCCESS) {
          this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
          this.listHinhThucBaoQuan = res.data?.loaiHinhBq
        }
        this.formData.patchValue({
          thoiHanLk : res.data.thoiHanLk,
          thoiHanBh : res.data.thoiHanBh
        })
      }
    }
  }


  openDialogDanhSach() {
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.quanLySoKhoTheKhoService.getDsTaoSoTheoDoiBaoQuan({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayNhap = item.thoiHanNhap;
          item.ngayXuat = item.thoiHanXuat;
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách sổ kho',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Sổ kho', 'Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
            dataColumn: ['ten', 'tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.bindingDataSoKho(data.id)
          }
        });
      }
    })
  }

  async bindingDataSoKho(id) {
    this.spinner.show();
    await this.quanLySoKhoTheKhoService.getDetail(id).then(async (res) => {
      if (res.data) {
        const data = res.data
        this.formData.patchValue({
          soKho: data.ten,
          idSoKho: data.id,
          ngayLapSoKho: data.ngayTao,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tenHangHoa: data.tenHangHoa,
          soLuong: data.slTon,
          dviTinh: data.donViTinh,
          tenThuKho : data.nguoiLap,
        })
        await this.loadDataComboBox();
        // this.loadThongTinKho(data.maLoKho ? data.maLoKho : data.maNganKho);
      }
      this.spinner.hide();
    });
  }


  async loadThongTinKho(maDiaDiem){
    this.quanLyHangTrongKhoService.getTrangThaiHt({maDvi : maDiaDiem}).then((res)=>{
      if(res.data && res.data.length > 0){
        const data = res.data[0];
        let date = new Date(data.ngayNhapDayKho);
        let date2 = new Date(data.ngayNhapDayKho);
        const dateHetHanLk = new Date(date.setMonth(date.getMonth()+this.formData.value.thoiHanLk));
        const dateHetHanBh = new Date(date2.setMonth(date2.getMonth()+this.formData.value.thoiHanBh));
        this.formData.patchValue({
          ngayNhapDayKho : data.ngayNhapDayKho,
          ngayNhapTu : data.thoiGianNhapDayTu,
          ngayNhapDen : data.thoiGianNhapDayDen,
          ngayHetHanLk : dateHetHanLk,
          ngayHetHanBh : dateHetHanBh
        })
      }
    })
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_KT || trangThai == STATUS.TU_CHOI_LDCC) && this.isAccessPermisson('LKQLCL_TDBQ_THEM') ;
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    let body = this.formData.value;
    body.children = this.dataTable;
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.pheDuyet();
        } else {
          this.redirectDefault();
        }
      }
    })
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_KT :
      case STATUS.TU_CHOI_LDCC :
      case STATUS.DU_THAO :
        trangThai = STATUS.CHO_DUYET_KT;
        break;
      case STATUS.CHO_DUYET_KT :
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      case STATUS.CHO_DUYET_LDCC :
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
    }
    this.approve(this.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_KT :
        trangThai = STATUS.TU_CHOI_KT;
        break;
      case STATUS.CHO_DUYET_LDCC :
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
    }
    this.reject(this.id, trangThai);
  }

  disabled() {
    return this.formData.value.trangThai != STATUS.DU_THAO && this.formData.value.trangThai != STATUS.TU_CHOI_KT && this.formData.value.trangThai != STATUS.TU_CHOI_LDCC;
  }

  isShowEditDelete(item) {
    return item.ngayKtra == dayjs().format('YYYY-MM-DD') && item.idNguoiKtra == this.userInfo.ID && item.trangThai == this.STATUS.DU_THAO && this.formData.value.trangThaiSoKho != STATUS.DA_DONG;;
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.CHO_DUYET_KT && this.isAccessPermisson('LKQLCL_TDBQ_DUYET_KT'))
      || (trangThai == STATUS.CHO_DUYET_LDCC && this.isAccessPermisson('LKQLCL_TDBQ_DUYET_LDCC'));
  }
  addRow() {

  }

  deleteRow(item,i: number): void {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.theoDoiBqDtlService.delete(body).then(async (res) => {
            this.spinner.hide();
            if (res.msg == MESSAGE.SUCCESS) {
              this.dataTable = this.dataTable.filter((d, index) => index !== i);
              this.notification.success(MESSAGE.SUCCESS,MESSAGE.DELETE_SUCCESS);
            }else{
              this.notification.error(MESSAGE.ERROR,res.msg);
            }
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  editRow(item){
    if(item){
      const date1 = new Date();
      const date2 = new Date(this.formData.value.ngayHetHanBh);
      // @ts-ignore
      const timeDiffInMilliseconds = Math.abs(date2 - date1);
      const daysDiff = Math.ceil(timeDiffInMilliseconds / (1000 * 60 * 60 * 24));
      const modalGT = this.modal.create({
        nzTitle: 'Thông tin chi tiết',
        nzContent: ThemMoiCtietTdbqComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '1500px',
        nzFooter: null,
        nzComponentParams: {
          id : item.id,
          isXacNhan : item.vaiTro == 'LDCHICUC' || item.vaiTro == 'LDCUC',
          dataTk : item.dataTk,
          dataKtv : item.dataKtv,
          dataLdcc : item.dataLdcc,
          thoiGianConLaiBh : daysDiff,
        },
      })
      modalGT.afterClose.subscribe((data)=>{
        this.changeMonth(this.monthSelect)
      });
    }
  }

  changeMonth(event) {
    if (event) {
      console.log(event)
      this.spinner.show();
      let body = {
        idHdr : this.id,
        monthSearch : event,
        detail : true
      }
      this.theoDoiBqDtlService.search(body).then((res)=>{
        this.spinner.hide();
        if(res.msg == MESSAGE.SUCCESS){
            this.dataTable = res.data;
          }
      });
    }
  }

  themMoiCtiet($event,isXacNhan?:boolean){
    $event.stopPropagation()
    if(isXacNhan && this.dataTable.length == 0){
        this.notification.error(MESSAGE.ERROR,"Không thể xác nhận khi chưa có danh sách chi tiết");
        return;
    }
    let dataTk
    let dataKtv
    let dataLdcc
    if(isXacNhan){
      dataTk = this.dataTable.filter(item => item.vaiTro == 'CBTHUKHO').sort((a,b)=>a.ngayKtra-b.ngayKtra);
      dataKtv = this.dataTable.filter(item => item.vaiTro == 'CBKTVBQ').sort((a,b)=>a.ngayKtra-b.ngayKtra);
      dataLdcc = this.dataTable.filter(item => item.vaiTro == 'LDCHICUC').sort((a,b)=>a.ngayKtra-b.ngayKtra);
    }
    const date1 = new Date();
    const date2 = new Date(this.formData.value.ngayHetHanBh);
    // @ts-ignore
    const timeDiffInMilliseconds = Math.abs(date2 - date1);
    const daysDiff = Math.ceil(timeDiffInMilliseconds / (1000 * 60 * 60 * 24));
    const modalGT = this.modal.create({
      nzTitle: 'Thông tin chi tiết',
      nzContent: ThemMoiCtietTdbqComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        dataHdr : this.formData.value,
        isXacNhan : isXacNhan,
        dataTk : dataTk?.length > 0 ? dataTk[0] : null,
        dataKtv : dataKtv?.length > 0 ? dataKtv[0] : null,
        dataLdcc : dataLdcc?.length > 0 ? dataLdcc[0] : null,
        thoiGianConLaiBh : daysDiff
      },
    });
    modalGT.afterClose.subscribe((data)=>{
        this.changeMonth(this.monthSelect)
    })
  }
}
