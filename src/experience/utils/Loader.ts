import { WebGLRenderer } from 'three'
import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import Experience from '../Experience'
import EventEmitter from './EventEmitter'

export default class Loader extends EventEmitter
{
    private experience: Experience;
    private renderer: WebGLRenderer;
    private toLoad: number;
    private loaded: number;
    private items: any;
    private loaders!: Array<any>;

    constructor()
    {
        super()

        this.experience = new Experience()
        this.renderer = this.experience.renderer!.instance!

        this.setLoaders()

        this.toLoad = 0
        this.loaded = 0
        this.items = {}
    }

    setLoaders()
    {
        this.loaders = []

        // Images
        this.loaders.push({
            extensions: ['jpg', 'png'],
            action: (_resource: any) =>
            {
                const image = new Image()

                image.addEventListener('load', () =>
                {
                    this.fileLoadEnd(_resource, image)
                })

                image.addEventListener('error', () =>
                {
                    this.fileLoadEnd(_resource, image)
                })

                image.src = _resource.source
            }
        })

        // Basis images
        const basisLoader = new BasisTextureLoader()
        basisLoader.setTranscoderPath('basis/')
        basisLoader.detectSupport(this.renderer)

        this.loaders.push({
            extensions: ['basis'],
            action: (_resource: any) =>
            {
                basisLoader.load(_resource.source, (_data) =>
                {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })

        // Draco
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('draco/')
        dracoLoader.setDecoderConfig({ type: 'js' })

        this.loaders.push({
            extensions: ['drc'],
            action: (_resource: any) =>
            {
                dracoLoader.load(_resource.source, (_data) =>
                {
                    this.fileLoadEnd(_resource, _data);

                    (DRACOLoader as any).releaseDecoderModule()
                })
            }
        })

        // GLTF
        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)

        this.loaders.push({
            extensions: ['glb', 'gltf'],
            action: (_resource: any) =>
            {
                gltfLoader.load(_resource.source, (_data) =>
                {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })

        // FBX
        const fbxLoader = new FBXLoader()

        this.loaders.push({
            extensions: ['fbx'],
            action: (_resource: any) =>
            {
                fbxLoader.load(_resource.source, (_data) =>
                {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })

        // RGBE | HDR
        const rgbeLoader = new RGBELoader()

        this.loaders.push({
            extensions: ['hdr'],
            action: (_resource: any) =>
            {
                rgbeLoader.load(_resource.source, (_data) =>
                {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })
    }

    load(_resources = [])
    {
        for(const _resource of _resources)
        {
            this.toLoad++
            const extensionMatch = (_resource as any).source.match(/\.([a-z]+)$/)

            if(typeof extensionMatch[1] !== 'undefined')
            {
                const extension = extensionMatch[1]
                const loader = this.loaders.find((_loader) => _loader.extensions.find((_extension: any) => _extension === extension))

                if(loader)
                {
                    loader.action(_resource)
                }
                else
                {
                    console.warn(`Cannot found loader for ${_resource}`)
                }
            }
            else
            {
                console.warn(`Cannot found extension of ${_resource}`)
            }
        }
    }

    /**
     * File load end
     */
    fileLoadEnd(_resource: any, _data: any)
    {
        this.loaded++
        this.items[_resource.name] = _data

        this.trigger('fileEnd', [_resource, _data])

        if(this.loaded === this.toLoad)
        {
            this.trigger('end')
        }
    }
}
