import React from "react";

const BuildFigureMenu = () => (
    <aside className="flex justify-end">
        <div className="flex flex-col m-4">
            <button className="bg-green-500 p-4">Build</button>
            <button className="bg-red-500 p-4">Destroy</button>
            <button className="bg-blue-500 p-4">Customize</button>
        </div>
    </aside>
);

export default BuildFigureMenu;
