import {clientState, entityList, mT} from "./global";
import {EntityResolver} from "./entityList";

export class Radar {
    radarPosition: { x: number; y: number } = {x: 0, y: 0};
    radarSize: number = 200;

    constructor() {
    }

    DEG2RAD(degrees: number) {
        return degrees * (Math.PI / 180);
    }

    localPlayer;
    localPlayerPos;
    localAngels;

    readLocalPlayer() {
        this.localPlayer = entityList.getLocalPlayer();
        this.localPlayerPos = this.localPlayer.m_vecOrigin(mT.vector3);
        this.localAngels = this.localPlayer.m_angEyeAnglesX(mT.vector3);
    }
    updateLocalPlayer(lp: EntityResolver) {
        this.localPlayer = lp;
        this.localPlayerPos = this.localPlayer.m_vecOrigin(mT.vector3);
        this.localAngels = clientState.resolver().dwClientState_ViewAngles(mT.vector3); // this.localPlayer.m_angEyeAnglesX(mT.vector3);
    }
    calculateRadarPosition(playerNo: number): { x?: number; y?: number } {

        const localAngels = this.localAngels;
        const localPlayerPos = this.localPlayerPos;
        const player = entityList.getPlayer(playerNo);
        const playerPos = player.m_vecOrigin(mT.vector3);

        const direction: { x?: number; y?: number; z?: number } = {};
        direction.x = -(playerPos.y - localPlayerPos.y);
        direction.y = playerPos.x - localPlayerPos.x;

        const radian = this.DEG2RAD(localAngels.y - 90.0);

        const dotPos: { x?: number; y?: number } = {};

        dotPos.x = (direction.y * Math.cos(radian) - direction.x * Math.sin(radian)) / 20.0;
        dotPos.y = (direction.y * Math.sin(radian) + direction.x * Math.cos(radian)) / 20.0;

        // Add RadarPos To Calculated DotPos
        dotPos.x += this.radarPosition.x + this.radarSize / 2;
        dotPos.y += this.radarPosition.y + this.radarSize / 2;

        // Clamp Dots To RadarSize ( Where 5 = Width/Height of the Dot)
        if (dotPos.x < this.radarPosition.x)
            dotPos.x = this.radarPosition.x;

        if (dotPos.x > this.radarPosition.x + this.radarSize - 5)
            dotPos.x = this.radarPosition.x + this.radarSize - 5;

        if (dotPos.y < this.radarPosition.y)
            dotPos.y = this.radarPosition.y;

        if (dotPos.y > this.radarPosition.y + this.radarSize - 5)
            dotPos.y = this.radarPosition.y + this.radarSize - 5;

        return dotPos;

    }
}