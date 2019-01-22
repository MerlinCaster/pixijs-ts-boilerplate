import {RotatingSprite} from "app/rotating-sprite";
import {TweenLite, TweenMax} from "gsap";
import "howler";
import {
    Dom,
    PixiAppWrapper as Wrapper,
    pixiAppWrapperEvent as WrapperEvent,
    PixiAppWrapperOptions as WrapperOpts,
} from "pixi-app-wrapper";
import {Asset, AssetPriority, LoadAsset, PixiAssetsLoader, SoundAsset} from "pixi-assets-loader";
import {
    AsciiFilter,
    CRTFilter,
    GlowFilter,
    OldFilmFilter,
    OutlineFilter,
    ShockwaveFilter,
} from "pixi-filters";
import "pixi-particles";
import "pixi-spine";

export enum Side {left,right };

const stackDisplacement = 0.05;   

function easeInOutQuad (t:number) { return t<.5 ? 2*t*t : -1+(4-2*t)*t }


/**
 * Showcase for PixiAppWrapper class.
 */
export class SampleApp {
    private app: Wrapper;
    private screenBorder: PIXI.Graphics;
    private fullScreenButton: PIXI.Container;
    private cardButton: PIXI.Container;
    private textButton: PIXI.Container;
    private fireButton: PIXI.Container;
    private containerMagic: PIXI.Container;
    private particlesEmitter: PIXI.particles.Emitter;
    private loader: PixiAssetsLoader;

    private totalAssets: number;
    private loadingProgress: number;
    private assetsCount: { [key: number]: { total: number, progress: number } } = {};

    private textStyle = new PIXI.TextStyle({
        fontFamily: "Verdana",
        fontSize: 24,
        fill: "#FFFFFF",
        wordWrap: true,
        wordWrapWidth: 440,
    });

    private bitmapTextStyle: PIXI.extras.BitmapTextStyle = {font: "35px Desyrel", align: "center"};

    constructor() {
        const canvas = Dom.getElementOrCreateNew<HTMLCanvasElement>("app-canvas", "canvas", document.getElementById("app-root"));

        // if no view is specified, it appends canvas to body
        const appOptions: WrapperOpts = {
            width: 1920,
            height: 1080,
            scale: "keep-aspect-ratio",
            align: "middle",
            resolution: window.devicePixelRatio,
            roundPixels: true,
            transparent: false,
            backgroundColor: 0xDCDCDC,
            view: canvas,
            showFPS: true,
            showMediaInfo: false,
            changeOrientation: true,
        };

        this.app = new Wrapper(appOptions);
        this.app.on(WrapperEvent.RESIZE_START, this.onResizeStart.bind(this));
        this.app.on(WrapperEvent.RESIZE_END, this.onResizeEnd.bind(this));

        this.createViews(); // Draw views that can be already drawn

        const assets = [
            {id: "card", url: "assets/gfx/magic.png", priority: AssetPriority.HIGHEST, type: "texture"},
            {id: "desyrel", url: "assets/fonts/desyrel.xml", priority: AssetPriority.HIGHEST, type: "font"},
            {id: "start", url: "assets/gfx/start.png", priority: AssetPriority.HIGHEST, type: "texture"},
            {id: "startHover", url: "assets/gfx/startHover.png", priority: AssetPriority.HIGHEST, type: "texture"},
            {id: "cardHoverOut", url: "assets/gfx/cardBtnHoverOut.png", priority: AssetPriority.HIGHEST, type: "texture"},
            {id: "cardHoverIn", url: "assets/gfx/cardBtnHoverIn.png", priority: AssetPriority.HIGHEST, type: "texture"},
            {id: "textHoverOut", url: "assets/gfx/textBtnHoverOut.png", priority: AssetPriority.HIGHEST, type: "texture"},
            {id: "textHoverIn", url: "assets/gfx/textBrnHoverIn.png", priority: AssetPriority.HIGHEST, type: "texture"},
            {id: "fireHoverOut", url: "assets/gfx/fireBtnHoverOut.png", priority: AssetPriority.HIGHEST, type: "texture"},
            {id: "fireHoverIn", url: "assets/gfx/fireBtnHoverIn.png", priority: AssetPriority.HIGHEST, type: "texture"},
            {id: "bunny", url: "assets/gfx/bunny.png", priority: AssetPriority.HIGH, type: "texture"},
            {id: "spineboy", url: "assets/gfx/spineboy.json", priority: AssetPriority.HIGHEST, type: "animation"},
            {id: "bubble", url: "assets/gfx/fireball3.gif", priority: AssetPriority.NORMAL, type: "texture"},
            {id: "atlas1", url: "assets/gfx/treasureHunter.json", priority: AssetPriority.LOWEST, type: "atlas"},
            // 404 Assets to test loading errors
        ];

        assets.forEach(asset => {
           if (!this.assetsCount[asset.priority]) {
               this.assetsCount[asset.priority] = {total: 1, progress: 0};
           } else {
               this.assetsCount[asset.priority].total++;
           }
        });

        this.loadingProgress = 0;
        this.totalAssets = assets.length;

        this.loader = new PixiAssetsLoader();
        this.loader.on(PixiAssetsLoader.PRIORITY_GROUP_LOADED, this.onAssetsLoaded.bind(this));
        this.loader.on(PixiAssetsLoader.ASSET_ERROR, this.onAssetsError.bind(this));
        this.loader.on(PixiAssetsLoader.ALL_ASSETS_LOADED, this.onAllAssetsLoaded.bind(this));

        this.loader.addAssets(assets).load();
    }

    

    private shuffleDeck(): void {
        this.containerMagic = new PIXI.Container();
        this.app.stage.addChild(this.containerMagic);
        var greenGroup = new PIXI.display.Group(0, true);
        greenGroup.on('sort', function (sprite: PIXI.Sprite) {
            sprite.zOrder = -sprite.y;
        });
        this.app.stage.addChild(new PIXI.display.Layer(greenGroup));
        var containerBack = new PIXI.Container();
        var containerFront = new PIXI.Container();
        this.app.stage.addChild(containerBack);
        this.app.stage.addChild(containerFront);
        let cardArray = [];
        let order = 144;
        for (let i = 0; i < 144; i++) {
            let magicCard = new PIXI.Sprite(PIXI.loader.resources.card.texture);
            magicCard.width = 170;
            magicCard.height = 235.5;
            magicCard.x = 100 + (i / 2);
            magicCard.y = 500 + (i / 2);
            magicCard.parentGroup = greenGroup;
            this.containerMagic.addChild(magicCard);
            cardArray.push(magicCard);
            order = order + 1;
        }
        let delayTime = 0;
        cardArray.reverse();
        let atualInd = 0;
        for (let i = 0; i < 144; i++) {
            atualInd = atualInd + 5;
            delayTime = delayTime + 1;
            TweenMax.to(cardArray[i], 1, {delay: delayTime, zIndex: atualInd, zOrder: atualInd})
            TweenMax.to(cardArray[i], 2, {x: cardArray[i].x + 600, delay: delayTime})
        }
       
    }

    private onAssetsLoaded(args: { priority: number, assets: LoadAsset[] }): void {
        window.console.log(`[SAMPLE APP] onAssetsLoaded ${args.assets.map(loadAsset => loadAsset.asset.id)}`);

        args.assets.forEach(loadAsset => {
            if (loadAsset.asset.id === "sound1" && loadAsset.loaded) {
                this.sound = (loadAsset.asset as SoundAsset).howl!;
            }
        });

        this.createViewsByPriority(args.priority);
    }

    public buttons(): void {
        this.fullScreenButton = new PIXI.Container();
        this.cardButton = new PIXI.Container();
        this.textButton = new PIXI.Container();
        this.fireButton = new PIXI.Container();
        this.app.stage.addChild(this.fullScreenButton);
        this.app.stage.addChild(this.cardButton);
        this.app.stage.addChild(this.textButton);
        this.app.stage.addChild(this.fireButton);

        let startBtn = new PIXI.Sprite(PIXI.loader.resources.start.texture);
        startBtn.buttonMode = true;
        startBtn.anchor.set(0.5);
        startBtn.interactive = true;
        startBtn.buttonMode = true;

        let cardBtn = new PIXI.Sprite(PIXI.loader.resources.cardHoverOut.texture);
        cardBtn.buttonMode = true;
        cardBtn.anchor.set(0.5);
        cardBtn.interactive = false;
        cardBtn.buttonMode = true;
        cardBtn.alpha = 0;

        let texttBtn = new PIXI.Sprite(PIXI.loader.resources.textHoverOut.texture);
        texttBtn.buttonMode = true;
        texttBtn.anchor.set(0.5);
        texttBtn.interactive = false;
        texttBtn.buttonMode = true;
        texttBtn.alpha = 0;

        let firetBtn = new PIXI.Sprite(PIXI.loader.resources.fireHoverOut.texture);
        firetBtn.buttonMode = true;
        firetBtn.anchor.set(0.5);
        firetBtn.interactive = false;
        firetBtn.buttonMode = true;
        firetBtn.alpha = 0;
        
        startBtn.on("pointerup", () => {
            // pointerdown does not trigger a user event in chrome-android
            document.getElementById("app-root").requestFullscreen()
            startBtn.interactive = false;
            startBtn.visible = false;
            cardBtn.interactive = true;
            texttBtn.interactive = true;
            firetBtn.interactive = true;
            cardBtn.alpha = 1;
            texttBtn.alpha = 1;
            firetBtn.alpha = 1;
        });

        startBtn.on("pointerover", () => {
            // pointerdown does not trigger a user event in chrome-android
            startBtn.texture = PIXI.loader.resources.startHover.texture;
        });

        startBtn.on("pointerout", () => {
            // pointerdown does not trigger a user event in chrome-android
            startBtn.texture = PIXI.loader.resources.start.texture;
        });

        this.fullScreenButton.addChild(startBtn);
        this.textButton.addChild(texttBtn);
        this.cardButton.addChild(cardBtn);
        this.fireButton.addChild(firetBtn);
        this.fullScreenButton.position.set(this.app.initialWidth / 2, this.app.initialHeight / 1.2);
        this.cardButton.position.set((this.app.initialWidth / 2) - (this.textButton.width + 20), this.app.initialHeight / 8);
        this.textButton.position.set(this.app.initialWidth / 2, this.app.initialHeight / 8);
        this.fireButton.position.set((this.app.initialWidth / 2) + this.textButton.width + 20, this.app.initialHeight / 8);
    
        console.log(this.cardButton.x);
        console.log(this.textButton.x);
        console.log(this.fireButton.x);
    }
    
    private onAssetsError(args: LoadAsset): void {
        window.console.log(`[SAMPLE APP] onAssetsError ${args.asset.id}: ${args.error!.message}`);
    }

    private onAllAssetsLoaded(): void {
        window.console.log("[SAMPLE APP] onAllAssetsLoaded !!!!");
    }

    private drawScreenBorder(width = 4): void {
        const halfWidth = width / 2;

        this.screenBorder = new PIXI.Graphics();
        this.screenBorder.lineStyle(width, 0xFFFFFF, 1);
        this.screenBorder.drawRect(halfWidth, halfWidth, this.app.initialWidth - width, this.app.initialHeight - width);

        this.app.stage.addChild(this.screenBorder);
    }

    private onResizeStart(): void {
        window.console.log("RESIZE STARTED!");
    }

    private onResizeEnd(args: any): void {
        window.console.log("RESIZE ENDED!", args);

        if (args.stage.orientation.changed) {
            this.relocateViews();
        }
    }

    private stopEmittingParticles(): void {
        if (this.particlesEmitter) {    
            this.particlesEmitter.emit = false;
            this.particlesEmitter.cleanup();
        }
    }

    private startEmittingParticles(): void {
        if (this.particlesEmitter) {
            this.particlesEmitter.emit = true;
        }
    }

    private createViews(): void {
        this.drawScreenBorder();
    }

    private createViewsByPriority(priority: number): void {
        switch (priority) {
            case AssetPriority.HIGHEST:
                this.buttons();
                // this.shuffleDeck();
                // this.drawSquare(this.app.initialWidth / 2 - 25, this.app.initialHeight / 2 - 25);
                break;

            case AssetPriority.HIGH:
                break;

            case AssetPriority.NORMAL:
                break;

            case AssetPriority.LOW:
                break;

            case AssetPriority.LOWEST:
                break;

            default:
                break;
        }
    }

    private removeViews(): void {
        this.app.stage.removeChildren();
    }
    
    private relocateViews(): void {
        /*
        this.screenBorder.width = this.app.initialWidth - 2;
        this.screenBorder.height = this.app.initialHeight - 2;
        window.console.log(this.screenBorder.width, this.screenBorder.height);
        */
        this.app.stage.removeChild(this.screenBorder);
        this.drawScreenBorder();

        if (this.fullScreenButton) {
            this.fullScreenButton.position.set(this.app.initialWidth / 2, this.app.initialHeight / 1.2);
        }
        if (this.cardButton) {
            this.cardButton.position.set((this.app.initialWidth / 2) - (this.textButton.width + 20), this.app.initialHeight / 8);
        }
        if (this.textButton) {
            this.textButton.position.set(this.app.initialWidth / 2, this.app.initialHeight / 8);
        }
        if (this.fireButton) {
            this.fireButton.position.set((this.app.initialWidth / 2) + this.textButton.width + 20, this.app.initialHeight / 8);
        }
    }
}
