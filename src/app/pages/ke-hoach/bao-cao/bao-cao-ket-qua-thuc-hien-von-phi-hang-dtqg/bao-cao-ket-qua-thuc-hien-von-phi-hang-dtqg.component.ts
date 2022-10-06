import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { STORAGE_KEY } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_LIST } from './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg.constant';

@Component({
    selector: 'app-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg',
    templateUrl: './bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg.component.html',
    styleUrls: ['./bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg.component.scss'],
})
export class BaoCaoKetQuaThucHienVonPhiHangDTQGComponent implements OnInit {
    @ViewChild('nzTreeComponent', { static: false })

    //thong tin dang nhap
    userInfo: any;
    donVis: any[] = [];
    capDvi: string;


    BaoCaoKetQuaThucHienVonPhiHangDTQGList = BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_LIST;
    danhSach: any[] = [];

    constructor(
        private router: Router,
        private userService: UserService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        this.spinner.show();
        this.userInfo = this.userService.getUserLogin();
        this.BaoCaoKetQuaThucHienVonPhiHangDTQGList.forEach(data => {
            let check = false;
            data.Role.forEach(item => {
                if (this.userService.isAccessPermisson(item)) {
                    check = true;
                    return;
                }
            })
            if (check) {
                this.danhSach.push(data);
            }
        })
        this.spinner.hide();
    }

    redirectThongTinChiTieuKeHoachNam() {
        this.router.navigate([
            '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
            1,
        ]);
    }
}
