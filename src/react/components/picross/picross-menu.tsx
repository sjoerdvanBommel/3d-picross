import React from "react";
import Picross from "../../../experience/picross/Picross";
import chairTabelModel from '../../../mock-data/figures/piramid.json';

interface IPicrossMenu {
    picross: Picross
}

const PicrossMenu = ({ picross } : IPicrossMenu) => {
    const exportPuzzle = () => {
        picross.exportPuzzle();
    }

    const updateFigure = () => {
        picross.updateFigure(chairTabelModel.map(x => ({ x: x.x, y: x.y, z: x.z, isInitial: false, opacity: 1, destroyable: false })));
    }

    const toggleFigurePuzzleEditor = () => {
        picross.toggleFigurePuzzleEditor();
    }

    return <div className="mt-8 ml-8 picross-menu overlay overflow-hidden self-start">
        <div className="inner p-2 bg-white hover:bg-picross-blue-light text-picross-blue-light hover:text-white rounded-md w-10 hover:w-48 h-10 hover:h-80 overflow-hidden cursor-auto">
            <i className="fas fa-bars w-14 h-14 text-center text-5xl transform scale-50 -translate-x-1/4 -translate-y-1/4"></i>
            <button className="btn btn-blue" onClick={exportPuzzle}>Export</button>
            <button className="btn btn-blue" onClick={updateFigure}>Import</button>
            <button className="btn btn-blue" onClick={toggleFigurePuzzleEditor}>Toggle puzzle mode</button>
        </div>
    </div>
}

export default PicrossMenu;