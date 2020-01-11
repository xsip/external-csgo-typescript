import {createResolver, gM, mT, rpm} from "./global";
import {dumpedOffsets} from "./offsets";
import {Resolver} from "../typings/typings";

export class ClientState {
    clientStateBase;
    private _resolver: Resolver<typeof dumpedOffsets.signatures>;

    constructor() {
        this.clientStateBase = rpm(gM('engine.dll').modBaseAddr + dumpedOffsets.signatures.dwClientState, mT.dword);
    }

    public resolver(): Resolver<typeof dumpedOffsets.signatures> {
        if (!this._resolver) {
            this._resolver = createResolver<typeof dumpedOffsets.signatures>(this.clientStateBase, dumpedOffsets.signatures);
        }
        return this._resolver;
    }
}