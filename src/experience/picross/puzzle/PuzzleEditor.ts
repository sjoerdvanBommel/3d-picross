import { Intersection, Object3D } from "three";
import { PuzzleEditorAction } from "../../../shared/PuzzleEditorAction";
import { Editor } from "../Editor";
import { Number } from "./Number";
import { Puzzle } from "./Puzzle";

export class PuzzleEditor extends Editor {
    private numbers: Number[] = [];

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
        if (!intersect.uv) {
            console.log('test');
            
        }
    }
    
    public onNoHoverBlock = (): void => {
        
    }

    private addNumber = (intersect: Intersection<Object3D>): void => {
        const newPicrossObjectPosition = this.getNewPicrossObjectPosition(intersect)!;
        const number = new Number(3, newPicrossObjectPosition, this.getPuzzle().getFigure()!)
        this.numbers.push(number);
        this.scene.add(number as unknown as Object3D);
    }

    private removeNumber = (intersect: Intersection<Object3D>): void => {
        const newPicrossObjectPosition = this.getNewPicrossObjectPosition(intersect)!;
        const number = this.numbers.find(number => number.figurePosition.equals(newPicrossObjectPosition));
        console.log(this.numbers, newPicrossObjectPosition);
        if (number) {
            this.numbers = this.numbers.filter(x => x.figurePosition !== number.figurePosition);
            this.scene.remove(number as unknown as Object3D);
        }
    }

    public actionOnClick: { [editorAction: string]: (intersect: Intersection<Object3D>) => void; } = {
        [PuzzleEditorAction.ADDING_NUMBERS.toString()]: this.addNumber,
        [PuzzleEditorAction.REMOVING_NUMBERS.toString()]: this.removeNumber
    };
}