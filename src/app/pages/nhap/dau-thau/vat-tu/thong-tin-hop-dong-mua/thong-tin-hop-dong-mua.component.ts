import {
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DialogThongTinPhuLucHopDongMuaVatTuComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-hop-dong-mua-vat-tu/dialog-thong-tin-phu-luc-hop-dong-mua-vat-tu.component';
import { DialogThongTinPhuLucHopDongMuaComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-hop-dong-mua/dialog-thong-tin-phu-luc-hop-dong-mua.component';

interface ItemData {
  id: string;
  stt: string;
  cuc: string;
  soGoiThau: string;
  soDeXuat: string;
  ngayDeXuat: string;
  tenDuAn: string;
  soLuong: string;
  tongTien: string;
}
@Component({
  selector: 'thong-tin-hop-dong-mua',
  templateUrl: './thong-tin-hop-dong-mua.component.html',
  styleUrls: ['./thong-tin-hop-dong-mua.component.scss'],
})
export class ThongTinHopDongMuaComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soDeXuat: '',
  };
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  formData: FormGroup;
  id: number;
  editId: string | null = null;
  listOfData: any[] = [{
    tenGoiThau: 'aaa'
  }];
  selectedCanCu: any = {};

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
    this.id = +this.routerActive.snapshot.paramMap.get('id');
  }

  openDialogQuyetDinhGiaoChiTieu() {
    if (this.id == 0) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
        },
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          this.selectedCanCu = data;
        }
      });
    }
  }

  openChiTietGoiThau(data: any) {
    const modalQD = this.modal.create({
      nzTitle: 'thông tin chi tiết gói thầu',
      nzContent: DialogThongTinPhuLucHopDongMuaVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.selectedCanCu = data;
      }
    });
  }

  tongHopDeXuatTuCuc(id: string): void {
    this.router.navigate([`/nhap/dau-thau/luong-dau-thau-gao/thong-tin-chung-phuong-an-trinh-tong-cuc/`, id])
  }

  back() {
    this.router.navigate([`/nhap/dau-thau/luong-dau-thau-gao`])
  }
}
