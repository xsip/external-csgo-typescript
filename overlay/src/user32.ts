import * as ffi from 'ffi-napi';
import * as ref from 'ref-napi';
import {default as Struct }from 'ref-struct-napi';

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


const rectStruct = Struct({
    left: 'long',
    top: 'long',
    right: 'long',
    bottom: 'long',
});

const rectPtr = ref.refType(rectStruct);

export interface IRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export class User32 {
    private user32;

    constructor() {
        this.user32 = ffi.Library('user32', {
            FindWindowW: ['int', [lpctstr, lpctstr]],
            GetWindowThreadProcessId: ['int', ['int', lpdwordPtr]],
            SetForegroundWindow: ['bool', ['int']],
            // GetWindowRect: [rectPtr, ['int']]
            GetWindowRect: ['bool', ['long', rectPtr]]
        });
    }

    getWindowRect = (windowName: string): IRect => {
        const hwnd = this.user32.FindWindowW(null, windowName);
        this.user32.SetForegroundWindow(hwnd);
        const rec_struct = new rectStruct;
        var Rect = this.user32.GetWindowRect(hwnd, rec_struct['ref.buffer']);
        return rec_struct;
    }
}