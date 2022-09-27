import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DonviService } from 'src/app/services/donvi.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { HelperService } from 'src/app/services/helper.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import {DanhMucService} from "../../../services/danhmuc.service";
import {
  DialogDanhSachHangHoaComponent
} from "../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";
import {PAGE_SIZE_DEFAULT} from "../../../constants/config";
import {UserLogin} from "../../../models/userlogin";
import { cloneDeep } from 'lodash';
import {DanhMucDinhMucService} from "../../../services/danh-muc-dinh-muc.service";
import {DanhMucMucPhi} from "../../../models/DeXuatKeHoachuaChonNhaThau";
import {Globals} from "../../../shared/globals";



@Component({
  selector: 'app-danh-muc-dinh-muc-phi',
  templateUrl: './danh-muc-dinh-muc-phi-component.html',
  styleUrls: ['./danh-muc-dinh-muc-phi-component.scss'],
})
export class DanhMucDinhMucPhiComponent implements OnInit {
  formData: FormGroup;
  formDataChinhSua: FormGroup;
  listVthh: any[] = [];
  listDinhMuc: any[] = [];
  listLhbq: any[] = [];
  listHtBq: any[] = [];
  dataTable: any[] = [];
  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;
  dataEdit: { [key: string]: { edit: boolean; data: DanhMucMucPhi } } = {};
  searchFilter = {
    cloaiVthh: '',
    hinhThucBq: '',
    loaiDinhMuc: '',
    loaiHinhBq: '',
    loaiVthh: '',
    maDinhMuc: '',
    tenDinhMuc: '',
    str: "",
    tenCloaiVthh: "",
    tenVthh:  ""
  };

  constructor(
    private router: Router,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private danhMucDinhMucService: DanhMucDinhMucService,
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private globals : Globals
  ) {
    this.formData = this.fb.group({
      id: [null],
      cloaiVthh: [null, [Validators.required]],
      tenCloaiVthh: [null],
      hinhThucBq: [null, [Validators.required]],
      loaiDinhMuc: [null, [Validators.required]],
      loaiHinhBq: [null, [Validators.required]],
      loaiVthh: [null, [Validators.required]],
      tenVthh: [null],
      maDinhMuc: [null, [Validators.required]],
      tenDinhMuc: [null, [Validators.required]],
      trangThai: [null, [Validators.required]]
    })
    this.formDataChinhSua = this.fb.group({
      id: [null],
      cloaiVthh: [null, [Validators.required]],
      tenCloaiVthh: [null],
      hinhThucBq: [null, [Validators.required]],
      loaiDinhMuc: [null, [Validators.required]],
      loaiHinhBq: [null, [Validators.required]],
      loaiVthh: [null, [Validators.required]],
      tenVthh: [null],
      maDinhMuc: [null, [Validators.required]],
      tenDinhMuc: [null, [Validators.required]],
      trangThai: [null, [Validators.required]],
    })
  }

   ngOnInit() {
     this.search();
     this.loadDsVthh();
     this.getListDinhMuc();
     this.getListLhbq();
     this.getListHtbq();
  }
  async loadDsVthh() {
    this.listVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data;
    }
  }

  async getListDinhMuc() {
    this.listDinhMuc = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_DINH_MUC');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDinhMuc = res.data;
    }
  }
  async getListLhbq() {
    this.listLhbq = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLhbq = res.data;
    }
  }
  async getListHtbq() {
    this.listHtBq = [];
    let res = await this.danhMucService.danhMucChungGetAll('HINH_THUC_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHtBq = res.data;
    }
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        }
        this.dataEdit[index].data.tenLoaiVthh = item.tenLoaiVthh
        this.dataEdit[index].data.tencLoaiVthh = item.tencLoaiVthh
      });
    }
  }

  selectHangHoa(type, i?) {
    const modal = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        isCaseSpecial: true
      },
    });
    modal.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data, type , i);
      }
    });
  }

  async search() {
    this.spinner.show();
    let body = {
      cloaiVthh: this.searchFilter.cloaiVthh,
      hinhThucBq: this.searchFilter.hinhThucBq,
      loaiDinhMuc: this.searchFilter.loaiDinhMuc,
      loaiHinhBq: this.searchFilter.loaiHinhBq,
      loaiVthh: this.searchFilter.loaiVthh,
      maDinhMuc: this.searchFilter.maDinhMuc,
      tenDinhMuc: this.searchFilter.tenDinhMuc,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      }
    };
    let res = await this.danhMucDinhMucService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.updateEditCache()
    this.spinner.hide();
  }

  async themmoi(data?, idInput?) {
    if (idInput && data) {
      this.formDataChinhSua.patchValue({
        id: idInput,
        cloaiVthh: data.cloaiVthh ,
        tenCloaiVthh: data.tencLoaiVthh,
        hinhThucBq: data.hinhThucBq,
        loaiDinhMuc: data.loaiDinhMuc,
        loaiHinhBq:data.loaiHinhBq,
        loaiVthh: data.loaiVthh,
        tenVthh: data.tenLoaiVthh,
        maDinhMuc:data.maDinhMuc,
        tenDinhMuc:data.tenDinhMuc,
      })
      this.helperService.markFormGroupTouched(this.formDataChinhSua);
      if (this.formDataChinhSua.invalid) {
        return;
      }
    } else  {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
    }

    let body = this.formData.value
    let res
    if (idInput) {
      let body = this.formDataChinhSua.value
      res = await this.danhMucDinhMucService.update(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        this.formData.reset()
        await this.search()
        this.updateEditCache()
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } else {
      res = await this.danhMucDinhMucService.create(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.formData.reset()
        await this.search()
        this.updateEditCache()
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    }
  clearFilter() {
    this.searchFilter = {
      cloaiVthh: '',
      hinhThucBq: '',
      loaiDinhMuc: '',
      loaiHinhBq: '',
      loaiVthh: '',
      maDinhMuc: '',
      tenDinhMuc: '',
      str: "",
      tenCloaiVthh: "",
      tenVthh:  ""
    };
    this.search();
  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: { ...this.dataTable[idx] },
      edit: false,
    };
  }

  luuEdit(index: number): void {

  }

  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "cloaiVthh": this.searchFilter.cloaiVthh,
          "hinhThucBq": this.searchFilter.hinhThucBq,
          "loaiDinhMuc": this.searchFilter.loaiDinhMuc,
          "loaiHinhBq": this.searchFilter.loaiHinhBq,
          "loaiVthh": this.searchFilter.loaiVthh,
          "maDinhMuc": this.searchFilter.maDinhMuc,
          "tenDinhMuc": this.searchFilter.tenDinhMuc,
          "trangThai": ""
        }

        this.danhMucDinhMucService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-dinh-muc-phi-nhap-xuat-bao-quan.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }



  xoa() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.danhMucDinhMucService.deleteMuti({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.allChecked = false;
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  xoaItem(item: any) {
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
          this.danhMucDinhMucService.delete(item.id).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.search();
            this.spinner.hide();
          });
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }




  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
            item.checked = true;
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }

  updateSingleChecked(): void {
    if (this.dataTable.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }


  async bindingDataHangHoa(data, type , i?) {
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      if (type == "save") {
        this.formData.patchValue({
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenVthh: data.parent.ten
        })
      }
      if (type == "search") {
        this.searchFilter.cloaiVthh = data.ma;
        this.searchFilter.tenCloaiVthh = data.ten;
        this.searchFilter.loaiVthh = data.parent.ma;
        this.searchFilter.tenVthh = data.parent.ten;
      }
      if (type == "edit") {
        this.dataEdit[i].data.cloaiVthh = data.ma;
        this.dataEdit[i].data.tencLoaiVthh = data.ten;
        this.dataEdit[i].data.loaiVthh = data.parent.ma;
        this.dataEdit[i].data.tenLoaiVthh = data.parent.ten;
      }
    }
    if (data.loaiHang == "VT") {
      if (type == "save") {
        this.formData.patchValue({
          loaiVthh: data.ma,
          tenVthh: data.ten,
          cloaiVthh: null,
          tenCloaiVthh: null,
        })
      }
      if (type == "search") {
        this.searchFilter.cloaiVthh = null;
        this.searchFilter.tenCloaiVthh = null;
        this.searchFilter.loaiVthh = data.parent.ma;
        this.searchFilter.tenVthh = data.parent.ten;
      }
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
            temp.push(item)
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    }
    else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  startEdit(i: number) {
    this.dataEdit[i].edit = true;
    console.log(this.dataEdit[i].data)
  }
}
