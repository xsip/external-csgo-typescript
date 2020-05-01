import {Vec3} from "../../math/extendedMath.service";

export interface Entity {
    health: number;
    team: number;
    origin: Vec3;
    vecView: Vec3;
    headBoneOrigin: Vec3;
    lifeState: number
}