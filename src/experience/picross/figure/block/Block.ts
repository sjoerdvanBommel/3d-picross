import { Material, Mesh, MeshMatcapMaterial, Vector3 } from 'three';
import Experience from '../../../Experience';
import Figure from '../Figure';
import IBlockProperties from './IBlockProperties';
import ITweakableBlockProperties from './ITweakableBlockProperties';

export default class Block extends Mesh
{
    public isInitial: boolean;
    private tweakableProperties: ITweakableBlockProperties = {
        color: '#00acff'
    };
    private static baseMaterial: Material;
    private _figurePosition!: Vector3;
    private experience: Experience;

    public constructor(blockProperties: IBlockProperties, public figure: Figure)
    {
        super()
        this.experience = new Experience();
        this.isInitial = blockProperties.isInitial;
        
        if (!Block.baseMaterial) {
            Block.baseMaterial = new MeshMatcapMaterial({ matcap: this.experience.resources.items.defaultBlockMatCap });
        }
        this.material = Block.baseMaterial.clone();
        
        if (blockProperties.opacity < 1) {
            this.material.transparent = true;
            this.material.opacity = blockProperties.opacity;
        }
        
        this.setColor(blockProperties.color ?? this.tweakableProperties.color);

        this.geometry = this.figure.getBlockGeometry();

        this.figurePosition = new Vector3(blockProperties.x, blockProperties.y, blockProperties.z);
    }

    public get figurePosition(): Vector3 {
        return this._figurePosition;
    }

    public set figurePosition(value: Vector3) {
        this._figurePosition = value;
        this.updatePosition();
    }

    public updateTweakableProperties(tweakableBlockProperties: ITweakableBlockProperties) {
        this.tweakableProperties.color = tweakableBlockProperties.color;
        this.setColor(this.tweakableProperties.color);
    }

    public updatePosition() {
        this.position.set(
            this._figurePosition.x ? this._figurePosition.x * this.figure.getTweakableProperties().blockWidth + this._figurePosition.x * this.figure.getTweakableProperties().marginBetweenBlocks : 0,
            this._figurePosition.y ? this._figurePosition.y * this.figure.getTweakableProperties().blockHeight + this._figurePosition.y * this.figure.getTweakableProperties().marginBetweenBlocks : 0,
            this._figurePosition.z ? this._figurePosition.z * this.figure.getTweakableProperties().blockDepth + this._figurePosition.z * this.figure.getTweakableProperties().marginBetweenBlocks : 0
        )
    }

    public getMaterial(): MeshMatcapMaterial {
        return this.material as MeshMatcapMaterial;
    }

    public setOpacity(opacity: number) {
        let material = (this.material as Material);
        if (opacity < 1) {
            material.transparent = true;
        }
        material.opacity = opacity;
        material.needsUpdate = true;
    }

    private setColor(color: string) {
        this.getMaterial().color.set(color)
    }
}