var _0x32bb = ['{\x22Message\x22:\x20\x22WebSocket\x20NOT\x20supported\x20by\x20your\x20Browser!\x22,\x20\x22Status\x22:500}', 'onmessage', 'send', 'WebSocket', 'wss://127.0.0.1:8987/GetCertInfo', 'onclose', 'wss://127.0.0.1:8987/SignAppendix', 'wss://127.0.0.1:8987/SignMsg', 'wss://127.0.0.1:8987/Config', 'WebSocket\x20NOT\x20supported\x20by\x20your\x20Browser!', 'wss://127.0.0.1:8987/SignApproved', 'onopen', 'wss://127.0.0.1:8987/VerifyMsg', 'wss://127.0.0.1:8987/SignIssued', 'wss://127.0.0.1:8987/SignXML', 'log', 'request', 'config', 'wss://127.0.0.1:8987/SignPDF', 'Connection\x20is\x20closed...', 'wss://127.0.0.1:8987/SignCopy', 'wss://127.0.0.1:8987/Auth', 'wss://127.0.0.1:8987/SignPDFWP', 'data', 'get_cert_info', 'wss://127.0.0.1:8987/GetLicenseRequest', 'wss://127.0.0.1:8987/SignOffice', 'wss://127.0.0.1:8987/VerifyXML', 'close', '{\x22Error\x22:\x20\x22WebSocket\x20NOT\x20supported\x20by\x20your\x20Browser!\x22,\x20\x22Status\x22:500}']; (function (_0x35e56e, _0x32bb86) { var _0xaea970 = function (_0x261120) { while (--_0x261120) { _0x35e56e['push'](_0x35e56e['shift']()); } }; _0xaea970(++_0x32bb86); }(_0x32bb, 0x146)); var _0xaea9 = function (_0x35e56e, _0x32bb86) { _0x35e56e = _0x35e56e - 0x0; var _0xaea970 = _0x32bb[_0x35e56e]; return _0xaea970; }; function vgca_show_config() { if (_0xaea9('0x7') in window) { var _0x397788 = new WebSocket(_0xaea9('0xc')); _0x397788[_0xaea9('0xf')] = function () { _0x397788[_0xaea9('0x6')](_0xaea9('0x15')); }; _0x397788[_0xaea9('0x5')] = function (_0x11fc8e) { _0x397788[_0xaea9('0x2')](); }; _0x397788[_0xaea9('0x9')] = function () { console['log']('Connection\x20is\x20closed...'); }; } else { console['log'](_0xaea9('0xd')); } } function vgca_sign_msg(_0x268f10, _0xc0bf61, _0x217cbb) { if (_0xaea9('0x7') in window) { var _0x42f93f = new WebSocket(_0xaea9('0xb')); _0x42f93f['onopen'] = function () { _0x42f93f['send'](_0xc0bf61); }; _0x42f93f[_0xaea9('0x5')] = function (_0x1a5779) { if (_0x217cbb) { _0x217cbb(_0x268f10, _0x1a5779['data']); } _0x42f93f[_0xaea9('0x2')](); }; _0x42f93f[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')](_0xaea9('0x17')); }; } else { if (_0x217cbb) { _0x217cbb(_0x268f10, _0xaea9('0x3')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_verify_msg(_0x21b3da, _0x4b3ef0) { if ('WebSocket' in window) { var _0x4baf76 = new WebSocket(_0xaea9('0x10')); _0x4baf76['onopen'] = function () { _0x4baf76['send'](_0x21b3da); }; _0x4baf76[_0xaea9('0x5')] = function (_0x4175d5) { if (_0x4b3ef0) { _0x4b3ef0(_0x4175d5['data']); } _0x4baf76[_0xaea9('0x2')](); }; _0x4baf76['onclose'] = function () { console['log'](_0xaea9('0x17')); }; } else { if (_0x4b3ef0) { _0x4b3ef0(sender, '{\x22Error\x22:\x20\x22WebSocket\x20NOT\x20supported\x20by\x20your\x20Browser!\x22,\x20\x22Status\x22:500}'); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_sign_pdf(_0x29051d, _0x481cac) { if (_0xaea9('0x7') in window) { var _0x1fcea6 = new WebSocket(_0xaea9('0x16')); _0x1fcea6[_0xaea9('0xf')] = function () { _0x1fcea6[_0xaea9('0x6')](_0x29051d); }; _0x1fcea6[_0xaea9('0x5')] = function (_0x56f68b) { if (_0x481cac) { _0x481cac(_0x56f68b['data']); } _0x1fcea6['close'](); }; _0x1fcea6['onclose'] = function () { console[_0xaea9('0x13')](_0xaea9('0x17')); }; } else { if (_0x481cac) { _0x481cac(_0xaea9('0x3')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_verify_pdf(_0x441dd6, _0x4c6633) { if ('WebSocket' in window) { var _0x1d773f = new WebSocket('wss://127.0.0.1:8987/VerifyPDF'); _0x1d773f[_0xaea9('0xf')] = function () { _0x1d773f['send'](_0x441dd6); }; _0x1d773f[_0xaea9('0x5')] = function (_0x5b1e63) { if (_0x4c6633) { _0x4c6633(_0x5b1e63['data']); } _0x1d773f[_0xaea9('0x2')](); }; _0x1d773f[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')]('Connection\x20is\x20closed...'); }; } else { if (_0x4c6633) { _0x4c6633(_0xaea9('0x3')); } console['log'](_0xaea9('0xd')); } } function vgca_sign_office(_0x26303c, _0x11ae5a) { if (_0xaea9('0x7') in window) { var _0x4f3a0e = new WebSocket(_0xaea9('0x0')); _0x4f3a0e[_0xaea9('0xf')] = function () { _0x4f3a0e[_0xaea9('0x6')](_0x26303c); }; _0x4f3a0e[_0xaea9('0x5')] = function (_0x6d02b5) { if (_0x11ae5a) { _0x11ae5a(_0x6d02b5[_0xaea9('0x1b')]); } _0x4f3a0e[_0xaea9('0x2')](); }; _0x4f3a0e[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')](_0xaea9('0x17')); }; } else { if (_0x11ae5a) { _0x11ae5a(_0xaea9('0x3')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_verify_office(_0x2c5721, _0x11c320) { if (_0xaea9('0x7') in window) { var _0x32971a = new WebSocket('wss://127.0.0.1:8987/VerifyOffice'); _0x32971a['onopen'] = function () { _0x32971a[_0xaea9('0x6')](_0x2c5721); }; _0x32971a[_0xaea9('0x5')] = function (_0xeaee70) { if (_0x11c320) { _0x11c320(_0xeaee70['data']); } _0x32971a[_0xaea9('0x2')](); }; _0x32971a[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')](_0xaea9('0x17')); }; } else { if (_0x11c320) { _0x11c320(_0xaea9('0x3')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_sign_file(_0xffcb04, _0x4925c9) { if (_0xaea9('0x7') in window) { var _0x1d74c5 = new WebSocket('wss://127.0.0.1:8987/SignFile'); _0x1d74c5[_0xaea9('0xf')] = function () { _0x1d74c5[_0xaea9('0x6')](_0xffcb04); }; _0x1d74c5[_0xaea9('0x5')] = function (_0x1d5041) { if (_0x4925c9) { _0x4925c9(_0x1d5041[_0xaea9('0x1b')]); } _0x1d74c5['close'](); }; _0x1d74c5['onclose'] = function () { console[_0xaea9('0x13')]('Connection\x20is\x20closed...'); }; } else { if (_0x4925c9) { _0x4925c9(_0xaea9('0x3')); } console['log'](_0xaea9('0xd')); } } function vgca_license_request(_0x57d8d9) { if (_0xaea9('0x7') in window) { var _0x27a38c = new WebSocket(_0xaea9('0x1d')); _0x27a38c[_0xaea9('0xf')] = function () { _0x27a38c[_0xaea9('0x6')](_0xaea9('0x14')); }; _0x27a38c[_0xaea9('0x5')] = function (_0x12f6ca) { if (_0x57d8d9) { _0x57d8d9(_0x12f6ca[_0xaea9('0x1b')]); } _0x27a38c[_0xaea9('0x2')](); }; _0x27a38c[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')]('Connection\x20is\x20closed...'); }; } else { if (_0x57d8d9) { _0x57d8d9(_0xaea9('0x3')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_sign_xml(_0x1ae8a8, _0x10d7f0, _0x2cfd11) { if (_0xaea9('0x7') in window) { var _0x278db6 = new WebSocket(_0xaea9('0x12')); _0x278db6[_0xaea9('0xf')] = function () { _0x278db6[_0xaea9('0x6')](_0x10d7f0); }; _0x278db6['onmessage'] = function (_0x299508) { if (_0x2cfd11) { _0x2cfd11(_0x1ae8a8, _0x299508['data']); } _0x278db6[_0xaea9('0x2')](); }; _0x278db6['onclose'] = function () { console[_0xaea9('0x13')](_0xaea9('0x17')); }; } else { if (_0x2cfd11) { _0x2cfd11(_0x1ae8a8, _0xaea9('0x3')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_get_certinfo(_0x10e359) { if ('WebSocket' in window) { var _0x49bac9 = new WebSocket(_0xaea9('0x8')); _0x49bac9[_0xaea9('0xf')] = function () { _0x49bac9[_0xaea9('0x6')](_0xaea9('0x1c')); }; _0x49bac9[_0xaea9('0x5')] = function (_0x14b977) { if (_0x10e359) { _0x10e359(_0x14b977['data']); } _0x49bac9[_0xaea9('0x2')](); }; _0x49bac9[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')](_0xaea9('0x17')); }; } else { if (_0x10e359) { _0x10e359(sender, _0xaea9('0x3')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_verify_xml(_0x5b06c5, _0x13499b) { if (_0xaea9('0x7') in window) { var _0x3ce634 = new WebSocket(_0xaea9('0x1')); _0x3ce634[_0xaea9('0xf')] = function () { _0x3ce634[_0xaea9('0x6')](_0x5b06c5); }; _0x3ce634['onmessage'] = function (_0x54e6d6) { if (_0x13499b) { _0x13499b(_0x54e6d6[_0xaea9('0x1b')]); } _0x3ce634[_0xaea9('0x2')](); }; _0x3ce634[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')]('Connection\x20is\x20closed...'); }; } else { if (_0x13499b) { _0x13499b(_0xaea9('0x4')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_sign_xml_wp12(_0x53197f, _0x5a6285) { if (_0xaea9('0x7') in window) { var _0x32013b = new WebSocket('wss://127.0.0.1:8987/SignXMLP12'); _0x32013b['onopen'] = function () { _0x32013b[_0xaea9('0x6')](_0x53197f); }; _0x32013b['onmessage'] = function (_0x4c0743) { if (_0x5a6285) { _0x5a6285(_0x4c0743[_0xaea9('0x1b')]); } _0x32013b['close'](); }; _0x32013b[_0xaea9('0x9')] = function () { console['log'](_0xaea9('0x17')); }; } else { if (_0x5a6285) { _0x5a6285(_0xaea9('0x3')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_sign_pdfwp(_0x19bb8b, _0xa83bb6) { if (_0xaea9('0x7') in window) { var _0x6d8765 = new WebSocket(_0xaea9('0x1a')); _0x6d8765[_0xaea9('0xf')] = function () { _0x6d8765['send'](_0x19bb8b); }; _0x6d8765[_0xaea9('0x5')] = function (_0x4508a0) { if (_0xa83bb6) { _0xa83bb6(_0x4508a0[_0xaea9('0x1b')]); } _0x6d8765['close'](); }; _0x6d8765[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')](_0xaea9('0x17')); }; } else { if (_0xa83bb6) { _0xa83bb6(_0xaea9('0x3')); } console[_0xaea9('0x13')]('WebSocket\x20NOT\x20supported\x20by\x20your\x20Browser!'); } } function vgca_sign_income(_0x2700ca, _0x2134f9) { if (_0xaea9('0x7') in window) { var _0x2f0b7b = new WebSocket('wss://127.0.0.1:8987/SignIncome'); _0x2f0b7b[_0xaea9('0xf')] = function () { _0x2f0b7b[_0xaea9('0x6')](_0x2700ca); }; _0x2f0b7b['onmessage'] = function (_0x30f6f2) { if (_0x2134f9) { _0x2134f9(_0x30f6f2[_0xaea9('0x1b')]); } _0x2f0b7b[_0xaea9('0x2')](); }; _0x2f0b7b[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')]('Connection\x20is\x20closed...'); }; } else { if (_0x2134f9) { _0x2134f9(_0xaea9('0x3')); } console['log']('WebSocket\x20NOT\x20supported\x20by\x20your\x20Browser!'); } } function vgca_comment(_0x3bec91, _0xed66c7) { if (_0xaea9('0x7') in window) { var _0x3da561 = new WebSocket('wss://127.0.0.1:8987/Comment'); _0x3da561[_0xaea9('0xf')] = function () { _0x3da561[_0xaea9('0x6')](_0x3bec91); }; _0x3da561[_0xaea9('0x5')] = function (_0x2aff28) { if (_0xed66c7) { _0xed66c7(_0x2aff28[_0xaea9('0x1b')]); } _0x3da561[_0xaea9('0x2')](); }; _0x3da561[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')](_0xaea9('0x17')); }; } else { if (_0xed66c7) { _0xed66c7(_0xaea9('0x3')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_auth(_0x545dd2, _0x24fbd5, _0x568fe7) { if (_0xaea9('0x7') in window) { var _0xe12552 = new WebSocket(_0xaea9('0x19')); _0xe12552['onopen'] = function () { _0xe12552[_0xaea9('0x6')](_0x24fbd5); }; _0xe12552['onmessage'] = function (_0x55e5e4) { if (_0x568fe7) { _0x568fe7(_0x545dd2, _0x55e5e4[_0xaea9('0x1b')]); } _0xe12552[_0xaea9('0x2')](); }; _0xe12552[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')](_0xaea9('0x17')); }; } else { if (_0x568fe7) { _0x568fe7(_0x545dd2, '{\x22Error\x22:\x20\x22WebSocket\x20NOT\x20supported\x20by\x20your\x20Browser!\x22,\x20\x22Status\x22:500}'); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_sign_approved(_0x3df645, _0x520243) { if (_0xaea9('0x7') in window) { var _0xbf924f = new WebSocket(_0xaea9('0xe')); _0xbf924f[_0xaea9('0xf')] = function () { _0xbf924f[_0xaea9('0x6')](_0x3df645); }; _0xbf924f['onmessage'] = function (_0x41c363) { if (_0x520243) { _0x520243(_0x41c363[_0xaea9('0x1b')]); } _0xbf924f[_0xaea9('0x2')](); }; _0xbf924f['onclose'] = function () { console[_0xaea9('0x13')](_0xaea9('0x17')); }; } else { if (_0x520243) { _0x520243(_0xaea9('0x3')); } console['log'](_0xaea9('0xd')); } } function vgca_sign_issued(_0x2d112e, _0x4619b7) { if (_0xaea9('0x7') in window) { var _0xf17edc = new WebSocket(_0xaea9('0x11')); _0xf17edc[_0xaea9('0xf')] = function () { _0xf17edc[_0xaea9('0x6')](_0x2d112e); }; _0xf17edc[_0xaea9('0x5')] = function (_0x4ac554) { if (_0x4619b7) { _0x4619b7(_0x4ac554[_0xaea9('0x1b')]); } _0xf17edc[_0xaea9('0x2')](); }; _0xf17edc[_0xaea9('0x9')] = function () { console['log'](_0xaea9('0x17')); }; } else { if (_0x4619b7) { _0x4619b7(_0xaea9('0x3')); } console[_0xaea9('0x13')]('WebSocket\x20NOT\x20supported\x20by\x20your\x20Browser!'); } } function vgca_sign_appendix(_0x55ce59, _0x2ea5cb) { if (_0xaea9('0x7') in window) { var _0x4ac87c = new WebSocket(_0xaea9('0xa')); _0x4ac87c[_0xaea9('0xf')] = function () { _0x4ac87c[_0xaea9('0x6')](_0x55ce59); }; _0x4ac87c[_0xaea9('0x5')] = function (_0x4e82a4) { if (_0x2ea5cb) { _0x2ea5cb(_0x4e82a4['data']); } _0x4ac87c[_0xaea9('0x2')](); }; _0x4ac87c[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')](_0xaea9('0x17')); }; } else { if (_0x2ea5cb) { _0x2ea5cb(_0xaea9('0x3')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } } function vgca_sign_copy(_0x32216f, _0x2c18d9) { if (_0xaea9('0x7') in window) { var _0x182645 = new WebSocket(_0xaea9('0x18')); _0x182645[_0xaea9('0xf')] = function () { _0x182645['send'](_0x32216f); }; _0x182645[_0xaea9('0x5')] = function (_0x288d35) { if (_0x2c18d9) { _0x2c18d9(_0x288d35[_0xaea9('0x1b')]); } _0x182645[_0xaea9('0x2')](); }; _0x182645[_0xaea9('0x9')] = function () { console[_0xaea9('0x13')]('Connection\x20is\x20closed...'); }; } else { if (_0x2c18d9) { _0x2c18d9(_0xaea9('0x3')); } console[_0xaea9('0x13')](_0xaea9('0xd')); } }


var vgcapluginObject = (function () {
    return {
        func1() {
            alert('test function from js file');
        },

        vgca_show_config () {
            if (_0xaea9('0x7') in window) {
                var _0x397788 = new WebSocket(_0xaea9('0xc'));
                _0x397788[_0xaea9('0xf')] = function () {
                    _0x397788[_0xaea9('0x6')](_0xaea9('0x15'));
                };
                _0x397788[_0xaea9('0x5')] = function (_0x11fc8e) {
                    _0x397788[_0xaea9('0x2')]();
                };
                _0x397788[_0xaea9('0x9')] = function () {
                    console['log']('Connection is closed...');
                };
            } else {
                console['log'](_0xaea9('0xd'));
            }
        },

        vgca_sign_msg(_0x268f10, _0xc0bf61, _0x217cbb) {
            if (_0xaea9('0x7') in window) {
                var _0x42f93f = new WebSocket(_0xaea9('0xb'));
                _0x42f93f['onopen'] = function () {
                    _0x42f93f['send'](_0xc0bf61);
                };
                _0x42f93f[_0xaea9('0x5')] = function (_0x1a5779) {
                    if (_0x217cbb) {
                        _0x217cbb(_0x268f10, _0x1a5779['data']);
                    }
                    _0x42f93f[_0xaea9('0x2')]();
                };
                _0x42f93f[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')](_0xaea9('0x17'));
                };
            } else {
                if (_0x217cbb) {
                    _0x217cbb(_0x268f10, _0xaea9('0x3'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },

        vgca_verify_msg(_0x21b3da, _0x4b3ef0) {
            if ('WebSocket' in window) {
                var _0x4baf76 = new WebSocket(_0xaea9('0x10'));
                _0x4baf76['onopen'] = function () {
                    _0x4baf76['send'](_0x21b3da);
                };
                _0x4baf76[_0xaea9('0x5')] = function (_0x4175d5) {
                    if (_0x4b3ef0) {
                        _0x4b3ef0(_0x4175d5['data']);
                    }
                    _0x4baf76[_0xaea9('0x2')]();
                };
                _0x4baf76['onclose'] = function () {
                    console['log'](_0xaea9('0x17'));
                };
            } else {
                if (_0x4b3ef0) {
                    _0x4b3ef0(sender, '{\"Error\": \"WebSocket NOT supported by your Browser!\", \"Status\":500}');
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },

        vgca_sign_pdf(_0x29051d, _0x481cac) {
            if (_0xaea9('0x7') in window) {
                var _0x1fcea6 = new WebSocket(_0xaea9('0x16'));
                _0x1fcea6[_0xaea9('0xf')] = function () {
                    _0x1fcea6[_0xaea9('0x6')](_0x29051d);
                };
                _0x1fcea6[_0xaea9('0x5')] = function (_0x56f68b) {
                    if (_0x481cac) {
                        _0x481cac(_0x56f68b['data']);
                    }
                    _0x1fcea6['close']();
                };
                _0x1fcea6['onclose'] = function () {
                    console[_0xaea9('0x13')](_0xaea9('0x17'));
                };
            } else {
                if (_0x481cac) {
                    _0x481cac(_0xaea9('0x3'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },

        vgca_verify_pdf(_0x441dd6, _0x4c6633) {
            if ('WebSocket' in window) {
                var _0x1d773f = new WebSocket('wss://127.0.0.1:8987/VerifyPDF');
                _0x1d773f[_0xaea9('0xf')] = function () {
                    _0x1d773f['send'](_0x441dd6);
                };
                _0x1d773f[_0xaea9('0x5')] = function (_0x5b1e63) {
                    if (_0x4c6633) {
                        _0x4c6633(_0x5b1e63['data']);
                    }
                    _0x1d773f[_0xaea9('0x2')]();
                };
                _0x1d773f[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')]('Connection is closed...');
                };
            } else {
                if (_0x4c6633) {
                    _0x4c6633(_0xaea9('0x3'));
                }
                console['log'](_0xaea9('0xd'));
            }
        },

        vgca_sign_office(_0x26303c, _0x11ae5a) {
            if (_0xaea9('0x7') in window) {
                var _0x4f3a0e = new WebSocket(_0xaea9('0x0'));
                _0x4f3a0e[_0xaea9('0xf')] = function () {
                    _0x4f3a0e[_0xaea9('0x6')](_0x26303c);
                };
                _0x4f3a0e[_0xaea9('0x5')] = function (_0x6d02b5) {
                    if (_0x11ae5a) {
                        _0x11ae5a(_0x6d02b5[_0xaea9('0x1b')]);
                    }
                    _0x4f3a0e[_0xaea9('0x2')]();
                };
                _0x4f3a0e[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')](_0xaea9('0x17'));
                };
            } else {
                if (_0x11ae5a) {
                    _0x11ae5a(_0xaea9('0x3'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },

        vgca_verify_office(_0x2c5721, _0x11c320) {
            if (_0xaea9('0x7') in window) {
                var _0x32971a = new WebSocket('wss://127.0.0.1:8987/VerifyOffice');
                _0x32971a['onopen'] = function () {
                    _0x32971a[_0xaea9('0x6')](_0x2c5721);
                };
                _0x32971a[_0xaea9('0x5')] = function (_0xeaee70) {
                    if (_0x11c320) {
                        _0x11c320(_0xeaee70['data']);
                    }
                    _0x32971a[_0xaea9('0x2')]();
                };
                _0x32971a[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')](_0xaea9('0x17'));
                };
            } else {
                if (_0x11c320) {
                    _0x11c320(_0xaea9('0x3'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },

        vgca_sign_file(_0xffcb04, _0x4925c9) {
            if (_0xaea9('0x7') in window) {
                var _0x1d74c5 = new WebSocket('wss://127.0.0.1:8987/SignFile');
                _0x1d74c5[_0xaea9('0xf')] = function () {
                    _0x1d74c5[_0xaea9('0x6')](_0xffcb04);
                };
                _0x1d74c5[_0xaea9('0x5')] = function (_0x1d5041) {
                    if (_0x4925c9) {
                        _0x4925c9(_0x1d5041[_0xaea9('0x1b')]);
                    }
                    _0x1d74c5['close']();
                };
                _0x1d74c5['onclose'] = function () {
                    console[_0xaea9('0x13')]('Connection is closed...');
                };
            } else {
                if (_0x4925c9) {
                    _0x4925c9(_0xaea9('0x3'));
                }
                console['log'](_0xaea9('0xd'));
            }
        },

        vgca_license_request(_0x57d8d9) {
            if (_0xaea9('0x7') in window) {
                var _0x27a38c = new WebSocket(_0xaea9('0x1d'));
                _0x27a38c[_0xaea9('0xf')] = function () {
                    _0x27a38c[_0xaea9('0x6')](_0xaea9('0x14'));
                };
                _0x27a38c[_0xaea9('0x5')] = function (_0x12f6ca) {
                    if (_0x57d8d9) {
                        _0x57d8d9(_0x12f6ca[_0xaea9('0x1b')]);
                    }
                    _0x27a38c[_0xaea9('0x2')]();
                };
                _0x27a38c[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')]('Connection is closed...');
                };
            } else {
                if (_0x57d8d9) {
                    _0x57d8d9(_0xaea9('0x3'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },
        // 1:data truyen cho callback, 2: json_prms 3: call back
        vgca_sign_xml(_0x1ae8a8, _0x10d7f0, _0x2cfd11) {
            if (_0xaea9('0x7') in window) {
                var _0x278db6 = new WebSocket(_0xaea9('0x12'));
                _0x278db6[_0xaea9('0xf')] = function () {
                    _0x278db6[_0xaea9('0x6')](_0x10d7f0);
                };
                _0x278db6['onmessage'] = function (_0x299508) {
                    if (_0x2cfd11) {
                        _0x2cfd11(_0x1ae8a8, _0x299508['data']);
                    }
                    _0x278db6[_0xaea9('0x2')]();
                };
                _0x278db6['onclose'] = function () {
                    console[_0xaea9('0x13')](_0xaea9('0x17'));
                };
            } else {
                if (_0x2cfd11) {
                    _0x2cfd11(_0x1ae8a8, _0xaea9('0x3'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },

        vgca_get_certinfo(_0x10e359) {
            if ('WebSocket' in window) {
                var _0x49bac9 = new WebSocket(_0xaea9('0x8'));
                _0x49bac9[_0xaea9('0xf')] = function () {
                    _0x49bac9[_0xaea9('0x6')](_0xaea9('0x1c'));
                };
                _0x49bac9[_0xaea9('0x5')] = function (_0x14b977) {
                    if (_0x10e359) {
                        _0x10e359(_0x14b977['data']);
                    }
                    _0x49bac9[_0xaea9('0x2')]();
                };
                _0x49bac9[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')](_0xaea9('0x17'));
                };
            } else {
                if (_0x10e359) {
                    _0x10e359(sender, _0xaea9('0x3'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },

        vgca_verify_xml(_0x5b06c5, _0x13499b) {
            if (_0xaea9('0x7') in window) {
                var _0x3ce634 = new WebSocket(_0xaea9('0x1'));
                _0x3ce634[_0xaea9('0xf')] = function () {
                    _0x3ce634[_0xaea9('0x6')](_0x5b06c5);
                };
                _0x3ce634['onmessage'] = function (_0x54e6d6) {
                    if (_0x13499b) {
                        _0x13499b(_0x54e6d6[_0xaea9('0x1b')]);
                    }
                    _0x3ce634[_0xaea9('0x2')]();
                };
                _0x3ce634[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')]('Connection is closed...');
                };
            } else {
                if (_0x13499b) {
                    _0x13499b(_0xaea9('0x4'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },

        vgca_sign_xml_wp12(_0x53197f, _0x5a6285) {
            if (_0xaea9('0x7') in window) {
                var _0x32013b = new WebSocket('wss://127.0.0.1:8987/SignXMLP12');
                _0x32013b['onopen'] = function () {
                    _0x32013b[_0xaea9('0x6')](_0x53197f);
                };
                _0x32013b['onmessage'] = function (_0x4c0743) {
                    if (_0x5a6285) {
                        _0x5a6285(_0x4c0743[_0xaea9('0x1b')]);
                    }
                    _0x32013b['close']();
                };
                _0x32013b[_0xaea9('0x9')] = function () {
                    console['log'](_0xaea9('0x17'));
                };
            } else {
                if (_0x5a6285) {
                    _0x5a6285(_0xaea9('0x3'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },

        vgca_sign_pdfwp(_0x19bb8b, _0xa83bb6) {
            if (_0xaea9('0x7') in window) {
                var _0x6d8765 = new WebSocket(_0xaea9('0x1a'));
                _0x6d8765[_0xaea9('0xf')] = function () {
                    _0x6d8765['send'](_0x19bb8b);
                };
                _0x6d8765[_0xaea9('0x5')] = function (_0x4508a0) {
                    if (_0xa83bb6) {
                        _0xa83bb6(_0x4508a0[_0xaea9('0x1b')]);
                    }
                    _0x6d8765['close']();
                };
                _0x6d8765[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')](_0xaea9('0x17'));
                };
            } else {
                if (_0xa83bb6) {
                    _0xa83bb6(_0xaea9('0x3'));
                }
                console[_0xaea9('0x13')]('WebSocket NOT supported by your Browser!');
            }
        },

        vgca_sign_income(_0x2700ca, _0x2134f9) {
            if (_0xaea9('0x7') in window) {
                var _0x2f0b7b = new WebSocket('wss://127.0.0.1:8987/SignIncome');
                _0x2f0b7b[_0xaea9('0xf')] = function () {
                    _0x2f0b7b[_0xaea9('0x6')](_0x2700ca);
                };
                _0x2f0b7b['onmessage'] = function (_0x30f6f2) {
                    if (_0x2134f9) {
                        _0x2134f9(_0x30f6f2[_0xaea9('0x1b')]);
                    }
                    _0x2f0b7b[_0xaea9('0x2')]();
                };
                _0x2f0b7b[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')]('Connection is closed...');
                };
            } else {
                if (_0x2134f9) {
                    _0x2134f9(_0xaea9('0x3'));
                }
                console['log']('WebSocket NOT supported by your Browser!');
            }
        },

        vgca_comment(_0x3bec91, _0xed66c7) {
            if (_0xaea9('0x7') in window) {
                var _0x3da561 = new WebSocket('wss://127.0.0.1:8987/Comment');
                _0x3da561[_0xaea9('0xf')] = function () {
                    _0x3da561[_0xaea9('0x6')](_0x3bec91);
                };
                _0x3da561[_0xaea9('0x5')] = function (_0x2aff28) {
                    if (_0xed66c7) {
                        _0xed66c7(_0x2aff28[_0xaea9('0x1b')]);
                    }
                    _0x3da561[_0xaea9('0x2')]();
                };
                _0x3da561[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')](_0xaea9('0x17'));
                };
            } else {
                if (_0xed66c7) {
                    _0xed66c7(_0xaea9('0x3'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },

        vgca_auth(_0x545dd2, _0x24fbd5, _0x568fe7) {
            if (_0xaea9('0x7') in window) {
                var _0xe12552 = new WebSocket(_0xaea9('0x19'));
                _0xe12552['onopen'] = function () {
                    _0xe12552[_0xaea9('0x6')](_0x24fbd5);
                };
                _0xe12552['onmessage'] = function (_0x55e5e4) {
                    if (_0x568fe7) {
                        _0x568fe7(_0x545dd2, _0x55e5e4[_0xaea9('0x1b')]);
                    }
                    _0xe12552[_0xaea9('0x2')]();
                };
                _0xe12552[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')](_0xaea9('0x17'));
                };
            } else {
                if (_0x568fe7) {
                    _0x568fe7(_0x545dd2, '{\"Error\": \"WebSocket NOT supported by your Browser!\", \"Status\":500}');
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },

        vgca_sign_approved(_0x3df645, _0x520243) {
            if (_0xaea9('0x7') in window) {
                var _0xbf924f = new WebSocket(_0xaea9('0xe'));
                _0xbf924f[_0xaea9('0xf')] = function () {
                    _0xbf924f[_0xaea9('0x6')](_0x3df645);
                };
                _0xbf924f['onmessage'] = function (_0x41c363) {
                    if (_0x520243) {
                        _0x520243(_0x41c363[_0xaea9('0x1b')]);
                    }
                    _0xbf924f[_0xaea9('0x2')]();
                };
                _0xbf924f['onclose'] = function () {
                    console[_0xaea9('0x13')](_0xaea9('0x17'));
                };
            } else {
                if (_0x520243) {
                    _0x520243(_0xaea9('0x3'));
                }
                console['log'](_0xaea9('0xd'));
            }
        },

        vgca_sign_issued(_0x2d112e, _0x4619b7) {
            if (_0xaea9('0x7') in window) {
                var _0xf17edc = new WebSocket(_0xaea9('0x11'));
                _0xf17edc[_0xaea9('0xf')] = function () {
                    _0xf17edc[_0xaea9('0x6')](_0x2d112e);
                };
                _0xf17edc[_0xaea9('0x5')] = function (_0x4ac554) {
                    if (_0x4619b7) {
                        _0x4619b7(_0x4ac554[_0xaea9('0x1b')]);
                    }
                    _0xf17edc[_0xaea9('0x2')]();
                };
                _0xf17edc[_0xaea9('0x9')] = function () {
                    console['log'](_0xaea9('0x17'));
                };
            } else {
                if (_0x4619b7) {
                    _0x4619b7(_0xaea9('0x3'));
                }
                console[_0xaea9('0x13')]('WebSocket NOT supported by your Browser!');
            }
        },

        vgca_sign_appendix(_0x55ce59, _0x2ea5cb) {
            if (_0xaea9('0x7') in window) {
                var _0x4ac87c = new WebSocket(_0xaea9('0xa'));
                _0x4ac87c[_0xaea9('0xf')] = function () {
                    _0x4ac87c[_0xaea9('0x6')](_0x55ce59);
                };
                _0x4ac87c[_0xaea9('0x5')] = function (_0x4e82a4) {
                    if (_0x2ea5cb) {
                        _0x2ea5cb(_0x4e82a4['data']);
                    }
                    _0x4ac87c[_0xaea9('0x2')]();
                };
                _0x4ac87c[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')](_0xaea9('0x17'));
                };
            } else {
                if (_0x2ea5cb) {
                    _0x2ea5cb(_0xaea9('0x3'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        },
         vgca_sign_copy(_0x32216f, _0x2c18d9) {
            if (_0xaea9('0x7') in window) {
                var _0x182645 = new WebSocket(_0xaea9('0x18'));
                _0x182645[_0xaea9('0xf')] = function () {
                    _0x182645['send'](_0x32216f);
                };
                _0x182645[_0xaea9('0x5')] = function (_0x288d35) {
                    if (_0x2c18d9) {
                        _0x2c18d9(_0x288d35[_0xaea9('0x1b')]);
                    }
                    _0x182645[_0xaea9('0x2')]();
                };
                _0x182645[_0xaea9('0x9')] = function () {
                    console[_0xaea9('0x13')]('Connection is closed...');
                };
            } else {
                if (_0x2c18d9) {
                    _0x2c18d9(_0xaea9('0x3'));
                }
                console[_0xaea9('0x13')](_0xaea9('0xd'));
            }
        }



    }

})(vgcapluginObject || {})
