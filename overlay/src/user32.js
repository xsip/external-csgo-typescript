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
const ffi = __importStar(require("ffi-napi"));
const ref = __importStar(require("ref-napi"));
const ref_struct_napi_1 = __importDefault(require("ref-struct-napi"));
const lpctstr = {
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
const lpdwordPtr = ref.refType(ref.types.ulong);
const rectStruct = ref_struct_napi_1.default({
    left: 'long',
    top: 'long',
    right: 'long',
    bottom: 'long',
});
const rectPtr = ref.refType(rectStruct);
class User32 {
    constructor() {
        this.getWindowRect = (windowName) => {
            const hwnd = this.user32.FindWindowW(null, windowName);
            this.user32.SetForegroundWindow(hwnd);
            const rec_struct = new rectStruct;
            var Rect = this.user32.GetWindowRect(hwnd, rec_struct['ref.buffer']);
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
}
exports.User32 = User32;
//# sourceMappingURL=user32.js.map