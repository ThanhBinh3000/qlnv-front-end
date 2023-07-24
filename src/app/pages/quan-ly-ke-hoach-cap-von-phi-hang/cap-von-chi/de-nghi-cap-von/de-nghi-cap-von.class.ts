export class BtnStatus {
    new: boolean = true;                               // trang thai tao moi lich su
    general: boolean = true;                           //trang thai tong cua ban ghi dang xet
    save?: boolean = true;                             // trang thai cua nut luu
    submit?: boolean = true;                           // trang thai cua nut trinh duyet
    pass?: boolean = true;                             // trang thai cua nut duyet, tu choi duyet
    approve?: boolean = true;                          // trang thai cua nut phe duyet, tu choi phe duyet
    accept?: boolean = true;                           // trang thai cua nut tiep nhan, tu choi tiep nhan
    print?: boolean = true;                            // trang thai cua nut in
    ok?: boolean = true;                               // trang thai cua nut chap nhan bieu mau
    finish?: boolean = true;                           // trang thai cua nut hoan tat nhap lieu
    export: boolean = true;
    viewAppVal?: boolean = true;                       // quyen xem tham dinh
    editAppVal?: boolean = true;                       // quyen sua tham dinh
    copy?: boolean = true;                             // copy
    addNewReport?: boolean = true;                     // them moi bao cao
    deleteReport?: boolean = true;                     // xoa bao cao
}