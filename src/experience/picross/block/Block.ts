import { BufferGeometry, Material, Mesh, MeshMatcapMaterial, Scene, Vector3 } from 'three';
import Experience from '../../Experience';
import IColoredBlockProperties from './IColoredBlockProperties';

export default class Block extends Mesh
{
    public static marginBetweenBlocks = .025;
    private static baseMaterial: Material;

    public isBeingHovered = false;
    private scene: Scene;
    private resources: any;
    public isInitial: boolean;
    public figurePosition: Vector3;

    constructor(coloredBlockProperties: IColoredBlockProperties, geometry: BufferGeometry)
    {
        super()

        this.scene = new Experience().scene!
        this.resources = new Experience().resources
        this.isInitial = coloredBlockProperties.isInitial ?? false;

        if (!Block.baseMaterial)
            Block.baseMaterial = new MeshMatcapMaterial({ matcap: this.resources.items.defaultBlockMatCap });
        this.material = Block.baseMaterial.clone();
        this.setColor(coloredBlockProperties.color);

        this.geometry = geometry;

        this.figurePosition = new Vector3(coloredBlockProperties.x, coloredBlockProperties.y, coloredBlockProperties.z);

        this.scene.add(this);
    }

    setColor(color: string) {
        (this.material as MeshMatcapMaterial).color.set(color)
    }
}