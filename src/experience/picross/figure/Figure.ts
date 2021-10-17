import { ExtrudeBufferGeometry, Object3D, Scene, Shape, Vector3 } from "three";
import { nameof } from "../../../shared/HelperFunctions";
import Experience from "../../Experience";
import { IPicrossObject } from "../PicrossObject";
import Block from "./block/Block";
import IBlockProperties from "./block/IBlockProperties";
import ITweakableFigureProperties from "./ITweakableFigureProperties";

export default class Figure implements IPicrossObject {
    private blockGeometry;
    private tweakableProperties: ITweakableFigureProperties = {
        blockRadius: 0.05,
        blockSmoothness: 7,
        blockWidth: 1,
        blockHeight: 1,
        blockDepth: 1,
        marginBetweenBlocks: 0.015
    };
    private scene: Scene;
    private experience: Experience;
    private tweakInputs: any[] = [];
    private blocks: Block[] = [];

    constructor(blockOptions: IBlockProperties[]) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.setTweaks();
        this.blockGeometry = this.createBlockGeometry();

        this.blocks = blockOptions.map(blockOption =>
            new Block({
                ...blockOption,
                color: blockOption.isInitial === true ? '#ffffff' : null
            }, this)
        );

        this.scene.add(...this.blocks);
    }

    public addBlock(block: Block) {
        if (this.getBlock(block.figurePosition) === null) {
            this.blocks.push(block);
            this.scene.add(block);
        }
    }

    public removeBlock(block: Block) {
        this.scene.remove(block);
        this.blocks = this.blocks.filter(x => x !== block);
    }

    public getBlock(positionOrObject: Vector3 | Object3D): Block | null {
        if (positionOrObject instanceof Vector3) {
            return this.blocks.find(block => block.figurePosition.equals(positionOrObject)) ?? null;
        }
        return this.blocks.find(block => block === positionOrObject) ?? null;
    }

    public getBlocks() {
        return this.blocks;
    }

    public getBlockGeometry() {
        return this.blockGeometry;
    }

    public getTweakableProperties() {
        return this.tweakableProperties;
    }

    public clone(): Figure {
        return new Figure(this.blocks.map(x => ({ ...x.figurePosition, isInitial: x.isInitial, opacity: 1, destroyable: false }))!);
    }

    public dispose() {
        this.blockGeometry.dispose();
        this.tweakInputs.forEach(tweakInput => tweakInput.dispose());
        this.blocks.forEach(block => {
            block.getMaterial().dispose();
            block.geometry.dispose();
        });
        this.scene.remove(...this.blocks);
        this.blocks = [];
    }

    private setTweaks() {
        const blockFolder = this.experience.tweakpane.folders.block;
        blockFolder.on('change', this.updateTweakableProperties.bind(this));
        this.tweakInputs = [
            blockFolder.addInput(this.tweakableProperties, nameof<ITweakableFigureProperties>("blockRadius"), { min: 0, max: 0.5, label: 'Radius' }),
            blockFolder.addInput(this.tweakableProperties, nameof<ITweakableFigureProperties>("blockSmoothness"), { min: 1, max: 10, step: 1, label: 'Smoothness' }),
            blockFolder.addInput(this.tweakableProperties, nameof<ITweakableFigureProperties>("blockWidth"), { min: 0.25, max: 10, label: 'Width' }),
            blockFolder.addInput(this.tweakableProperties, nameof<ITweakableFigureProperties>("blockHeight"), { min: 0.25, max: 10, label: 'Height' }),
            blockFolder.addInput(this.tweakableProperties, nameof<ITweakableFigureProperties>("blockDepth"), { min: 0.25, max: 10, label: 'Depth' }),
            blockFolder.addInput(this.tweakableProperties, nameof<ITweakableFigureProperties>("marginBetweenBlocks"), { min: 0, max: 0.5, label: 'Margin' })
        ];
    }

    private updateTweakableProperties() {
        this.blockGeometry = this.createBlockGeometry();
        this.blocks.forEach(block => {
            block.geometry = this.blockGeometry;
            block.updatePosition();
        });
    }

    private createBlockGeometry() {
        const { blockWidth: width, blockHeight: height, blockDepth: depth, blockRadius: radius, blockSmoothness: smoothness } = this.tweakableProperties;
        const shape = new Shape();
        const eps = 0.00001;
        const radius0 = radius - eps;
        shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
        shape.absarc(eps, height - radius0 * 2, eps, Math.PI, Math.PI / 2, true);
        shape.absarc(width - radius0 * 2, height - radius0 * 2, eps, Math.PI / 2, 0, true);
        shape.absarc(width - radius0 * 2, eps, eps, 0, -Math.PI / 2, true);
        const geometry = new ExtrudeBufferGeometry(shape, {
            depth: depth - radius * 2,
            bevelEnabled: true,
            bevelSegments: smoothness * 2,
            steps: 1,
            bevelSize: radius0,
            bevelThickness: radius,
            curveSegments: smoothness
        });

        geometry.center();

        return geometry;
    }
}