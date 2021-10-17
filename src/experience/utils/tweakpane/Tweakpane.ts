import { FolderApi, Pane } from 'tweakpane';
import Experience from '../../Experience';
import ITweakpaneFolders from './ITweakpaneFolders';

export default class Tweakpane
{
    public folders: ITweakpaneFolders;
    
    private experience: Experience;
    private instance: FolderApi;

    public constructor()
    {
        this.experience = new Experience()
        this.instance = new Pane();
        this.instance.hidden = !this.experience.config.debug ?? true;

        this.folders = {
            block: this.instance.addFolder({
                title: 'Block',
                expanded: true
            })
        };
    }
}