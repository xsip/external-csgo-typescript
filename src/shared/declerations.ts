import {EMemoryTypes} from "../process/process.interfaces";
import {ProcessService} from "../process/process.service";
import {IModuleListEntry, Resolver} from "../../typings/typings";
import {ClientStateService} from "../game/clientState/clientState.service";
import {RadarService} from "../features/radar.service";
import {EntityList} from "../game/entity/entity.service";
import {AimbotService} from "../features/aimbot.service";
import {Entity} from "../game/entity/entity.interfaces";
import {RendererService} from "../game/renderer/renderer.service";


const notInitializedFunc = () => {
    throw Error('Globals not initialized!!');
};

export let proc: ProcessService;
export let gM: (moduleName: string) => IModuleListEntry = notInitializedFunc;
export let rpm: typeof ProcessService.prototype.readMemory = notInitializedFunc;
export let rbf: typeof ProcessService.prototype.readBuffer = notInitializedFunc;
export let wpm: typeof ProcessService.prototype.writeMemory = notInitializedFunc;
export const mT = EMemoryTypes;

let entityList: EntityList;

export let clientState: ClientStateService;
export let renderer: RendererService;
export let aimbot: AimbotService;
export let radar: RadarService;

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
export const hackBase = ( forEachPlayer: (enemy: Entity, localPlayer: Entity, entityIndex: number) => void, onUpdate: () => void,) => {

    proc = new ProcessService('csgo.exe');
    gM = proc.getModule.bind(proc);
    rpm = proc.readMemory.bind(proc);
    rbf = proc.readBuffer.bind(proc);
    wpm = proc.writeMemory.bind(proc);

    clientState = new ClientStateService();
    entityList = new EntityList();
    radar = new RadarService();
    aimbot = new AimbotService();
    renderer = new RendererService();
    console.log('hack initialized..\nstarting main loop..');

    const update = () => {
        clientState.update();
        entityList.update(clientState.localEntityIndex);
        renderer.readViewMatrix();
    };

    update();

    const main = setInterval(() => {
        const localEntity: Entity = entityList.entity(clientState.localEntityIndex);

        for (let i = 0; i < clientState.maxEntitys; i++) {
            entityList.update(i);
            const entity = entityList.entity(i);
            if (entity &&  entity.lifeState === 0) {
                if ((entity.team === 2 || entity.team === 3)) {
                    forEachPlayer(entity, localEntity, i);
                }
            }
        }

        update();
        onUpdate();
    }, 0);


};