const LOOT_ITEMS = [
    { id: 1, name: "Ключ", value: 15, w: 1, h: 1, rarity: "common" },
    { id: 2, name: "Сигареты", value: 30, w: 1, h: 1, rarity: "common" },
    { id: 3, name: "Изолента", value: 40, w: 1, h: 1, rarity: "common" },
    { id: 4, name: "Провода", value: 120, w: 1, h: 1, rarity: "rare" },
    { id: 5, name: "Настольные часы", value: 250, w: 1, h: 1, rarity: "epic" },
    { id: 6, name: "Болты", value: 10, w: 1, h: 1, rarity: "common" },
    { id: 7, name: "Граната", value: 150, w: 1, h: 1, rarity: "rare", type: "nade" },
    { id: 8, name: "Аптечка", value: 100, w: 1, h: 2, heal: 30, rarity: "common", type: "med" },
    { id: 9, name: "Тушенка", value: 80, w: 1, h: 1, heal: 10, rarity: "common", type: "food" },
    { id: 10, name: "Сухари", value: 40, w: 1, h: 1, heal: 5, rarity: "common", type: "food" },
    { id: 11, name: "Золотая цепь", value: 1200, w: 1, h: 1, rarity: "epic" },
    { id: 12, name: "Видеокарта", value: 2500, w: 2, h: 1, rarity: "legendary" },
    { id: 13, name: "Биткоин", value: 5000, w: 1, h: 1, rarity: "legendary" },
    { id: 14, name: "Патроны 9x18", value: 50, w: 1, h: 1, rarity: "common", type: "ammo", ammoType: "9x18", count: 16 },
    { id: 15, name: "Патроны 5.45", value: 150, w: 1, h: 1, rarity: "rare", type: "ammo", ammoType: "5.45", count: 30 },
    { id: 16, name: "Патроны 5.56", value: 300, w: 1, h: 1, rarity: "epic", type: "ammo", ammoType: "5.56", count: 30 },
    { id: 17, name: "Стимулятор", value: 500, w: 1, h: 1, rarity: "epic", type: "stim" },
    { id: 18, name: "Бронежилет", value: 600, w: 2, h: 2, rarity: "rare", type: "armor", durability: 60, armor: 8 },
    { id: 19, name: "Большая аптечка", value: 250, w: 2, h: 2, heal: 60, rarity: "rare", type: "med", healPart: "all" },
    { id: 20, name: "Бинт", value: 60, w: 1, h: 1, heal: 15, rarity: "common", type: "med", healPart: "injury" },
    { id: 21, name: "Ключ от КПП", value: 100, w: 1, h: 1, rarity: "rare", type: "key" }
];

const WEAPONS = {
    "ПМ": { damage: 20, mag: 8, ammo: "9x18" },
    "АК-74": { damage: 40, mag: 30, ammo: "5.45" },
    "M4A1": { damage: 60, mag: 30, ammo: "5.56" }
};

const ENEMIES = {
    "Дикий": { hp: 40, damage: 10, armor: 0, rewardMoney: 50, rewardItem: 6 },
    "Свита": { hp: 80, damage: 15, armor: 10, rewardMoney: 150, rewardItem: 3 },
    "USEC": { hp: 100, damage: 20, armor: 15, rewardMoney: 200, rewardItem: 15 },
    "BEAR": { hp: 100, damage: 20, armor: 15, rewardMoney: 200, rewardItem: 8 },
    "Решала": { hp: 150, damage: 25, armor: 25, rewardMoney: 800, rewardItem: 11 },
    "Санитар": { hp: 180, damage: 30, armor: 30, rewardMoney: 1200, rewardItem: 12 },
    "Килла": { hp: 300, damage: 45, armor: 40, rewardMoney: 2500, rewardItem: 13 },
    "Тагилла": { hp: 250, damage: 35, armor: 35, rewardMoney: 2000, rewardItem: 14 }
};

const BOSSES = ["Решала", "Санитар", "Килла", "Тагилла"];
const BACKPACKS = [
    { name: "Сумка", size: 3 },
    { name: "Рюкзак", size: 4 },
    { name: "Беркут", size: 5 }
];

const MAP_RULES = {
    "Завод": { time: 15, steps: 3 },
    "Лес": { time: 20, steps: 4 },
    "Развязка": { time: 15, steps: 3, enemyDamage: 1.5 }
};

const defaultState = {
    money: 5000,
    hp: 100,
    maxHp: 100,
    inventory: [],
    stash: [],
    weapon: "ПМ",
    backpackLevel: 0,
    faction: "BEAR",
    currentAmmo: 8,
    enemy: null,
    clicksCount: 0,
    isInCombat: false,
    isEventActive: false,
    stimTurns: 0,
    timeLeft: 15,
    isExtracting: false,
    stepsToExit: 0,
    armor: 0,
    armorDurability: 0,
    injury: false,
    aimBonus: false,
    stats: { survived: 0, died: 0, earned: 0 },
    version: 8
};

function createNewState() {
    return {
        ...defaultState,
        inventory: [],
        stash: [],
        stats: { survived: 0, died: 0, earned: 0 }
    };
}

let savedData = null;

try {
    savedData = JSON.parse(localStorage.getItem("tarkov_rpg_save"));
} catch (error) {
    console.warn("Сохранение повреждено, создан новый профиль.", error);
}

let state = savedData && [6, 7, 8].includes(savedData.version)
    ? {
        ...createNewState(),
        ...savedData,
        version: 8,
        inventory: Array.isArray(savedData.inventory) ? savedData.inventory : [],
        stash: Array.isArray(savedData.stash) ? savedData.stash : [],
        armor: savedData.armor || 0,
        armorDurability: savedData.armorDurability || 0,
        injury: !!savedData.injury,
        aimBonus: !!savedData.aimBonus,
        stats: {
            survived: savedData.stats?.survived || 0,
            died: savedData.stats?.died || 0,
            earned: savedData.stats?.earned || 0
        }
    }
    : createNewState();

if (
    !Number.isInteger(state.backpackLevel) ||
    state.backpackLevel < 0 ||
    state.backpackLevel >= BACKPACKS.length
) {
    state.backpackLevel = 0;
}

let selectedMap = null;
let selectedBg = null;
let selectedFaction = state.faction;

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioCtx = AudioContextClass ? new AudioContextClass() : null;

function playSound(type) {
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    const sounds = {
        click: { wave: "square", start: 800, end: 800, duration: 0.05, volume: 0.05 },
        shoot: { wave: "sawtooth", start: 200, end: 50, duration: 0.2, volume: 0.2 },
        reload: { wave: "triangle", start: 400, end: 400, duration: 0.1, volume: 0.1 },
        step: { wave: "sine", start: 100, end: 100, duration: 0.1, volume: 0.1 }
    };

    const sound = sounds[type];
    if (!sound) return;

    osc.type = sound.wave;
    osc.frequency.setValueAtTime(sound.start, now);
    if (sound.end !== sound.start) {
        osc.frequency.exponentialRampToValueAtTime(sound.end, now + sound.duration);
    }

    gain.gain.setValueAtTime(sound.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + sound.duration);
    osc.start(now);
    osc.stop(now + sound.duration);
}

function canFitItem(item) {
    const size = BACKPACKS[state.backpackLevel].size;
    const occupied = Array(size * size).fill(false);

    function place(candidate, mark = true) {
        const w = candidate.w || 1;
        const h = candidate.h || 1;
        if (w > size || h > size) return false;

        for (let row = 0; row <= size - h; row++) {
            for (let col = 0; col <= size - w; col++) {
                let fits = true;

                for (let r = 0; r < h && fits; r++) {
                    for (let c = 0; c < w; c++) {
                        if (occupied[(row + r) * size + col + c]) {
                            fits = false;
                            break;
                        }
                    }
                }

                if (!fits) continue;

                if (mark) {
                    for (let r = 0; r < h; r++) {
                        for (let c = 0; c < w; c++) {
                            occupied[(row + r) * size + col + c] = true;
                        }
                    }
                }

                return true;
            }
        }

        return false;
    }

    for (const itemInBag of state.inventory) {
        if (!place(itemInBag)) return false;
    }

    return place(item, false);
}

function addItemToInventory(item) {
    if (!canFitItem(item)) {
        addLog(`Не хватает места для предмета: ${item.name}.`, "danger");
        return false;
    }

    state.inventory.push({ ...item });
    return true;
}

function updateUI() {
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setText("hub-money", state.money);
    setText("hub-hp", state.hp);
    setText("hub-weapon", state.weapon);
    setText("stat-survived", state.stats.survived);
    setText("stat-died", state.stats.died);
    setText("stat-earned", state.stats.earned);
    setText("money-display", state.money);
    setText("hp-display", `${state.hp}/${state.maxHp}`);
    setText("ammo-count", state.currentAmmo);
    setText("time-display", state.timeLeft);
    setText("armor-display", state.armorDurability > 0 ? state.armor : 0);
    setText("injury-display", state.injury ? "есть" : "нет");

    const hpBar = document.getElementById("player-hp-bar");
    if (hpBar) {
        hpBar.style.width = `${Math.max(0, state.hp / state.maxHp * 100)}%`;
        hpBar.style.background = state.hp < 30 ? "#c75c5c" : "#4a6b48";
    }

    const backpackSize = BACKPACKS[state.backpackLevel].size;
    const usedCells = state.inventory.reduce(
        (total, item) => total + (item.w || 1) * (item.h || 1),
        0
    );

    setText("weight-display", `Занято: ${usedCells}/${backpackSize * backpackSize}`);

    const lootBtn = document.getElementById("loot-btn");
    const moveBtn = document.getElementById("move-btn");
    const combatActions = document.getElementById("combat-actions");

    if (state.isInCombat || state.isEventActive) {
        lootBtn?.classList.add("hidden");
        moveBtn?.classList.add("hidden");
    } else if (state.isExtracting) {
        lootBtn?.classList.add("hidden");
        moveBtn?.classList.remove("hidden");
        if (moveBtn) {
            moveBtn.textContent = `ИДТИ К ВЫХОДУ (Осталось: ${state.stepsToExit})`;
        }
    } else {
        lootBtn?.classList.remove("hidden");
        moveBtn?.classList.add("hidden");
    }

    combatActions?.classList.toggle("hidden", !state.isInCombat);

    renderGrid("grid-bg", "grid-items", state.inventory, backpackSize, false);
    renderGrid("stash-bg", "stash-items", state.stash, 6, true);

    localStorage.setItem("tarkov_rpg_save", JSON.stringify(state));
}

function renderGrid(bgId, itemsId, items, size, isStash) {
    const bg = document.getElementById(bgId);
    const container = document.getElementById(itemsId);
    if (!bg || !container) return;

    container.innerHTML = "";
    bg.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    bg.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    if (bg.children.length !== size * size) {
        bg.innerHTML = "";

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement("div");
            cell.className = "grid-cell";
            bg.appendChild(cell);
        }
    }

    const occupied = Array(size * size).fill(false);
    const cellW = 100 / size;
    const cellH = 100 / size;

    items.forEach((item, index) => {
        const w = item.w || 1;
        const h = item.h || 1;
        let placement = null;

        for (let row = 0; row <= size - h && !placement; row++) {
            for (let col = 0; col <= size - w; col++) {
                let free = true;

                for (let r = 0; r < h && free; r++) {
                    for (let c = 0; c < w; c++) {
                        if (occupied[(row + r) * size + col + c]) {
                            free = false;
                            break;
                        }
                    }
                }

                if (free) placement = { row, col };
            }
        }

        if (!placement) return;

        for (let r = 0; r < h; r++) {
            for (let c = 0; c < w; c++) {
                occupied[(placement.row + r) * size + placement.col + c] = true;
            }
        }

        const itemDiv = document.createElement("div");
        itemDiv.className = `inv-item rarity-${item.rarity || "common"}`;
        itemDiv.style.width = `calc(${w * cellW}% - 2px)`;
        itemDiv.style.height = `calc(${h * cellH}% - 2px)`;
        itemDiv.style.left = `calc(${placement.col * cellW}% + 2px)`;
        itemDiv.style.top = `calc(${placement.row * cellH}% + 2px)`;

        if (isStash) {
            itemDiv.innerHTML = `<div>${item.name}</div><div class="item-val">${item.value}₽</div>`;
            itemDiv.onclick = () => openStashMenu(index);
        } else {
            const name = item.count ? `${item.name} (${item.count})` : item.name;
            itemDiv.innerHTML = `<button class="drop-btn" type="button">x</button><div>${name}</div>`;
            itemDiv.querySelector(".drop-btn").onclick = event => {
                event.stopPropagation();
                dropItem(index);
            };
        }

        container.appendChild(itemDiv);
    });
}

window.switchHubTab = function(tab, button) {
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    button?.classList.add("active");

    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.add("hidden");
    });

    document.getElementById(`hub-${tab}`)?.classList.remove("hidden");
};

function useConsumable(item, fromStash = false) {
    if (item.type === "med" || item.type === "food") {
        if (item.healPart === "injury") {
            if (!state.injury) {
                alert("Ранений нет.");
                return false;
            }
            state.injury = false;
        } else {
            state.hp = Math.min(state.maxHp, state.hp + item.heal);
            if (item.healPart === "all") state.injury = false;
        }
        return true;
    }

    if (item.type === "stim") {
        state.stimTurns = 10;
        return true;
    }

    if (item.type === "armor") {
        state.armor = item.armor || 8;
        state.armorDurability = item.durability || 60;
        return true;
    }

    if (item.type === "nade") {
        state.grenades = (state.grenades || 0) + 1;
        return true;
    }

    if (fromStash) {
        alert("Этот предмет нельзя использовать здесь.");
    }
    return false;
}

function openStashMenu(index) {
    const item = state.stash[index];
    if (!item) return;

    const action = prompt(
        `Предмет: ${item.name}\n1 — Продать за ${item.value}₽\n2 — Использовать\nОтмена — закрыть`,
        "1"
    );

    if (action === "1") {
        state.money += item.value;
        state.stats.earned += item.value;
        state.stash.splice(index, 1);
        playSound("click");
    } else if (action === "2" && useConsumable(item, true)) {
        state.stash.splice(index, 1);
        playSound("click");
    }

    updateUI();
}

window.dropItem = function(index) {
    state.inventory.splice(index, 1);
    updateUI();
};

window.buyItem = function(type, param) {
    if (type === "backpack") {
        if (param <= state.backpackLevel) {
            addLog("У вас уже есть этот рюкзак или лучше.", "system");
            return;
        }

        const cost = param === 1 ? 2000 : 10000;
        if (state.money < cost) {
            addLog("Недостаточно денег.", "danger");
            return;
        }

        state.money -= cost;
        state.backpackLevel = param;
    } else if (type === "weapon") {
        const cost = param === "АК-74" ? 1500 : 5000;
        if (!WEAPONS[param] || state.money < cost) {
            addLog("Недостаточно денег.", "danger");
            return;
        }

        state.money -= cost;
        state.weapon = param;
        state.currentAmmo = WEAPONS[param].mag;
    } else {
        let item;
        let cost;

        if (type === "item") {
            const prices = {
                "Аптечка": 100,
                "Большая аптечка": 250,
                "Бинт": 60,
                "Бронежилет": 600,
                "Граната": 150,
                "Стимулятор": 500
            };
            item = LOOT_ITEMS.find(entry => entry.name === param);
            cost = prices[param];
        }

        if (type === "ammo") {
            const prices = { "9x18": 50, "5.45": 150, "5.56": 300 };
            item = LOOT_ITEMS.find(entry => entry.ammoType === param);
            cost = prices[param];
        }

        if (!item || state.money < cost) {
            addLog("Недостаточно денег или товар не найден.", "danger");
            return;
        }

        state.money -= cost;
        state.stash.push({ ...item });
    }

    playSound("click");
    updateUI();
};

document.querySelectorAll(".faction-btn").forEach(button => {
    button.onclick = () => {
        document.querySelectorAll(".faction-btn").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        selectedFaction = button.dataset.faction;
        checkStartBtn();
        playSound("click");
    };
});

document.querySelectorAll(".map-btn").forEach(button => {
    button.onclick = () => {
        document.querySelectorAll(".map-btn").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        selectedMap = button.dataset.map;
        selectedBg = button.dataset.bg;
        checkStartBtn();
        playSound("click");
    };
});

function checkStartBtn() {
    const button = document.getElementById("start-btn");
    if (button) button.disabled = !(selectedFaction && selectedMap);
}

document.getElementById("start-btn").addEventListener("click", () => {
    if (!selectedFaction || !selectedMap) return;

    const mapRule = MAP_RULES[selectedMap] || MAP_RULES["Завод"];

    state.faction = selectedFaction;
    state.timeLeft = mapRule.time;
    state.isExtracting = false;
    state.stepsToExit = 0;
    state.isInCombat = false;
    state.isEventActive = false;
    state.enemy = null;
    state.injury = false;
    state.aimBonus = false;

    document.getElementById("faction-display").textContent = state.faction;
    document.getElementById("map-display").textContent = selectedMap;
    document.body.style.backgroundImage = selectedBg ? `url("${selectedBg}")` : "none";

    document.getElementById("hub-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");
    document.getElementById("log-area").innerHTML =
        `<p class="log-system">Рейд на "${selectedMap}". Найдите выход!</p>`;

    playSound("click");
    updateUI();
});

document.getElementById("extract-btn").addEventListener("click", () => {
    if (state.isInCombat || state.isEventActive) {
        addLog("Нельзя выбирать выход во время боя или события.", "danger");
        return;
    }

    if (state.isExtracting) {
        addLog("Вы уже направляетесь к выходу.", "system");
        return;
    }

    if (state.timeLeft > 10) {
        addLog("Выходы пока закрыты. Нужно дождаться, пока останется 10 ходов.", "system");
        return;
    }

    state.isEventActive = true;

    const panel = document.getElementById("event-panel");
    const options = document.getElementById("event-options");
    options.innerHTML = "";

    document.getElementById("enemy-name").textContent = "Карта выходов";
    document.getElementById("event-text").textContent = "Куда направимся?";
    document.getElementById("combat-hp").classList.add("hidden");
    panel.classList.remove("hidden");

    const exits = [
        { name: "Выход А (Лес)", requiresKey: false },
        { name: "Выход Б (Склад)", requiresKey: false },
        { name: "Выход В (КПП)", requiresKey: true }
    ];

    exits.forEach(exit => {
        const button = document.createElement("button");
        button.className = "event-btn";
        button.textContent = exit.requiresKey
            ? `${exit.name} — нужен ключ от КПП`
            : exit.name;

        button.onclick = () => {
            const hasKey = state.inventory.some(item => item.type === "key");
            if (exit.requiresKey && !hasKey) {
                addLog("Для этого выхода нужен ключ от КПП.", "danger");
                return;
            }

            if (exit.requiresKey) {
                const keyIndex = state.inventory.findIndex(item => item.type === "key");
                state.inventory.splice(keyIndex, 1);
            }

            state.isEventActive = false;
            state.isExtracting = true;
            state.stepsToExit = MAP_RULES[selectedMap]?.steps || 3;
            document.getElementById("event-panel").classList.add("hidden");
            addLog(`Вы выбрали ${exit.name}. До выхода ${state.stepsToExit} шага.`, "success");
            updateUI();
        };

        options.appendChild(button);
    });

    updateUI();
});

document.getElementById("move-btn").addEventListener("click", () => {
    if (!state.isExtracting || state.isInCombat || state.isEventActive) return;

    state.stepsToExit--;
    state.timeLeft--;
    playSound("step");

    if (state.timeLeft <= 0) {
        gameOver("Время вышло — вы не успели добраться до выхода.");
        return;
    }

    if (state.stepsToExit <= 0) {
        winRaid();
        return;
    }

    addLog(`Вы идёте к выходу. Осталось шагов: ${state.stepsToExit}.`, "system");

    const dangerChance = Math.min(20 + state.clicksCount * 5, 75);
    state.clicksCount++;

    updateUI();

    if (Math.random() * 100 < dangerChance) {
        Math.random() < 0.65 ? spawnEnemy() : triggerRandomEvent();
    }
});

document.getElementById("loot-btn").addEventListener("click", () => {
    if (state.isInCombat || state.isEventActive || state.isExtracting) return;

    state.timeLeft--;
    playSound("step");

    if (state.timeLeft <= 0) {
        gameOver("Время вышло — вы остались в рейде.");
        return;
    }

    let itemPool = LOOT_ITEMS;

    if (selectedMap === "Завод") {
        itemPool = LOOT_ITEMS.filter(item =>
            item.type === "ammo" || item.type === "armor" ||
            item.rarity !== "common"
        );
    } else if (selectedMap === "Лес") {
        itemPool = LOOT_ITEMS.filter(item =>
            item.type === "food" || item.type === "med" ||
            item.rarity === "common"
        );
    }

    const item = itemPool[Math.floor(Math.random() * itemPool.length)];
    addItemToInventory(item);

    if (state.stimTurns > 0) {
        state.hp = Math.min(state.maxHp, state.hp + 2);
        state.stimTurns--;
        if (state.stimTurns === 0) addLog("Действие стимулятора закончилось.", "system");
    }

    updateUI();

    const eventChance = Math.min(10 + state.clicksCount * 5, 70);
    state.clicksCount++;

    if (Math.random() * 100 < eventChance) {
        Math.random() < 0.5 ? spawnEnemy() : triggerRandomEvent();
    }
});

function triggerRandomEvent() {
    state.isEventActive = true;

    const panel = document.getElementById("event-panel");
    const title = document.getElementById("enemy-name");
    const text = document.getElementById("event-text");
    const options = document.getElementById("event-options");

    panel.classList.remove("hidden");
    document.getElementById("combat-hp").classList.add("hidden");
    options.innerHTML = "";

    const events = [
        {
            title: "Шуршание",
            text: "За углом слышится шорох.",
            choices: [
                {
                    label: "Проверить",
                    action: () => resolveEvent("В куче мусора нашлись патроны.", 0, "Патроны 9x18")
                },
                {
                    label: "Уйти",
                    action: () => resolveEvent("Вы решили не рисковать и ушли.", 0)
                }
            ]
        },
        {
            title: "Растяжка",
            text: "На уровне колен натянута проволока.",
            choices: [
                {
                    label: "Перепрыгнуть",
                    action: () => Math.random() > 0.3
                        ? resolveEvent("Вы успешно перепрыгнули ловушку.", 0)
                        : resolveEvent("Ловушка взорвалась! Вы получили ранение и потеряли здоровье.", -25, null, true)
                },
                {
                    label: "Перерезать",
                    action: () => resolveEvent("Вы обезвредили ловушку и нашли гранату.", 0, "Граната")
                }
            ]
        },
        {
            title: "Заброшенный медпункт",
            text: "В комнате видны остатки медицинских припасов.",
            choices: [
                {
                    label: "Осмотреть",
                    action: () => resolveEvent("Вы нашли бинт.", 0, "Бинт")
                },
                {
                    label: "Пройти мимо",
                    action: () => resolveEvent("Вы прошли мимо медпункта.", 0)
                }
            ]
        }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    title.textContent = event.title;
    text.textContent = event.text;

    event.choices.forEach(choice => {
        const button = document.createElement("button");
        button.className = "event-btn";
        button.textContent = choice.label;
        button.onclick = choice.action;
        options.appendChild(button);
    });

    updateUI();
}

function resolveEvent(message, hpChange = 0, itemName = null, causesInjury = false) {
    if (hpChange) {
        state.hp = Math.max(0, Math.min(state.maxHp, state.hp + hpChange));
    }

    if (causesInjury) state.injury = true;

    if (itemName) {
        const item = LOOT_ITEMS.find(entry => entry.name === itemName);
        if (item) addItemToInventory(item);
    }

    if (state.hp <= 0) {
        gameOver("Вы погибли после случайного события.");
        return;
    }

    addLog(message, hpChange < 0 ? "danger" : "success");
    closeEvent();
}

function closeEvent() {
    state.isEventActive = false;
    document.getElementById("event-panel").classList.add("hidden");
    updateUI();
}

function spawnEnemy() {
    let enemyName;

    if (Math.random() < 0.2) {
        enemyName = BOSSES[Math.floor(Math.random() * BOSSES.length)];
    } else {
        const normals = Object.keys(ENEMIES).filter(
            name => !BOSSES.includes(name) && name !== state.faction
        );
        enemyName = normals[Math.floor(Math.random() * normals.length)];
    }

    const base = ENEMIES[enemyName];
    const damageMultiplier = selectedMap === "Развязка" ? 1.5 : 1;

    state.enemy = {
        ...base,
        name: enemyName,
        currentHp: base.hp,
        damage: Math.floor(base.damage * damageMultiplier)
    };

    state.isInCombat = true;
    state.clicksCount = 0;

    document.getElementById("enemy-name").textContent = enemyName;
    document.getElementById("event-text").textContent = "Враг открыл огонь!";
    document.getElementById("event-options").innerHTML = "";
    document.getElementById("combat-hp").classList.remove("hidden");
    document.getElementById("enemy-hp-display").textContent =
        `${state.enemy.currentHp}/${state.enemy.hp}`;
    document.getElementById("enemy-hp-bar").style.width = "100%";
    document.getElementById("event-panel").classList.remove("hidden");

    addLog(`ВНИМАНИЕ! Обнаружен ${enemyName}.`, "danger");
    updateUI();
    enemyAttack();
}

function enemyAttack() {
    if (!state.isInCombat || !state.enemy) return;

    let damage = state.enemy.damage;
    let blocked = 0;

    if (state.armorDurability > 0) {
        blocked = Math.min(state.armor, damage, state.armorDurability);
        state.armorDurability -= blocked;
        damage -= blocked;

        if (state.armorDurability <= 0) {
            state.armor = 0;
            state.armorDurability = 0;
            addLog("Бронежилет разрушен!", "danger");
        }
    }

    state.hp -= damage;

    if (state.injury && Math.random() < 0.25) {
        state.hp -= 5;
        addLog("Ранение ухудшилось: потеряно ещё 5 HP.", "danger");
    }

    addLog(
        `${state.enemy.name} атакует! Урон: ${damage}${blocked ? ` (${blocked} поглощено бронёй)` : ""}.`,
        "danger"
    );

    updateUI();

    if (state.hp <= 0) gameOver("Вы погибли в бою.");
}

// --- СТРЕЛЬБА ---
document.getElementById("shoot-btn").addEventListener("click", () => {
    if (!state.isInCombat || !state.enemy) return;

    if (state.currentAmmo <= 0) {
        addLog("Магазин пуст — нужно перезарядиться.", "danger");
        return;
    }

    playSound("shoot");
    state.currentAmmo--;

    let damage = WEAPONS[state.weapon].damage;
    if (state.aimBonus) {
        damage = Math.floor(damage * 1.5);
        state.aimBonus = false;
    } else if (Math.random() < 0.2) {
        damage *= 2;
    }

    state.enemy.currentHp -= damage;
    addLog(`Вы стреляете и наносите ${damage} урона.`, "success");

    updateEnemyHealth();
    updateUI();

    if (state.enemy.currentHp <= 0) winFight();
    else enemyAttack();
});

function updateEnemyHealth() {
    if (!state.enemy) return;
    const percent = Math.max(0, state.enemy.currentHp / state.enemy.hp * 100);
    document.getElementById("enemy-hp-bar").style.width = `${percent}%`;
    document.getElementById("enemy-hp-display").textContent =
        `${Math.max(0, state.enemy.currentHp)}/${state.enemy.hp}`;
}

document.getElementById("reload-btn").addEventListener("click", () => {
    if (!state.isInCombat || !state.enemy) return;

    const weapon = WEAPONS[state.weapon];
    const needed = weapon.mag - state.currentAmmo;

    if (needed <= 0) {
        addLog("Магазин уже полон.", "system");
        return;
    }

    const ammoItems = state.inventory.filter(
        item => item.ammoType === weapon.ammo && item.count > 0
    );
    let available = ammoItems.reduce((sum, item) => sum + item.count, 0);

    if (available <= 0) {
        addLog(`Нет патронов типа ${weapon.ammo}.`, "danger");
        return;
    }

    playSound("reload");
    const loaded = Math.min(needed, available);
    let remaining = loaded;

    for (const item of ammoItems) {
        const used = Math.min(remaining, item.count);
        item.count -= used;
        remaining -= used;
        if (remaining <= 0) break;
    }

    state.inventory = state.inventory.filter(
        item => !(item.ammoType === weapon.ammo && item.count <= 0)
    );

    state.currentAmmo += loaded;
    addLog(`Перезарядка: заряжено ${loaded} патронов.`, "success");
    updateUI();
    enemyAttack();
});

document.getElementById("cover-btn").addEventListener("click", () => {
    if (!state.isInCombat) return;

    playSound("click");

    if (Math.random() > 0.4) {
        addLog("Вы укрылись и избежали атаки.", "success");
    } else {
        addLog("Укрытие не помогло.", "danger");
        enemyAttack();
    }
});

document.getElementById("heal-btn").addEventListener("click", () => {
    if (!state.isInCombat) return;

    const index = state.inventory.findIndex(
        item => item.type === "med" || item.type === "food"
    );

    if (index === -1) {
        addLog("В рюкзаке нет аптечек или еды.", "danger");
        return;
    }

    const item = state.inventory[index];

    if (!useConsumable(item)) {
        addLog("Этот предмет нельзя применить.", "system");
        return;
    }

    state.inventory.splice(index, 1);
    playSound("reload");
    addLog(`Использовано: ${item.name}.`, "success");
    updateUI();
    enemyAttack();
});

document.getElementById("grenade-btn").addEventListener("click", () => {
    if (!state.isInCombat || !state.enemy) return;

    const index = state.inventory.findIndex(item => item.type === "nade");
    if (index === -1) {
        addLog("В рюкзаке нет гранаты.", "danger");
        return;
    }

    state.inventory.splice(index, 1);
    playSound("shoot");

    const damage = 80;
    state.enemy.currentHp -= damage;
    addLog(`Вы бросили гранату и нанесли ${damage} урона!`, "success");

    updateEnemyHealth();
    updateUI();

    if (state.enemy.currentHp <= 0) winFight();
    else enemyAttack();
});

document.getElementById("flee-btn").addEventListener("click", () => {
    if (!state.isInCombat || !state.enemy) return;

    playSound("step");

    const name = state.enemy.name;
    const penalty = Math.floor((state.enemy.armor || 0) * 0.25);
    const chance = Math.max(15, Math.min(75, 55 - penalty));

    if (Math.random() * 100 < chance) {
        state.isInCombat = false;
        state.enemy = null;
        state.isEventActive = false;
        document.getElementById("event-panel").classList.add("hidden");

        addLog(`Вы сбежали от ${name}. Потрачен один ход.`, "success");
        state.timeLeft--;

        if (state.inventory.length && Math.random() < 0.5) {
            const lost = state.inventory.splice(
                Math.floor(Math.random() * state.inventory.length), 1
            )[0];
            addLog(`При побеге потерян предмет: ${lost.name}.`, "danger");
        }

        if (state.timeLeft <= 0) {
            gameOver("Время рейда закончилось во время побега.");
            return;
        }

        updateUI();
    } else {
        addLog(`Не удалось убежать от ${name}!`, "danger");
        enemyAttack();
    }
});

function winFight() {
    if (!state.enemy) return;

    const enemy = state.enemy;
    addLog(`Вы победили: ${enemy.name}!`, "success");

    state.money += enemy.rewardMoney;
    state.stats.earned += enemy.rewardMoney;

    if (enemy.rewardItem) {
        const reward = LOOT_ITEMS.find(item => item.id === enemy.rewardItem);
        if (reward) addItemToInventory(reward);
    }

    state.enemy = null;
    state.isInCombat = false;
    document.getElementById("event-panel").classList.add("hidden");
    updateUI();
}

function gameOver(reason) {
    addLog(`РЕЙД ПРОВАЛЕН: ${reason}`, "danger");

    state.stats.died++;
    state.inventory = [];
    state.hp = state.maxHp;
    state.money = Math.floor(state.money * 0.7);
    state.isInCombat = false;
    state.isEventActive = false;
    state.isExtracting = false;
    state.stepsToExit = 0;
    state.enemy = null;
    state.injury = false;
    state.armor = 0;
    state.armorDurability = 0;
    state.currentAmmo = WEAPONS[state.weapon].mag;

    updateUI();

    setTimeout(() => {
        document.getElementById("game-screen").classList.remove("active");
        document.getElementById("hub-screen").classList.add("active");
        document.body.style.backgroundImage = "none";
    }, 1500);
}

function winRaid() {
    addLog("ВЫ УСПЕШНО ВЫШЛИ ИЗ РЕЙДА!", "success");
    state.stats.survived++;

    if (state.inventory.length) {
        state.stash.push(...state.inventory);
        state.inventory = [];
    }

    state.isExtracting = false;
    state.injury = false;
    updateUI();

    setTimeout(() => {
        document.getElementById("game-screen").classList.remove("active");
        document.getElementById("hub-screen").classList.add("active");
        document.body.style.backgroundImage = "none";
        switchHubTab("stash", document.querySelectorAll(".tab-btn")[2]);
    }, 1500);
}

function addLog(message, type = "loot") {
    const area = document.getElementById("log-area");
    if (!area) return;

    const paragraph = document.createElement("p");
    paragraph.className = `log-${type}`;
    paragraph.textContent = message;
    area.appendChild(paragraph);
    area.scrollTop = area.scrollHeight;
}

document.getElementById("reset-game-btn")?.addEventListener("click", () => {
    if (!confirm("Обнулить весь прогресс?")) return;

    state = createNewState();
    selectedMap = null;
    selectedBg = null;
    selectedFaction = state.faction;
    localStorage.removeItem("tarkov_rpg_save");

    document.querySelectorAll(".faction-btn, .map-btn").forEach(button => {
        button.classList.remove("selected");
    });

    document.getElementById("start-btn").disabled = true;
    document.body.style.backgroundImage = "none";
    document.getElementById("game-screen").classList.remove("active");
    document.getElementById("hub-screen").classList.add("active");

    switchHubTab("raid", document.querySelector(".tab-btn"));
    updateUI();
});

updateUI();