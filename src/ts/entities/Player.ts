import Phaser from "phaser";
import { GameScene } from "../scenes/GameScene.ts";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpSound!: Phaser.Sound.HTML5AudioSound;
  private hitSound!: Phaser.Sound.HTML5AudioSound;


  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, "dino-run");

    // add Player to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // init the game object
    this.init();

    // adding update() to the scene's update loop
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  init() {
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.setOrigin(0, 1)
      .setGravityY(5000)
      .setCollideWorldBounds(true)
      .setBodySize(44, 92)
      .setOffset(20, 0)
      .setDepth(1);

    //this.registerPlayerControl();
    this.registerAnimations();
    this.registerSounds();
  }

  // registerPlayerControl() {
  //   const spaceBar = this.scene.input.keyboard?.addKey(
  //     Phaser.Input.Keyboard.KeyCodes.SPACE,
  //   );

  //   spaceBar?.on('down', () => {
  //     console.log('Pressing space');
  //     this.setVelocityY(-1600);
  //   });
  // }

  update() {
    const { space, down } = this
      .cursors as Phaser.Types.Input.Keyboard.CursorKeys;
    const isOnFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();
    const spacePressed = Phaser.Input.Keyboard.JustDown(space);
    const downArrowPressed = Phaser.Input.Keyboard.JustDown(down);
    const downArrowUp = Phaser.Input.Keyboard.JustUp(down);

    // if space is down and the body sits on the floor
    if (spacePressed && isOnFloor) {
      this.setVelocityY(-1600);
      this.jumpSound.play();
    }

    if (downArrowPressed && isOnFloor) {
      this.body?.setSize(this.body.width, 58);
      this.setOffset(60, 34);
    }

    if (downArrowUp && isOnFloor) {
      this.body?.setSize(44, 92);
      this.setOffset(20, 0);
    }

    if (!(this.scene as GameScene).isGameRunning) {
      // only update the character if th game is running, otherwise return asap
      return;
    }

    // if dino is in the air
    if (this.body!.deltaAbsY() > 2) {
      this.anims.stop();
    } else {
      this.playRunAnimation();
    }
  }

  playRunAnimation() {
    const body = this.body as Phaser.Physics.Arcade.Body;

    body.height <= 58
      ? this.play("dino-down", true)
      : this.play("dino-run", true);
  }

  registerAnimations() {
    this.anims.create({
      key: "dino-run",
      frames: this.anims.generateFrameNumbers("dino-run", { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "dino-down",
      frames: this.anims.generateFrameNumbers("dino-down"),
      frameRate: 10,
      repeat: -1,
    });
  }

  registerSounds() {
    this.jumpSound = this.scene.sound.add("jump", {
      volume: 0.5,
    }) as Phaser.Sound.HTML5AudioSound;
    this.hitSound = this.scene.sound.add("hit", {
      volume: 0.5,
    }) as Phaser.Sound.HTML5AudioSound;
  }

  dies() {
    this.anims.pause();
    this.setTexture("dino-hurt");
    this.hitSound.play();
  }
}
