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

    return <div>
        <div className={isEditingFigure ? "" : "hidden"}>
            <FigureEditorMenu picross={picross} onChangeEditor={editPuzzle}></FigureEditorMenu>
        </div>
        <div className={isEditingFigure ? "hidden" : ""}>
            <PuzzleEditorMenu picross={picross} onChangeEditor={editFigure}></PuzzleEditorMenu>
        </div>
    </div>
};

export default EditorMenu