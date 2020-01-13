"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ffi = __importStar(require("ffi-napi"));
var ref = __importStar(require("ref-napi"));
var ref_struct_napi_1 = __importDefault(require("ref-struct-napi"));
var lpctstr = {
    name: 'lpctstr',
    indirection: 1,
    size: ref.sizeof.pointer,
    get: function (buffer, offset) {
        var _buf = buffer.readPointer(offset);
        if (_buf.isNull()) {
            return null;
        }
        return _buf.readCString(0);
    },
    set: function (buffer, offset, value) {
        var _buf = ref.allocCString(value, 'ucs2');
        return buffer.writePointer(_buf, offset);
    },
    ffi_type: ffi.types.CString.ffi_type
};
var lpdwordPtr = ref.refType(ref.types.ulong);
var rectStruct = ref_struct_napi_1.default({
    left: 'long',
    top: 'long',
    right: 'long',
    bottom: 'long',
});
var rectPtr = ref.refType(rectStruct);
var User32 = /** @class */ (function () {
    function User32() {
        var _this = this;
        this.getWindowRect = function (windowName) {
            var hwnd = _this.user32.FindWindowW(null, windowName);
            _this.user32.SetForegroundWindow(hwnd);
            var rec_struct = new rectStruct;
            var Rect = _this.user32.GetWindowRect(hwnd, rec_struct['ref.buffer']);
            return rec_struct;
        };
        this.user32 = ffi.Library('user32', {
            FindWindowW: ['int', [lpctstr, lpctstr]],
            GetWindowThreadProcessId: ['int', ['int', lpdwordPtr]],
            SetForegroundWindow: ['bool', ['int']],
            // GetWindowRect: [rectPtr, ['int']]
            GetWindowRect: ['bool', ['long', rectPtr]]
        });
    }
    return User32;
}());
exports.User32 = User32;
//# sourceMappingURL=user32.js.map