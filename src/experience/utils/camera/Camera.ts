import { PerspectiveCamera, Scene } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from '../../Experience';
import EventEmitter from '../EventEmitter';
import Sizes from '../Sizes';
import Time from '../Time';
import { CameraEvent } from './CameraEvent';

export default class Camera extends EventEmitter
{
    private experience: Experience;
    private config: any;
    public debug: any;
    public time: Time;
    public sizes: Sizes;
    public targetElement: HTMLCanvasElement;
    public scene: Scene;
    public instance!: PerspectiveCamera;
    private mode: 'default' | 'debug';
    private modes: any;

    constructor()
    {
        super();
        
        // Options
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.config.debug
        this.time = this.experience.time!
        this.sizes = this.experience.sizes!
        this.targetElement = this.experience.targetElement
        this.scene = this.experience.scene!

        // Set up
        this.mode = 'debug' // defaultCamera \ debugCamera

        this.setInstance()
        this.setModes()
    }

    setInstance()
    {
        // Set up
        this.instance = new PerspectiveCamera(25, this.config.width / this.config.height, 0.1, 150)
        this.instance.rotation.reorder('YXZ')

        this.scene.add(this.instance)
    }

    setModes()
    {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')
        this.modes.debug.instance.position.set(10, 10, 10)
        
        this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
        this.modes.debug.orbitControls.enabled = this.modes.debug.active
        this.modes.debug.orbitControls.screenSpacePanning = true
        this.modes.debug.orbitControls.enableKeys = false
        this.modes.debug.orbitControls.enableDamping = true
        this.modes.debug.orbitControls.update()
        this.modes.debug.orbitControls.addEventListener('change', () => this.trigger(CameraEvent.cameraMoved, [this.instance.position]))
    }


    resize()
    {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update()
    {
        // Update debug orbit controls
        this.modes.debug.orbitControls.update()

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position)
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
        this.instance.updateMatrixWorld() // To be used in projection
    }

    destroy()
    {
        this.modes.debug.orbitControls.destroy()
    }
}
