export function convertTrangThai(status: string): string {
    if (status == '00') {
        return 'Mới tạo';
    } else if (status == '01') {
        return 'Chờ duyệt';
    } else if (status == '02') {
        return 'Đã duyệt';
    } else if (status == '03') {
        return 'Từ chối';
    }
}