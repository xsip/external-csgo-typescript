import {gM, rbf} from "../shared/declerations";
import {dumpedOffsets} from "../game/offsets";
import {ExtendedMath, Vec3, Vec2} from "../math/extendedMath.service";
import {Entity} from "../game/entity/entity.interfaces";

export class RadarService {
    // always zero!! Canvas gets moved in the frontend
    radarPosition: { x: number; y: number } = {x: 0, y: 0};
    frontendRadarPosition: { x: number; y: number } = {x: 13, y: 50};
    radarSize: number = 165;

    constructor() {
    }

    calculateRadarPositionForEntity(entity: Entity, localEntity: Entity, viewAngles: Vec3): Vec2 {

        const direction: Vec3 = {x: 0, y: 0, z: 0};
        direction.x = -(entity.origin.y - localEntity.origin.y);
        direction.y = entity.origin.x - localEntity.origin.x;

        const radian = ExtendedMath.DEG2RAD(viewAngles.y - 90.0);

        const dotPos: Vec2 = {x: 0, y: 0};

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

    setRadarSize(size: number) {
        this.radarSize = size;
    }

    setRadarPos(pos: { x: number; y: number; }) {
        this.frontendRadarPosition = pos;
    }

    viewMatrix: any[] = [];

    getViewMatrix() {
        const viewMatOffset = gM('client_panorama.dll').modBaseAddr + dumpedOffsets.signatures.dwViewMatrix;
        const matBuffer: Buffer = rbf(viewMatOffset, 64);

        for (let i = 0; i < 16; i++) {
            this.viewMatrix[i] = matBuffer.readFloatLE(i * 0x4);
        }
    }

}