import {EMemoryTypes} from "./interfaces";
import {ProcessInstance} from "./process.instance";
import {Resolver} from "../typings/typings";
import {ClientState} from "./clientState";
import {Radar} from "./radar";
import {EntityList, EntityResolver} from "./entityList";
import {Aimbot} from "./aimbot";

const notInitializedFunc = () => {
    throw Error('Globals not initialized!!');
};

export let proc: ProcessInstance;
export let gM: typeof ProcessInstance.prototype.getModule = notInitializedFunc;
export let rpm: typeof ProcessInstance.prototype.readMemory = notInitializedFunc;
export let wpm: typeof ProcessInstance.prototype.writeMemory = notInitializedFunc;
export const mT = EMemoryTypes;


export let clientState: ClientState;
export let aimbot: Aimbot;
export let entityList: EntityList;
export let radar: Radar;
export let wsConnections: any[] = [];

export const removeFromWsConnections = (ws) => {
    wsConnections = wsConnections.filter(w => w != ws);
    console.log(wsConnections);
};

export const createResolver = <T, U = {}>(baseOffset: any, offsetList: T, extendBy?: U): Resolver<T> => {

    let resolver: Resolver<typeof offsetList> & U = {
        base: baseOffset,
        ...extendBy ? extendBy : {},
        set: {},
    } as Resolver<typeof offsetList> & U;

    for (let k in offsetList as Object) {
        resolver[k] = (type: EMemoryTypes) => {
            return rpm(resolver.base + offsetList[k], type);
        };
        resolver.set[k] = (value: any, type: EMemoryTypes) => {
            wpm(resolver.base + offsetList[k], value, type);
        }
    }

    return resolver;

};
process.title = 'External Cs go!';
export const initHack = (processName: string, forEachPlayer: (enemy: EntityResolver, localPlayer: EntityResolver, i?: number) => void, afterLoop: () => void) => {

    proc = new ProcessInstance(processName);
    gM = proc.getModule.bind(proc);
    rpm = proc.readMemory.bind(proc);
    wpm = proc.writeMemory.bind(proc);

    clientState = new ClientState();
    entityList = new EntityList(clientState);
    radar = new Radar();
    aimbot = new Aimbot();
    console.log('hack initialized..\nstarting main loop..');
    const main = setInterval(() => {
        // radar.readLocalPlayer();
        const localPlayer: EntityResolver = entityList.getLocalPlayer();
        radar.updateLocalPlayer(localPlayer);
        const maxPlayer: number = clientState.resolver().dwClientState_MaxPlayer(mT.int);

        for (let i = 0; i < maxPlayer; i++) {

            const entity = entityList.getPlayer(i);
            if (entity && /*entity.m_iHealth(mT.int) > 1 &&*/ entity.m_lifeState(mT.int) === 0) {
                let enemyTeam: number = entity.m_iTeamNum(mT.int);
                if ((enemyTeam === 2 || enemyTeam === 3) /*&& enemyTeam !== localPlayer.m_iTeamNum(mT.int)*/) {
                    forEachPlayer(entity, localPlayer, i);
                }
            }
        }
        afterLoop();

    }, 0);


};