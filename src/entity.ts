import {Vec3} from "./extended.math";

export interface Entity {
    health: number;
    team: number;
    origin: Vec3;
    vecView: Vec3;
    headBoneOrigin: Vec3;
    lifeState: number
}