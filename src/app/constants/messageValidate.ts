import { Utils } from "../Utility/utils";


export const MESSAGEVALIDATE = {
  NOTBLANK: 'Trường này không được để trống!',
  INVALIDFORMAT: 'Trường này không được để trống và giá trị từ 1000 đến 2999',
  YEAR: 'Vui lòng nhập từ 1000 đến 2999',
  TYPE_OF_TEXT: 'Vui lòng chọn loại văn bản',
  NOT_NEGATIVE: 'Giá trị trong trường bôi đỏ không được âm',
  NOTEMPTYS: 'Vui lòng nhập đúng giá trị cho các trường bôi đỏ!',
  NOTSAVE: 'Vui lòng lưu các trường dữ liệu trong bảng!',
  WRONG_FORMAT: 'Vui lòng nhập năm đúng định dạng số từ 1000 đến 2999',
  MONEYRANGE: 'Số tiền quy đổi vượt quá hạn mức ' + Utils.MONEY_LIMIT,
  PERSONREPORT: 'Vui lòng chọn người thực hiện báo cáo',
  SAVEREPORT: 'Vui lòng lưu cáo cáo trước khi lưu phụ lục',
  WARNING_FINISH_INPUT: 'Vui lòng hoàn tất nhập liệu trước khi thực hiện trình duyệt',
  DOCUMENTARY: 'Vui lòng lưu file công văn',
  ERROR_DATA: "Vui lòng nhập đúng dữ liệu: Bản ghi ",
  OVER_SIZE: "Kích thước file không vượt quá 2MB",
  NOT_EMPTY_DOTBC: "Vui lòng chọn đợt báo cáo",
  EXIST_REPORT: "Báo cáo đã tồn tại",
  WRONG_DAY: '"Đến ngày" cần lớn hơn "Từ ngày"',
  EXIST_CONTRACT: "Không tìm thấy hợp đồng",
  LOCAL_EXIST: "Địa phương nhận đã tồn tại",
  NOT_EXIST_REPORT: "Không tồn tại báo cáo cho việc tổng hợp",
  EXIST_MONEY: "Vui lòng chọn đơn vị tiền",
  MONEY_LIMIT: "Giá trị tiền nằm trong khoảng từ 0 đến 9.000.000.000.000.000 đồng",
  NOT_SAVE_FILE: 'Vui lòng lưu các trường thông tin của tài liệu đính kèm!'
};
