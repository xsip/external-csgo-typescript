import {ExtendedMath, Vec3} from "../math/extendedMath.service";
import {Entity} from "../game/entity/entity.interfaces";

export class AimbotService {
    config: {
        fov: number;
    } = {fov: 10};

    constructor() {
        /*setInterval(() => {
            this.bonePos++;
            if(this.bonePos > 50) {
                this.bonePos = 0;
            }
            console.log(this.bonePos);
        },2000);*/
    }

    bonePos = 8;

    playerIsInFov(player: Entity, localPlayer: Entity, localViewAngles: Vec3, inFov: (aimAngle: Vec3) => void): boolean {

        const localOrigin: Vec3 = localPlayer.origin;
        const vecView: Vec3 = localPlayer.vecView;
        const playerOrigin: Vec3 = player.headBoneOrigin;

        localOrigin.x += vecView.x;
        localOrigin.y += vecView.y;
        localOrigin.z += vecView.z;


        const aimAngle = ExtendedMath.calcAngle(localOrigin, playerOrigin);
        const distance = ExtendedMath.getDistance(localOrigin, playerOrigin);

        const diff: number = ExtendedMath.angleDifference(localViewAngles, aimAngle, distance);
        // console.log(diff);
        if (diff < this.config.fov) {
            inFov(aimAngle);
        }
        // }
        return true;

    }
}