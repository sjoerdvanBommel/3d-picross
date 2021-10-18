import { Vector3 } from "three";
import Experience from "../../Experience";
import { CameraEvent } from "../../utils/camera/CameraEvent";
import Figure from "../figure/Figure";

const { Text } = require("troika-three-text");

export class Number extends Text {
    private experience: Experience;

    constructor(value: number, public figurePosition: Vector3, private figure: Figure) {
        super();

        this.experience = new Experience();
        super.text = value.toString();
        super.fontSize = .3;
        super.color = 0x000000;
        super.anchorX = 'center';
        super.anchorY = 'middle';
        super.sync();
        this.setPosition();
        this.updateRotation(this.experience.camera.instance.position);
        this.experience.camera!.on(CameraEvent.cameraMoved, this.updateRotation);
    }

    private updateRotation = (cameraPosition: Vector3) => {
        super.lookAt(cameraPosition);
        super.sync();
    }

    private setPosition = () => {
        this['position'].set(
            this.figurePosition.x ? this.figurePosition.x * this.figure.getTweakableProperties().blockWidth + this.figurePosition.x * this.figure.getTweakableProperties().marginBetweenBlocks : 0,
            this.figurePosition.y ? this.figurePosition.y * this.figure.getTweakableProperties().blockHeight + this.figurePosition.y * this.figure.getTweakableProperties().marginBetweenBlocks : 0,
            this.figurePosition.z ? this.figurePosition.z * this.figure.getTweakableProperties().blockDepth + this.figurePosition.z * this.figure.getTweakableProperties().marginBetweenBlocks : 0
        )
    }
}