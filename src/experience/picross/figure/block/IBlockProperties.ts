export default interface IBlockProperties {
    x: number;
    y: number;
    z: number;
    isInitial: boolean;
    opacity: number;
    destroyable: boolean;
    color?: string | null;
}