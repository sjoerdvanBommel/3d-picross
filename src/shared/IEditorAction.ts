import { PicrossPointerEvent } from "../experience/utils/pointer/PicrossPointerEvent";

export interface IEditorAction {
    getAction(pointerEvent: PicrossPointerEvent): IEditorAction | null;
}