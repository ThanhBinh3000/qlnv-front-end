var tecapro = tecapro || {};

tecapro.ScanProgress = function (params) {
    var _params = (params == undefined || params == null) ? {} : params;
    console.log("ScanProgress _params", _params);
    var _progressId = undefined;

    this.setProgressBar = function(percent){
        var elem = document.getElementById(_params.bar);
        elem.style.width = percent + "%";
        elem.innerHTML = percent + "%";
    }
    /*
     * Lặp vô thời hạn
     * interval: ngầm định 50 miliseconds
     * bar_percent: Độ dài progress so với 
     */
    this.clearProgress = function(){
        if (this._progressId !== undefined) {
            clearInterval(this._progressId);
            this._progressId = undefined;
        }
        var elem = document.getElementById(_params.bar);
        elem.style.left = 0;
    }
    this.moveInfinite = function (interval = 30, bar_percent = 20) {
        if (this._progressId !== undefined) {
            console.log("moveInfinite Đang có 1 tuyến trình đang chạy");
            return;
        }
        console.log("moveInfinite _params", _params.bar);
        console.log("moveInfinite _params", _params.progress);

        var elem = document.getElementById(_params.bar);
        var pos = 1;
        this._progressId = setInterval(frame, interval);
        elem.style.width = bar_percent + "%";
        function frame() {
            //console.log("frame", pos);
            if (pos >= 100 - bar_percent) {
                pos = 1;
            } else {
                pos += 1;
                elem.style.left = pos + "%";
            }
        }        
    }
}