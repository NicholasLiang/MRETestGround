import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import dotenv from 'dotenv';
import { resolve as resolvePath } from 'path';

// add some generic error handlers here, to log any exceptions we're not expecting
process.on('uncaughtException', err => console.log('uncaughtException', err));
process.on('unhandledRejection', reason => console.log('unhandledRejection', reason));


// Read .env if file exists
dotenv.config();


// here will be the class
class HelloWorld {
    private cube: MRE.Actor = null;
    private assets: MRE.AssetContainer;

    constructor(private context: MRE.Context) {
        this.context.onStarted(() => this.started());
    }

    private async started() {

        this.assets = new MRE.AssetContainer(this.context);

        // Load a glTF model
        const cubeData = await this.assets.loadGltf('altspace-cube.glb', "box");

        // spawn a copy of the glTF model
        this.cube = MRE.Actor.CreateFromPrefab(this.context, {
            firstPrefabFrom: cubeData,
            actor: {
                name: 'Altspace Cube',
                transform: {
                    local: {
                        position: { x: 0, y: -1, z: 0 },
                        scale: { x: 0.4, y: 0.4, z: 0.4 }
                    }
                }
            }
        });
    }
}


function runApp() {
    // Start listening for connections, and serve static files.
    const server = new MRE.WebHost({
        baseDir: resolvePath(__dirname, '../public')
    });

    // Handle new application sessions
    server.adapter.onConnection(context => new HelloWorld(context));
}

const delay = 1000;
const argv = process.execArgv.join();
const isDebug = argv.includes('inspect') || argv.includes('debug');

if (isDebug) {
    setTimeout(runApp, delay);
} else {
    runApp();
}