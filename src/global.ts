import {EMemoryTypes} from "./interfaces";
import {ProcessInstance} from "./process.instance";
import {Resolver} from "../typings/typings";
import {ClientState} from "./clientState";
import {Radar} from "./radar";
import {EntityList} from "./entityList";
import {Aimbot} from "./aimbot";
import {Entity} from "./entity";
import {Vec3} from "./extended.math";


const notInitializedFunc = () => {
    throw Error('Globals not initialized!!');
};

export let proc: ProcessInstance;
export let gM: typeof ProcessInstance.prototype.getModule = notInitializedFunc;
export let rpm: typeof ProcessInstance.prototype.readMemory = notInitializedFunc;
export let rbf: typeof ProcessInstance.prototype.readBuffer = notInitializedFunc;
export let wpm: typeof ProcessInstance.prototype.writeMemory = notInitializedFunc;
export const mT = EMemoryTypes;


let clientState: ClientState;
let entityList: EntityList;

export let aimbot: Aimbot;
export let radar: Radar;
export let wsConnections: any[] = [];

export const removeFromWsConnections = (ws) => {
    wsConnections = wsConnections.filter(w => w != ws);
    console.log(wsConnections);
};

export const createResolver = <T, U = {}>(baseOffset: any, offsetList: T, typesForSignatures?: {[index: string]: EMemoryTypes}, extendBy?: U,): Resolver<T> => {

    let resolver: Resolver<typeof offsetList> & U = {
        base: baseOffset,
        ...extendBy ? extendBy : {},
        set: {},
    } as Resolver<typeof offsetList> & U;

    for (let k in offsetList as Object) {
        resolver[k] = (type?: EMemoryTypes) => {
            return rpm(resolver.base + offsetList[k],type ? type : typesForSignatures[k]);
        };
        resolver.set[k] = (value: any, type?: EMemoryTypes) => {
            wpm(resolver.base + offsetList[k], value,  type ? type : typesForSignatures[k]);
        }
    }

    return resolver;

};
process.title = 'External Cs go!';
export const hackBase = ( forEachPlayer: (enemy: Entity, localPlayer: Entity, localViewAngles: Vec3, entityIndex: number, clientState: ClientState) => void, afterLoop: (clientState: ClientState) => void,) => {

    proc = new ProcessInstance('csgo.exe');
    gM = proc.getModule.bind(proc);
    rpm = proc.readMemory.bind(proc);
    rbf = proc.readBuffer.bind(proc);
    wpm = proc.writeMemory.bind(proc);

    clientState = new ClientState();
    entityList = new EntityList();
    radar = new Radar();
    aimbot = new Aimbot();
    console.log('hack initialized..\nstarting main loop..');

    clientState.update();
    entityList.update(clientState.localEntityIndex);

    const main = setInterval(() => {
        const localEntity: Entity = entityList.entity(clientState.localEntityIndex);

        for (let i = 0; i < clientState.maxEntitys; i++) {
            entityList.update(i);
            const entity = entityList.entity(i);
            if (entity && /*entity.m_iHealth(mT.int) > 1 &&*/ entity.lifeState === 0) {
                if ((entity.team === 2 || entity.team === 3) /*&& enemyTeam !== localEntity.m_iTeamNum(mT.int)*/) {
                    forEachPlayer(entity, localEntity, clientState.viewAngles, i, clientState);
                }
            }
        }
        entityList.update(clientState.localEntityIndex);
        clientState.update();
        afterLoop(clientState);

    }, 0);


};