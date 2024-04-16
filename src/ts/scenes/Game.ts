import Phaser from "phaser";
import { Player } from "../entities/Player.ts";
import { GameScene } from "./GameScene.ts";
import { PRELOAD_CONFIG } from "../config.ts";

type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export default class Game extends GameScene {
  private player!: Player;
  private ground!: Phaser.GameObjects.TileSprite;
  private startTrigger!: SpriteWithDynamicBody;
  private spawnInterval = 1500;
  private spawnTime = 0;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private clouds!: Phaser.GameObjects.Group;
  private gameSpeed = 10;
  private gameSpeedModifier = 1;

  private gameOverScreen!: Phaser.GameObjects.Container;
  private gameOverText!: Phaser.GameObjects.Image;
  private restartText!: Phaser.GameObjects.Image;

  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private highScoreText!: Phaser.GameObjects.Text;
  private scoreInterval = 100;
  private scoreDeltaTime = 0;

  private progressSound!: Phaser.Sound.HTML5AudioSound;

  constructor() {
    super("Game");
  }

  create() {
    this.createEnvironment();
    this.createPlayer();
    this.createObstacles();
    this.createGameOverScreen();
    this.createAnimations();
    this.createScore();

    this.handleGameStart();
    this.handleObstacleCollision();
    this.handleGameRestart();

    this.progressSound = this.sound.add("progress", {
      volume: 0.2,
    }) as Phaser.Sound.HTML5AudioSound;
  }

  update(time: number, delta: number): void {
    if (!this.isGameRunning) {
      return;
    }
    this.spawnTime += delta;
    this.scoreDeltaTime += delta;

    if (this.spawnTime >= this.spawnInterval) {
      this.spawnObstacle();
      this.spawnTime = 0;
    }

    if (this.scoreDeltaTime >= this.scoreInterval) {
      this.score += 1;
      this.scoreDeltaTime = 0;

      if (this.score % 100 === 0) {
        this.gameSpeedModifier += 0.2;
        this.progressSound.play();

        this.tweens.add({
          targets: this.scoreText,
          duration: 100,
          repeat: 3,
          alpha: 0,
          yoyo: true,
        });
      }
    }

    Phaser.Actions.IncX(
      this.obstacles.getChildren(),
      -this.gameSpeed * this.gameSpeedModifier,
    );
    Phaser.Actions.IncX(this.clouds.getChildren(), -0.5);

    const score = String(this.score).padStart(5, "0");
    this.scoreText.setText(score);

    this.obstacles.getChildren().forEach((gameObject) => {
      const obstacle = gameObject as SpriteWithDynamicBody;

      if (obstacle.getBounds().right < 0) {
        this.obstacles.remove(obstacle);
      }
    });

    this.clouds.getChildren().forEach((gameObject) => {
      const cloud = gameObject as SpriteWithDynamicBody;

      if (cloud.getBounds().right < 0) {
        cloud.x = this.gameWidth + 30;
      }
    });

    this.ground.tilePositionX += this.gameSpeed * this.gameSpeedModifier;
  }
  createPlayer() {
    this.player = new Player(this, 0, this.gameHeight - 100);
  }

  createEnvironment() {
    this.ground = this.add
      .tileSprite(0, this.gameHeight, 88, 26, "ground")
      .setOrigin(0, 1);

    this.clouds = this.add.group();
    this.clouds = this.clouds.addMultiple([
      this.add.image(this.gameWidth * 0.5, this.gameHeight * 0.5, "cloud"),
      this.add.image(this.gameWidth - 80, this.gameHeight * 0.25, "cloud"),
      this.add.image(this.gameWidth * 0.3, 100, "cloud"),
    ]);
    this.clouds.setAlpha(0);
  }

  createObstacles() {
    this.obstacles = this.physics.add.group();
  }

  createGameOverScreen() {
    this.restartText = this.add.image(0, 80, "restart");
    this.gameOverText = this.add.image(0, 0, "game-over");

    this.gameOverScreen = this.add
      .container(this.gameWidth * 0.5, this.gameHeight * 0.5 - 50)
      .add(this.gameOverText)
      .add(this.restartText)
      .setAlpha(0);
  }

  createAnimations() {
    this.anims.create({
      key: "enemy-bird-flying",
      frames: this.anims.generateFrameNumbers("enemy-bird"),
      frameRate: 6,
      repeat: -1,
    });
  }

  createScore() {
    this.scoreText = this.add
      .text(this.gameWidth, 20, "00000", {
        fontSize: 30,
        fontFamily: "Arial",
        color: "#535353",
      })
      .setOrigin(1, 0)
      .setAlpha(0);

    this.highScoreText = this.add
      .text(this.gameWidth, 50, "00000", {
        fontSize: 30,
        fontFamily: "Arial",
        color: "#eeeeee",
      })
      .setOrigin(1, 0)
      .setAlpha(0);
  }

  handleGameStart() {
    this.startTrigger = this.physics.add
      .sprite(0, 10, "")
      .setAlpha(0)
      .setOrigin(0, 1);

    this.physics.add.overlap(this.startTrigger, this.player, () => {
      // if it's triggered at the top
      if (this.startTrigger.y === 10) {
        // move the trigger to the bottom
        this.startTrigger.body.reset(0, this.gameHeight);
        return;
      }
      // if it's triggered at the bottom, disable it
      this.startTrigger.disableBody();

      // roll the floor and play the animation
      const groundRolloutEvent = this.time.addEvent({
        delay: 1000 / 60,
        loop: true,
        callback: () => {
          this.ground.width += 25;
          this.player.playRunAnimation();
          this.player.setVelocityX(80);

          if (this.ground.width >= this.gameWidth) {
            groundRolloutEvent.remove();
            this.player.setVelocityX(0);
            this.clouds.setAlpha(1);
            this.scoreText.setAlpha(1);
            this.highScoreText.setAlpha(1);
            this.isGameRunning = true;
          }
        },
      });
    });
  }

  handleObstacleCollision() {
    this.physics.add.collider(this.obstacles, this.player, () => {
      this.physics.pause();
      this.isGameRunning = false;
      this.player.dies();
      this.spawnTime = 0;
      this.scoreDeltaTime = 0;
      this.score = 0;
      this.gameSpeedModifier = 1;
      this.gameOverScreen.setAlpha(1);
      const newHighScore = this.highScoreText.text.substring(
        this.highScoreText.text.length - 5,
      );
      const newScore = Number(this.scoreText.text) > Number(newHighScore)
        ? this.scoreText.text
        : newHighScore;

      this.highScoreText.setText("HI " + newScore);
      this.highScoreText.setAlpha(1);
    });
  }

  handleGameRestart() {
    this.restartText.setInteractive();
    this.restartText.on("pointerdown", () => {
      console.log("restart clicked.");
      this.physics.resume();
      this.player.setVelocity(0);
      this.obstacles.clear(true, true);
      this.gameOverScreen.setAlpha(0);
      this.anims.resumeAll();
      this.isGameRunning = true;
    });
  }

  spawnObstacle() {
    // we generate a random number from the sum of all obstacle assets
    // and then decide if it's a bird or a cactus
    let selectedObstacle, selectedHeight;
    const choice = Math.floor(
      Math.random() *
        (PRELOAD_CONFIG.cactusesCount + PRELOAD_CONFIG.birdsCount),
    ) + 1;

    // must be a bird...
    if (choice > PRELOAD_CONFIG.cactusesCount) {
      selectedObstacle = "enemy-bird";
      // two heights possible
      selectedHeight = this.gameHeight -
        [20, 70][Math.floor(Math.random() * 2)];
    } else {
      // ...it's a cactus
      selectedObstacle = `obstacle-${choice}`;
      selectedHeight = this.gameHeight;
    }
    const distance = Phaser.Math.Between(
      0.6 * this.gameWidth + this.gameWidth,
      0.9 * this.gameWidth + this.gameWidth,
    );

    const obstacle = this.obstacles
      .create(distance, selectedHeight, selectedObstacle)
      .setOrigin(0, 1)
      .setImmovable();

    if (selectedObstacle === "enemy-bird") {
      obstacle.play("enemy-bird-flying", true);
    }
  }
}
