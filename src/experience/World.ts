import Experience from './Experience';
import Figure from './picross/figure/Figure';
import FigureEditor from './picross/figure/FigureEditor';
import Resources from './Resources';

export default class World
{
    private experience: Experience;
    private resources: Resources;

    constructor()
    {
        this.experience = new Experience()
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group: any) =>
        {
            new FigureEditor(new Figure([{ x: 0, y: 0, z: 0, isInitial: true }]))
        });
    }
}