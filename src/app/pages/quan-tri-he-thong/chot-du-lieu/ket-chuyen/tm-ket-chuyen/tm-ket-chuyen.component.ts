import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Globals} from "../../../../../shared/globals";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {MESSAGE} from "../../../../../constants/message";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NgxSpinnerService} from "ngx-spinner";
import {BcBnTt130Service} from "../../../../../services/bao-cao/BcBnTt130.service";
import {DonviService} from "../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {QthtKetChuyenService} from "../../../../../services/quantri-hethong/qthtKetChuyen.service";
import {MangLuoiKhoService} from "../../../../../services/qlnv-kho/mangLuoiKho.service";
import dayjs from "dayjs";
import {da} from "date-fns/locale";

@Component({
  selector: 'app-tm-ket-chuyen',
  templateUrl: './tm-ket-chuyen.component.html',
  styleUrls: ['./tm-ket-chuyen.component.scss']
})
export class TmKetChuyenComponent extends Base2Component implements OnInit {

  formData: FormGroup;
  listDataGroup = [];
  listDataSelected = [];
  listChildrenSaved = [];
  listChiCucSelected = [];
  danhMuc: string;

  listDvi = [];
  isViewDanhMuc: boolean = false;
  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private _service: QthtKetChuyenService,
              private donViService: DonviService,
              private danhMucService: DanhMucService,
              private _modalRef: NzModalRef,
              private mangLuoiKhoService : MangLuoiKhoService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, _service);
    this.formData = this.fb.group({
      nam : [dayjs().get("year")],
      maDvi : [null],
      ghiChu : [null]
    });
  }

  async ngOnInit() {
    this.spinner.show()
    await this.getDmDonVi();
    this.spinner.hide()
  }
  async getDmDonVi(){
    let body = {
      maDvi: this.userInfo.MA_DVI,
    };
     await this.donViService.getAllChildrenByMadvi(body).then((res)=>{
       console.log(res.data);
       if(res.data){
         let dataCuc = res.data.filter(item => item.type == 'DV');
          dataCuc.forEach( item => {
            let children = item.children?.filter(item => item.type == 'DV');
            children.forEach( c => c.children = null);
            item.children = children;
          })
         this.listDvi = dataCuc;
       }
    });
  }

  changeDvi(event?: any) {
    this.listDataGroup.forEach(item => {
      if (event.nzValue == item.danhMuc) {
        this.formData.get('maSoDvi').setValue(item.maSo)
      }
    });
  }

  onChange($event: string[]): void {
    // console.log($event);
    console.log(this.formData.value.maDvi);
  }


  onCancel() {
    this._modalRef.destroy();
  }
  async save() {
    let dsDviSelected = this.formData.value.maDvi;
    this.listChildrenSaved = [];
    this.listChiCucSelected = [];
    if(dsDviSelected && dsDviSelected.length > 0){
      this.spinner.show();

      for (const maDvi of dsDviSelected) {
        await this.addDataNganLoToSaved(maDvi);
      }
      console.log(this.listChildrenSaved);
      console.log(this.listChiCucSelected);

      let body = {
        nam : this.formData.value.nam,
        listDviSelected : this.listChiCucSelected,
        children : this.listChildrenSaved,
        tenVietTat : this.formData.value.ghiChu
      }
      if(this.listChildrenSaved == null || this.listChildrenSaved.length == 0){
        this.notification.error(MESSAGE.ERROR,"Không cớ dữ liệu kết chuyển");
        this.spinner.hide();
        return
      }
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có muôn chốt dữ liệu kết chuyển ?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          this.createUpdate(body).then((res)=>{
            if(res){
              this._modalRef.close(res);
            }
          })
        },
      });
      this.spinner.hide();
    }else{
      this.notification.error(MESSAGE.ERROR,"Vui lòng chọn đơn vị kết chuyển cuối năm");
    }
  }


  async addDataNganLoToSaved(maDvi) {
    let body2 = {
      maDvi: maDvi,
    };

    try {
      const res = await this.mangLuoiKhoService.getDetailByMa(body2);
      if (res.data && res.data.object) {
        const dataRes = res.data.object;
        // Check chi cục với cục
        // Đây là cục
        if(dataRes.maDtqgkv != null && dataRes.child && dataRes.child.length > 0){
          dataRes.child.forEach( cc => {
            // Ở dây lẫn cả chi cục lẫn phòng ban nên phải check có child ms là chi cục
            if(cc.child && cc.child.length > 0){
              this.listChiCucSelected.push(cc.maTongKho);
            }
          })
        }
        // Đây là chi cục
        if(dataRes.maTongKho != null){
          this.listChiCucSelected.push(dataRes.maTongKho);
        }
        if (dataRes.ctietHhTrongKho && dataRes.ctietHhTrongKho.length > 0) {
          this.listChildrenSaved = [...this.listChildrenSaved,...dataRes.ctietHhTrongKho];
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


}
