import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { displayNumber, exchangeMoney, mulNumber, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import * as fileSaver from 'file-saver';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';

export class ItemData {
    id: any;
    stt: string;
    tenTaiSan: string;
    maTaiSan: string;
    // dviTinh: any;
    // donGiaTdTheoQd: number;
    // ncauTbiNamNSluong: number;
    // ncauTbiNamNTtien: number;
    // ncauTbiNamNSluongTd: number;
    // ncauTbiNamNTtienTd: number;
    // ncauTbiNamN1Sluong: number;
    // ncauTbiNamN1Ttien: number;
    // ncauTbiNamN2Sluong: number;
    // ncauTbiNamN2Ttien: number;
    level: any;
    checked: boolean;

    sluongTsanTdiemBcao: number;
    sluongTsanDaNhan: number;
    sluongTsanPduyet: number;
    sluongTsanTcong: number;
    tchuanDmucTda: number;
    dtoanDnghiSluong: number;
    dtoanDnghiMgia: number;
    thanhTien: number;
    tdinhSluong: number;
    tdinhTtien: number;
    chenhLech: number;
    thuyetMinh: string;
    yKien: string
}
@Component({
    selector: 'app-phu-luc-06',
    templateUrl: './phu-luc-06.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class PhuLuc06Component implements OnInit {
    @Input() dataInfo;
    //thong tin chung
    maDviTien: string = '1';
    lstCtietBcao: ItemData[] = [];
    formDetail: any;
    thuyetMinh: string;
    namBcao: number;
    maDvi: string;
    total = new ItemData();
    //danh muc
    donViTiens: any[] = DON_VI_TIEN;
    listVtu: any[] = [];
    dsDinhMuc: any[] = [];
    soLaMa: any[] = LA_MA;
    //cac nut
    editMoneyUnit = false;
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusPrint: boolean;
    isDataAvailable = false;
    allChecked = false;

    checkViewTD: boolean;
    checkEditTD: boolean;
    //nho dem
    listIdDelete: string;
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    amount = AMOUNT;
    scrollX: string;
    fileList: NzUploadFile[] = [];
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    lstFiles: any[] = [];
    listIdDeleteFiles: string[] = [];

    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        console.log(this.fileList);
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        console.log(this.fileList);

        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.lstFiles.push({ id: id, fileName: file?.name });
            this.listFile.push(file);
        });
        this.fileList = [];
    };
    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private danhMucService: DanhMucDungChungService,
        private quanLyVonPhiService: QuanLyVonPhiService,
    ) {
    }


    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }


    async initialization() {
        this.spinner.show();
        this.formDetail = this.dataInfo?.data;
        this.maDvi = this.dataInfo?.maDvi;
        this.namBcao = this.dataInfo?.namBcao;
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.status = !this.dataInfo?.status;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.statusPrint = this.dataInfo?.statusBtnPrint;
        this.checkEditTD = this.dataInfo?.editAppraisalValue;
        this.checkViewTD = this.dataInfo?.viewAppraisalValue;
        if (this.status) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_PL6');
            if (category) {
                this.listVtu = category.data;
            }
            this.scrollX = (560 + BOX_NUMBER_WIDTH * 8).toString() + 'px';
        } else {
            if (this.checkEditTD) {
                this.scrollX = (410 + BOX_NUMBER_WIDTH * 10).toString() + 'px';
            } else if (this.checkViewTD) {
                this.scrollX = (350 + BOX_NUMBER_WIDTH * 10).toString() + 'px';
            } else {
                this.scrollX = (350 + BOX_NUMBER_WIDTH * 8).toString() + 'px';
            }
        }
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })

        this.updateEditCache();
        this.tinhTong();
        this.getStatusButton();

        this.spinner.hide();
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.dataInfo.maDvi + '/' + this.dataInfo.maBcao);
        const temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
            (data) => {
                const objfile = {
                    fileName: data.filename,
                    fileSize: data.size,
                    fileUrl: data.url,
                }
                return objfile;
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        return temp;
    }

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
        let checkSaveEdit;
        //check xem tat ca cac dong du lieu da luu chua?
        //chua luu thi bao loi, luu roi thi cho di
        this.lstCtietBcao.forEach(element => {
            if (this.editCache[element.id].edit === true) {
                checkSaveEdit = false
            }
        });
        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        //tinh lai don vi tien va kiem tra gioi han cua chung
        const lstCtietBcaoTemp: ItemData[] = [];
        let checkMoneyRange = true;
        this.lstCtietBcao.forEach(item => {
            if (item.sluongTsanTdiemBcao > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
            })
        })

        if (!checkMoneyRange) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        // replace nhung ban ghi dc them moi id thanh null
        lstCtietBcaoTemp.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })

        if (!this.checkViewTD) {
            lstCtietBcaoTemp.forEach(item => {
                item.tdinhSluong = item.dtoanDnghiSluong;
                item.tdinhTtien = item.thanhTien;
            })
        }

        const request = JSON.parse(JSON.stringify(this.formDetail));
        if (!request.fileDinhKems) {
            request.fileDinhKems = [];
        }
        for (const iterator of this.listFile) {
            request.fileDinhKems.push(await this.uploadFile(iterator));
        }
        request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
        request.trangThai = trangThai;

        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }

        this.spinner.show();
        this.lapThamDinhService.updateLapThamDinh(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                    this.formDetail = data.data;
                    this._modalRef.close({
                        formDetail: this.formDetail,
                    });
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (!this.formDetail?.id) {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
            return;
        }
        const requestGroupButtons = {
            id: this.formDetail.id,
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        this.spinner.show();
        await this.lapThamDinhService.approveCtietThamDinh(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.formDetail.trangThai = mcn;
                this.getStatusButton();
                if (mcn == "0") {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                }
                this._modalRef.close({
                    formDetail: this.formDetail,
                });
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
        this.spinner.hide();
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.tinhTong();
        this.updateEditCache();
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    deleteSelected() {
        // delete object have checked = true
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.checked != true)
        this.allChecked = false;
        this.tinhTong()
    }

    // xoa dong
    deleteById(id: string): void {
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id);
        this.tinhTong();
    }

    // start edit
    startEdit(id: string): void {
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
    }

    // click o checkbox single
    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
    }

    // click o checkbox all
    updateAllChecked(): void {
        this.lstCtietBcao.forEach(item => {
            item.checked = this.allChecked;
        })
    }

    // them dong moi
    addLine(id: number): void {
        const item: ItemData = {
            ... new ItemData(),
            id: uuid.v4() + 'FE',
            checked: false,
        }

        this.lstCtietBcao.splice(id + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    selectTaisan(idTaiSan: any, idRow: any) {
        const taiSan = this.listVtu.find(ts => ts.ma === idTaiSan);
        this.editCache[idRow].data.tenTaiSan = taiSan.giaTri;
    }

    tinhTong() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            // this.total.donGiaTdTheoQd = sumNumber([this.total.donGiaTdTheoQd, item.donGiaTdTheoQd]);
            // this.total.ncauTbiNamNSluong = sumNumber([this.total.ncauTbiNamNSluong, item.ncauTbiNamNSluong]);
            // this.total.ncauTbiNamNTtien = sumNumber([this.total.ncauTbiNamNTtien, item.ncauTbiNamNTtien]);
            // this.total.ncauTbiNamNSluongTd = sumNumber([this.total.ncauTbiNamNSluongTd, item.ncauTbiNamNSluongTd]);
            // this.total.ncauTbiNamNTtienTd = sumNumber([this.total.ncauTbiNamNTtienTd, item.ncauTbiNamNTtienTd]);
            // this.total.ncauTbiNamN1Sluong = sumNumber([this.total.ncauTbiNamN1Sluong, item.ncauTbiNamN1Sluong]);
            // this.total.ncauTbiNamN1Ttien = sumNumber([this.total.ncauTbiNamN1Ttien, item.ncauTbiNamN1Ttien]);
            // this.total.ncauTbiNamN2Sluong = sumNumber([this.total.ncauTbiNamN2Sluong, item.ncauTbiNamN2Sluong]);
            // this.total.ncauTbiNamN2Ttien = sumNumber([this.total.ncauTbiNamN2Ttien, item.ncauTbiNamN2Ttien]);

            this.total.tchuanDmucTda = sumNumber([this.total.tchuanDmucTda, item.tchuanDmucTda]);
            this.total.dtoanDnghiMgia = sumNumber([this.total.dtoanDnghiMgia, item.dtoanDnghiMgia]);
            this.total.thanhTien = sumNumber([this.total.thanhTien, item.thanhTien]);
            this.total.tdinhTtien = sumNumber([this.total.tdinhTtien, item.tdinhTtien]);
            this.total.chenhLech = sumNumber([this.total.chenhLech, item.chenhLech]);
        })
    }

    changeModel(id: string): void {
        this.editCache[id].data.sluongTsanTcong = sumNumber([this.editCache[id].data.sluongTsanTdiemBcao, this.editCache[id].data.sluongTsanDaNhan, this.editCache[id].data.sluongTsanPduyet]);
        this.editCache[id].data.thanhTien = mulNumber(this.editCache[id].data.dtoanDnghiSluong, this.editCache[id].data.dtoanDnghiMgia);
        this.editCache[id].data.tdinhTtien = mulNumber(this.editCache[id].data.tdinhSluong, this.editCache[id].data.dtoanDnghiMgia);
        this.editCache[id].data.chenhLech = this.editCache[id].data.tdinhTtien - this.editCache[id].data.thanhTien;
    }

    //show popup tu choi
    tuChoi(mcn: string) {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Từ chối',
            nzContent: DialogTuChoiComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modalTuChoi.afterClose.subscribe(async (text) => {
            if (text) {
                this.save(mcn, text);
            }
        });
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    getStatusButton() {
        if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
    }
    // action print
    doPrint() {
        const WindowPrt = window.open(
            '',
            '',
            'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
        );
        let printContent = '';
        printContent = printContent + '<div>';
        printContent =
            printContent + document.getElementById('tablePrint').innerHTML;
        printContent = printContent + '</div>';
        WindowPrt.document.write(printContent);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }
    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

    handleCancel() {
        this._modalRef.close();
    };

    deleteFile(id: string): void {
        this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.listIdDeleteFiles.push(id);
    };

    //download file về máy tính
    async downloadFile(id: string) {
        //let file!: File;
        const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            const fileAttach = this.lstFiles.find(element => element?.id == id);
            if (fileAttach) {
                await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
                    (data) => {
                        fileSaver.saveAs(data, fileAttach.fileName);
                    },
                    err => {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    },
                );
            }
        } else {
            const blob = new Blob([file], { type: "application/octet-stream" });
            fileSaver.saveAs(blob, file.name);
        }
    };
}
