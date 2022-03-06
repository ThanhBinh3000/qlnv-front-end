var tecapro = tecapro || {};

/*
 * Class handle scan 
 * params contain fields:
 * 1. viewId: id of html element that view scan.
 * 2. scanCompletedCallback: callback được gọi khi quá trình scan completed (scan xong 
 *     và file pdf đã được upload lên server side, cần các bước xử lý khác như số hóa,...)
 *     
 */
tecapro.Scan = function (params) {
    var _params = (params == undefined || params == null) ? {} : params;

    /*
     * Thời gian chờ tối đa giữa các lần scan, trong thời gian chờ này không cần lấy lại danh sách scan driver từ client,
     * nếu giữa 2 lần scan vượt quá thời gian này, thì khi dialog đc show, 1 request sẽ đc gửi xuống server để lấy lại scan.
     * Đơn vị tính miliseconds
     */
    const __MAX_TIME_SCAN_IDLE = 10 * 60 * 1000;

    /*
     * Time in miliseconds since midnight, 1 Jan 1970
     * Dùng để kiểm tra xem có cần lấy lại danh sách máy scan của user.
     * Nếu
     */
    //var _lastUsed = new Date().getTime();
    var _lastUsed = -1;
    var _isScanning = false;
    var _progressBar = undefined;
    var _ticket = "";

    var init = function () {
        console.log("tecapro.Scan init function");
        if ($('#scan-form').length <= 0) {
            $("body").append(tecapro.Scan.__scanForm);
            $("#scan-form-cancel").on("click", function () {
                if (confirm("Bạn thực sự muốn hủy quá trình scan") == true) {
                    $('#scan-form').modal('hide');
                    _isScanning = false;
                    window.clearTimeout(_scanDevices);
                };
            });

            $("#perform-scan").on("click", ferformScan);

            $("#scan-form").modal({
                backdrop: 'static',
                keyboard: false
            });

            _progressBar = new tecapro.ScanProgress({ bar: "scanBar", progress: "scanProgress" })
        }
    }
    var closeScanDialog = function () {
        $('#scan-form').modal('hide');
        _isScanning = false;
    }
    var ferformScan = function (e) {
        if (_isScanning) {
            alert("Có 1 tuyến trình scan đang chạy, vui lòng đợi tuyến trình này kết thúc \r\n hoặc nhấn [Hủy] để kết thúc quá trình hiện tại!")
            return;
        }
        var dvId = $('#scan-list').val();
        console.log("perform scan", dvId);

        $.ajax({
            url: _params.Api + "api/Scan/PerformScan?username=" + _params.Username + "&dpi=" + "300" + "&device_id=" + dvId + "&ticket=" + _ticket,
            type: 'GET',
            //data: JSON.stringify({ "dpi": 300, username: _params.Username }),
            dataType: 'JSON',
            success: function (data) {
                data = data.data
                console.log("ferformScan success data", data)
                _isScanning = true;
                $("#scan-control-box").hide();
                $("#scan-state").text("Trạng thái: Đang quét.....");
                $("#scan-progress").show();
                $('#perform-scan').prop('disabled', true);
                $("#perform-scan").css("background-color", "#fdfdfd");
                $("#perform-scan").css("color", "#090909");
                $("#scanBar").css("width", "100%");
                //_progressBar.moveInfinite();

                //Init timer to get scan status.
                console.log("ferformScan time = ", (new Date()).getTime());
                setTimeout(function () {
                    updateScanStatus(dvId)
                }, 200);
            }
        }).done(function (resp) {
            console.log("ferformScan done data", resp);

            //debugger

        });
    }
    var updateScanStatus = function (forDeviceId) {
        if (!_isScanning) {
            return;
        }
        console.log("updateScanStatus time = ", (new Date()).getTime());
        console.log("/Scan/GetScanProgress?username=" + _params.Username + "&ticket=" + _ticket);
        $.ajax({
            url: _params.Api + "api/Scan/GetScanProgress?username=" + _params.Username + "&ticket=" + _ticket,
            type: 'GET',
            //data: JSON.stringify({ "dpi": 300, username: _params.Username }),
            //dataType: 'JSON',
            success: function (data) {
                data = data.data
                console.log("updateScanStatus success data", data)
                $("#update-scan-list").show();
                $("#scan-progress").show();
                $("#scan-control-box").hide();
                $("#scan-msg-box").hide();
                $('#perform-scan').prop('disabled', true);
                $("#perform-scan").css("background-color", "#fdfdfd");
                $("#perform-scan").css("color", "#090909");
                $("#scanBar").css("width", "100%");
                //_progressBar.moveInfinite();
                //Init timer to get scan status.
                processScanStatus(data, _ticket);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("updateScanStatus error xhr.status", xhr.status);
                console.log("updateScanStatus thrownError", thrownError);
            }
        }).done(function (resp) {
            console.log("updateScanStatus done data", resp);
            //debugger

        });
    }
    var processScanStatus = function (data, dvId) {
        if (!_isScanning) {
            return;
        }
        if (data.state == 6) {
            _progressBar.clearProgress();
            _progressBar.setProgressBar(100);
            console.log("Scan completed!.....................", data);
            closeScanDialog();
            _params.ScanCompeletedCallback(data);
            return
        }
        if (data.state == 2 || data.state == 3) {
            _progressBar.clearProgress();
            _progressBar.setProgressBar(Math.round(data.CurrentValue * 100.0 / data.Max));
        }
        if (data.state == 2) {
            $("#scan-state").text("Trạng thái: Export pdf.....");
        }
        else if (data.state == 3) {
            $("#scan-state").text("Trạng thái: Upload pdf.....");
        }
        else if (data.state == 5) {
            $("#scanBar").css("width", "100%");
            $("#scan-state").text("Trạng thái: Đang số hóa.....");
        }
        else if (data.state == 1001) {
            $("#scanBar").css("width", "100%");
            $("#scan-msg-box").show();
            $("#scan-msg").html("Lỗi: Có lỗi xảy ra trong quá trình scan...<br/>Vui lòng khởi động lại việc scan hoặc liên hệ với nhóm phát triển");
            return;
        }
        else if (data.state == 1004) {
            $("#scanBar").css("width", "100%");
            $("#scan-msg-box").show();
            $("#scan-msg").html("Lỗi: Có lỗi xảy ra trong quá trình số hóa...<br/>Vui lòng khởi động lại việc scan hoặc liên hệ với nhóm phát triển");
            return;
        }
        else if (data.state == 1002) {
            $("#scanBar").css("width", "100%");
            $("#scan-msg-box").show();
            $("#scan-msg").html("Lỗi: Có lỗi xảy ra trong quá trình export pdf...<br/>Vui lòng khởi động lại việc scan hoặc liên hệ với nhóm phát triển");
            return;
        }
        else if (data.state == 1003) {
            $("#scanBar").css("width", "100%");
            $("#scan-msg-box").show();
            $("#scan-msg").html("Lỗi: Có lỗi xảy ra trong quá trình upload file pdf...<br/>Vui lòng khởi động lại việc scan hoặc liên hệ với nhóm phát triển");
            return;
        }
        else if (data.state == 1005) {
            $("#scanBar").css("width", "100%");
            $("#scan-msg-box").show();
            $("#scan-msg").html("Lỗi: Có lỗi xảy ra trong quá trình kết nối với máy scan...<br/>Vui lòng khởi động lại việc scan hoặc liên hệ với nhóm phát triển");
            return;
        }

        setTimeout(function () {
            updateScanStatus(dvId);
        }, 200);
    }
    /*
     * Thực hiện việc scan document gồm các công việc sau:
     * 1. Open Scan Document Dialog
     * 2. Lấy lại danh sách máy scan.
     * 3. Hiển thị yêu cầu chọn máy scan.
     * 4. Nếu văn thư thấy máy scan không đúng, thì phải kiểm tra đã bật máy scan 
     * và đã nối máy scan với máy tính cá nhân của văn thư hay chưa, sau đó cần chọn lại cho đúng.
     * 5. Gửi lệnh scan xuống server -> Hiển thị màn hình chờ có progress bar chạy kiểu vô định
     * 5.1. Scan lỗi, báo lỗi lên màn hình.
     * 5.2. Scan thành công, gửi request để update trạng thái scan liên tục từ server.
     * 6. Kết thúc quá trình scan.
     * 6.1. Văn thư nhấn nút hủy, gửi lệnh hủy xuống server side, đóng cửa sổ scan.
     * 6.2. Không có button Ok, chỉ có button hủy. Khi scan thành công gửi event ra cho browser (gọi hàm callback)
     */
    this.scan = function (ticket) {
        console.log("scan function");

        _ticket = ticket;

        //Get current time in miliseconds
        let currTime = (new Date()).getTime();

        console.log("currTime", currTime);

        $("#scan-state").text("Trạng thái: Đang quét");
        $("#scan-form").modal('show');

        console.log(currTime - _lastUsed, __MAX_TIME_SCAN_IDLE, currTime - _lastUsed > __MAX_TIME_SCAN_IDLE)

        if (currTime - _lastUsed > __MAX_TIME_SCAN_IDLE) {
            $("#update-scan-list").show();
            $("#scan-progress").show();
            $("#scan-control-box").hide();
            $("#scan-msg-box").show();

            $('#perform-scan').prop('disabled', true);
            $("#perform-scan").css("background-color", "#fdfdfd");
            $("#perform-scan").css("color", "#090909");
            $("#scanBar").css("width", "100%");

            //_progressBar.moveInfinite();
            update_scan_devices();

        }

    }//end of scan fucntion

    var _reloadDevicesTimer = undefined;
    var _scanDevices = undefined

    var update_scan_devices = function () {

        console.log("update_scan_devices", _params.Username)
        $("#scan-state").text("Trạng thái: Đang lấy danh sách máy scan");
        $.ajax({
            url: _params.Api + 'api/Scan/GetDevices?username=' + _params.Username,
            method: 'GET',
            error: function (xhr, status, error) {
                console.log("Không thể load Scan với username = " + _params.Username);
                console.log(xhr.responseText);
            },
            success: function (data) {

                console.log(data);
                data = data.data;

                if (data.error > 0) {
                    $("#scan-msg").text(data.msg);
                    $("#device-interface").text("");
                    $("#scan-list").html("");
                }
                else {
                    if (data.devices != undefined && data.devices.length > 0) {
                        $("#scan-msg").html("Chọn scan và nhấn nút <b>[Scan]</b> để bắt đầu scan tài liệu");
                        $("#update-scan-list").hide();
                        $("#scan-control-box").show();

                        $('#perform-scan').prop('disabled', false);
                        $("#perform-scan").css("background-color", "#19696a");
                        $("#perform-scan").css("color", "#D0D0D0");

                        _progressBar.clearProgress();
                        $("#scan-progress").hide();
                    }
                    else {
                        $("#scan-msg").html("Không tìm thấy máy scan nào đang kết nối với máy tính của bạn. <br/>Vui lòng bật máy scan và kết nối vào máy tính!");
                        //Khởi tạo timer để request liên tục hàm này
                        //_reloadDevicesTimer = 
                        //Gọi hàm lặm lại sau 1s
                        _scanDevices = window.setTimeout(update_scan_devices, 1000);
                    }
                    $("#device-interface").text((data.supported_device === undefined) ? "---" : data.supported_device);
                    let selectHtml = "";
                    if (data.devices != undefined) {
                        for (var i = 0; i < data.devices.length; i++) {
                            let it = data.devices[i];
                            selectHtml += '<option value="' + it.id + '">' + it.name + '<option>';
                        }
                    }
                    $("#scan-list").html(selectHtml);
                }
            }
        });
    };
    init();
}

tecapro.Scan.__scanForm = `
<div id= "scan-form" class="modal fade" data-keyboard="false" data-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header modal-body-thin">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title">Tecapro AI Scan</h4>
            </div>
            <div class="modal-body modal-body-thin">
            <div class="row" id="update-scan-list">
                <div class="form-group">
                    <label class="control-label" id="scan-state">Lấy danh sách máy scans</label>
                </div>     
            </div>
            <div class="row" id="scan-progress">
                    <div id="scanProgress">
                      <div id="scanBar"></div>
                    </div>
            </div>

            <div class="row" id="scan-control-box">
                            <div class="form-group">                    
                                <label>Chuẩn giao tiếp:</label> <span id="device-interface"></span>
                            </div>
                            <div class="form-group">
                                <label>Máy scan</label><select id="scan-list"></select>                    
                            </div>     
            </div>
            <div class="row" id="scan-msg-box">
                <div class="form-group">
                    <p id="scan-msg" class="control-label">Vui lòng chờ</p>
                </div>
            </div>
            </div>
            <div class="clearfix"></div>
            <div class="modal-footer modal-body-thin">
                <button id="perform-scan">Scan</button>
                <button id="scan-form-cancel" type="button" data-dismiss="modal" class="btn btn-sm btn-outline dark">Hủy</button>
            </div>
        </div>
    </div>
</div>
`;