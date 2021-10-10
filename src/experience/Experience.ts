import * as THREE from 'three'
import { Scene } from 'three'
import assets from './Assets'
import Camera from './Camera'
import Renderer from './Renderer'
import Resources from './Resources'
import Pointer from './utils/pointer/Pointer'
import Sizes from './utils/Sizes'
import Stats from './utils/Stats'
import Time from './utils/Time'
import Tweakpane from './utils/Tweakpane'
import World from './World'



export default class Experience
{
    static instance: Experience;
    public targetElement!: HTMLCanvasElement;
    public time!: Time;
    public pointer!: Pointer;
    public sizes!: Sizes;
    public scene!: Scene;
    public tweakpane!: Tweakpane;
    public config: any;
    public stats!: Stats;
    public camera!: Camera;
    public renderer!: Renderer;
    public rendererInstance!: any;
    public resources!: Resources;
    public world!: World;


    constructor(_options: any = {})
    {
        if(Experience.instance)
        {
            return Experience.instance
        }
        Experience.instance = this

        // Options
        this.targetElement = _options.targetElement

        if(!this.targetElement)
        {
            console.warn('Missing \'targetElement\' property')
            return
        }

        this.time = new Time()
        this.sizes = new Sizes()
        this.pointer = new Pointer()
        this.setConfig()
        this.setStats()
        this.scene = new THREE.Scene()
        this.setScene()
        this.setCamera()
        this.setRenderer()
        this.setResources()
        this.tweakpane = new Tweakpane()
        this.setWorld()
        
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        this.update()
    }

    setConfig()
    {
        this.config = {}
    
        // Debug
        this.config.debug = window.location.hash === '#debug'

        window.addEventListener('hashchange', function() {
            location.reload();
        })

        // Pixel ratio
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        // Width and height
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height || window.innerHeight
    }

    setStats()
    {
        if(this.config.debug)
        {
            this.stats = new Stats(true)
        }
    }
    
    setScene()
    {
    }

    setCamera()
    {
        this.camera = new Camera()
    }

    setRenderer()
    {
        this.renderer = new Renderer({ rendererInstance: this.rendererInstance })

        this.targetElement.appendChild(this.renderer.instance!.domElement)
    }

    setResources()
    {
        this.resources = new Resources(assets)
    }

    setWorld()
    {
        this.world = new World()
    }

    update()
    {
        if(this.stats)
            this.stats.update()
        
        this.camera.update()
        
        if(this.renderer)
            this.renderer.update()

        window.requestAnimationFrame(() =>
        {
            this.update()
        })
    }

    resize()
    {
        // Config
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height

        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        if(this.camera)
            this.camera.resize()

        if(this.renderer)
            this.renderer.resize()
    }

    destroy()
    {
        
    }
}
