import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { displayNumber, exchangeMoney, getHead, getTail, sortByIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, DON_VI_TIEN, LA_MA, MONEY_LIMIT, QUATITY } from "src/app/Utility/utils";
import * as uuid from "uuid";
import * as fileSaver from 'file-saver';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
export class ItemData {
    id!: string;
    stt!: string;
    level: number;
    maNdung!: string;
    tenNdung: string;
    thNamHienHanhN1!: number;
    tranChiN!: number;
    ncauChiN!: number;
    clechTranChiVsNcauChiN: number;
    tranChiN1!: number;
    ncauChiN1!: number;
    clechTranChiVsNcauChiN1: number;
    tranChiN2!: number;
    ncauChiN2!: number;
    clechTranChiVsNcauChiN2: number;
    ghiChu: string;
}


@Component({
    selector: 'app-bieu-mau-16',
    templateUrl: './bieu-mau-16.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau16Component implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: any;
    total: ItemData = new ItemData();
    chiCoSo: ItemData = new ItemData();
    chiMoi: ItemData = new ItemData();
    maDviTien: string = '1';
    thuyetMinh: string;
    namBcao: number;
    //danh muc
    noiDungs: any[] = [];
    soLaMa: any[] = LA_MA;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    amount = AMOUNT;
    quatity = QUATITY;
    scrollX: string;
    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusPrint: boolean;
    editMoneyUnit = false;
    isDataAvailable = false;
    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
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
        private danhMucService: DanhMucDungChungService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
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
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.namBcao = this.dataInfo?.namBcao;
        this.status = !this.dataInfo?.status;
        if (this.status) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_TT69_BM17');
            if (category) {
                this.noiDungs = category.data;
            }
            this.scrollX = (410 + BOX_NUMBER_WIDTH * 10).toString() + 'px';
        } else {
            this.scrollX = (350 + BOX_NUMBER_WIDTH * 10).toString() + 'px';
        }
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.statusPrint = this.dataInfo?.statusBtnPrint;
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })
        if (this.lstCtietBcao.length == 0) {
            this.noiDungs.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    maNdung: e.ma,
                    tenNdung: e.giaTri,
                })
            })
        }

        this.lstCtietBcao = sortByIndex(this.lstCtietBcao);

        if (this.dataInfo?.extraData && this.dataInfo?.extraData.length > 0) {
            this.dataInfo.extraData.forEach(item => {
                const index = this.lstCtietBcao.findIndex(e => e.maNdung == item.maNdung);
                this.lstCtietBcao[index].thNamHienHanhN1 = item.namHienHanhUocThien;
                this.lstCtietBcao[index].tranChiN = item.tranChiN;
                this.lstCtietBcao[index].ncauChiN = item.ncauChiN;
                this.lstCtietBcao[index].clechTranChiVsNcauChiN = item.clechTranChiVsNcauChiN;
                this.lstCtietBcao[index].tranChiN1 = item.tranChiN1;
                this.lstCtietBcao[index].ncauChiN1 = item.ncauChiN1;
                this.lstCtietBcao[index].clechTranChiVsNcauChiN1 = item.clechTranChiVsNcauChiN1;
                this.lstCtietBcao[index].tranChiN2 = item.tranChiN2;
                this.lstCtietBcao[index].ncauChiN2 = item.ncauChiN2;
                this.lstCtietBcao[index].clechTranChiVsNcauChiN2 = item.clechTranChiVsNcauChiN2;
            })
        }
        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
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
            if (item.thNamHienHanhN1 > MONEY_LIMIT || item.tranChiN > MONEY_LIMIT || item.ncauChiN > MONEY_LIMIT ||
                item.tranChiN1 > MONEY_LIMIT || item.ncauChiN1 > MONEY_LIMIT ||
                item.tranChiN2 > MONEY_LIMIT || item.ncauChiN2 > MONEY_LIMIT) {
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

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        // if (n == 0) {
        //     for (let i = 0; i < this.soLaMa.length; i++) {
        //         while (k >= this.soLaMa[i].gTri) {
        //             xau += this.soLaMa[i].kyTu;
        //             k -= this.soLaMa[i].gTri;
        //         }
        //     }
        // }
        if (n == 0) {
            xau = chiSo[n];
        }
        // if (n == 2) {
        //     xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
        // }
        if (n == 1) {
            xau = String.fromCharCode(k + 96);
        }
        if (n == 2) {
            xau = "-";
        }
        return xau;
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

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
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

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        const indexP = this.lstCtietBcao.findIndex(e => e.stt == getHead(this.lstCtietBcao[index].stt));
        const indexC = this.lstCtietBcao.findIndex(e => getHead(e.stt) == getHead(this.lstCtietBcao[index].stt) && getTail(e.stt) != getTail(this.lstCtietBcao[index].stt));
        this.lstCtietBcao[indexC].thNamHienHanhN1 = (!this.lstCtietBcao[indexP].thNamHienHanhN1 ? 0 : this.lstCtietBcao[indexP].thNamHienHanhN1) - this.lstCtietBcao[index].thNamHienHanhN1;
        this.lstCtietBcao[indexC].tranChiN = (!this.lstCtietBcao[indexP].tranChiN ? 0 : this.lstCtietBcao[indexP].tranChiN) - this.lstCtietBcao[index].tranChiN;
        this.lstCtietBcao[indexC].ncauChiN = (!this.lstCtietBcao[indexP].ncauChiN ? 0 : this.lstCtietBcao[indexP].ncauChiN) - this.lstCtietBcao[index].ncauChiN;
        this.lstCtietBcao[indexC].clechTranChiVsNcauChiN = (!this.lstCtietBcao[indexP].clechTranChiVsNcauChiN ? 0 : this.lstCtietBcao[indexP].clechTranChiVsNcauChiN) - this.lstCtietBcao[index].clechTranChiVsNcauChiN;
        this.lstCtietBcao[indexC].tranChiN1 = (!this.lstCtietBcao[indexP].tranChiN1 ? 0 : this.lstCtietBcao[indexP].tranChiN1) - this.lstCtietBcao[index].tranChiN1;
        this.lstCtietBcao[indexC].ncauChiN1 = (!this.lstCtietBcao[indexP].ncauChiN1 ? 0 : this.lstCtietBcao[indexP].ncauChiN1) - this.lstCtietBcao[index].ncauChiN1;
        this.lstCtietBcao[indexC].clechTranChiVsNcauChiN1 = (!this.lstCtietBcao[indexP].clechTranChiVsNcauChiN1 ? 0 : this.lstCtietBcao[indexP].clechTranChiVsNcauChiN1) - this.lstCtietBcao[index].clechTranChiVsNcauChiN1;
        this.lstCtietBcao[indexC].tranChiN2 = (!this.lstCtietBcao[indexP].tranChiN2 ? 0 : this.lstCtietBcao[indexP].tranChiN2) - this.lstCtietBcao[index].tranChiN2;
        this.lstCtietBcao[indexC].ncauChiN2 = (!this.lstCtietBcao[indexP].ncauChiN2 ? 0 : this.lstCtietBcao[indexP].ncauChiN2) - this.lstCtietBcao[index].ncauChiN2;
        this.lstCtietBcao[indexC].clechTranChiVsNcauChiN2 = (!this.lstCtietBcao[indexP].clechTranChiVsNcauChiN2 ? 0 : this.lstCtietBcao[indexP].clechTranChiVsNcauChiN2) - this.lstCtietBcao[index].clechTranChiVsNcauChiN2;
        this.getInTotal();
        this.updateEditCache();
    }

    //gia tri cac o input thay doi thi tinh toan lai
    changeModel(id: string): void {
        this.editCache[id].data.clechTranChiVsNcauChiN = sumNumber([this.editCache[id].data.tranChiN, -this.editCache[id].data.ncauChiN]);
        this.editCache[id].data.clechTranChiVsNcauChiN1 = sumNumber([this.editCache[id].data.tranChiN1, -this.editCache[id].data.ncauChiN1]);
        this.editCache[id].data.clechTranChiVsNcauChiN2 = sumNumber([this.editCache[id].data.tranChiN2, -this.editCache[id].data.ncauChiN2]);
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.thNamHienHanhN1 = sumNumber([this.total.thNamHienHanhN1, item.thNamHienHanhN1]);
                this.total.tranChiN = sumNumber([this.total.tranChiN, item.tranChiN]);
                this.total.ncauChiN = sumNumber([this.total.ncauChiN, item.ncauChiN]);
                this.total.clechTranChiVsNcauChiN = sumNumber([this.total.clechTranChiVsNcauChiN, item.clechTranChiVsNcauChiN]);
                this.total.tranChiN1 = sumNumber([this.total.tranChiN1, item.tranChiN1]);
                this.total.ncauChiN1 = sumNumber([this.total.ncauChiN1, item.ncauChiN1]);
                this.total.clechTranChiVsNcauChiN1 = sumNumber([this.total.clechTranChiVsNcauChiN1, item.clechTranChiVsNcauChiN1]);
                this.total.tranChiN2 = sumNumber([this.total.tranChiN2, item.tranChiN2]);
                this.total.ncauChiN2 = sumNumber([this.total.ncauChiN2, item.ncauChiN2]);
                this.total.clechTranChiVsNcauChiN2 = sumNumber([this.total.clechTranChiVsNcauChiN2, item.clechTranChiVsNcauChiN2]);
            }
        })
        this.getInTotal();
    }

    getInTotal() {
        this.chiCoSo = new ItemData();
        this.chiMoi = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 1) {
                if (getTail(item.stt) == 1) {
                    this.chiCoSo.thNamHienHanhN1 = sumNumber([this.chiCoSo.thNamHienHanhN1, item.thNamHienHanhN1]);
                    this.chiCoSo.tranChiN = sumNumber([this.chiCoSo.tranChiN, item.tranChiN]);
                    this.chiCoSo.ncauChiN = sumNumber([this.chiCoSo.ncauChiN, item.ncauChiN]);
                    this.chiCoSo.clechTranChiVsNcauChiN = sumNumber([this.chiCoSo.clechTranChiVsNcauChiN, item.clechTranChiVsNcauChiN]);
                    this.chiCoSo.tranChiN1 = sumNumber([this.chiCoSo.tranChiN1, item.tranChiN1]);
                    this.chiCoSo.ncauChiN1 = sumNumber([this.chiCoSo.ncauChiN1, item.ncauChiN1]);
                    this.chiCoSo.clechTranChiVsNcauChiN1 = sumNumber([this.chiCoSo.clechTranChiVsNcauChiN1, item.clechTranChiVsNcauChiN1]);
                    this.chiCoSo.tranChiN2 = sumNumber([this.chiCoSo.tranChiN2, item.tranChiN2]);
                    this.chiCoSo.ncauChiN2 = sumNumber([this.chiCoSo.ncauChiN2, item.ncauChiN2]);
                    this.chiCoSo.clechTranChiVsNcauChiN2 = sumNumber([this.chiCoSo.clechTranChiVsNcauChiN2, item.clechTranChiVsNcauChiN2]);
                }
                if (getTail(item.stt) == 2) {
                    this.chiMoi.thNamHienHanhN1 = sumNumber([this.chiMoi.thNamHienHanhN1, item.thNamHienHanhN1]);
                    this.chiMoi.tranChiN = sumNumber([this.chiMoi.tranChiN, item.tranChiN]);
                    this.chiMoi.ncauChiN = sumNumber([this.chiMoi.ncauChiN, item.ncauChiN]);
                    this.chiMoi.clechTranChiVsNcauChiN = sumNumber([this.chiMoi.clechTranChiVsNcauChiN, item.clechTranChiVsNcauChiN]);
                    this.chiMoi.tranChiN1 = sumNumber([this.chiMoi.tranChiN1, item.tranChiN1]);
                    this.chiMoi.ncauChiN1 = sumNumber([this.chiMoi.ncauChiN1, item.ncauChiN1]);
                    this.chiMoi.clechTranChiVsNcauChiN1 = sumNumber([this.chiMoi.clechTranChiVsNcauChiN1, item.clechTranChiVsNcauChiN1]);
                    this.chiMoi.tranChiN2 = sumNumber([this.chiMoi.tranChiN2, item.tranChiN2]);
                    this.chiMoi.ncauChiN2 = sumNumber([this.chiMoi.ncauChiN2, item.ncauChiN2]);
                    this.chiMoi.clechTranChiVsNcauChiN2 = sumNumber([this.chiMoi.clechTranChiVsNcauChiN2, item.clechTranChiVsNcauChiN2]);
                }
            }
        })
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

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
    }

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
