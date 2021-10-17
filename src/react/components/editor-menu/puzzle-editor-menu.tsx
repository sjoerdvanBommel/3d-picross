import React, { useEffect, useState } from "react";
import Picross from "../../../experience/picross/Picross";
import { PuzzleEditorAction } from "../../../shared/PuzzleEditorAction";
import { ActionButton, ActionButtonColor } from "./action-button";

interface IPuzzleEditorMenuProps {
    picross: Picross;
    onChangeEditor: () => void;
}

const PuzzleEditorMenu = ({ picross, onChangeEditor }: IPuzzleEditorMenuProps) => {
    const [activePuzzleEditorAction, setActivePuzzleEditorAction] = useState(PuzzleEditorAction.ADDING_NUMBERS);
    
    const setAddingNumbers = () => setActivePuzzleEditorAction(PuzzleEditorAction.ADDING_NUMBERS);
    const setRemovingNumbers = () => setActivePuzzleEditorAction(PuzzleEditorAction.REMOVING_NUMBERS);

    useEffect(() => {
        picross.updatePuzzleEditorActiveAction(activePuzzleEditorAction)
    }, [activePuzzleEditorAction]);

    return <aside className="flex justify-end">
        <div className="flex flex-col gap-6 mt-12 mr-8 md:mr-12">
            <ActionButton active={activePuzzleEditorAction === PuzzleEditorAction.ADDING_NUMBERS} color={ActionButtonColor.Green} icon="pen-alt" mouseIcon={activePuzzleEditorAction.getMouseIcon(PuzzleEditorAction.ADDING_NUMBERS)} onClick={setAddingNumbers} />
            <ActionButton active={activePuzzleEditorAction === PuzzleEditorAction.REMOVING_NUMBERS} color={ActionButtonColor.Red} icon="eraser" mouseIcon={activePuzzleEditorAction.getMouseIcon(PuzzleEditorAction.REMOVING_NUMBERS)} onClick={setRemovingNumbers} />
            <ActionButton active={activePuzzleEditorAction === PuzzleEditorAction.REMOVING_NUMBERS} color={ActionButtonColor.Red} icon="eraser" mouseIcon={activePuzzleEditorAction.getMouseIcon(PuzzleEditorAction.REMOVING_NUMBERS)} onClick={setRemovingNumbers} />
            <ActionButton active={false} color={ActionButtonColor.Gray} icon="cubes" onClick={onChangeEditor} />
        </div>
    </aside>;
};

export default PuzzleEditorMenu;
