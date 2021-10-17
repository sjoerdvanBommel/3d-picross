import { Intersection, Object3D } from "three";
import { PuzzleEditorAction } from "../../../shared/PuzzleEditorAction";
import { Editor } from "../Editor";
import { Puzzle } from "./Puzzle";

export class PuzzleEditor extends Editor {
    public constructor(puzzle: Puzzle) {
        super(puzzle, PuzzleEditorAction.ADDING_NUMBERS);
    }

    public setActiveAction = (activeAction: PuzzleEditorAction) => {
        this.activeAction = activeAction;
    }

    public getPuzzle = (): Puzzle => {
        return this.picrossObject as Puzzle;
    }

    public onHoverBlock = (intersect: Intersection<Object3D>): void => {
        console.log('onHoverBlock', intersect);
    }
    
    public onNoHoverBlock = (): void => {
        
    }

    private addNumber = (intersect: Intersection<Object3D>): void => {
        console.log('addNumber', intersect);
    }

    private removeNumber = (intersect: Intersection<Object3D>): void => {
        console.log('removeNumber', intersect);
    }

    public actionOnClick: { [editorAction: string]: (intersect: Intersection<Object3D>) => void; } = {
        [PuzzleEditorAction.ADDING_NUMBERS.toString()]: this.addNumber,
        [PuzzleEditorAction.REMOVING_NUMBERS.toString()]: this.removeNumber
    };
}