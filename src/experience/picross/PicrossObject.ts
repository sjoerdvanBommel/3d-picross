import Block from "./figure/block/Block";

export interface IPicrossObject {
    getBlocks(): Block[];
    dispose(): void;
}