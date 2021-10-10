import { BufferGeometry, ExtrudeBufferGeometry, MeshMatcapMaterial, Shape, Vector3 } from "three";
import { TpChangeEvent } from "tweakpane";
import Experience from "../../Experience";
import Block from "../block/Block";
import { IBlockGeometryProperties } from "../block/IBlockGeometryProperties";
import IBlockProperties from "../block/IBlockProperties";
import ITweakableFigureProperties from "./ITweakableFigureProperties";

export default class Figure {
    public tweakableProperties: ITweakableFigureProperties = {
        initialBlockColor: '#999999',
        defaultColor: '#b8ebff',
        hoverColor: '#8fdfff',
        radius: 0.05,
        smoothness: 5,
        width: 1,
        height: 1,
        depth: 1,
        margin: 0.025
    };
    public blockGeometry: BufferGeometry;
    public blocks: Block[] = [];

    private experience: Experience;

    constructor(blockOptions: IBlockProperties[]) {
        this.experience = new Experience();
        this.setTweaks();

        this.blockGeometry = this.createBlockGeometry(this.tweakableProperties);
        this.blocks = blockOptions.map(blockOptions => new Block({
            ...blockOptions,
            color: blockOptions.isInitial === true ? this.tweakableProperties.initialBlockColor : this.tweakableProperties.defaultColor
        }, this.blockGeometry));
    }

    public updateTweakableProperties(tweakableFigureProperties: ITweakableFigureProperties, updateGeometry: boolean) {
        this.tweakableProperties.defaultColor = tweakableFigureProperties.defaultColor;
        this.tweakableProperties.hoverColor = tweakableFigureProperties.hoverColor;
        this.blockGeometry = this.createBlockGeometry(tweakableFigureProperties);
        
        this.blocks.forEach(block => {
            if (block.isInitial) {
                (block.material as MeshMatcapMaterial).color.set(this.tweakableProperties.initialBlockColor);
            } else {
                (block.material as MeshMatcapMaterial).color.set(block.isBeingHovered ? this.tweakableProperties.hoverColor : this.tweakableProperties.defaultColor);
            }

            if (updateGeometry) {
                block.geometry = this.blockGeometry;
            }

            this.setBlockPosition(block, block.figurePosition);
        });
    }

    public setBlockPosition(block: Block, figurePosition: Vector3) {
        block.position.set(
            figurePosition.x ? figurePosition.x * this.tweakableProperties.width + figurePosition.x * this.tweakableProperties.margin : 0,
            figurePosition.y ? figurePosition.y * this.tweakableProperties.height + figurePosition.y * this.tweakableProperties.margin : 0,
            figurePosition.z ? figurePosition.z * this.tweakableProperties.depth + figurePosition.z * this.tweakableProperties.margin : 0
        )
    }

    private createBlockGeometry({ width, height, depth, radius, smoothness }: IBlockGeometryProperties) {
        let shape = new Shape();
        let eps = 0.00001;
        let radius0 = radius - eps;
        shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
        shape.absarc(eps, height - radius0 * 2, eps, Math.PI, Math.PI / 2, true);
        shape.absarc(width - radius0 * 2, height - radius0 * 2, eps, Math.PI / 2, 0, true);
        shape.absarc(width - radius0 * 2, eps, eps, 0, -Math.PI / 2, true);
        let geometry = new ExtrudeBufferGeometry(shape, {
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

    setTweaks() {
        if ((this.experience.config as any).debug != true) {
            return;
        }

        this.experience.tweakpane!.folders.block.on('change', (event: TpChangeEvent) => {
            const mustUpdateGeometry = ['blockWidth', 'blockHeight', 'blockDepth', 'blockRadius', 'blockSmoothness'].includes(event.presetKey);
            if (mustUpdateGeometry) {
                if (event.last) {
                    this.updateTweakableProperties(this.tweakableProperties, mustUpdateGeometry)
                }
            }
            else {
                this.updateTweakableProperties(this.tweakableProperties, false)
            }
        })
        this.experience.tweakpane!.folders.block.addInput(this.tweakableProperties, 'defaultColor');
        this.experience.tweakpane!.folders.block.addInput(this.tweakableProperties, 'hoverColor');
        this.experience.tweakpane!.folders.block.addInput(this.tweakableProperties, 'radius', { min: 0, max: 0.5, presetKey: 'blockRadius' });
        this.experience.tweakpane!.folders.block.addInput(this.tweakableProperties, 'smoothness', { min: 1, max: 10, step: 1, presetKey: 'blockSmoothness' });
        this.experience.tweakpane!.folders.block.addInput(this.tweakableProperties, 'width', { min: 0.25, max: 10, presetKey: 'blockWidth' });
        this.experience.tweakpane!.folders.block.addInput(this.tweakableProperties, 'height', { min: 0.25, max: 10, presetKey: 'blockHeight' });
        this.experience.tweakpane!.folders.block.addInput(this.tweakableProperties, 'depth', { min: 0.25, max: 10, presetKey: 'blockDepth' });
        this.experience.tweakpane!.folders.block.addInput(this.tweakableProperties, 'margin', { min: 0, max: 0.5 });
    }
}