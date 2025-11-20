    <template>
        <div class="game">
            <div class="score">HI {{ bestScore }} {{ score }}</div>
            <div class="dino" :style="{ bottom: dinoBottom + 'px' }">
                <img :src="frames[currentFrame]" style="width: 100%; height: 100%" />
            </div>
            <template v-for="(ob, i) in obstacles" :key="ob.id">
                <div class="obstacle" :style="{
                    left: ob.left + 'px',
                    bottom: ob.bottom + 'px',
                }">
                    <img src="../assets/cactus.svg" style="width: 100%; height: 100%" />
                </div>
            </template>
            <div v-if="gameOver" class="msg">
                <p>Game Over!</p>
                <button @click="restart" class="restart-btn"><img src="../assets/restart.svg"></img></button>
            </div>
            <div v-if="waitingStart" class="msg">
                <p>Нажми пробел для старта</p>
            </div>
            <div class="ground"></div>
            <div class="grass-blades">
                <div v-for="(blade, i) in grassBlades" :key="i" class="grass-blade" :style="{
                    left: blade.left + 'px',
                    width: blade.width + 'px',
                    height: blade.height + 'px',
                    bottom: blade.bottom + 'px'
                }"></div>
            </div>
        </div>
    </template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import cat1 from "../assets/cat1-no-bg.png";
import cat2 from "../assets/cat2-no-bg.png";

const dinoBottom = ref(20);
const isJumping = ref(false);
const isFalling = ref(false);
const jumpPower = ref(0);
const gameOver = ref(false);
const score = ref(0);
const obstacles = ref([]);
const speed = ref(5)
const grassBlades = ref([]);
const waitingStart = ref(true);
const currentFrame = ref(0)

const NUM_BLADES = 35;
const dinoX = 50;
const dinoWidth = 40;
const dinoHeight = 40;
const obstacleWidth = 20;
const obstacleHeight = 40;
const safeMargin = 5;
const bestScore = ref(
    parseInt(parseInt(localStorage.getItem('catBestScore') || '0', 10))
)
const PACK_GAP = 200;
const FIELD_WIDTH = 600;

const frames = [cat1,cat2]

let obstacleInterval = null;
let jumpInterval = null;
let fallInterval = null;
let jumpTimeout = null;
let canSpawnNextPack = true;
let runningInterval = null;

function spawnObstaclePack() {
    const count = Math.floor(Math.random() * 4) + 1;

    let rightmost = obstacles.value.length
        ? Math.max(...obstacles.value.map(o => o.left)) : FIELD_WIDTH

    let start = Math.max(rightmost + PACK_GAP, FIELD_WIDTH)

    for (let i = 0; i < count; i++) {
        obstacles.value.push({
            id: Date.now() + Math.random() + '-' + i,
            left: start + i * obstacleWidth,
            bottom: 20,
            scored: false
        });
    }
}

function startJump() {
    if (isJumping.value || isFalling.value || gameOver.value) return;
    isJumping.value = true;
    jumpPower.value = 0;
    clearInterval(fallInterval);

    jumpInterval = setInterval(() => {
        if (dinoBottom.value < 120 && jumpPower.value < 40) {
            dinoBottom.value += 4;
            jumpPower.value += 1;
        }
    }, 15);

    jumpTimeout = setTimeout(() => {
        stopJump();
    }, 400);
    stopRunningAnimation();
}

function stopJump() {
    if (!isJumping.value) return;
    clearInterval(jumpInterval);
    clearTimeout(jumpTimeout);
    isJumping.value = false;
    isFalling.value = true;

    fallInterval = setInterval(() => {
        if (dinoBottom.value > 20) {
            dinoBottom.value -= 5;
        } else {
            clearInterval(fallInterval);
            isFalling.value = false;
            jumpPower.value = 0;
            dinoBottom.value = 20;
        }
    }, 15);
    startRunningAnimation();
}

function moveObstacles() {
    if (!obstacles.value.length) spawnObstaclePack();

    obstacleInterval = setInterval(() => {
        for (let i = 0; i < obstacles.value.length; i++) {
            obstacles.value[i].left -= speed.value
            const ob = obstacles.value[i];

            const collides =
                ob.left < dinoX + dinoWidth - safeMargin &&
                ob.left + obstacleWidth > dinoX + safeMargin &&
                dinoBottom.value < obstacleHeight;
            if (collides) {
                gameOver.value = true;
                stopRunningAnimation()

                if (score.value > bestScore.value) {
                    bestScore.value = score.value;
                    localStorage.setItem('catBestScore', String(score.value))
                }
                clearInterval(obstacleInterval);
                clearInterval(jumpInterval);
                clearInterval(fallInterval);
                clearTimeout(jumpTimeout);
                return;
            }

            if (!ob.scored && ob.left + obstacleWidth < dinoX) {
                score.value++;
                ob.scored = true;
                if (score.value % 10 === 0 && speed.value < 15) {
                    speed.value += 1
                }
            }
        }

        obstacles.value = obstacles.value.filter(ob => ob.left >= -obstacleWidth);

        let rightmost = obstacles.value.length
            ? Math.max(...obstacles.value.map(o => o.left))
            : 0;

        if (canSpawnNextPack && rightmost < FIELD_WIDTH - PACK_GAP) {
            spawnObstaclePack();
            canSpawnNextPack = false;
        }

        if (!canSpawnNextPack && rightmost < FIELD_WIDTH - 2 * PACK_GAP) {
            canSpawnNextPack = true;
        }
    }, 20);

}

function restart() {
    gameOver.value = false;
    score.value = 0;
    dinoBottom.value = 20;
    isJumping.value = false;
    isFalling.value = false;
    jumpPower.value = 0;
    obstacles.value = [];
    speed.value = 5;
    spawnObstaclePack();
    moveObstacles();
    startRunningAnimation();
}
function randomGrass() {
    grassBlades.value = [];
    for (let i = 0; i < NUM_BLADES; i++) {
        grassBlades.value.push({
            left: Math.random() * 600,
            width: 1 + Math.random() * 5,
            height: 1,
            bottom: 20 + Math.random() * 10
        });
    }
}

randomGrass();

function startRunningAnimation() {
    if (runningInterval) clearInterval(runningInterval)
    runningInterval = setInterval(() => {
        currentFrame.value = (currentFrame.value + 1) % frames.length
    }, 150)
}

function stopRunningAnimation() {
    if (runningInterval) clearInterval(runningInterval)
    currentFrame.value = 0
}

function keyDownHandler(e) {
    if (waitingStart.value && (e.code === "Space" || e.code === "ArrowUp")) {
        waitingStart.value = false;
        gameOver.value = false;
        score.value = 0;
        dinoBottom.value = 20;
        isJumping.value = false;
        isFalling.value = false;
        jumpPower.value = 0;
        obstacles.value = [];
        spawnObstaclePack();
        moveObstacles()
        startRunningAnimation();
        return
    }

    if (gameOver.value && e.code === "Space") {
        restart()
        return
    }

    if (!waitingStart.value && !isJumping.value && !isFalling.value && !gameOver.value && (e.code === "Space" || e.code === "ArrowUp")) {
        startJump();
    }


}
function keyUpHandler(e) {
    if ((e.code === "Space" || e.code === "ArrowUp") && isJumping.value) {
        stopJump();
    }
}

onMounted(() => {
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
});
onUnmounted(() => {
    document.removeEventListener('keydown', keyDownHandler);
    document.removeEventListener('keyup', keyUpHandler);
    clearInterval(obstacleInterval);
    clearInterval(jumpInterval);
    clearInterval(fallInterval);
    clearInterval(speed)
    clearTimeout(jumpTimeout);
    stopRunningAnimation()
});

</script>

<style lang="scss">
body {
    background: #202124;
}

.game {
    width: 600px;
    height: 150px;
    overflow: hidden;
    position: relative;
    background: #202124;
    margin: 60px auto;
}

.dino {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 50px;
    border-radius: 8px;
    transition: bottom 0.02s;
    z-index: 1000;
}

.obstacle {
    width: 20px;
    height: 40px;
    position: absolute;
    top: 98px;
    transition: left 0.02s;
    z-index: 1000;
}

.score {
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 1.1em;
    z-index: 2;
    color: rgb(172, 172, 172);
}

.msg {
    position: absolute;
    left: 0;
    right: 0;
    top: 40%;
    transform: translateY(-50%);
    text-align: center;
    background: #20212400;
    color: rgb(172, 172, 172);
    width: 100%;
    font-size: 1.2em;
}

.restart-btn {
    background: rgb(172, 172, 172);
    border-radius: 5px;
    border: 1px;
}

.ground {
    position: absolute;
    left: 0;
    bottom: 25px;
    width: 100%;
    height: 2px;
    background: #5f6368;
    overflow: hidden;
    z-index: 100;
}

.grass-blades {
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 10%;
    height: 55px;
    pointer-events: none;
    z-index: 1000;
}

.grass-blade {
    position: absolute;
    background: #5f6368;
    opacity: 0.85;
}
</style>
