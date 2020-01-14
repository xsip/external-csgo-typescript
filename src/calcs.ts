export interface Vec3 {
    x: number;
    y: number;
    z: number;
}
// TODO: implement aimbot calculations
export class Calcs {
    constructor() {

    }

    subVec(from: Vec3, sub: Vec3): Vec3 {
        return {
            x: from.x - sub.x,
            y: from.y - sub.y,
            z: from.z - sub.z,
        }
    }

    calcAngle(src: Vec3, dst: Vec3): Vec3 {
        let angles: Vec3 = {} as Vec3;
        return angles;
    }

    deg2Rad(deg: number) {
        return (deg * Math.PI) / 180;
    }

    dotProduct(a: Vec3, b: Vec3 = {x: 0, y: 0, z: 0}) {
        return (a.x * b.x + a.y * b.y + a.z * b.z);
    }

    getDistance(playerPos: Vec3, entityPos: Vec3): number {
        return Math.sqrt(this.dotProduct(this.subVec(entityPos, playerPos)));
    }

    angleDifference(viewAngles: Vec3, targetAngles: Vec3, Distance): number {
        return 0;
    }
}