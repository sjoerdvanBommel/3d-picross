export class PicrossPointerEvent {
    public static SHORT_LEFT_CLICK_UP = new PicrossPointerEvent('pointerShortLeftClickUp', 'mouse-left-click');
    public static SHORT_RIGHT_CLICK_UP = new PicrossPointerEvent('pointerShortRightClickUp', 'mouse-right-click');
    public static SHORT_MIDDLE_CLICK_UP = new PicrossPointerEvent('pointerShortMiddleClickUp', 'mouse-middle-click');
    public static MOVE = new PicrossPointerEvent('pointerMouseMove');

    private constructor(public event: string, public mouseIcon?: string) { }
}