
import {dumpedOffsets, MemoryTypesForNetvars} from "./offsets";
import {gM, rpm, mT, rbf, createResolver} from "./global";

import {Resolver} from "../typings/typings";
import {Vec3} from "./extended.math";
import {Entity} from "./entity";

interface EntityResolver extends Resolver<typeof dumpedOffsets.netvars> {
    base?: any;
}

interface BasicPlayer {
    m_iHealth: number;
    m_iTeamNum: number;
    headBoneOrigin: Vec3;
    m_vecViewOrigin: Vec3;
    m_Origin: Vec3;
}

export class EntityList {
    private entityListBaseAddress;
    private entityPointerByIndex: { [index: number]: any } = {};
    private _entity: Entity[] = [];
    constructor() {
        this.entityListBaseAddress = gM('client_panorama.dll').modBaseAddr + dumpedOffsets.signatures.dwEntityList;
    }
    public entity = (entityIndex: number) => this._entity[entityIndex];
    private getResolver(entityIndex: number): EntityResolver {
        this.entityPointerByIndex[entityIndex] = rpm(this.entityListBaseAddress + 0x10 * entityIndex, mT.dword);
        return this.buildResolver(entityIndex);
    }

    private buildResolver(entityIndex: number): EntityResolver {
        const resolver: EntityResolver = createResolver<typeof dumpedOffsets.netvars>(this.entityPointerByIndex[entityIndex], dumpedOffsets.netvars, MemoryTypesForNetvars, {},);
        resolver.base = this.entityPointerByIndex[entityIndex];
        return resolver;
    }

    update(entityIndex: number) {
        const p = this.getResolver(entityIndex);
        this._entity[entityIndex] = {
            health: p.m_iHealth(),
            team: p.m_iTeamNum(),
            origin: p.m_vecOrigin(),
            vecView: p.m_vecViewOffset(),
            lifeState: p.m_lifeState(),
            headBoneOrigin: this.getBonePositionByResolver(p,8),
        }
    }

    getBonePositionByResolver(entity: EntityResolver, bone: number): Vec3 {
        const boneBase = entity.m_dwBoneMatrix(mT.dword);
        const boneMatrixBuffer: Buffer = rbf(boneBase + (0x30 * bone), 64);
        const boneMatrixList: number[] = [];
        for (let i = 0; i < 16; i++) {
            boneMatrixList[i] = boneMatrixBuffer.readFloatLE(i * 0x4);
        }
        return {x: boneMatrixList[3], y: boneMatrixList[7], z: boneMatrixList[13]};
    }

    readBasicPlayerData(playerNo: number): BasicPlayer {
        const player = this.getResolver(playerNo);
        const playerBuffer: Buffer = rbf(player.base, 0x138);
        return {
            m_iHealth: playerBuffer.readInt32LE(dumpedOffsets.netvars.m_iHealth),
            m_iTeamNum: playerBuffer.readInt32LE(dumpedOffsets.netvars.m_iHealth),
            m_Origin: {
                x: playerBuffer.readFloatLE(dumpedOffsets.netvars.m_vecOrigin),
                y: playerBuffer.readFloatLE(dumpedOffsets.netvars.m_vecOrigin + 0x4),
                z: playerBuffer.readFloatLE(dumpedOffsets.netvars.m_vecOrigin + 0x8),
            },
            m_vecViewOrigin: {
                x: playerBuffer.readFloatLE(dumpedOffsets.netvars.m_vecViewOffset),
                y: playerBuffer.readFloatLE(dumpedOffsets.netvars.m_vecViewOffset + 0x4),
                z: playerBuffer.readFloatLE(dumpedOffsets.netvars.m_vecViewOffset + 0x8),
            },
            headBoneOrigin: this.getBonePositionByResolver(player, 8),
        }
    }

}