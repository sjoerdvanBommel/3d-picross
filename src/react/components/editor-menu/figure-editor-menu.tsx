import React, { useEffect, useState } from "react";
import Picross from "../../../experience/picross/Picross";
import { FigureEditorAction } from "../../../shared/FigureEditorAction";
import { ActionButton, ActionButtonColor } from "./action-button";

interface IFigureEditorMenuProps {
    picross: Picross;
    onChangeEditor: () => void;
}

const FigureEditorMenu = ({ picross, onChangeEditor }: IFigureEditorMenuProps) => {
    const [active, setActive] = useState(FigureEditorAction.BUILDING);
    
    const setBuilding = () => setActive(FigureEditorAction.BUILDING);
    const setDestroying = () => setActive(FigureEditorAction.DESTROYING);
    const setCustomizing = () => setActive(FigureEditorAction.CUSTOMIZING);

    useEffect(() => {
        picross.updateFigureEditorActiveAction(active)
    }, [active]);

    return <aside className="flex justify-end">
        <div className="flex flex-col gap-6 mt-12 mr-8 md:mr-12">
            <ActionButton active={active === FigureEditorAction.BUILDING} color={ActionButtonColor.Green} icon="hammer" mouseIcon={active.getMouseIcon(FigureEditorAction.BUILDING)} onClick={setBuilding} />
            <ActionButton active={active === FigureEditorAction.DESTROYING} color={ActionButtonColor.Red} icon="trash" mouseIcon={active.getMouseIcon(FigureEditorAction.DESTROYING)} onClick={setDestroying} />
            <ActionButton active={active === FigureEditorAction.CUSTOMIZING} color={ActionButtonColor.Blue} icon="palette" mouseIcon={active.getMouseIcon(FigureEditorAction.CUSTOMIZING)} onClick={setCustomizing} />
            <ActionButton active={false} color={ActionButtonColor.Gray} icon="flag-checkered" onClick={onChangeEditor} />
        </div>
    </aside>;
};

export default FigureEditorMenu;
