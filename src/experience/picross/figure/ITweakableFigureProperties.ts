import { IBlockGeometryProperties } from "../block/IBlockGeometryProperties";

export default interface ITweakableFigureProperties extends IBlockGeometryProperties {
    initialBlockColor: string,
    defaultColor: string,
    hoverColor: string,
    margin: number
}

