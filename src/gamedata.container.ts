
import {EntityList} from "./entityList";
import {Aimbot} from "./aimbot";
import {Radar} from "./radar";
import {ClientState} from "./clientState";

export class GamedataContainer {

    private clientState: ClientState;
    private entityList;

    private radar = new Radar();
    private aimbot = new Aimbot();

    constructor() {
        this.clientState = new ClientState();
        this.entityList = new EntityList(this.clientState)

    }

    public update(playerLoopIndex: number) {

    }
}