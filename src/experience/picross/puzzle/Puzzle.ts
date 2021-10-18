import { Event, Object3D, Scene, Vector3 } from "three";
import Experience from "../../Experience";
import Block from "../figure/block/Block";
import Figure from "../figure/Figure";
import { IPicrossObject } from "../PicrossObject";

export class Puzzle implements IPicrossObject {
    private destroyableBlocks: Block[] = [];
    private experience: Experience;
    private scene: Scene;

    public constructor(private figure: Figure) {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.generate();
        this.scene.add(...this.getBlocks());
    }

    public getBlocks(): Block[] {
        return [...this.figure.getBlocks(), ...this.destroyableBlocks];
    }

    public getBlock(positionOrObject: Object3D<Event> | Vector3): Block | null {
        if (positionOrObject instanceof Vector3) {
            return this.getBlocks().find(block => block.figurePosition.equals(positionOrObject)) ?? null;
        }
        return this.getBlocks().find(block => block === positionOrObject) ?? null;
    }

    public addDestroyableBlock(block: Block) {
        this.destroyableBlocks.push(block);
    }

    public getFigure(): Figure {
        return this.figure
    }

    public dispose(): void {
        this.scene.remove(...this.getBlocks());
        this.getBlocks().forEach(block => {
            block.getMaterial().dispose();
            block.geometry.dispose();
        });
        this.figure.dispose();
    }

    private generate(): void {
        const xPositions = this.figure.getBlocks().map(block => block.figurePosition.x);
        const minX = Math.min(...xPositions);
        const maxX = Math.max(...xPositions);
        
        const yPositions = this.figure.getBlocks().map(block => block.figurePosition.y);
        const minY = Math.min(...yPositions);
        const maxY = Math.max(...yPositions);
        
        const zPositions = this.figure.getBlocks().map(block => block.figurePosition.z);
        const minZ = Math.min(...zPositions);
        const maxZ = Math.max(...zPositions);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    if (this.figure.getBlock(new Vector3(x, y, z)) === null) {
                        this.addDestroyableBlock(new Block({ x, y, z, isInitial: false, opacity: 1, destroyable: true }, this.figure))
                    }
                }
            }
        }
    }
}