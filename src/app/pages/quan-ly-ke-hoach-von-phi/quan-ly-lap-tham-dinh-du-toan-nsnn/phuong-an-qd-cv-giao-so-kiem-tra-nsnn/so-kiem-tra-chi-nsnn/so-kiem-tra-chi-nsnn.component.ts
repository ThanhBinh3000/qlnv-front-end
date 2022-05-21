import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { DONVITIEN, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { TRANGTHAIBAOCAO } from '../../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';

@Component({
    selector: 'app-so-kiem-tra-chi-nsnn',
    templateUrl: './so-kiem-tra-chi-nsnn.component.html',
    styleUrls: ['./so-kiem-tra-chi-nsnn.component.scss']
})
export class SoKiemTraChiNsnnComponent implements OnInit {
    //thong tin dang nhap
    id!: any;
    userInfo: any;
    //thong tin chung bao cao
    ngayNhap: string;
    maBaoCao: string;
    soQdCv: string;
    maDviTao: string;
    maPa: string;
    maGiao: string;
    trangThai: string;
    namPa: number;
    maDviTien: any;
    newDate = new Date();
    //danh muc
    donViTiens: any[] = DONVITIEN;
    lstCTietBCao: any[];
    donVis: any[] = [];
    trangThais: any[] = TRANGTHAIBAOCAO;

    constructor(
        private userService: UserService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private spinner: NgxSpinnerService,
        private router: ActivatedRoute,
        private datepipe: DatePipe,
        private sanitizer: DomSanitizer,
        private route: Router,
        private notification: NzNotificationService,
        private location: Location,
        private danhMucService: DanhMucHDVService,
    ) { }

    async ngOnInit() {
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName); //get user info

        //lay danh sach danh muc
        this.danhMucService.dMDonVi().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        // //check param dieu huong router
        // this.maDonviNhan = this.router.snapshot.paramMap.get('maDonViNhan');
        // this.maPa = this.router.snapshot.paramMap.get('maPa');
        // let objChiTietSoTranChi = {
        //     maDviNhan: this.maDonviNhan,
        //     maPa: this.maPa
        // }
        // this.quanLyVonPhiService.getchitiettranchi(objChiTietSoTranChi).subscribe(
        //     res => {
        //         if (res.statusCode == 0) {
        //             this.listchitiet = res.data.lstCTiet;
        //             this.objChitiet = res.data;
        //             this.maDviTien = res.data.maDviTien;
        //             this.objChitiet.ngayTao = this.datepipe.transform(this.objChitiet?.ngayTao, 'dd/MM/yyyy');
        //             this.checkdata = true;
        //             if (this.listchitiet.length != 0) {
        //                 this.tongso = 0;
        //                 this.listchitiet.forEach(e => {
        //                     this.tongso += e.soDuocGiao;
        //                 });
        //             }

        //         } else {
        //             this.notification.error(MESSAGE.ERROR, res?.msg);
        //             this.checkdata = false;
        //         }
        //     },
        //     err => {
        //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        //         this.checkdata = false;
        //     },
        // );
        // this.quanLyVonPhiService.dMDonVi().toPromise().then(res => {
        //     if (res.statusCode == 0) {
        //         this.donViTaos = res.data;
        //     }
        // })
        // this.spinner.hide();
        
    }

    //get user info
    async getUserInfo(username: string) {
        await this.userService.getUserInfo(username).toPromise().then(
            (data) => {
                if (data?.statusCode == 0) {
                    this.userInfo = data?.data
                    return data?.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
    }

    redirectkehoachvonphi() {
        // this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
        this.location.back()
    }

    // //get user info
    // async getUserInfo(username: string) {
    //     let userInfo = await this.nguoiDungSerivce
    //         .getUserInfo(username)
    //         .toPromise()
    //         .then(
    //             (data) => {
    //                 if (data?.statusCode == 0) {
    //                     this.userInfor = data?.data;
    //                     return data?.data;
    //                 } else {
    //                 }
    //             },
    //             (err) => {
    //                 console.log(err);
    //             },
    //         );
    //     return userInfo;
    // }



    //lay ten don vi tạo
    getUnitName() {
        return this.donVis.find((item) => item.maDvi == this.maDviTao)?.tenDvi;
    }

    getStatusName() {
        return this.trangThais.find(e => e.id == this.trangThai)?.tenDm;
    }


}
