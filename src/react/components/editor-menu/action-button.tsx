import * as React from "react";

interface IActionButtonProps {
    color: ActionButtonColor,
    icon: string,
    mouseIcon?: string,
    active?: boolean,
    onClick: () => void
}

export enum ActionButtonColor {
    Red = "from-red-300 to-red-500 hover:from-red-500 hover:to-red-700",
    Green = "from-green-300 to-green-500 hover:from-green-400 hover:to-green-700",
    Blue = "from-blue-300 to-blue-500 hover:from-blue-400 hover:to-blue-700",
    Gray = "from-gray-300 to-gray-500 hover:from-gray-500 hover:to-gray-700"
}

export const ActionButton = ({ color, icon, mouseIcon, active = false, onClick }: IActionButtonProps) => (
    <button onClick={onClick} className={`bg-gradient-to-br ${color} ${active ? 'opacity-100' : 'opacity-40'}  h-24 w-24 rounded-xl shadow-xl relative`}>
        <i className={`fas fa-${icon} text-white text-5xl`}></i>
        {mouseIcon && <img src={`./assets/${mouseIcon}.svg`} alt="Mouse left click" className="absolute bottom-2 right-1 w-6 h-6 hidden lg:block" />}
    </button>
);
