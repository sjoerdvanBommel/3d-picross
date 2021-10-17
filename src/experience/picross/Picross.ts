import { FigureEditorAction } from '../../shared/FigureEditorAction';
import { PuzzleEditorAction } from '../../shared/PuzzleEditorAction';
import Experience from '../Experience';
import Resources from '../utils/Resources';
import IBlockProperties from './figure/block/IBlockProperties';
import Figure from './figure/Figure';
import FigureEditor from './figure/FigureEditor';
import { Puzzle } from './puzzle/Puzzle';
import { PuzzleEditor } from './puzzle/PuzzleEditor';

export default class Picross
{
    private experience: Experience;
    private resources: Resources;
    private figureEditor?: FigureEditor | null;
    private puzzleEditor?: PuzzleEditor | null;
    private inFigureEditMode: boolean = true;

    public constructor()
    {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        
        this.resources.on('groupEnd', (_group: any) =>
        {
            this.figureEditor = new FigureEditor(new Figure([{ x: 0, y: 0, z: 0, isInitial: true, opacity: 1, destroyable: false }]));
        });
    }

    public updateFigure(blockProperties: IBlockProperties[]) {
        this.figureEditor?.replaceFigure(new Figure(blockProperties));
    }

    public updateFigureEditorActiveAction(editorAction: FigureEditorAction) {
        this.figureEditor?.setActiveAction(editorAction);
    }
    
    public updatePuzzleEditorActiveAction(editorAction: PuzzleEditorAction) {
        this.puzzleEditor?.setActiveAction(editorAction);
    }

    public toggleFigurePuzzleEditor() {
        this.inFigureEditMode = !this.inFigureEditMode;
        if (this.inFigureEditMode) {
            this.figureEditor?.replaceFigure(this.puzzleEditor!.getPuzzle().getFigure().clone());
            this.puzzleEditor?.getPuzzle().dispose();
        }
        else {
            const puzzle = new Puzzle(this.figureEditor!.getFigure().clone());
            this.puzzleEditor = new PuzzleEditor(puzzle);
            this.figureEditor?.dispose();
        }
    }

    public exportPuzzle() {
        if (!this.inFigureEditMode) {
            const blocks = this.puzzleEditor?.getPuzzle().getBlocks()!;
            console.log(blocks.map(x => ({ ...x.figurePosition })));
        }
    }
}