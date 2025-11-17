/*
By Okazz
*/
let colors = ['#7bdff2', '#b2f7ef', '#f7d6e0', '#f2b5d4'];
let ctx;
let motions = [];
let motionClasses = [];
let sceneTimer = 0;
let resetTime = 60 * 8.5;
let fadeOutTime = 30;

// 新增：隱藏選單變數
let menuWidth = 320;
let menuX = -menuWidth;
let menuTargetX = -menuWidth;
let menuEasing = 0.12;
// 新增兩項：測驗卷筆記、作品筆記（插入在測驗系統之後）
let menuItems = ['第一單元作品', '第一單元講義', '測驗系統', '測驗卷筆記', '作品筆記', '淡江大學', '回到首頁'];
let menuTextSize = 32;
// 對應每項的預設目標網址（若為 null，點擊時會提示使用者輸入網址）
let menuTargets = [
	'https://acgn1221-ai.github.io/20251020/', // 第一單元作品
	'https://hackmd.io/@oQlKWzw8Sb6Vp8HMwRikbg/Byu6UQCjxe', // 第一單元講義
	'https://acgn1221-ai.github.io/20251104/', // 測驗系統
	'https://hackmd.io/@oQlKWzw8Sb6Vp8HMwRikbg/BJs7Ktr1-x', // 測驗卷筆記
	'https://hackmd.io/@oQlKWzw8Sb6Vp8HMwRikbg/SygJ8pFybe', // 作品筆記
	'https://www.tku.edu.tw/', // 淡江大學
	null  // 回到首頁（特別處理）
];
let iframeElem = null; // 新增：iframe 參考

// 新增：學生資訊文字跳動動畫變數 (p5.js 預設 60fps)
let studentInfoBaseY = 30;
let studentInfoBounce = 0; // 文字上下跳動的偏移量
let bounceStartTime = 0;
const bounceDurationUp = 60;   // 向上動畫時間 (1秒)
const bouncePause = 60;        // 停滯時間 (1秒)
const bounceDurationDown = 90;   // 向下動畫時間 (1.5秒)
const totalBounceCycle = bounceDurationUp + bouncePause + bounceDurationDown;


function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	ctx = drawingContext;
	INIT();
}

function draw() {
    background('#eff7f6');
    for (let m of motions) {
        m.run();
    }

    let alph = 0;
    if ((resetTime - fadeOutTime) < sceneTimer && sceneTimer <= resetTime) {
        alph = map(sceneTimer, (resetTime - fadeOutTime), resetTime, 0, 255);
        background(255, alph);

    }

    if (frameCount % resetTime == 0) {
        INIT();
    }

    sceneTimer++;

    // 新增：選單滑出邏輯（當滑鼠在最左側 100px 時滑出）
    if (mouseX <= 100) {
        menuTargetX = 0;
    } else {
        menuTargetX = -menuWidth;
    }
    menuX = lerp(menuX, menuTargetX, menuEasing);

    // 在最上層繪製選單
    drawMenu();

    // 更新學生資訊動畫
    updateStudentInfoAnimation();

    // 在最上層繪製學生資訊
    drawStudentInfo();
}

function INIT() {
	sceneTimer = 0;
	motions = [];
	motionClasses = [Motion01, Motion02, Motion03, Motion04, Motion05];
	let drawingRegion = width * 0.75;
	let cellCount = 25;
	let cellSize = drawingRegion / cellCount;
	let clr = '#415a77';
	for (let i = 0; i < cellCount; i++) {
		for (let j = 0; j < cellCount; j++) {
			let x = cellSize * j + (cellSize / 2) + (width - drawingRegion) / 2;
			let y = cellSize * i + (cellSize / 2) + (height - drawingRegion) / 2;
			let MotionClass = random(motionClasses);
			let t = -int(dist(x, y, width / 2, height / 2) * 0.7);
			motions.push(new MotionClass(x, y, cellSize, t, clr));
		}
	}
}

function easeInOutQuint(x) {
	return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

class Agent {
	constructor(x, y, w, t, clr) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.t1 = int(random(30, 100));
		this.t2 = this.t1 + int(random(30, 100));
		this.t = t;
		this.clr2 = color(clr);
		this.clr1 = color(random(colors));
		this.currentColor = this.clr1;
	}

	show() {
	}

	move() {
		if (0 < this.t && this.t < this.t1) {
			let n = norm(this.t, 0, this.t1 - 1);
			this.updateMotion1(easeInOutQuint(n));
		} else if (this.t1 < this.t && this.t < this.t2) {
			let n = norm(this.t, this.t1, this.t2 - 1);
			this.updateMotion2(easeInOutQuint(n));
		}
		this.t++;
	}

	run() {
		this.show();
		this.move();
	}

	updateMotion1(n) {

	}
	updateMotion2(n) {

	}

}

class Motion01 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 3;
		this.ang = int(random(4)) * (TAU / 4);
		this.size = 0;
	}

	show() {
		noStroke();
		fill(this.currentColor);
		square(this.x + this.shift * cos(this.ang), this.y + this.shift * sin(this.ang), this.size);
	}

	updateMotion1(n) {
		this.shift = lerp(this.w * 3, 0, n);
		this.size = lerp(0, this.w, n);
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
	}
}

class Motion02 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 2;
		this.ang = int(random(4)) * (TAU / 4);
		this.size = 0;
		this.corner = this.w / 2;
	}

	show() {
		noStroke();
		fill(this.currentColor);
		square(this.x + this.shift * cos(this.ang), this.y + this.shift * sin(this.ang), this.size, this.corner);
	}

	updateMotion1(n) {
		this.shift = lerp(0, this.w * 2, n);
		this.size = lerp(0, this.w / 2, n);
	}

	updateMotion2(n) {
		this.size = lerp(this.w / 2, this.w, n);
		this.shift = lerp(this.w * 2, 0, n);
		this.corner = lerp(this.w / 2, 0, n);
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
	}
}

class Motion03 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 2;
		this.ang = 0;
		this.size = 0
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.ang);
		noStroke();
		fill(this.currentColor);
		square(0, 0, this.size);
		pop();
	}

	updateMotion1(n) {
		this.ang = lerp(0, TAU, n);
		this.size = lerp(0, this.w, n);
		this.currentColor = lerpColor(this.clr1, this.clr2, n);

	}
}

class Motion04 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 2;
		this.ang = int(random(4)) * (TAU / 4);
		this.rot = PI;
		this.side = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.ang);
		translate(-this.w / 2, -this.w / 2);
		rotate(this.rot);
		fill(this.currentColor);
		rect(this.w / 2, (this.w / 2) - (this.w - this.side) / 2, this.w, this.side);
		pop();
	}

	updateMotion1(n) {
		this.side = lerp(0, this.w, n);
	}

	updateMotion2(n) {
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
		this.rot = lerp(PI, 0, n);
	}
}

class Motion05 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w / 2;
		this.size = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
		for (let i = 0; i < 4; i++) {
			fill(this.currentColor);
			square((this.w / 4) + this.shift, (this.w / 4) + this.shift, this.size);
			rotate(TAU / 4);
		}
		pop();
	}

	updateMotion1(n) {
		this.size = lerp(0, this.w / 4, n);
	}

	updateMotion2(n) {
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
		this.shift = lerp(this.w / 2, 0, n);
		this.size = lerp(this.w / 4, this.w / 2, n);

	}
}

// 新增：繪製選單（文字大小 32px）
function drawMenu() {
    push();
    translate(menuX, 0);

    // 背景
    noStroke();
    fill('#2b2b2b');
    rect(menuWidth / 2, height / 2, menuWidth, height);

    // 選單文字
    textSize(menuTextSize);
    textAlign(LEFT, TOP);

    let startY = 80;
    let gap = 88;
    for (let i = 0; i < menuItems.length; i++) {
        let y = startY + i * gap;
        // 判斷滑鼠是否在選單與該項目上（考慮 menuX 偏移）
        let relMouseX = mouseX - menuX;
        let hovered = relMouseX >= 0 && relMouseX <= menuWidth && mouseY >= y && mouseY <= y + 48;

        if (hovered) {
            fill('#ffd166'); // hover 顏色
        } else {
            fill(255); // 文字顏色
        }
        // 左內距 40
        text(menuItems[i], 40, y);
    }
    pop();
}

// 新增：easeInOutQuad 函數
function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

// 新增：easeOutBounce 函數
function easeOutBounce(x) {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (x < 1 / d1) { return n1 * x * x; }
    else if (x < 2 / d1) { return n1 * (x -= 1.5 / d1) * x + 0.75; }
    else if (x < 2.5 / d1) { return n1 * (x -= 2.25 / d1) * x + 0.9375; }
    else { return n1 * (x -= 2.625 / d1) * x + 0.984375; }
}

// 新增：更新學生資訊動畫狀態的函式
function updateStudentInfoAnimation() {
    let elapsed = frameCount - bounceStartTime;
    let progress = 0;
    const bounceHeight = -20; // 向上跳動的高度

    if (elapsed < bounceDurationUp) {
        // 階段一：向上移動
        progress = elapsed / bounceDurationUp;
        let easedProgress = easeInOutQuad(progress);
        studentInfoBounce = lerp(0, bounceHeight, easedProgress);
    } else if (elapsed < bounceDurationUp + bouncePause) {
        // 階段二：在頂部停滯
        studentInfoBounce = bounceHeight;
    } else if (elapsed < totalBounceCycle) {
        // 階段三：向下移動並反彈
        progress = (elapsed - bounceDurationUp - bouncePause) / bounceDurationDown;
        let easedProgress = easeOutBounce(progress);
        studentInfoBounce = lerp(bounceHeight, 0, easedProgress);
    } else {
        // 動畫週期結束，重置
        studentInfoBounce = 0;
        bounceStartTime = frameCount;
    }
}
// 新增：在畫布最上層繪製學生資訊
function drawStudentInfo() {
    push();
    // 設定文字樣式
    const studentInfoText = '班級: 教育科技一年B班   姓名: 張O婕   學號: 414730506';
    const padding = 20;
    textSize(20);
    textFont('LXGW WenKai TC');
    textAlign(CENTER, TOP);

    // 計算背景框尺寸
    const textW = textWidth(studentInfoText);
    const boxW = textW + padding * 2;
    const boxH = 20 + padding * 2 + 10; // 加大高度以容納跳動

    // 繪製半透明背景框
    fill(0, 0, 0, 150); // 黑色，約 60% 透明度
    noStroke();
    rect(width / 2, studentInfoBaseY + boxH / 2 - padding, boxW, boxH, 6);

    // 繪製文字
    fill('#ffd60a');
    text(studentInfoText, width / 2, studentInfoBaseY + studentInfoBounce);
    pop();
}

// 新增：顯示 / 隱藏 / 調整 iframe 的函式
function showIframe(url) {
    if (!iframeElem) {
        iframeElem = createElement('iframe');
        iframeElem.attribute('frameborder', '0');
        iframeElem.style('position', 'fixed');
        iframeElem.style('z-index', '9999');
        iframeElem.style('background', '#ffffff');
        iframeElem.style('box-shadow', '0 8px 24px rgba(0,0,0,0.4)');
    }
    iframeElem.attribute('src', url);
    iframeElem.style('display', 'block');
    resizeIframe();
}

function hideIframe() {
    if (iframeElem) {
        iframeElem.style('display', 'none');
        // 若要一律移除可以改用 iframeElem.remove(); iframeElem = null;
    }
}

function resizeIframe() {
    if (!iframeElem) return;
    let w = floor(windowWidth * 0.8); // 寬為視窗 80%
    let h = floor(windowHeight * 0.8); // 高設定為視窗 80%
    let left = floor((windowWidth - w) / 2);
    let top = floor((windowHeight - h) / 2);
    iframeElem.style('width', w + 'px');
    iframeElem.style('height', h + 'px');
    iframeElem.style('left', left + 'px');
    iframeElem.style('top', top + 'px');
}

// 在視窗大小改變時同步調整 iframe
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    resizeIframe();
}

// 修改：滑鼠點擊選單回報並處理第一單元作品（以 iframe 顯示）
function mousePressed() {
    let relMouseX = mouseX - menuX;
    if (relMouseX >= 0 && relMouseX <= menuWidth) {
        let startY = 80;
        let gap = 88;
        for (let i = 0; i < menuItems.length; i++) {
            let y = startY + i * gap;
            if (mouseY >= y && mouseY <= y + 48) {
                console.log('選取項目：' + menuItems[i]);
				// 以 menuTargets 陣列為主要控制：若有網址則 showIframe，若為 null 則提示使用者輸入網址；
				// 最後一個（回到首頁）特殊處理為導回 index.html
				if (menuTargets[i]) {
					showIframe(menuTargets[i]);
				} else {
					// 如果是最後一項（回到首頁）
					if (i === menuItems.length - 1) {
						// 導回同目錄下的 index.html
						location.href = 'index.html';
					} else {
						// 提示使用者輸入要顯示的網址（支援 https:// 或 http://）
						let url = prompt('請輸入要顯示的網址（例如 https://...）：');
						if (url) {
							showIframe(url);
						} else {
							// 若使用者取消或未輸入，隱藏 iframe
							hideIframe();
						}
					}
				}
            }
        }
    } else {
        // 若使用者點擊畫布其他地方，可選擇關閉 iframe
        // hideIframe();
    }
}