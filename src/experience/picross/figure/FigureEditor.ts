import { Intersection, Object3D, Vector3 } from "three";
import { FigureEditorAction } from "../../../shared/FigureEditorAction";
import { Editor } from "../Editor";
import Block from "./block/Block";
import Figure from "./Figure";

export default class FigureEditor extends Editor {
    private indicatorBlock: Block;

    constructor(figure: Figure) {
        super(figure, FigureEditorAction.BUILDING);
        
        this.indicatorBlock = new Block({x: 1, y: 0, z: 0, isInitial: false, opacity: .3, destroyable: false }, this.figure);
        this.indicatorBlock.visible = false;
        
        this.scene.add(this.indicatorBlock);

        this.setTweaks();
    }

    private get figure(): Figure {
        return this.picrossObject as Figure;
    }

    public onHoverBlock = (intersect: Intersection<Object3D>) => {
        this.updateIndicatorBlockPosition(intersect);
    }

    public onNoHoverBlock = () => {
        if (this.indicatorBlock.visible) {
            this.indicatorBlock.visible = false;
        }
        this.figure.getBlocks().forEach(block => block.setOpacity(1));
    }

    public replaceFigure = (figure: Figure) => {
        this.picrossObject = figure;
        this.indicatorBlock.figure = figure;
        this.indicatorBlock.geometry = figure.getBlockGeometry();
    }

    public setActiveAction = (activeAction: FigureEditorAction) => {
        this.activeAction = activeAction;
    }

    public getFigure = (): Figure => {
        return this.figure;
    }

    public dispose = () => {
        this.figure.dispose();
        this.indicatorBlock.geometry.dispose();
        this.indicatorBlock.getMaterial().dispose();
    }

    private addBlock = (intersect: Intersection<Object3D>) => {
        const newBlockPosition = this.getNewBlockPosition(intersect);
        if (newBlockPosition) {
            this.figure.addBlock(new Block({...newBlockPosition, isInitial: false, opacity: 1, destroyable: false }, this.figure));
        }
    }

    private customizeBlock = (intersect: Intersection<Object3D>) => {
        console.log('customize', intersect);
    }

    private updateIndicatorBlockPosition = (intersect: Intersection<Object3D>) => {
        if (this.activeAction === FigureEditorAction.BUILDING) {
            if (!this.indicatorBlock.visible) {
                this.indicatorBlock.visible = true;
            }
            const newBlockPosition = this.getNewBlockPosition(intersect);
            if (newBlockPosition && !this.indicatorBlock.figurePosition.equals(newBlockPosition)) {
                this.indicatorBlock.figurePosition = newBlockPosition;
            }
        }
        else if (this.activeAction === FigureEditorAction.DESTROYING) {
            const pointedBlock = this.figure.getBlock(intersect.object);
            if (pointedBlock) {
                this.figure.getBlocks().forEach(block => block.setOpacity(1));
                if (!pointedBlock.isInitial) {
                    pointedBlock.setOpacity(0.5);
                }
            }
        }
    }

    private getNewBlockPosition = (intersect: Intersection<Object3D>): Vector3 | null => {
        const pointedBlock = this.figure.getBlock(intersect.object);
        if (pointedBlock) {
            const newBlockDirection = new Vector3(
                Math.round(intersect.face!.normal.x + (intersect.face!.normal.x > 0 ? -0.3 : 0.3)),
                Math.round(intersect.face!.normal.y + (intersect.face!.normal.y > 0 ? -0.3 : 0.3)),
                Math.round(intersect.face!.normal.z + (intersect.face!.normal.z > 0 ? -0.3 : 0.3))
            );
            return pointedBlock.figurePosition.clone().add(newBlockDirection);
        }
        return null;
    }

    private removeBlock = (intersect: Intersection<Object3D>) => {
        const clickedBlock = this.figure.getBlock(intersect.object);
        if (clickedBlock && !clickedBlock.isInitial) {
            this.figure.removeBlock(clickedBlock);
        }
    }

    private setTweaks = () => {
        const blockFolder = this.experience.tweakpane!.folders.block;
        blockFolder.on('change', () => {
            this.indicatorBlock.geometry = this.figure.getBlockGeometry();
        })
    }
    
    public actionOnClick: { [editorAction: string]: (intersect: Intersection<Object3D>) => void; } = {
        [FigureEditorAction.BUILDING.toString()]: this.addBlock,
        [FigureEditorAction.DESTROYING.toString()]: this.removeBlock,
        [FigureEditorAction.CUSTOMIZING.toString()]: this.customizeBlock,
    };
}