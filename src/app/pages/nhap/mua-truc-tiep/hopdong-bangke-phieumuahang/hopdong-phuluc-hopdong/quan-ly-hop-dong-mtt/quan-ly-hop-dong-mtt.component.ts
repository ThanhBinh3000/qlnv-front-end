import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { MESSAGE } from 'src/app/constants/message';
import { ChaogiaUyquyenMualeService } from 'src/app/services/chaogia-uyquyen-muale.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { MttHopDongPhuLucHdService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/MttHopDongPhuLucHdService.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { QuyetDinhPheDuyetKetQuaChaoGiaMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ket-qua-chao-gia-mtt.service';
import { StorageService } from 'src/app/services/storage.service';
import {
  QuyetDinhGiaoNvNhapHangService
} from "../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../../../../../services/user.service";
import {UserLogin} from "../../../../../../models/userlogin";
import { Globals } from 'src/app/shared/globals';
import { STATUS, STATUS_LABEL } from 'src/app/constants/status';
import {PREVIEW} from "../../../../../../constants/fileType";

@Component({
  selector: 'app-quan-ly-hop-dong-mtt',
  templateUrl: './quan-ly-hop-dong-mtt.component.html',
  styleUrls: ['./quan-ly-hop-dong-mtt.component.scss']
})
export class QuanLyHopDongMttComponent extends Base2Component implements OnInit {

  @Input() id: number;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  idQdKh: number
  idQdGnvu: number
  idHopDong: number;
  isEditHopDong: boolean
  listNguonVon: any[] = [];
  selected: boolean = false;
  selectedHd: boolean = false;
  danhSachCtiet: any[] = [];
  formData: FormGroup
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  userInfo: UserLogin;
  STATUS = STATUS
  isDetail: boolean
  tongSlChaoGia: number;
  previewName: string = '';


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    public globals: Globals,
    public userService: UserService,
    private thongTinPhuLucHopDongService: MttHopDongPhuLucHdService,
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinPhuLucHopDongService);
    this.formData = this.fb.group({
      id: [],
      namKh: [''],
      soQd: [],
      soQdKq: [],
      tenDuAn: [],
      tenDvi: [],
      tongMucDt: [],
      nguonVon: [],
      tongSoLuong: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      vat: ['5'],
      canhanTochuc: [],
      trangThaiHd: [''],
      tenTrangThaiHd: [''],
      idQdKq: [''],
      idQdGiaoNvNh: [''],
    });
  }

  async ngOnInit() {
    this.previewName = this.userService.isChiCuc() ? 'nhap_truc_tiep_hop_dong_chicuc' : 'nhap_truc_tiep_hop_dong_cuc'
    this.userInfo = this.userService.getUserLogin();
    this.dataTable = []
    await this.spinner.show()
    await Promise.all([
    ]);
    if (this.id && !this.userService.isChiCuc()) {
      await this.getDetail(this.id)
    }
    if (this.id && this.userService.isChiCuc()) {
      await this.getDetailChiCuc(this.id)
    }
    this.initForm();
    await Promise.all([
      this.loadDataComboBox(),
    ]);
    await this.spinner.hide()
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
    })
  }

  async getDetail(id) {
    if (id) {
      let res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        await this.quyetDinhPheDuyetKeHoachMTTService.getDetailDtlCuc(data.idPdKhDtl).then(dataTtin => {
          console.log(dataTtin, "ql hd")
          this.formData.patchValue({
            namKh: data.namKh,
            soQd: dataTtin.data?.soQd,
            soQdKq: data.soQdKq,
            tenDuAn: dataTtin.data?.tenDuAn,
            tongMucDt: dataTtin.data?.tongMucDt,
            nguonVon: dataTtin.data?.nguonVon,
            tongSoLuong: dataTtin.data?.tongSoLuong * 1000,
            tenLoaiVthh: dataTtin.data?.tenLoaiVthh,
            tenCloaiVthh: dataTtin.data?.tenCloaiVthh,
            trangThaiHd: data.trangThaiHd,
            idQdKq: data.id,
            tenTrangThaiHd: data.tenTrangThaiHd

          })
          this.danhSachCtiet = res.data.danhSachCtiet;
          this.tongSlChaoGia = 0;
          this.danhSachCtiet.forEach(item =>{
            this.dataTable.push(...item.listHdong)
            this.tongSlChaoGia += item.listChaoGia.length
          })
          this.formData.get('canhanTochuc').setValue(this.dataTable.length);
          // this.showDetail(event, this.danhSachCtiet[0])
          this.showDetailHd(event, this.dataTable[0])
        });
      }else {
        await this.getDetailChiCuc(id)
      }
    }
  }

  async getDetailChiCuc(id) {
    if (id) {
      let res = await this.quyetDinhGiaoNvNhapHangService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        console.log(res.data, 876)
        this.dataTable = []
          this.formData.patchValue({
            namKh: res.data.hhQdPheduyetKhMttHdr.namKh,
            soQd: res.data.hhQdPheduyetKhMttHdr.soQd,
            tenDuAn: res.data.hhQdPheduyetKhMttHdr.tenDuAn,
            tongMucDt: res.data.tongMucDt,
            nguonVon: res.data.nguonVon,
            tongSoLuong: res.data.hopDongMttHdrs.reduce((prev, cur) => {
              prev += cur.soLuong;
              return prev;
            }, 0),
            tenLoaiVthh: res.data.tenLoaiVthh,
            tenCloaiVthh: res.data.tenCloaiVthh,
            trangThaiHd: res.data?.trangThaiHd,
            tenTrangThaiHd: res.data?.tenTrangThaiHd,
            idQdGiaoNvNh: res.data.id
          })
        console.log(this.formData.value)
        this.idQdKh = res.data.idQdPdKh
        this.idQdGnvu = res.data.id
        let dsHd = res.data.hopDongMttHdrs.filter(x => x.maDvi.includes(this.userInfo.MA_DVI))
        this.dataTable.push(...dsHd)
        this.showDetailHd(event, this.dataTable[0])
      }
    }
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
  }

  async getDetailHopDong($event, id: number) {
    this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    this.idHopDong = id;
    this.spinner.hide();

    await this.thongTinPhuLucHopDongService.getDetail(this.idHopDong)
      .then(async (res) => {
        const dataDtl = res.data;
        this.formData.patchValue({
          thanhTien: dataDtl.thanhTien,
          tongSoLuongQdKh: dataDtl.tongSoLuongQdKh,
          tongSoLuongQdKhDaky: dataDtl.tongSoLuongQdKhDaky,
          tongSoLuongQdKhChuaky: dataDtl.tongSoLuongQdKhChuaky,
        })

      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  async redirectHopDong(isShowHd: boolean, id: number) {
    this.isEditHopDong = isShowHd;
    this.idHopDong = id;
    debugger
    if (!isShowHd) {
      if(!this.userService.isChiCuc()){
        await this.ngOnInit()
      }else{
        await this.getDetailChiCuc(this.idQdGnvu)
      }
    }
  }

  validateListHopDong(){
    if(this.dataTable.filter(x => x.trangThai == STATUS.DU_THAO).length > 0){
      return true
    }else{
      return false
    }
  }

  pheDuyet() {
    if(this.validateListHopDong()){
      this.notification.error(MESSAGE.ERROR, 'Vui lòng thêm các hợp đồng cho các đơn vị cung cấp');
      return;
    }else{
      let trangThai = STATUS.DA_HOAN_THANH
      let mesg = 'Bạn có muốn hoàn thành ?'
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: mesg,
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = null
            if(!this.userService.isChiCuc()){
              let body = {
                id: this.id,
                lyDoTuChoi: null,
                trangThai: trangThai,
              };
              res =
                await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.approve(
                  body,
                );
            }else{
              let body = {
                id: this.idQdKh,
                lyDoTuChoi: null,
                trangThai: trangThai,
              };
              res =
                await this.quyetDinhPheDuyetKeHoachMTTService.approve(
                  body,
                );
            }

            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
              this.goBack()
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

  validateData(): boolean {
    let result = true;
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(item => {
        if (item) {
          if (item.trangThai != STATUS.DA_KY) {
            this.notification.error(MESSAGE.ERROR, "Vui lòng ký tất cả hợp đồng cho các gói thầu");
            result = false;
            return
          }
        }
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng thêm hợp đồng");
      result = false;
      return
    }
    return result;
  }

  calcTong() {
    if (this.danhSachCtiet) {
      const sum = this.danhSachCtiet.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      return sum;
    }
  }
  idRowSelect: number;
  // async showDetail($event, data: any) {
  //   await this.spinner.show();
  //   if ($event.type == "click") {
  //     this.selected = false;
  //     $event.target.parentElement.parentElement.querySelector(".selectedRow")?.classList.remove("selectedRow");
  //     $event.target.parentElement.classList.add("selectedRow");
  //   } else {
  //     this.selected = true;
  //   }
  //   this.idRowSelect = data.id;
  //   this.dataTable = data.listHdong;
  //   this.showDetailHd($event, this.dataTable[0])
  //   await this.spinner.hide();
  // }

  async showDetailHd($event, data: any) {
    await this.spinner.show();
    if ($event.type == "click") {
      this.selectedHd = false;
      $event.target.parentElement.parentElement.querySelector(".selectedRow")?.classList.remove("selectedRow");
      $event.target.parentElement.classList.add("selectedRow");
    } else {
      this.selectedHd = true;
    }
    this.idHopDong = data.id;
    await this.spinner.hide();
  }

  async deleteHd(data) {
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
            id: data.id
          };
          this.thongTinPhuLucHopDongService.delete(body).then(async () => {
            await this.getDetail(this.id);
            await this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
  goBack() {
    this.showListEvent.emit();
  }

  // showList(idHopDong: number) {
  //   this.isDetail = false;
  //   this.getDetail(idHopDong);
  //   this.showListEvent.emit();
  // }

  // async preview(fileName: string): Promise<void> {
  //   if (this.loaiVthh.startsWith('02')) {
  //     this.previewName = 'thong_tin_hop_dong_vt'
  //   } else {
  //     this.previewName = 'thong_tin_hop_dong_lt'
  //   }
  //   this.reportTemplate.fileName = this.previewName + '.docx';
  //   let body = {
  //     id: id,
  //     reportTemplateRequest: this.reportTemplate
  //   }
  // }

  async preview(id: string) {
    this.reportTemplate.fileName = this.previewName + '.docx';
      let body = {
        id: id,
        reportTemplateRequest: this.reportTemplate
      }
    await this.thongTinPhuLucHopDongService.preview(body).then(async s => {
      if (s.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
        this.printSrc = s.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.info(MESSAGE.NOTIFICATION, MESSAGE.TEMPLATE_NULL);
      }

    });
  }

}
