import { Intersection, Object3D, Raycaster, Vector3 } from "three";
import Experience from "../../Experience";
import IPointerPositions from "../../utils/pointer/IPointerPositions";
import Block from "../block/Block";
import Figure from "./Figure";

export default class FigureEditor {
    private experience: Experience;
    private raycaster: Raycaster;
    private hoveredBlock: Block | null = null;

    constructor(private figure: Figure) {
        this.experience = new Experience();
        this.raycaster = new Raycaster();

        this.experience.pointer!.on('pointermove', this.pointerMove.bind(this))

        this.experience.pointer!.on('pointerShortLeftClickUp', (position: IPointerPositions) => {
            this.pointerShortLeftClickUp(position)
        })

        this.experience.pointer!.on('pointerShortRightClickUp', (position: IPointerPositions) => {
            this.pointerShortRightClickUp(position)
        })
    }

    private addBlock(intersect: Intersection<Object3D>) {
        const clickedBlock = this.figure.blocks.find(x => x == intersect.object);
        if (clickedBlock) {
            const newBlockDirection = new Vector3(
                Math.round(intersect.face!.normal.x + (intersect.face!.normal.x > 0 ? -0.3 : 0.3)),
                Math.round(intersect.face!.normal.y + (intersect.face!.normal.y > 0 ? -0.3 : 0.3)),
                Math.round(intersect.face!.normal.z + (intersect.face!.normal.z > 0 ? -0.3 : 0.3))
            );
            const newBlockPosition = clickedBlock.figurePosition.clone().add(newBlockDirection);
            if (!this.figure.blocks.some(x => x.figurePosition.equals(newBlockPosition))) {
                const block = new Block({...newBlockPosition, ...this.figure.tweakableProperties, color: this.figure.tweakableProperties.defaultColor }, this.figure.blockGeometry);
                this.figure.blocks.push(block)
                this.figure.setBlockPosition(block, newBlockPosition);
            }
        }
    }

    removeBlock(intersect: Intersection<Object3D>) {
        const clickedBlock = this.figure.blocks.find(x => x == intersect.object);
        if (clickedBlock && !clickedBlock.isInitial) {
            this.experience.scene!.remove(clickedBlock);
            this.figure.blocks = this.figure.blocks.filter(x => x !== clickedBlock);
        }
    }

    onHoverBlock(intersect: Intersection<Object3D>) {
        const hoveredBlock = this.figure.blocks.find(x => x == intersect.object)
        if (hoveredBlock && hoveredBlock != this.hoveredBlock) {
            if (hoveredBlock.isInitial === false) {
                hoveredBlock.setColor(this.figure.tweakableProperties.hoverColor);
            }
            if (this.hoveredBlock?.isInitial === false) {
                this.hoveredBlock?.setColor(this.figure.tweakableProperties.defaultColor);
            }
        }
        this.hoveredBlock = hoveredBlock || null;
    }

    onNoHoverBlock() {
        if (this.hoveredBlock?.isInitial === false) {
            this.hoveredBlock.setColor(this.figure.tweakableProperties.defaultColor);
        }
        this.hoveredBlock = null;
    }

    onHover(positions: IPointerPositions, onHoverBlock: Function, onNoHoverBlock?: Function) {
        this.raycaster.setFromCamera(positions, this.experience.camera!.instance!);
        var intersect = this.raycaster.intersectObjects(this.figure.blocks);
        
        if (intersect.length > 0) {
            onHoverBlock?.(intersect[0]);
        }
        else {
            onNoHoverBlock?.();
        }
    }

    pointerMove(positions: IPointerPositions)
    {
        this.onHover(positions, this.onHoverBlock.bind(this), this.onNoHoverBlock.bind(this));
    }

    pointerShortLeftClickUp(positions: IPointerPositions)
    {
        this.onHover(positions, this.addBlock.bind(this));
    }

    pointerShortRightClickUp(positions: IPointerPositions) {
        this.onHover(positions, this.removeBlock.bind(this));
    }
}