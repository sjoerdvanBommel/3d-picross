import React, { useEffect, useRef, useState } from "react";
import Picross from "../../../experience/picross/Picross";
import FigureEditorMenu from "./figure-editor-menu";
import PuzzleEditorMenu from "./puzzle-editor-menu";

interface IEditorMenuProps {
    picross: Picross
}

const EditorMenu = ({ picross }: IEditorMenuProps) => {
    const [isEditingFigure, setIsEditingFigure] = useState(true);
    
    const isFirstRun = useRef(true);

    const editPuzzle = () => setIsEditingFigure(false);
    const editFigure = () => setIsEditingFigure(true);
    
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        picross.toggleFigurePuzzleEditor();
    }, [isEditingFigure]);

    return <aside className="flex sm:flex-col gap-3 pb-4 px-4 sm:px-0 sm:gap-6 sm:mt-12 sm:mr-12 justify-between sm:justify-start sm:items-end">
        {isEditingFigure && <FigureEditorMenu picross={picross} onChangeEditor={editPuzzle}></FigureEditorMenu>}
        {!isEditingFigure && <PuzzleEditorMenu picross={picross} onChangeEditor={editFigure}></PuzzleEditorMenu>}
    </aside>;
};

export default EditorMenu