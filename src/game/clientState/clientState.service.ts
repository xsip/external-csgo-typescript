import {createResolver, gM, mT, rpm} from "../../shared/declerations";
import {dumpedOffsets, TypesForSignatures} from "../offsets";
import {Resolver} from "../../../typings/typings";
import {Vec3} from "../../math/extendedMath.service";

export class ClientStateService {

    public set viewAngles(angles: Vec3) {
        this.resolver().set.dwClientState_ViewAngles(angles);
    }

    public get viewAngles(): Vec3 {
        return this._viewAngles;
    }

    public currentMap: string = '';

    public maxEntitys: number = 0;
    public localEntityIndex: number;


    private clientStateBase;
    private _resolver: Resolver<typeof dumpedOffsets.signatures>;
    private _viewAngles = {x: 0, y: 0, z: 0};


    constructor() {
        this.clientStateBase = rpm(gM('engine.dll').modBaseAddr + dumpedOffsets.signatures.dwClientState, mT.dword);
    }


    update() {
        const resolver = this.resolver();
        this._viewAngles = resolver.dwClientState_ViewAngles();
        this.currentMap = resolver.dwClientState_Map();
        this.maxEntitys = resolver.dwClientState_MaxPlayer();
        this.localEntityIndex = resolver.dwClientState_GetLocalPlayer();
    }

    private resolver(): Resolver<typeof dumpedOffsets.signatures> {
        if (!this._resolver) {
            this._resolver = createResolver<typeof dumpedOffsets.signatures>(this.clientStateBase, dumpedOffsets.signatures, TypesForSignatures, {},);
        }
        return this._resolver;
    }

}