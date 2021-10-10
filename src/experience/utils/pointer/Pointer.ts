import EventEmitter from '../EventEmitter';

const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 2;

export default class Pointer extends EventEmitter
{
    private dragDelta = 0.015
    private startX = 0;
    private startY = 0;
    private mouse = { x: 0, y: 0 };

    constructor()
    {
        super()

        window.addEventListener('pointermove', this.pointerMove.bind(this))
        window.addEventListener('pointerdown', this.pointerDown.bind(this))
        window.addEventListener('pointerup', this.pointerUp.bind(this))
    }

    pointerMove(event: PointerEvent)
    {
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;            

        this.trigger('pointermove', [this.mouse])
    }

    pointerDown(event: PointerEvent)
    {
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;   

        this.startX = this.mouse.x;
        this.startY = this.mouse.y;
    }

    pointerUp(event: PointerEvent)
    {
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        const diffX = Math.abs(this.mouse.x - this.startX);
        const diffY = Math.abs(this.mouse.y - this.startY);
        if (diffX < this.dragDelta && diffY < this.dragDelta) {
            if (event.button == LEFT_MOUSE_BUTTON) {
                this.trigger('pointerShortLeftClickUp', [this.mouse])
            }
            if (event.button == RIGHT_MOUSE_BUTTON) {
                this.trigger('pointerShortRightClickUp', [this.mouse])
            }
        }
    }
}
