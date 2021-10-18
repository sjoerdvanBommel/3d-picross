import { Object3D, Vector3 } from "three";
import Block from "./figure/block/Block";

export interface IPicrossObject {
    getBlocks(): Block[];
    dispose(): void;
    getBlock(positionOrObject: Vector3 | Object3D): Block | null;
}