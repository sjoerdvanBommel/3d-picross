import { PicrossPointerEvent } from "../experience/utils/pointer/PicrossPointerEvent";
import { IEditorAction } from "./IEditorAction";

const enum FigureEditorActionKey {
    BUILDING = 'BUILDING',
    DESTROYING = 'DESTROYING',
    CUSTOMIZING = 'CUSTOMIZING'
};

const editorActionMouseIcons = {
    [FigureEditorActionKey.BUILDING]: {
        [FigureEditorActionKey.BUILDING]: PicrossPointerEvent.SHORT_LEFT_CLICK_UP,
        [FigureEditorActionKey.DESTROYING]: PicrossPointerEvent.SHORT_RIGHT_CLICK_UP,
        [FigureEditorActionKey.CUSTOMIZING]: PicrossPointerEvent.SHORT_MIDDLE_CLICK_UP
    },
    [FigureEditorActionKey.DESTROYING]: {
        [FigureEditorActionKey.BUILDING]: PicrossPointerEvent.SHORT_RIGHT_CLICK_UP,
        [FigureEditorActionKey.DESTROYING]: PicrossPointerEvent.SHORT_LEFT_CLICK_UP,
        [FigureEditorActionKey.CUSTOMIZING]: PicrossPointerEvent.SHORT_MIDDLE_CLICK_UP
    },
    [FigureEditorActionKey.CUSTOMIZING]: {
        [FigureEditorActionKey.BUILDING]: PicrossPointerEvent.SHORT_RIGHT_CLICK_UP,
        [FigureEditorActionKey.DESTROYING]: PicrossPointerEvent.SHORT_MIDDLE_CLICK_UP,
        [FigureEditorActionKey.CUSTOMIZING]: PicrossPointerEvent.SHORT_LEFT_CLICK_UP
    }
};

export class FigureEditorAction implements IEditorAction {
    public static readonly BUILDING = new FigureEditorAction(FigureEditorActionKey.BUILDING);
    public static readonly DESTROYING = new FigureEditorAction(FigureEditorActionKey.DESTROYING);
    public static readonly CUSTOMIZING = new FigureEditorAction(FigureEditorActionKey.CUSTOMIZING);
    public static readonly values: FigureEditorAction[] = Object.values(FigureEditorAction);

    private constructor(private readonly key: FigureEditorActionKey) { }

    public toString() {
        return this.key;
    }

    public getMouseIcon(active: FigureEditorAction): string {
        return editorActionMouseIcons[this.key][active.key].mouseIcon!;
    }

    public getAction(pointerEvent: PicrossPointerEvent): FigureEditorAction | null {
        for (const [key, value] of Object.entries(editorActionMouseIcons[this.key])) {
            if (value === pointerEvent) {
                return FigureEditorAction.values.find(x => x.key === key) ?? null;
            }
        }
        return null;
    }
}