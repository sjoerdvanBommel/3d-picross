import { Intersection, Object3D, Raycaster, Scene, Vector2 } from "three";
import { IEditorAction } from "../../shared/IEditorAction";
import Experience from "../Experience";
import { PicrossPointerEvent } from "../utils/pointer/PicrossPointerEvent";
import { IPicrossObject } from "./PicrossObject";

export abstract class Editor {
    protected experience: Experience;
    protected scene: Scene;
    protected raycaster: Raycaster;
    
    protected constructor(protected picrossObject: IPicrossObject, protected activeAction: IEditorAction) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.raycaster = new Raycaster();

        this.experience.pointer!.on(PicrossPointerEvent.MOVE.event, this.pointerMove);
        this.experience.pointer!.on(PicrossPointerEvent.SHORT_LEFT_CLICK_UP.event, this.doActionIfBlockLeftClicked);
        this.experience.pointer!.on(PicrossPointerEvent.SHORT_RIGHT_CLICK_UP.event, this.doActionIfBlockRightClicked);
    }

    public abstract onHoverBlock(intersect: Intersection<Object3D>): void;
    public abstract onNoHoverBlock(): void;
    public abstract actionOnClick: { [editorAction: string]: (intersect: Intersection<Object3D>) => void; };

    public ifPointing(positions: Vector2, onHoverBlock: (intersect: Intersection<Object3D>) => void, onNoHoverBlock?: () => void) {
        this.raycaster.setFromCamera(positions, this.experience.camera!.instance!);
        var intersect = this.raycaster.intersectObjects(this.picrossObject.getBlocks());
        
        if (intersect.length > 0) {
            onHoverBlock?.(intersect[0]!);
        }
        else {
            onNoHoverBlock?.();
        }
    }

    private doActionIfBlockLeftClicked = (positions: Vector2) => {
        this.ifPointing(positions, this.onLeftClickBlock);
    }

    private doActionIfBlockRightClicked = (positions: Vector2) => {
        this.ifPointing(positions, this.onRightClickBlock);
    }

    private onLeftClickBlock = (intersect: Intersection<Object3D>): void => {
        this.onClickBlock(PicrossPointerEvent.SHORT_LEFT_CLICK_UP, intersect);
    }

    private onRightClickBlock = (intersect: Intersection<Object3D>): void => {
        this.onClickBlock(PicrossPointerEvent.SHORT_RIGHT_CLICK_UP, intersect);
    }

    private onClickBlock = (pointerEvent: PicrossPointerEvent, intersect: Intersection<Object3D>) => {
        const editorAction = this.activeAction.getAction(pointerEvent);
        if (editorAction) {
            this.actionOnClick[editorAction.toString()]!(intersect);
        }
    }

    private pointerMove = (positions: Vector2) => {
        this.ifPointing(positions, this.onHoverBlock.bind(this), this.onNoHoverBlock.bind(this));
    }
}