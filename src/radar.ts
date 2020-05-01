import {gM, rbf} from "./global";
import {dumpedOffsets} from "./offsets";
import {ExtendedMath, Vec3, Vec2} from "./extended.math";
import {Entity} from "./entity";

export class Radar {
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

    getViewMatrix2() {
        const viewMatOffset = gM('client_panorama.dll').modBaseAddr + dumpedOffsets.signatures.dwViewMatrix;
        const matBuffer: Buffer = rbf(viewMatOffset, 64);

        for (let i = 0; i < 16; i++) {
            this.viewMatrix[i] = matBuffer.readFloatLE(i * 0x4);
        }
    }


    w2s2(from: Vec3, width: number = 1280, height: number = 720) {
        this.getViewMatrix2();
        let w: number;
        const ret: Vec2 = {} as Vec2;

        ret.x = this.viewMatrix[0] * from.x + this.viewMatrix[1] * from.y + this.viewMatrix[2] * from.z + this.viewMatrix[3];
        ret.y = this.viewMatrix[4] * from.x + this.viewMatrix[5] * from.y + this.viewMatrix[6] * from.z + this.viewMatrix[7];
        w = this.viewMatrix[12] * from.x + this.viewMatrix[13] * from.y + this.viewMatrix[14] * from.z + this.viewMatrix[15];
        if (w < 0.01) {
            return {x: 0, y: 0};
        }

        let invw: number = 1.0 / w;

        ret.x *= invw;
        ret.y *= invw;

        let x: number = width / 2;
        let y: number = height / 2;

        x += 0.5 * ret.x * width + 0.5;
        y -= 0.5 * ret.y * height + 0.5;

        ret.x = x;
        ret.y = y;
        return ret;
    }
}