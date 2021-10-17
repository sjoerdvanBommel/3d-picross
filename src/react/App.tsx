import '@fortawesome/fontawesome-free/css/all.css';
import React, { useState } from "react";
import '../assets/custom.css';
import '../assets/tailwind-custom.css';
import '../assets/tailwind.css';
import Experience from "../experience/Experience";
import EditorMenu from './components/editor-menu/editor-menu';
import PicrossMenu from "./components/picross/picross-menu";

export const App = () => {
    const [experienceLoaded, setExperienceLoaded] = useState(false);
    
    new Experience().resources.on('groupEnd', (_group: any) =>
    {
        setExperienceLoaded(true);
    });

    if (!experienceLoaded) {
        return <></>;
    }

    return <div className="flex justify-between">
        <PicrossMenu picross={new Experience().picross} />
        <EditorMenu picross={new Experience().picross} />
    </div>
};
