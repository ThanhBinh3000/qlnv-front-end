import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { Cvmb, Report, ThanhToan } from '../../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { Tab } from '../../von-mua-von-ung.constant';

@Component({
    selector: 'dialog-tao-moi-thanh-toan',
    templateUrl: './dialog-tao-moi-thanh-toan.component.html',
    styleUrls: ['../../von-mua-von-ung.component.scss'],
})

export class DialogTaoMoiThanhToanComponent implements OnInit {
    @Input() request: any;

    userInfo: any;
    response: Report = new Report();
    canCuGias: any[] = [];
    loaiDns: any[] = [];
    donVis: any[];
    lstNam: number[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.response.maLoai = this.request.maLoai;
        if (this.userService.isChiCuc()) {
            this.canCuGias = Cvmb.CAN_CU_GIA.filter(e => e.id == Cvmb.DON_GIA);
            this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id == Cvmb.THOC);
        } else if (this.userService.isTongCuc()) {
            this.canCuGias = Cvmb.CAN_CU_GIA.filter(e => e.id == Cvmb.HOP_DONG);
            this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id == Cvmb.VTU);
        } else {
            this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id != Cvmb.VTU);
        }

        this.lstNam = Utils.getListYear(5, 10);
    }

    changeModel() {
        if (this.userService.isCuc()) {
            this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id != Cvmb.VTU);
            if (this.response.canCuVeGia == Cvmb.DON_GIA) {
                this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id == Cvmb.THOC);
            } else {
                this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id == Cvmb.GAO || e.id == Cvmb.MUOI);
            }
        }
    }

    async checkReport() {
        if (!this.response.namDnghi || !this.response.canCuVeGia || this.response.loaiDeNghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.request.namDnghi = this.response.namDnghi;
        this.request.canCuVeGia = this.response.canCuVeGia;
        this.request.loaiDnghi = this.response.loaiDeNghi;
        this.spinner.show();
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(this.request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    let initItem = new Report();
                    let lstBcao = [];
                    if (data.data.content?.length > 0) {
                        lstBcao = data.data.content;
                        lstBcao.sort((a, b) => b.dot - a.dot);
                        if ([Status.TT_02, Status.TT_04, Status.TT_01].includes(lstBcao[0].trangThai)) {
                            this.notification.warning(MESSAGE.WARNING, 'Trạng thái của đợt trước không cho phép tạo mới!')
                            this.response.loaiDeNghi = null;
                            return;
                        } else {
                            const index = lstBcao.findIndex(e => !Status.check('reject', e.trangThai));
                            if (index != -1) {
                                Object.assign(initItem, lstBcao[index]);
                            }
                        }
                    }
                    this.initReport(lstBcao?.length + 1, initItem);
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    this.response.loaiDeNghi = null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.response.loaiDeNghi = null;
            }
        );
        this.spinner.hide();
    }

    async initReport(dot: number, initItem: Report) {
        this.response.ngayTao = new Date();
        this.response.maDvi = this.userInfo.MA_DVI;
        this.response.dot = dot;
        this.response.trangThai = Status.TT_01;
        this.response.nguoiTao = this.userInfo.sub;
        await this.getMaDnghi();
        if (this.response.canCuVeGia == Cvmb.DON_GIA) {
            if (initItem.lstCtiets?.length == 0) {
                this.response.lstCtiets.push(new ThanhToan({
                    id: uuid.v4() + 'FE',
                    maDvi: this.userInfo.MA_DVI,
                    tenDvi: this.userInfo?.TEN_DVI,
                }))
            } else {
                initItem.lstCtiets.forEach(item => {
                    this.response.lstCtiets.push(new ThanhToan({
                        ...item,
                        id: uuid.v4() + 'FE',
                        uncNgay: null,
                        uncNienDoNs: null,
                        ung: null,
                        cong: null,
                        cap: null,
                    }))
                })
            }
        } else {
            if (dot == 1) {

            }
        }
    }

    async getMaDnghi() {
        this.spinner.show();
        await this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.response.maCapUng = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }

    async getContractData() {
        // const request = {
        //     namKHoach: this.response.namDnghi,
        //     maDvi: this.userInfo.MA_DVI,
        //     loaiVthh: null,
        // }
        // switch (this.response.loaiDnghi) {
        //     case Utils.MUA_THOC:
        //         request.loaiVthh = "0101"
        //         break;
        //     case Utils.MUA_GAO:
        //         request.loaiVthh = "0102"
        //         break;
        //     case Utils.MUA_MUOI:
        //         request.loaiVthh = "04"
        //         break;
        //     case Utils.MUA_VTU:
        //         request.loaiVthh = "02"
        //         break;
        // }
        // await this.capVonMuaBanTtthService.dsachHopDong(request).toPromise().then(
        //     (data) => {
        //         if (data.statusCode == 0) {
        //             data.data.forEach(item => {
        //                 const temp: ThanhToan = {
        //                     ... new ThanhToan(),
        //                     id: uuid.v4() + 'FE',
        //                     tenKhachHang: item.tenNhaThau,
        //                     isParent: false,
        //                     qdPdKqNhaThau: item.soHd,
        //                     soLuongKeHoach: item.soLuongKehoach,
        //                     soLuongHopDong: item.soLuong,
        //                     donGia: item.donGia,
        //                     giaTriHd: mulNumber(item.soLuong, item.donGia),
        //                 }
        //                 this.response.ttGui.lstCtietBcaos.push(temp);
        //                 const index = this.response.ttGui.lstCtietBcaos.findIndex(e => e.tenKhachHang == temp.tenKhachHang && e.isParent);
        //                 if (index == -1) {
        //                     this.response.ttGui.lstCtietBcaos.push({
        //                         ...temp,
        //                         id: uuid.v4() + 'FE',
        //                         isParent: true,
        //                         qdPdKqNhaThau: item.soQdPdKhlcnt,
        //                     })
        //                 } else {
        //                     if (this.response.ttGui.lstCtietBcaos[index].qdPdKqNhaThau.indexOf(item.soQdPdKhlcnt) == -1) {
        //                         this.response.ttGui.lstCtietBcaos[index].qdPdKqNhaThau += ', ' + item.sosoQdPdKhlcnt;
        //                     }
        //                     this.response.ttGui.lstCtietBcaos[index].soLuongHopDong = sumNumber([this.response.ttGui.lstCtietBcaos[index].soLuongHopDong, temp.soLuongHopDong]);
        //                     this.response.ttGui.lstCtietBcaos[index].soLuongKeHoach = sumNumber([this.response.ttGui.lstCtietBcaos[index].soLuongKeHoach, temp.soLuongKeHoach]);
        //                     this.response.ttGui.lstCtietBcaos[index].giaTriHd = sumNumber([this.response.ttGui.lstCtietBcaos[index].giaTriHd, temp.giaTriHd]);
        //                     this.response.ttGui.lstCtietBcaos[index].donGia = divNumber(this.response.ttGui.lstCtietBcaos[index].giaTriHd, this.response.ttGui.lstCtietBcaos[index].soLuongHopDong);
        //                 }
        //             })
        //         } else {
        //             this.notification.warning(MESSAGE.WARNING, data?.msg);
        //         }
        //     },
        //     (err) => {
        //         this.notification.warning(MESSAGE.WARNING, MESSAGE.SYSTEM_ERROR);
        //     },
        // );
    }

    handleOk() {
        if (!this.response.namDnghi || !this.response.loaiDeNghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        this._modalRef.close({
            baoCao: this.response,
            id: null,
            tabSelected: this.response.canCuVeGia == Cvmb.DON_GIA ? Tab.THANH_TOAN_DON_GIA : Tab.THANH_TOAN_HOP_DONG,
        });
    }

    handleCancel() {
        this._modalRef.close();
    }
}
