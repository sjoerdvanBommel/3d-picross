import { PicrossPointerEvent } from "../experience/utils/pointer/PicrossPointerEvent";
import { IEditorAction } from "./IEditorAction";

const enum PuzzleEditorActionKey {
    ADDING_NUMBERS = 'ADDING_NUMBERS',
    REMOVING_NUMBERS = 'REMOVING_NUMBERS'
};

const editorActionMouseIcons = {
    [PuzzleEditorActionKey.ADDING_NUMBERS]: {
        [PuzzleEditorActionKey.ADDING_NUMBERS]: PicrossPointerEvent.SHORT_LEFT_CLICK_UP,
        [PuzzleEditorActionKey.REMOVING_NUMBERS]: PicrossPointerEvent.SHORT_RIGHT_CLICK_UP
    },
    [PuzzleEditorActionKey.REMOVING_NUMBERS]: {
        [PuzzleEditorActionKey.ADDING_NUMBERS]: PicrossPointerEvent.SHORT_RIGHT_CLICK_UP,
        [PuzzleEditorActionKey.REMOVING_NUMBERS]: PicrossPointerEvent.SHORT_LEFT_CLICK_UP
    },
};

export class PuzzleEditorAction implements IEditorAction {
    public static readonly ADDING_NUMBERS = new PuzzleEditorAction(PuzzleEditorActionKey.ADDING_NUMBERS);
    public static readonly REMOVING_NUMBERS = new PuzzleEditorAction(PuzzleEditorActionKey.REMOVING_NUMBERS);
    public static readonly values: PuzzleEditorAction[] = Object.values(PuzzleEditorAction);

    private constructor(private readonly key: PuzzleEditorActionKey) { }

    public toString() {
        return this.key;
    }

    public getMouseIcon(active: PuzzleEditorAction): string {
        return editorActionMouseIcons[this.key][active.key].mouseIcon!;
    }

    public getAction(pointerEvent: PicrossPointerEvent): PuzzleEditorAction | null {
        for (const [key, value] of Object.entries(editorActionMouseIcons[this.key])) {
            if (value === pointerEvent) {
                return PuzzleEditorAction.values.find(x => x.key === key) ?? null;
            }
        }
        return null;
    }
}