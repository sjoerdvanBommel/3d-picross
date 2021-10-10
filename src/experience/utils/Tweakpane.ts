import { FolderApi, Pane } from 'tweakpane';
import Experience from '../Experience';

export default class Tweakpane
{
    private experience: Experience;
    private instance: FolderApi;
    folders: any;

    constructor(_active?: any)
    {
        this.experience = new Experience()
        this.instance = new Pane();
        (this.instance as any).hidden = !(this.experience.config as any)?.debug ?? true;

        this.folders = {
            block: this.instance.addFolder({
                title: 'Block',
                expanded: true
            })
        };
    }
}