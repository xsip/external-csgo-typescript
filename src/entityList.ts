import {EMemoryTypes} from "./interfaces";
import {dumpedOffsets, Netvars} from "./offsets";
import {gM, rpm, mT} from "./global";
import {ClientState} from "./clientState";
import {Resolver} from "../typings/typings";

interface EntityResolver_ {
    base?: any;
}

export type EntityResolver = Resolver<typeof dumpedOffsets.netvars> & EntityResolver_;

export class EntityList {
    entityListBaseAddress;
    entityForPlayerNo: { [index: number]: any } = {};

    constructor(private clientState: ClientState) {
        this.entityListBaseAddress = gM('client_panorama.dll').modBaseAddr + dumpedOffsets.signatures.dwEntityList;
    }

    getPlayer(playerNo: number): EntityResolver {
        this.entityForPlayerNo[playerNo] = rpm(this.entityListBaseAddress + 0x10 * playerNo, mT.dword);
        return this.buildResolver(playerNo);
    }

    getLocalPlayer(): EntityResolver {
        return this.getPlayer(this.clientState.resolver().dwClientState_GetLocalPlayer(mT.int));
    }

    private buildResolver(playerNo: number): EntityResolver {
        const resolver: EntityResolver = {
            base: this.entityForPlayerNo[playerNo]
        };
        for (let k in dumpedOffsets.netvars) {
            resolver[k] = (type: EMemoryTypes) =>
                rpm(this.entityForPlayerNo[playerNo] + dumpedOffsets.netvars[k], type);
        }
        return resolver;
    }


}