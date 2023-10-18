import {Component, Input, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {MmHopDongCt} from "../../../may-moc-thiet-bi/mm-hop-dong/mm-thong-tin-hop-dong/mm-thong-tin-hop-dong.component";
import {
  MmBbGiaoNhanCt
} from "../../../may-moc-thiet-bi/mm-bien-ban-giao-nhan/mm-them-moi-bb-giao-nhan/mm-them-moi-bb-giao-nhan.component";
import {DialogPvcBbGiaoNhanComponent} from "./dialog-pvc-bb-giao-nhan/dialog-pvc-bb-giao-nhan.component";
import {
  BienBanGiaoNhanPvcService
} from "../../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/bien-ban-giao-nhan-pvc.service";
import {HopDongPvcService} from "../../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/hop-dong-pvc.service";

@Component({
  selector: 'app-them-moi-bien-ban-pvc',
  templateUrl: './them-moi-bien-ban-pvc.component.html',
  styleUrls: ['./them-moi-bien-ban-pvc.component.scss']
})
export class ThemMoiBienBanPvcComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;

  rowItem: MmHopDongCt = new MmHopDongCt();
  rowItemBg: MmBbGiaoNhanCt = new MmBbGiaoNhanCt();
  rowItemBn: MmBbGiaoNhanCt = new MmBbGiaoNhanCt();
  dataEditBg: { [key: string]: { edit: boolean; data: MmBbGiaoNhanCt } } = {};
  dataEditBn: { [key: string]: { edit: boolean; data: MmBbGiaoNhanCt } } = {};
  dataEdit: { [key: string]: { edit: boolean; data: MmHopDongCt } } = {};
  listHopDong: any[] = []
  listHangHoa: any[] = []
  tableBenGiao: any[] = []
  tableBenNhan: any[] = []
  maBb: string


  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanSv: BienBanGiaoNhanPvcService,
    private hopDongService: HopDongPvcService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      soBienBan: [null, Validators.required],
      diaDiemGiaoNhan: [null],
      namKeHoach: [dayjs().get('year'), Validators.required],
      soHopDong: [null, Validators.required],
      ngayGiaoNhan: [null, Validators.required],
      benGiaoHang: [null, Validators.required],
      benNhanHang: [null, Validators.required],
      quyCachChatLuong: [null],
      noiDungKhac: [null],
      listQlDinhMucBbGnLoaiHh: [null],
      listQlDinhMucPvcBbGnDaiDienBenNhan: [null],
      listQlDinhMucPvcBbGnDaiDienBenGiao: [null],
      trangThai: ['78'],
      tenTrangThai: ['Đang nhập dữ liệu'],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maBb = `/${this.formData.value.namKeHoach}/BBGN-` + this.userInfo.DON_VI.tenVietTat;
      this.loadDsHopDong();
      if (this.id > 0) {
        this.detail(this.id)
      } else {
        this.initForm()
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    console.log(this.userInfo)
    this.formData.patchValue({
      diaDiemGiaoNhan: this.userInfo.DON_VI.diaChi,
      benNhanHang: this.userInfo.TEN_DVI
    })
    await this.getMaDanhSach()
  }

  async getMaDanhSach() {
    let id = await this.userService.getId('QL_DINH_MUC_PVC_BB_GN_SEQ')
    this.formData.patchValue({
      soBienBan: id
    })
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.bienBanSv.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.chagneHopDong(data.soHopDong)
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.listFileDinhKems;
          this.formData.patchValue({
            soBienBan: this.formData.value.soBienBan ? this.formData.value.soBienBan.split('/')[0] : null
          })
          this.dataTable = data.listQlDinhMucPvcBbGnLoaiHh;
          this.tableBenNhan = data.listQlDinhMucPvcBbGnDaiDienBenNhan;
          this.tableBenGiao = data.listQlDinhMucPvcBbGnDaiDienBenGiao;
          this.updateEditCache()
          this.updateEditCacheBgBn('benGiao')
          this.updateEditCacheBgBn('benNhan')
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    this.formData.value.listQlDinhMucBbGnLoaiHh = this.dataTable;
    this.formData.value.listQlDinhMucPvcBbGnDaiDienBenGiao = this.tableBenGiao;
    this.formData.value.listQlDinhMucPvcBbGnDaiDienBenNhan = this.tableBenNhan;
    this.formData.value.maDvi = this.userInfo.MA_DVI
    let body = this.formData.value;
    body.soBienBan = body.soBienBan + this.maBb
    body.fileDinhKems = this.fileDinhKem
    let data = await this.createUpdate(body);
    this.id = data.id;
    if(isGuiDuyet){
      await this.pheDuyet();
    }
    if (data && !isGuiDuyet) {
      this.goBack()
    }
  }

  async pheDuyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.DANG_NHAP_DU_LIEU :
      case STATUS.TUCHOI_CB_CUC : {
        trangThai = STATUS.DA_KY;
        break;
      }
      case STATUS.DA_KY : {
        trangThai = STATUS.DADUYET_CB_CUC
      }
    }
    await this.approve(this.id, trangThai, 'Bạn có chắc chắn muốn duyệt?')
  }


  xoaItem(index: number) {
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
          this.dataTable.splice(index, 1);
          this.updateEditCache()
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async loadDsHopDong() {
    this.spinner.show();
    try {
      let body = {
        "loai": "00",
        "paggingReq": {
          "limit": 10,
          "page": 0
        },
        "capDvi": this.userInfo.CAP_DVI,
        "maDvi": this.userInfo.MA_DVI,
      }
      let res = await this.hopDongService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listHopDong = data.content;
        if (this.listHopDong) {
          this.listHopDong = this.listHopDong.filter(item => item.trangThai == this.STATUS.DA_KY)
        }
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async chonHopDong() {
    if (!this.isView) {
      let modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH MUA SẮM',
        nzContent: DialogPvcBbGiaoNhanComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listHopDong,
          dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Số QĐ mua sắm', 'Giá trị'],
          dataColumn: ['soHopDong', 'tenHopDong', 'soQdpdKhMuaSam', 'giaTri'],
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            soHopDong: data.soHopDong
          })
          this.chagneHopDong(data.soHopDong)
        }
      })
    }
  }

  async chagneHopDong(soHd) {
    let filter = this.listHopDong.filter(item => item.soHopDong = soHd)
    if (filter && filter.length > 0) {
      let res = await this.hopDongService.getDetail(filter[0].id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.formData.patchValue({
            benGiaoHang: data.banTenDvi
          })
          this.listHangHoa = data.listQlDinhMucPvcHdLoaiHh;
          const ddNh : any[] = data.listQlDinhMucPvcHdDiaDiemNh;
          if (this.listHangHoa && this.listHangHoa.length > 0) {
            this.listHangHoa.forEach(item => {
              item.id = null;
              if (ddNh && ddNh.length > 0) {
                let detailDdnh = ddNh.find(data => data.maDvi == this.userInfo.MA_DVI);
                if (detailDdnh) {
                  item.soLuong  = detailDdnh.soLuong
                }
              }
            })
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg)
      }
    }
  }

  changHangHoa(event, type?: any) {
    let result = this.listHangHoa.filter(item => item.maHangHoa === event)
    if (result && result.length > 0) {
      if (type) {
        type.tenHangHoa = result[0].tenHangHoa;
        type.donViTinh = result[0].donViTinh;
        type.soLuong = result[0].soLuong;
        type.donGia = result[0].donGia;
      } else {
        this.rowItem.tenHangHoa = result[0].tenHangHoa;
        this.rowItem.donViTinh = result[0].donViTinh;
        this.rowItem.soLuong = result[0].soLuong;
        this.rowItem.donGia = result[0].donGia;
      }
    }
  }


  async themMoiCtiet() {
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.checkExitsData(this.rowItem, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Dữ liệu trùng lặp, đề nghị nhập lại.");
      this.spinner.hide();
      return;
    }
    this.rowItem.id = null
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new MmHopDongCt();
    this.updateEditCache();
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.maHangHoa == item.maHangHoa) {
          rs = true;
          return;
        }
      })
    }
    return rs;
  }

  required(item: MmHopDongCt) {
    let msgRequired = '';
    //validator
    if (!item.maHangHoa) {
      msgRequired = "Loại tài sản không được để trống";
    } else if (!item.soLuong) {
      msgRequired = "Số lượng không được để trống";
    }
    return msgRequired;
  }

  updateEditCache() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  refresh() {
    this.rowItem = new MmHopDongCt();
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: {...this.dataTable[stt]},
      edit: false
    };
  }

  async saveEdit(idx: number) {
    let msgRequired = this.required(this.dataEdit[idx].data)
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.dataEdit[idx].edit = false;
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.updateEditCache();
  }

  deleteItem(index: any) {
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
          this.dataTable.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  themMoiBgBn(type) {
    if (type == 'benGiao') {
      this.rowItemBg.loai = 'GIAO'
      this.rowItemBg.id = null
      this.tableBenGiao = [...this.tableBenGiao, this.rowItemBg];
      this.rowItemBg = new MmBbGiaoNhanCt();
      this.updateEditCacheBgBn(type);
    } else {
      this.rowItemBn.loai = 'NHAN '
      this.rowItemBn.id = null
      this.tableBenNhan = [...this.tableBenNhan, this.rowItemBn];
      this.rowItemBn = new MmBbGiaoNhanCt();
      this.updateEditCacheBgBn(type);
    }
  }

  updateEditCacheBgBn(type) {
    if (type == 'benGiao') {
      if (this.tableBenGiao) {
        this.tableBenGiao.forEach((item, index) => {
          this.dataEditBg[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    } else {
      if (this.tableBenNhan) {
        this.tableBenNhan.forEach((item, index) => {
          this.dataEditBn[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    }
  }

  refreshBgBn(type) {
    if (type == 'benGiao') {
      this.rowItemBg = new MmBbGiaoNhanCt();
    } else {
      this.rowItemBn = new MmBbGiaoNhanCt();
    }
  }

  editRowBgBn(stt: number, type) {
    if (type == 'benGiao') {
      this.dataEditBg[stt].edit = true;
    } else {
      this.dataEditBn[stt].edit = true;
    }
  }

  cancelEditBgBn(stt: number, type): void {
    if (type == 'benGiao') {
      this.dataEditBg[stt] = {
        data: {...this.tableBenGiao[stt]},
        edit: false
      };
    } else {
      this.dataEditBn[stt] = {
        data: {...this.tableBenNhan[stt]},
        edit: false
      };
    }
  }

  async saveEditBgBn(idx: number, type) {
    if (type == 'benGiao') {
      this.dataEditBg[idx].edit = false;
      Object.assign(this.tableBenGiao[idx], this.dataEditBg[idx].data);
      this.updateEditCacheBgBn(type);
    } else {
      this.dataEditBn[idx].edit = false;
      Object.assign(this.tableBenNhan[idx], this.dataEditBn[idx].data);
      this.updateEditCacheBgBn(type);
    }

  }

  deleteItemBgBn(index: any, type) {
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
          if (type == 'benGiao') {
            this.tableBenGiao.splice(index, 1);
            this.updateEditCacheBgBn(type);
          } else {
            this.tableBenNhan.splice(index, 1);
            this.updateEditCacheBgBn(type);
          }
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }
}
