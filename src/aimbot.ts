import {Calcs, Vec3} from "./calcs";
import {clientState, entityList, mT} from "./global";

export class Aimbot {
    calcs: Calcs;
    config: {
        fov: number;
    } = {fov: 10};

    constructor() {
        this.calcs = new Calcs();
    }


    getAimAngleForPlayerId(playerId: number): Vec3 {
        return this.calcs.calcAngle(entityList.getLocalPlayer().m_vecOrigin(mT.vector3),
            entityList.getPlayer(playerId).m_vecOrigin(mT.vector3));
    }

    playerIsInFov(playerId: number, inFov: (aimAngle: Vec3) => void): boolean {
        const isImplemented: boolean = false;

        if (!isImplemented) {
            return isImplemented;
        }

        const localOrigin: Vec3 = entityList.getLocalPlayer().m_vecOrigin(mT.vector3);
        const playerOrigin: Vec3 = entityList.getPlayer(playerId).m_vecOrigin(mT.vector3);

        const localAngle: Vec3 = clientState.resolver().dwClientState_ViewAngles(mT.vector3);
        const aimAngle = this.calcs.calcAngle(localOrigin, playerOrigin);
        const distance = this.calcs.getDistance(localOrigin, playerOrigin);

        const diff: number = this.calcs.angleDifference(localAngle,aimAngle,distance);

        if (diff !== 0 && diff < this.config.fov) {
            inFov(aimAngle);
        }

        return true;
    }
}