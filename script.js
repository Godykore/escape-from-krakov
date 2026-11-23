"use strict";

const ENERGY_MAX = 100;
const MIN_RAID_TURNS = 10;
const MAX_RAID_TURNS = 30;
const STASH_SIZE = 10;
const SAVE_VERSION = 22;

const NAME_FIRST = [
    "Андрей", "Славик", "Максим", "Илья", "Денис",
    "Вадим", "Артур", "Никита", "Егор", "Михаил"
];

const NAME_LAST = [
    "Стамеска", "Бронебойный", "Кувалда", "Тихий",
    "Ржавый", "Лесник", "Шустрый", "Крепкий",
    "Шрам", "Одесский"
];

function generateCharacterName() {
    return `${NAME_FIRST[Math.floor(Math.random() * NAME_FIRST.length)]} ${NAME_LAST[Math.floor(Math.random() * NAME_LAST.length)]}`;
}

const WEAPONS = {
    "ТОЗ-106": { damage: 38, mag: 2, ammo: "20/70", price: 2200, durability: 100 },
    "АК-74": { damage: 40, mag: 30, ammo: "5.45", price: 22000, durability: 100 },
    "M4A1": { damage: 55, mag: 30, ammo: "5.56", price: 50000, durability: 100 },
    "Вепрь": { damage: 48, mag: 10, ammo: "7.62", price: 30000, durability: 100 },
    "Сайга-12": { damage: 62, mag: 8, ammo: "12/70", price: 28000, durability: 100 },
    "РПК": { damage: 58, mag: 45, ammo: "5.45", durability: 100, exclusive: true },
    "ПКМ": { damage: 75, mag: 100, ammo: "7.62", durability: 100, exclusive: true }
};

const ARMORS = {
    "Лёгкий бронежилет": { armor: 8, durability: 50, price: 9000 },
    "Средний бронежилет": { armor: 16, durability: 90, price: 22000 },
    "Тяжёлый бронежилет": { armor: 25, durability: 140, price: 45000 },
    "Броня Киллы": { armor: 35, durability: 180, price: 0, exclusive: true }
};

const BACKPACKS = [
    { name: "Сумка", size: 3, price: 0 },
    { name: "Рюкзак", size: 4, price: 4000 },
    { name: "Беркут", size: 5, price: 12000 },
    { name: "Турист", size: 6, price: 24000 },
    { name: "Штурмовой", size: 7, price: 40000 }
];

const ITEMS = [
    { name: "Аптечка", value: 350, buy: 500, w: 1, h: 2, type: "med", heal: 30, rarity: "common" },
    { name: "Большая аптечка", value: 900, buy: 1400, w: 2, h: 2, type: "med", heal: 60, rarity: "rare" },
    { name: "Бинт", value: 220, buy: 350, w: 1, h: 1, type: "med", healPart: "injury", rarity: "common" },
    { name: "Граната", value: 700, buy: 1100, w: 1, h: 1, type: "nade", rarity: "rare" },
    { name: "Стимулятор", value: 1800, buy: 2800, w: 1, h: 1, type: "stim", rarity: "epic" },
    { name: "Энергетик", value: 180, buy: 300, w: 1, h: 1, type: "energy", energy: 25, rarity: "common" },
    { name: "Энергетический батончик", value: 140, buy: 220, w: 1, h: 1, type: "energy", energy: 15, rarity: "common" },
    { name: "Вода", value: 200, buy: 320, w: 1, h: 1, type: "energy", energy: 25, rarity: "common" },
    { name: "Шприц «Джаггернаут»", value: 12000, buy: 0, w: 1, h: 1, type: "juggernaut", rarity: "legendary" },
    { name: "Ключ от КПП", value: 1600, buy: 2500, w: 1, h: 1, type: "key", rarity: "rare" },
    { name: "Ключ от особой комнаты", value: 9000, buy: 14000, w: 1, h: 1, type: "specialKey", rarity: "epic" },
    { name: "Изолента", value: 260, buy: 400, w: 1, h: 1, type: "loot", rarity: "common" },
    { name: "Провода", value: 550, buy: 900, w: 1, h: 1, type: "loot", rarity: "rare" },
    { name: "Настольные часы", value: 1800, buy: 2800, w: 1, h: 1, type: "loot", rarity: "epic" },
    { name: "Золотая цепь", value: 9000, buy: 14000, w: 1, h: 1, type: "loot", rarity: "epic" },
    { name: "Видеокарта", value: 45000, buy: 70000, w: 2, h: 1, type: "loot", rarity: "legendary" },
    { name: "Биткоин", value: 80000, buy: 120000, w: 1, h: 1, type: "loot", rarity: "legendary" },
    { name: "Карманные часы", value: 4200, buy: 6500, w: 1, h: 1, type: "loot", rarity: "rare" },
    { name: "Серебряное кольцо", value: 6500, buy: 10000, w: 1, h: 1, type: "loot", rarity: "rare" },
    { name: "Старинный компас", value: 11000, buy: 17000, w: 1, h: 1, type: "loot", rarity: "epic" },
    { name: "Коллекционная фигурка", value: 18000, buy: 28000, w: 1, h: 1, type: "loot", rarity: "epic" },
    { name: "Патроны 9x18", value: 180, buy: 300, w: 1, h: 1, type: "ammo", ammoType: "9x18", count: 16, compatibleWeapons: ["ПМ"], rarity: "common" },
    { name: "Патроны 5.45", value: 650, buy: 1000, w: 1, h: 1, type: "ammo", ammoType: "5.45", count: 30, compatibleWeapons: ["АК-74", "РПК"], rarity: "rare" },
    { name: "Патроны 5.56", value: 900, buy: 1400, w: 1, h: 1, type: "ammo", ammoType: "5.56", count: 30, compatibleWeapons: ["M4A1"], rarity: "rare" },
    { name: "Патроны 7.62", value: 1100, buy: 1700, w: 1, h: 1, type: "ammo", ammoType: "7.62", count: 30, compatibleWeapons: ["Вепрь", "ПКМ"], rarity: "epic" },
    { name: "Патроны 12/70", value: 700, buy: 1100, w: 1, h: 1, type: "ammo", ammoType: "12/70", count: 12, compatibleWeapons: ["Сайга-12"], rarity: "rare" },
    { name: "Патроны 20/70", value: 400, buy: 650, w: 1, h: 1, type: "ammo", ammoType: "20/70", count: 10, compatibleWeapons: ["ТОЗ-106"], rarity: "common" },
    { name: "Болты", value: 280, buy: 420, w: 1, h: 1, type: "loot", rarity: "common" },
    { name: "Гайки", value: 180, buy: 300, w: 1, h: 1, type: "loot", rarity: "common" },
    { name: "Флешка", value: 2400, buy: 3800, w: 1, h: 1, type: "loot", rarity: "rare" },
    { name: "Кофе", value: 450, buy: 700, w: 1, h: 1, type: "energy", energy: 20, rarity: "common" },
    { name: "Антисептик", value: 500, buy: 750, w: 1, h: 1, type: "med", heal: 10, rarity: "common" }
];

const MASK_ITEM = {
    name: "Маска Тагиллы",
    value: 0,
    w: 1,
    h: 1,
    type: "mask",
    exclusive: true,
    rarity: "legendary"
};

const KILLA_ARMOR_ITEM = {
    name: "Броня Киллы",
    value: 0,
    w: 2,
    h: 2,
    type: "armor",
    armor: 35,
    durability: 180,
    maxDurability: 180,
    exclusive: true,
    rarity: "legendary"
};

const BOSSES = ["Решала", "Санитар", "Килла", "Тагилла"];

const ENEMIES = {
    "Дикий": { hp: 45, damage: 10, armor: 0, money: 500, loot: ["Болты", "Провода"] },
    "Свита": { hp: 75, damage: 15, armor: 8, money: 1200, loot: ["Патроны 5.45", "Аптечка"] },
    "USEC": { hp: 95, damage: 18, armor: 12, money: 1500, loot: ["Патроны 5.56", "Большая аптечка"] },
    "BEAR": { hp: 95, damage: 18, armor: 12, money: 1500, loot: ["Патроны 5.45", "Аптечка"] },
    "Решала": { hp: 150, damage: 23, armor: 20, money: 12000, loot: ["Золотая цепь", "Ключ от особой комнаты"] },
    "Санитар": { hp: 180, damage: 27, armor: 25, money: 18000, loot: ["Шприц «Джаггернаут»", "Большая аптечка"] },
    "Килла": { hp: 300, damage: 40, armor: 35, money: 35000, loot: ["Броня Киллы", "РПК", "ПКМ"] },
    "Тагилла": { hp: 250, damage: 33, armor: 28, money: 28000, loot: ["Маска Тагиллы", "Видеокарта"] }
};

const MAP_RULES = {
    "Завод": { time: 30, steps: 3, room: "Заводская оружейная" },
    "Лес": { time: 30, steps: 4, room: "Лесной бункер" },
    "Развязка": { time: 30, steps: 3, room: "Служебная комната" }
};

const defaultState = {
    characterName: generateCharacterName(),
    money: 12000,
    hp: 100,
    maxHp: 100,
    energy: 100,
    maxEnergy: 100,
    stash: [],
    inventory: [],
    weapon: null,
    weaponDurability: 0,
    currentAmmo: 0,
    armor: 0,
    armorDurability: 0,
    equippedArmor: null,
    mask: null,
    backpackLevel: 0,
    faction: "BEAR",
    injury: false,
    stimTurns: 0,
    stimHp: 0,
    stimEnergy: 0,
    specialRoomUsed: false,
    timeLeft: 30,
    clicksCount: 0,
    isInCombat: false,
    isEventActive: false,
    isExtracting: false,
    stepsToExit: 0,
    enemy: null,
    enemyLoot: [],
    aimBonus: false,
    attackMode: "button",
    stats: { survived: 0, died: 0, earned: 0 },
    version: SAVE_VERSION
};

function createNewState() {
    return structuredClone(defaultState);
}

let state;

try {
    const saved = JSON.parse(localStorage.getItem("tarkov_rpg_save"));

    if (saved && [20, 21, SAVE_VERSION].includes(saved.version)) {
        state = { ...createNewState(), ...saved, version: SAVE_VERSION };
        state.characterName ||= generateCharacterName();
        state.stats = { ...defaultState.stats, ...(saved.stats || {}) };
        state.stash = Array.isArray(saved.stash) ? saved.stash : [];
        state.inventory = Array.isArray(saved.inventory) ? saved.inventory : [];
        state.enemyLoot = Array.isArray(saved.enemyLoot) ? saved.enemyLoot : [];

        if (!["button", "aim"].includes(state.attackMode)) {
            state.attackMode = "button";
        }
    } else {
        state = createNewState();
    }
} catch {
    state = createNewState();
}

const sizeFor = () => BACKPACKS[state.backpackLevel]?.size || 3;

let selectedMap = "";
let selectedBg = "";
let selectedFaction = state.faction;
let stashFilter = "all";
let activeMenu = null;
let raidBackground = "";

function clone(item) {
    return structuredClone(item);
}

function itemByName(name) {
    return ITEMS.find(item => item.name === name);
}

function addLog(text, type = "loot") {
    const area = document.getElementById("log-area");
    if (!area) return;

    const p = document.createElement("p");
    p.className = `log-${type}`;
    p.textContent = text;
    area.appendChild(p);
    area.scrollTop = area.scrollHeight;
}

function cells(items) {
    return items.reduce((total, item) => total + (item.w || 1) * (item.h || 1), 0);
}

function canPack(items, item, size = sizeFor()) {
    if (!item || (item.w || 1) > size || (item.h || 1) > size) {
        return false;
    }

    const grid = Array(size * size).fill(false);

    for (const candidate of [...items, item]) {
        const width = candidate.w || 1;
        const height = candidate.h || 1;
        let placed = false;

        for (let y = 0; y <= size - height && !placed; y++) {
            for (let x = 0; x <= size - width && !placed; x++) {
                let free = true;

                for (let dy = 0; dy < height && free; dy++) {
                    for (let dx = 0; dx < width; dx++) {
                        if (grid[(y + dy) * size + x + dx]) {
                            free = false;
                            break;
                        }
                    }
                }

                if (!free) continue;

                for (let dy = 0; dy < height; dy++) {
                    for (let dx = 0; dx < width; dx++) {
                        grid[(y + dy) * size + x + dx] = true;
                    }
                }

                placed = true;
            }
        }

        if (!placed) return false;
    }

    return true;
}

function addRaidItem(item) {
    if (!item) return false;

    if (!canPack(state.inventory, item)) {
        addLog(`Нет места для предмета: ${item.name}.`, "danger");
        return false;
    }

    state.inventory.push(clone(item));
    return true;
}

function getSellPrice(item) {
    if (item.exclusive) return 0;
    return Math.max(1, Math.floor((item.value || item.price || item.buy || 50) * 0.65));
}

function categoryFor(item) {
    if (item.type === "weapon") return "weapon";
    if (item.type === "armor") return "armor";
    if (item.type === "backpack") return "backpack";
    if (["med", "stim", "juggernaut"].includes(item.type)) return "medical";
    if (["energy", "food"].includes(item.type)) return "food";
    if (item.type === "ammo") return "ammo";
    if (["key", "specialKey", "mask"].includes(item.type)) return "special";
    return "all";
}

function describeItem(item) {
    if (!item) return "";

    if (item.type === "weapon") {
        const gun = WEAPONS[item.name];
        const capacity = item.mag || gun?.mag || "?";
        return `${item.name}. Урон: ${item.damage || gun?.damage || "?"}. Калибр: ${item.ammo || gun?.ammo || "?"}. Заряжено: ${state.currentAmmo}/${capacity}.`;
    }

    if (item.type === "armor") {
        return `${item.name}. Защита: ${item.armor || 0}. Прочность: ${item.durability || 0}/${item.maxDurability || item.durability || 0}.`;
    }

    if (item.type === "ammo") {
        return `${item.name}. Количество: ${item.count || 0}. Совместимо: ${(item.compatibleWeapons || []).join(", ") || item.ammoType}.`;
    }

    if (item.type === "med") {
        return `${item.name}. Лечение: ${item.heal || 0} HP${item.healPart === "injury" ? ". Лечит ранение." : "."}`;
    }

    if (item.type === "energy") {
        return `${item.name}. Восстанавливает ${item.energy || 0} энергии.`;
    }

    return `${item.name}. Редкость: ${item.rarity || "обычная"}. Цена продажи: ${getSellPrice(item)} ₽.`;
}

function updateUI() {
    const text = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    state.hp = Math.max(0, Math.min(state.maxHp, state.hp));
    state.energy = Math.max(0, Math.min(state.maxEnergy, state.energy));

    text("hub-character-name", state.characterName);
    text("raid-character-name", state.characterName);
    text("hub-money", state.money);
    text("hub-hp", state.hp);
    text("hub-energy", state.energy);
    text("hub-weapon", state.weapon || "Нож");
    text("hub-armor", state.equippedArmor?.name || "Нет");
    text("hub-backpack", `${BACKPACKS[state.backpackLevel]?.name || "Сумка"} ${sizeFor()}×${sizeFor()}`);
    text("stat-survived", state.stats.survived);
    text("stat-died", state.stats.died);
    text("stat-earned", state.stats.earned);
    text("money-display", state.money);
    text("hp-display", `${state.hp}/${state.maxHp}`);
    text("energy-display", `${state.energy}/${state.maxEnergy}`);
    text("ammo-count", state.currentAmmo);
    text("time-display", state.timeLeft);
    text("armor-display", state.armorDurability > 0 ? state.armor : 0);
    text("injury-display", state.injury ? "есть — снижена точность и здоровье" : "нет");
    text("weapon-display", state.weapon || "Нож");
    text("backpack-size", `${sizeFor()}×${sizeFor()}`);
    text("backpack-slot-size", `${sizeFor()}×${sizeFor()}`);

    const hpBar = document.getElementById("player-hp-bar");
    if (hpBar) {
        hpBar.style.width = `${state.maxHp ? state.hp / state.maxHp * 100 : 0}%`;
    }

    const energyBar = document.getElementById("energy-bar");
    if (energyBar) {
        energyBar.style.width = `${state.maxEnergy ? state.energy / state.maxEnergy * 100 : 0}%`;
    }

    const inAction = state.isInCombat || state.isEventActive;

    document.getElementById("loot-btn")?.classList.toggle("hidden", inAction || state.isExtracting);
    document.getElementById("move-btn")?.classList.toggle("hidden", !state.isExtracting || inAction);
    document.getElementById("combat-actions")?.classList.toggle("hidden", !state.isInCombat);

    updateAttackControls();

    renderGrid("grid-bg", "grid-items", state.inventory, sizeFor(), "raid");
    renderGrid("stash-bg", "stash-items", state.stash, STASH_SIZE, "stash");
    renderGrid("loadout-bg", "loadout-items", state.inventory, sizeFor(), "loadout");
    renderEquipment();
    renderShop();

    try {
        localStorage.setItem("tarkov_rpg_save", JSON.stringify(state));
    } catch (error) {
        console.warn("Не удалось сохранить игру:", error);
    }
}

function renderGrid(bgId, containerId, items, size, mode) {
    const bg = document.getElementById(bgId);
    const container = document.getElementById(containerId);
    if (!bg || !container) return;

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

    container.innerHTML = "";

    const filtered = items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) =>
            mode !== "stash" ||
            stashFilter === "all" ||
            categoryFor(item) === stashFilter
        );

    const occupied = Array(size * size).fill(false);
    const cellWidth = 100 / size;
    const cellHeight = 100 / size;

    filtered.forEach(({ item, index }) => {
        const width = item.w || 1;
        const height = item.h || 1;
        let place = null;

        for (let row = 0; row <= size - height && !place; row++) {
            for (let col = 0; col <= size - width && !place; col++) {
                let free = true;

                for (let y = 0; y < height && free; y++) {
                    for (let x = 0; x < width; x++) {
                        if (occupied[(row + y) * size + col + x]) {
                            free = false;
                            break;
                        }
                    }
                }

                if (free) place = { row, col };
            }
        }

        if (!place) return;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                occupied[(place.row + y) * size + place.col + x] = true;
            }
        }

        const div = document.createElement("div");
        div.className = `inv-item rarity-${item.rarity || "common"}`;
        div.style.width = `calc(${width * cellWidth}% - 2px)`;
        div.style.height = `calc(${height * cellHeight}% - 2px)`;
        div.style.left = `calc(${place.col * cellWidth}% + 2px)`;
        div.style.top = `calc(${place.row * cellHeight}% + 2px)`;
        div.title = describeItem(item);

        const label = document.createElement("div");
        label.textContent = item.count ? `${item.name} (${item.count})` : item.name;
        div.appendChild(label);

        if (item.type === "backpack") {
            const dimensions = document.createElement("div");
            const backpack = BACKPACKS.find(entry => entry.name === item.name);
            dimensions.textContent = backpack ? `${backpack.size}×${backpack.size}` : "";
            div.appendChild(dimensions);
        }

        if (item.type === "ammo") {
            const description = document.createElement("div");
            description.className = "item-description";
            description.textContent = `Для: ${(item.compatibleWeapons || []).join(", ") || item.ammoType}`;
            div.appendChild(description);
        }

        if (item.durability !== undefined) {
            const durability = document.createElement("div");
            durability.textContent = `${item.durability}/${item.maxDurability ?? item.durability}`;
            div.appendChild(durability);
        }

        if (mode === "enemyLoot") {
            div.addEventListener("click", () => takeEnemyLoot(index));
        } else if (mode === "lootPlayer") {
            div.addEventListener("click", () => addLog(describeItem(item), "system"));
        } else if (mode === "stash") {
            const value = document.createElement("div");
            value.className = "item-val";
            value.textContent = item.exclusive ? "Эксклюзив" : `Продажа: ${getSellPrice(item)} ₽`;
            div.appendChild(value);

            div.addEventListener("click", event => {
                event.stopPropagation();
                openItemMenu(index, div);
            });
        } else if (mode === "loadout") {
            div.addEventListener("click", () => {
                const [takenItem] = state.inventory.splice(index, 1);
                if (takenItem) state.stash.push(takenItem);
                updateUI();
            });
        } else {
            const drop = document.createElement("button");
            drop.className = "drop-btn";
            drop.textContent = "×";
            drop.setAttribute("aria-label", "Выбросить предмет");

            drop.addEventListener("click", event => {
                event.stopPropagation();
                state.inventory.splice(index, 1);
                updateUI();
            });

            div.appendChild(drop);
            div.addEventListener("click", () => useRaidItem(index));
        }

        container.appendChild(div);
    });
}

function takeEnemyLoot(index) {
    const item = state.enemyLoot[index];
    if (!item) return;

    if (!canPack(state.inventory, item)) {
        addLog(`В рюкзаке недостаточно места для ${item.name}.`, "danger");
        return;
    }

    state.inventory.push(state.enemyLoot.splice(index, 1)[0]);
    renderGrid("enemy-loot-bg", "enemy-loot-items", state.enemyLoot, 4, "enemyLoot");
    renderGrid("loot-player-bg", "loot-player-items", state.inventory, sizeFor(), "lootPlayer");
    updateUI();
}

function openItemMenu(index, target) {
    closeMenu();

    const item = state.stash[index];
    if (!item) return;

    const menu = document.createElement("div");
    menu.className = "stash-item-menu";

    const title = document.createElement("div");
    title.className = "stash-item-menu-title";
    title.textContent = item.name;
    menu.appendChild(title);

    const details = document.createElement("div");
    details.textContent = describeItem(item);
    menu.appendChild(details);

    if (item.type === "backpack") {
        const backpack = BACKPACKS.find(entry => entry.name === item.name);
        if (backpack) {
            const dimensions = document.createElement("div");
            dimensions.textContent = `Размер: ${backpack.size}×${backpack.size}`;
            menu.appendChild(dimensions);
        }
    }

    const addButton = (label, action) => {
        const button = document.createElement("button");
        button.className = "stash-menu-button";
        button.textContent = label;
        button.onclick = () => {
            action();
            closeMenu();
            updateUI();
        };
        menu.appendChild(button);
    };

    if (item.type === "weapon") {
        addButton("Экипировать оружие", () => {
            state.weapon = item.name;
            state.weaponDurability = item.durability || 0;
            state.currentAmmo = Math.min(state.currentAmmo || 0, WEAPONS[item.name]?.mag || 0);
        });
    }

    if (item.type === "armor") {
        addButton("Экипировать броню", () => equipArmor(item));
    }

    if (item.type === "mask") {
        addButton("Экипировать маску", () => {
            state.mask = clone(item);
        });
    }

    if (item.type === "backpack") {
        addButton("Экипировать рюкзак", () => {
            const level = BACKPACKS.findIndex(entry => entry.name === item.name);
            if (level < 0) return;

            if (level < state.backpackLevel) {
                alert("Нельзя заменить текущий рюкзак на меньший.");
                return;
            }

            state.backpackLevel = level;
            state.stash.splice(index, 1);
        });
    }

    if (["med", "energy", "stim", "juggernaut"].includes(item.type)) {
        addButton("Использовать", () => {
            if (!consumeItem(item)) {
                alert("Сейчас этот предмет использовать нельзя.");
                return;
            }
            state.stash.splice(index, 1);
        });
    }

    if (!item.exclusive) {
        addButton(`Продать за ${getSellPrice(item)} ₽`, () => {
            const price = getSellPrice(item);
            state.money += price;
            state.stats.earned += price;
            state.stash.splice(index, 1);
        });
    }

    addButton("Переложить в рейд", () => {
        if (!canPack(state.inventory, item)) {
            alert("В рюкзаке недостаточно места.");
            return;
        }
        state.inventory.push(state.stash.splice(index, 1)[0]);
    });

    addButton("Закрыть", () => {});

    document.body.appendChild(menu);
    activeMenu = menu;

    const rect = target.getBoundingClientRect();
    const left = Math.max(8, Math.min(rect.left, innerWidth - menu.offsetWidth - 8));
    const top = Math.max(8, Math.min(rect.bottom + 5, innerHeight - menu.offsetHeight - 8));

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
}

function closeMenu() {
    activeMenu?.remove();
    activeMenu = null;
}

document.addEventListener("click", event => {
    if (activeMenu && !activeMenu.contains(event.target)) {
        closeMenu();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
});

function equipArmor(item) {
    state.equippedArmor = clone(item);
    state.armor = item.armor || ARMORS[item.name]?.armor || 0;
    state.armorDurability = item.durability || item.maxDurability || 0;
}

function renderEquipment() {
    const setOptions = (id, entries, emptyLabel, onChange) => {
        const select = document.getElementById(id);
        if (!select) return;

        select.innerHTML = "";

        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = emptyLabel;
        select.appendChild(emptyOption);

        entries.forEach((entry, index) => {
            const option = document.createElement("option");
            option.value = String(index);
            option.textContent = entry.label;
            select.appendChild(option);
        });

        select.value = "";
        select.onchange = () => onChange(select.value);
    };

    const weapons = state.stash.filter(item => item.type === "weapon");
    const armors = state.stash.filter(item => item.type === "armor");
    const masks = state.stash.filter(item => item.type === "mask");
    const backpacks = state.stash.filter(item => item.type === "backpack");

    setOptions(
        "weapon-slot",
        weapons.map(item => ({
            label: `${item.name} (${item.durability}/${item.maxDurability})`
        })),
        "Нож — стандартное оружие",
        value => {
            if (value === "") {
                state.weapon = null;
                state.weaponDurability = 0;
                state.currentAmmo = 0;
            } else {
                const item = weapons[Number(value)];
                if (item) {
                    state.weapon = item.name;
                    state.weaponDurability = item.durability || 0;
                    state.currentAmmo = Math.min(state.currentAmmo || 0, WEAPONS[item.name]?.mag || 0);
                }
            }

            updateUI();
        }
    );

    setOptions(
        "armor-slot",
        armors.map(item => ({
            label: `${item.name} (${item.durability}/${item.maxDurability})`
        })),
        "Без брони",
        value => {
            if (value === "") {
                state.equippedArmor = null;
                state.armor = 0;
                state.armorDurability = 0;
            } else {
                const item = armors[Number(value)];
                if (item) equipArmor(item);
            }

            updateUI();
        }
    );

    setOptions(
        "mask-slot",
        masks.map(item => ({ label: item.name })),
        "Без маски",
        value => {
            state.mask = value === "" ? null : clone(masks[Number(value)]);
            updateUI();
        }
    );

    setOptions(
        "backpack-slot",
        backpacks.map(item => {
            const backpack = BACKPACKS.find(entry => entry.name === item.name);
            return {
                label: `${item.name} — ${backpack?.size || "?"}×${backpack?.size || "?"}`
            };
        }),
        `${BACKPACKS[state.backpackLevel]?.name || "Сумка"} — ${sizeFor()}×${sizeFor()} (надет)`,
        value => {
            if (value === "") return;

            const item = backpacks[Number(value)];
            if (!item) return;

            const level = BACKPACKS.findIndex(entry => entry.name === item.name);

            if (level < state.backpackLevel) {
                alert("Нельзя заменить текущий рюкзак на меньший.");
                updateUI();
                return;
            }

            const index = state.stash.indexOf(item);
            if (index >= 0) state.stash.splice(index, 1);

            state.backpackLevel = level;
            updateUI();
        }
    );
}

const SHOP = {
    weapons: [
        ...Object.entries(WEAPONS)
            .filter(([, weapon]) => !weapon.exclusive)
            .map(([name, weapon]) => ({
                name,
                type: "weapon",
                price: weapon.price,
                damage: weapon.damage,
                mag: weapon.mag,
                ammo: weapon.ammo,
                durability: weapon.durability,
                maxDurability: weapon.durability,
                w: 2,
                h: 2,
                rarity: name === "ТОЗ-106" ? "common" : "rare"
            })),
        ...Object.entries(ARMORS)
            .filter(([, armor]) => !armor.exclusive)
            .map(([name, armor]) => ({
                name,
                type: "armor",
                price: armor.price,
                value: Math.floor(armor.price * 0.65),
                armor: armor.armor,
                durability: armor.durability,
                maxDurability: armor.durability,
                w: 2,
                h: 2,
                rarity: "rare"
            }))
    ],
    medical: ITEMS.filter(item => ["med", "stim"].includes(item.type)),
    food: ITEMS.filter(item => item.type === "energy"),
    special: ITEMS.filter(item => ["key", "specialKey"].includes(item.type)),
    ammo: ITEMS.filter(item => item.type === "ammo"),
    backpacks: BACKPACKS.slice(1).map(backpack => ({
        name: backpack.name,
        type: "backpack",
        price: backpack.price,
        value: Math.floor(backpack.price * 0.65),
        w: 2,
        h: 2,
        size: backpack.size,
        rarity: "rare"
    }))
};

let shopCategory = "weapons";

function renderShop() {
    const grid = document.getElementById("shop-grid");
    if (!grid) return;

    grid.innerHTML = "";

    (SHOP[shopCategory] || []).forEach(item => {
        const button = document.createElement("button");
        button.className = "shop-btn";

        const name = document.createTextNode(item.name);
        const price = document.createElement("span");
        price.textContent = `${item.price || item.buy || 0} ₽`;

        button.appendChild(name);
        button.appendChild(price);

        if (item.type === "backpack") {
            const size = document.createElement("small");
            size.textContent = `Размер: ${item.size}×${item.size}`;
            button.appendChild(document.createElement("br"));
            button.appendChild(size);
        }

        if (item.type === "ammo") {
            const compatible = (item.compatibleWeapons || []).join(", ") || item.ammoType;
            button.title = `Патроны ${item.ammoType}. Совместимо: ${compatible}`;

            const details = document.createElement("small");
            details.textContent = `Для: ${compatible}`;
            button.appendChild(document.createElement("br"));
            button.appendChild(details);
        }

        button.onclick = () => buyItem(item);
        grid.appendChild(button);
    });
}

function buyItem(item) {
    const price = item.price ?? item.buy ?? 0;

    if (!price) return alert("Этот предмет нельзя купить.");
    if (state.money < price) return alert("Недостаточно денег.");

    if (item.type === "backpack") {
        const level = BACKPACKS.findIndex(backpack => backpack.name === item.name);

        if (
            level <= state.backpackLevel ||
            state.stash.some(stashItem =>
                stashItem.type === "backpack" && stashItem.name === item.name
            )
        ) {
            return alert("У вас уже есть такой или более вместительный рюкзак.");
        }
    }

    state.money -= price;

    const copy = clone(item);
    delete copy.price;
    delete copy.buy;

    if (copy.type === "weapon") {
        copy.durability = copy.maxDurability;
        copy.value = Math.floor(price * 0.65);
    }

    if (copy.type === "armor") {
        copy.value = Math.floor(price * 0.65);
    }

    state.stash.push(copy);
    addLog(`Куплено: ${copy.name}. Предмет отправлен в схрон.`, "success");
    updateUI();
}

document.querySelectorAll(".shop-category-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".shop-category-btn").forEach(categoryButton => {
            categoryButton.classList.remove("active");
        });

        button.classList.add("active");
        shopCategory = button.dataset.shop;
        renderShop();
    });
});

document.querySelectorAll(".stash-category-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".stash-category-btn").forEach(categoryButton => {
            categoryButton.classList.remove("active");
        });

        button.classList.add("active");
        stashFilter = button.dataset.stash;
        updateUI();
    });
});

window.switchHubTab = function(tab, button) {
    document.querySelectorAll(".tab-btn").forEach(tabButton => {
        tabButton.classList.remove("active");
    });

    button?.classList.add("active");

    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.add("hidden");
    });

    document.getElementById(`hub-${tab}`)?.classList.remove("hidden");
};

window.clearLoadout = function() {
    state.stash.push(...state.inventory);
    state.inventory = [];
    updateUI();
};

window.equipAllUseful = function() {
    const useful = state.stash.filter(item =>
        ["med", "energy", "nade", "stim", "juggernaut", "ammo"].includes(item.type)
    );

    let moved = 0;

    for (const item of useful) {
        if (!canPack(state.inventory, item)) continue;

        state.inventory.push(item);
        state.stash.splice(state.stash.indexOf(item), 1);
        moved++;
    }

    if (!moved) alert("Подходящих предметов нет или не хватает места.");
    updateUI();
};

function consumeItem(item) {
    if (item.type === "med") {
        if (item.healPart === "injury") {
            if (!state.injury) return false;
            state.injury = false;
            return true;
        }

        const canHeal = state.hp < state.maxHp;
        const canTreatInjury = item.healPart === "all" && state.injury;

        if (!canHeal && !canTreatInjury) return false;

        state.hp = Math.min(state.maxHp, state.hp + (item.heal || 0));

        if (item.healPart === "all") {
            state.injury = false;
        }

        return true;
    }

    if (item.type === "energy") {
        if (state.energy >= state.maxEnergy) return false;

        state.energy = Math.min(state.maxEnergy, state.energy + (item.energy || 20));
        return true;
    }

    if (item.type === "juggernaut" || item.type === "stim") {
        if (state.stimTurns > 0) return false;

        state.stimTurns = 10;
        state.stimHp = item.type === "juggernaut" ? 20 : 2;
        state.stimEnergy = item.type === "juggernaut" ? 10 : 0;
        return true;
    }

    return false;
}

function useRaidItem(index) {
    const item = state.inventory[index];
    if (!item) return;

    if (item.type === "nade") {
        addLog("Гранату используйте кнопкой «ГРАНАТА» во время боя.", "system");
        return;
    }

    if (!["med", "energy", "stim", "juggernaut"].includes(item.type)) return;

    if (!consumeItem(item)) {
        addLog("Этот предмет сейчас нельзя использовать.", "system");
        return;
    }

    state.inventory.splice(index, 1);
    addLog(`Использовано: ${item.name}.`, "success");
    updateUI();
}

document.querySelectorAll(".attack-mode-btn").forEach(button => {
    button.addEventListener("click", () => {
        if (!["button", "aim"].includes(button.dataset.mode)) return;

        state.attackMode = button.dataset.mode;
        updateUI();
    });
});

document.querySelectorAll(".faction-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".faction-btn").forEach(factionButton => {
            factionButton.classList.remove("selected");
        });

        button.classList.add("selected");
        selectedFaction = button.dataset.faction;
        checkStart();
    });
});

document.querySelectorAll(".map-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".map-btn").forEach(mapButton => {
            mapButton.classList.remove("selected");
        });

        button.classList.add("selected");
        selectedMap = button.dataset.map;
        selectedBg = button.dataset.bg;
        checkStart();
    });
});

function checkStart() {
    const startButton = document.getElementById("start-btn");
    if (startButton) startButton.disabled = !(selectedMap && selectedFaction);
}

document.getElementById("welcome-play-btn")?.addEventListener("click", () => {
    document.getElementById("welcome-screen")?.classList.remove("active");
    document.getElementById("hub-screen")?.classList.add("active");
});

document.getElementById("welcome-exit-btn")?.addEventListener("click", () => {
    window.close();

    setTimeout(() => {
        if (!window.closed) {
            alert("Закройте вкладку браузера, чтобы выйти из игры.");
        }
    }, 100);
});

document.getElementById("start-btn")?.addEventListener("click", () => {
    if (!selectedMap || !selectedFaction) return;

    state.faction = selectedFaction;
    state.timeLeft = getRaidTurns(state.energy);
    state.isExtracting = false;
    state.stepsToExit = 0;
    state.isInCombat = false;
    state.isEventActive = false;
    state.enemy = null;
    state.enemyLoot = [];
    state.injury = false;
    state.specialRoomUsed = false;
    raidBackground = selectedBg;

    const factionDisplay = document.getElementById("faction-display");
    const mapDisplay = document.getElementById("map-display");

    if (factionDisplay) factionDisplay.textContent = state.faction;
    if (mapDisplay) mapDisplay.textContent = selectedMap;

    document.body.style.backgroundImage = selectedBg ? `url("${selectedBg}")` : "none";

    document.getElementById("hub-screen")?.classList.remove("active");
    document.getElementById("game-screen")?.classList.add("active");

    const logArea = document.getElementById("log-area");
    if (logArea) logArea.innerHTML = "";

    addLog(`Рейд на карте «${selectedMap}» начался.`, "system");
    updateUI();
});

function getRaidTurns(energy) {
    return Math.round(MIN_RAID_TURNS + (MAX_RAID_TURNS - MIN_RAID_TURNS) * energy / ENERGY_MAX);
}

function tickStim() {
    if (state.stimTurns <= 0) return;

    state.hp = Math.min(state.maxHp, state.hp + state.stimHp);
    state.energy = Math.min(state.maxEnergy, state.energy + state.stimEnergy);
    state.stimTurns--;

    if (!state.stimTurns) {
        state.stimHp = 0;
        state.stimEnergy = 0;
        addLog("Эффект шприца закончился.", "system");
    }
}

function spendTurn(energy = 3) {
    state.timeLeft--;
    state.energy = Math.max(0, state.energy - energy);
    tickStim();

    if (state.timeLeft <= 0) {
        gameOver("Время рейда вышло.");
        return false;
    }

    return true;
}

document.getElementById("loot-btn")?.addEventListener("click", () => {
    if (state.isInCombat || state.isEventActive || state.isExtracting) return;
    if (!spendTurn(4)) return;

    const pool = ITEMS.filter(item => item.type !== "juggernaut");
    const item = clone(pool[Math.floor(Math.random() * pool.length)]);

    addRaidItem(item);
    addLog(`Найдено: ${item.name}.`, "loot");

    if (Math.random() < 0.25) {
        if (Math.random() < 0.7) {
            spawnEnemy();
        } else {
            showSpecialRoom();
        }
    }

    updateUI();
});

function showEvent(title, text, choices) {
    state.isEventActive = true;

    document.getElementById("event-panel")?.classList.remove("hidden");

    const enemyName = document.getElementById("enemy-name");
    const eventText = document.getElementById("event-text");
    const eventOptions = document.getElementById("event-options");

    if (enemyName) enemyName.textContent = title;
    if (eventText) eventText.textContent = text;
    if (eventOptions) eventOptions.innerHTML = "";

    document.getElementById("combat-hp")?.classList.add("hidden");
    document.getElementById("aim-target")?.classList.add("hidden");
    document.getElementById("enemy-loot-panel")?.classList.add("hidden");

    choices.forEach(choice => {
        const button = document.createElement("button");
        button.className = "event-btn";
        button.textContent = choice.label;
        button.onclick = choice.action;
        eventOptions?.appendChild(button);
    });

    updateUI();
}

function closeEvent() {
    state.isEventActive = false;
    document.getElementById("event-panel")?.classList.add("hidden");
    document.getElementById("enemy-loot-panel")?.classList.add("hidden");
    updateUI();
}

function showSpecialRoom() {
    if (state.specialRoomUsed) return;

    const roomName = MAP_RULES[selectedMap]?.room || "Особая комната";
    const hasKey = state.inventory.some(item => item.type === "specialKey");
    const lockpickChance = 0.55;

    showEvent(
        roomName,
        hasKey
            ? "Найден вход в особую комнату. Использовать ключ?"
            : `Найден запертый вход. Нужен ключ; можно попытаться вскрыть дверь. Шанс успеха: ${Math.round(lockpickChance * 100)}%.`,
        [
            {
                label: hasKey
                    ? "Открыть ключом"
                    : `Попытаться вскрыть (${Math.round(lockpickChance * 100)}%)`,
                action: () => {
                    const keyIndex = state.inventory.findIndex(item => item.type === "specialKey");

                    if (keyIndex >= 0) {
                        state.inventory.splice(keyIndex, 1);
                    } else if (Math.random() > lockpickChance) {
                        closeEvent();
                        addLog("Не удалось открыть комнату.", "danger");
                        return;
                    }

                    state.specialRoomUsed = true;

                    const pool = ITEMS.filter(item =>
                        ["loot", "ammo", "med"].includes(item.type) &&
                        item.rarity !== "legendary"
                    );

                    const count = 1 + Math.floor(Math.random() * 3);

                    for (let i = 0; i < count; i++) {
                        addRaidItem(clone(pool[Math.floor(Math.random() * pool.length)]));
                    }

                    closeEvent();
                    addLog("Вы обыскали особую комнату. Добыча зависит от удачи.", "success");
                }
            },
            {
                label: "Уйти",
                action: closeEvent
            }
        ]
    );
}

document.getElementById("extract-btn")?.addEventListener("click", () => {
    if (state.isInCombat || state.isEventActive) {
        addLog("Нельзя выбирать выход во время боя или события.", "danger");
        return;
    }

    showEvent("Карта выходов", "Выберите точку эвакуации.", [
        { label: "Выход А — лесная тропа", action: () => selectExit(3, false) },
        { label: "Выход Б — склад", action: () => selectExit(2, false) },
        { label: "Выход В — КПП (нужен ключ)", action: () => selectExit(1, true) }
    ]);
});

function selectExit(steps, requiresKey) {
    const keyIndex = state.inventory.findIndex(item => item.type === "key");

    if (requiresKey && keyIndex < 0) {
        addLog("Для этого выхода нужен ключ от КПП.", "danger");
        return;
    }

    if (requiresKey) {
        state.inventory.splice(keyIndex, 1);
    }

    state.isEventActive = false;
    state.isExtracting = true;
    state.stepsToExit = steps;

    document.getElementById("event-panel")?.classList.add("hidden");
    addLog(`Выдвигаемся к выходу. Осталось шагов: ${steps}.`, "system");
    updateUI();
}

document.getElementById("move-btn")?.addEventListener("click", () => {
    if (!state.isExtracting || state.isInCombat) return;

    state.stepsToExit--;

    if (!spendTurn(3)) return;
    if (state.stepsToExit <= 0) {
        winRaid();
        return;
    }

    addLog(`До выхода осталось шагов: ${state.stepsToExit}.`, "system");

    if (Math.random() < 0.2) {
        spawnEnemy();
    }

    updateUI();
});

function spawnEnemy() {
    const name = Math.random() < 0.18
        ? BOSSES[Math.floor(Math.random() * BOSSES.length)]
        : ["Дикий", "Свита", "USEC", "BEAR"]
            .filter(enemyName => enemyName !== state.faction)[Math.floor(Math.random() * 3)];

    const base = ENEMIES[name];

    state.enemy = {
        ...base,
        name,
        hp: base.hp,
        currentHp: base.hp
    };

    state.isInCombat = true;
    state.isEventActive = false;
    state.enemyLoot = [];

    document.getElementById("event-panel")?.classList.remove("hidden");

    const enemyName = document.getElementById("enemy-name");
    const eventText = document.getElementById("event-text");
    const eventOptions = document.getElementById("event-options");

    if (enemyName) enemyName.textContent = name;
    if (eventText) eventText.textContent = "Противник атакует!";
    if (eventOptions) eventOptions.innerHTML = "";

    document.getElementById("enemy-loot-panel")?.classList.add("hidden");
    document.getElementById("combat-hp")?.classList.remove("hidden");

    const enemyHpDisplay = document.getElementById("enemy-hp-display");
    const enemyHpBar = document.getElementById("enemy-hp-bar");

    if (enemyHpDisplay) enemyHpDisplay.textContent = `${base.hp}/${base.hp}`;
    if (enemyHpBar) enemyHpBar.style.width = "100%";

    addLog(`Обнаружен противник: ${name}.`, "danger");
    updateUI();
    enemyAttack();
}

function enemyAttack() {
    if (!state.enemy || !state.isInCombat) return;

    const incoming = state.enemy.damage;
    const blocked = state.armorDurability > 0
        ? Math.min(state.armor, incoming, state.armorDurability)
        : 0;

    state.armorDurability = Math.max(0, state.armorDurability - blocked);

    if (state.equippedArmor) {
        state.equippedArmor.durability = state.armorDurability;
    }

    const damage = incoming - blocked;
    state.hp -= damage;

    if (!state.injury && Math.random() < 0.15) {
        state.injury = true;
        addLog("Вы получили ранение: точность снижена, здоровье постепенно ухудшается.", "danger");
    } else if (state.injury) {
        state.hp -= 5;
    }

    addLog(
        `Враг атаковал: ${damage} урона${blocked ? `, броня поглотила ${blocked}` : ""}.`,
        "danger"
    );

    if (state.armorDurability <= 0 && state.equippedArmor) {
        addLog("Броня разрушена, но остаётся надетой и больше не защищает.", "danger");
    }

    updateUI();

    if (state.hp <= 0) {
        gameOver("Вы погибли в бою.");
    }
}

function updateEnemyHealth() {
    if (!state.enemy) return;

    const percent = Math.max(0, state.enemy.currentHp / state.enemy.hp * 100);
    const enemyHpBar = document.getElementById("enemy-hp-bar");
    const enemyHpDisplay = document.getElementById("enemy-hp-display");

    if (enemyHpBar) enemyHpBar.style.width = `${percent}%`;

    if (enemyHpDisplay) {
        enemyHpDisplay.textContent = `${Math.max(0, state.enemy.currentHp)}/${state.enemy.hp}`;
    }
}

function getHitChance(zone = "body") {
    let miss = 0.1 + (1 - state.hp / state.maxHp) * 0.35 + (state.injury ? 0.1 : 0);

    if (state.attackMode === "aim") {
        miss += zone === "head" ? 0.12 : 0.03;
    }

    return Math.max(0.25, Math.min(0.9, 1 - miss));
}

function updateChanceDisplay() {
    const chance = document.getElementById("success-chance");

    if (chance) {
        chance.textContent = state.isInCombat
            ? `Шанс попадания: ${Math.round(getHitChance(state.attackMode === "aim" ? "head" : "body") * 100)}%`
            : "";
    }

    const shootButton = document.getElementById("shoot-btn");

    if (shootButton && state.isInCombat) {
        shootButton.title = `Шанс попадания: ${Math.round(getHitChance("body") * 100)}%`;
    }

    document.querySelectorAll("#aim-target [data-zone]").forEach(target => {
        const percent = Math.round(getHitChance(target.dataset.zone) * 100);
        target.title = `Шанс попадания: ${percent}%`;

        let chanceLabel = target.querySelector(".zone-chance");

        if (!chanceLabel) {
            chanceLabel = document.createElement("span");
            chanceLabel.className = "zone-chance";
            target.appendChild(chanceLabel);
        }

        chanceLabel.textContent = `${percent}%`;
    });
}

function updateAttackControls() {
    const shootButton = document.getElementById("shoot-btn");
    const target = document.getElementById("aim-target");

    shootButton?.classList.toggle(
        "hidden",
        state.attackMode === "aim" || !state.isInCombat
    );

    target?.classList.toggle(
        "hidden",
        state.attackMode !== "aim" || !state.isInCombat
    );

    document.querySelectorAll(".attack-mode-btn").forEach(button => {
        button.classList.toggle("selected", button.dataset.mode === state.attackMode);
    });

    updateChanceDisplay();
}

function performAttack(zone = "body") {
    if (!state.isInCombat || !state.enemy) return;

    if (state.attackMode === "aim" && zone === "body") return;

    const gun = state.weapon && WEAPONS[state.weapon];

    if (!gun) {
        const knifeChance = Math.max(0.25, Math.min(0.9, getHitChance(zone) - 0.1));

        if (Math.random() > knifeChance) {
            addLog("Удар ножом не достиг цели.", "danger");
            updateUI();
            enemyAttack();
            return;
        }

        const multiplier = zone === "head" ? 1.5 : zone === "limb" ? 0.65 : 1;
        const damage = Math.max(1, Math.floor(30 * multiplier) - (state.enemy.armor || 0));

        state.enemy.currentHp -= damage;
        addLog(`Удар ножом! Урон: ${damage}.`, "success");
        updateEnemyHealth();
        updateUI();

        if (state.enemy.currentHp <= 0) {
            winFight();
        } else {
            enemyAttack();
        }

        return;
    }

    if (state.currentAmmo <= 0) {
        addLog("Магазин пуст — перезарядитесь.", "danger");
        return;
    }

    state.currentAmmo--;
    state.weaponDurability = Math.max(0, state.weaponDurability - 1);

    const owned = state.stash.find(item =>
        item.type === "weapon" && item.name === state.weapon
    );

    if (owned) {
        owned.durability = state.weaponDurability;
    }

    if (state.weaponDurability <= 10 && Math.random() < 0.18) {
        addLog("Осечка! Оружие сильно изношено.", "danger");
        updateUI();
        enemyAttack();
        return;
    }

    if (Math.random() > getHitChance(zone)) {
        addLog("Промах!", "danger");
        updateUI();
        enemyAttack();
        return;
    }

    let multiplier = zone === "head" ? 1.8 : zone === "limb" ? 0.65 : 1;

    if (state.aimBonus) {
        multiplier *= 1.5;
        state.aimBonus = false;
    }

    const damage = Math.max(1, Math.floor(gun.damage * multiplier) - (state.enemy.armor || 0));
    state.enemy.currentHp -= damage;

    addLog(`Попадание! Урон: ${damage}.`, "success");
    updateEnemyHealth();
    updateUI();

    if (state.enemy.currentHp <= 0) {
        winFight();
    } else {
        enemyAttack();
    }
}

document.getElementById("shoot-btn")?.addEventListener("click", () => {
    if (state.attackMode !== "button") return;
    performAttack("body");
});

document.getElementById("aim-target")?.addEventListener("click", event => {
    if (state.attackMode !== "aim") return;

    const target = event.target.closest("[data-zone]");
    if (!target) return;

    performAttack(target.dataset.zone);
});

function reloadWeapon() {
    if (!state.weapon) {
        addLog("Огнестрельное оружие не выбрано.", "system");
        return;
    }

    const gun = WEAPONS[state.weapon];
    if (!gun) return;

    const neededAtStart = Math.max(0, gun.mag - state.currentAmmo);

    if (neededAtStart === 0) {
        addLog("Магазин уже полон.", "system");
        return;
    }

    let loadedTotal = 0;

    for (const item of state.inventory) {
        if (
            item.type !== "ammo" ||
            item.ammoType !== gun.ammo ||
            neededAtStart - loadedTotal <= 0
        ) {
            continue;
        }

        const loaded = Math.min(neededAtStart - loadedTotal, item.count);
        item.count -= loaded;
        loadedTotal += loaded;
        state.currentAmmo += loaded;
    }

    state.inventory = state.inventory.filter(item =>
        item.type !== "ammo" || item.count > 0
    );

    if (loadedTotal === 0) {
        addLog(`Нет подходящих патронов ${gun.ammo}.`, "danger");
    } else {
        addLog(`Перезаряжено: +${loadedTotal} патронов.`, "success");
    }

    updateUI();
}

document.getElementById("reload-btn")?.addEventListener("click", reloadWeapon);

document.getElementById("cover-btn")?.addEventListener("click", () => {
    const chance = 0.55;

    if (Math.random() < chance) {
        addLog(`Вы укрылись от атаки. Шанс успеха был ${Math.round(chance * 100)}%.`, "success");
    } else {
        addLog(`Не удалось укрыться. Шанс успеха был ${Math.round(chance * 100)}%.`, "danger");
        enemyAttack();
    }
});

document.getElementById("heal-btn")?.addEventListener("click", () => {
    const index = state.inventory.findIndex(item =>
        ["med", "energy", "juggernaut", "stim"].includes(item.type)
    );

    if (index < 0) {
        addLog("Нет подходящих предметов лечения.", "danger");
        return;
    }

    const item = state.inventory[index];

    if (!consumeItem(item)) {
        addLog("Предмет сейчас нельзя применить.", "system");
        return;
    }

    state.inventory.splice(index, 1);
    addLog(`Использовано: ${item.name}.`, "success");
    updateUI();

    if (state.isInCombat) {
        enemyAttack();
    }
});

document.getElementById("grenade-btn")?.addEventListener("click", () => {
    if (!state.isInCombat || !state.enemy) return;

    const index = state.inventory.findIndex(item => item.type === "nade");

    if (index < 0) {
        addLog("В рюкзаке нет гранаты.", "danger");
        return;
    }

    state.inventory.splice(index, 1);
    state.enemy.currentHp -= 80;

    updateEnemyHealth();
    updateUI();

    if (state.enemy.currentHp <= 0) {
        winFight();
    } else {
        enemyAttack();
    }
});

document.getElementById("flee-btn")?.addEventListener("click", () => {
    const chance = 0.55;

    if (Math.random() < chance) {
        addLog(`Вы сбежали. Шанс успеха был ${Math.round(chance * 100)}%.`, "success");
        state.enemy = null;
        state.isInCombat = false;
        document.getElementById("event-panel")?.classList.add("hidden");

        if (spendTurn(3)) {
            updateUI();
        }
    } else {
        addLog(`Не удалось сбежать. Шанс успеха был ${Math.round(chance * 100)}%.`, "danger");
        enemyAttack();
    }
});

function weightedLootItem() {
    const roll = Math.random();

    let rarity;

    if (roll < 0.01) rarity = "legendary";
    else if (roll < 0.08) rarity = "epic";
    else if (roll < 0.34) rarity = "rare";
    else rarity = "common";

    let pool = ITEMS.filter(item =>
        item.rarity === rarity && item.type !== "juggernaut"
    );

    if (!pool.length) {
        pool = ITEMS.filter(item => item.rarity === "common");
    }

    return clone(pool[Math.floor(Math.random() * pool.length)]);
}

function createEnemyLoot(enemy) {
    const isBoss = BOSSES.includes(enemy.name);
    const loot = [];
    const itemCount = isBoss
        ? 3 + Math.floor(Math.random() * 3)
        : 2 + Math.floor(Math.random() * 2);

    for (let i = 0; i < itemCount; i++) {
        loot.push(weightedLootItem());
    }

    const weaponDropChance = isBoss ? 0.75 : 0.3;

    if (Math.random() < weaponDropChance) {
        let weapons = Object.entries(WEAPONS);

        if (!isBoss) {
            weapons = weapons.filter(([, weapon]) => !weapon.exclusive);
        }

        const [name, weapon] = weapons[Math.floor(Math.random() * weapons.length)];

        loot.push({
            name,
            type: "weapon",
            value: weapon.price || 0,
            damage: weapon.damage,
            ammo: weapon.ammo,
            mag: weapon.mag,
            durability: Math.max(10, Math.floor(weapon.durability * (isBoss ? 0.75 : 0.4))),
            maxDurability: weapon.durability,
            exclusive: !!weapon.exclusive,
            w: 2,
            h: 2,
            rarity: weapon.exclusive ? "legendary" : "rare"
        });
    }

    if (isBoss && enemy.name === "Килла" && Math.random() < 0.45) {
        loot.push(clone(KILLA_ARMOR_ITEM));
    }

    if (isBoss && enemy.name === "Тагилла" && Math.random() < 0.45) {
        loot.push(clone(MASK_ITEM));
    }

    return loot;
}

function winFight() {
    const enemy = state.enemy;
    if (!enemy) return;

    addLog(`Победа над: ${enemy.name}.`, "success");
    state.money += enemy.money;
    state.stats.earned += enemy.money;
    state.enemyLoot = createEnemyLoot(enemy);
    state.enemy = null;
    state.isInCombat = false;

    showEvent(
        "ПРОТИВНИК ПОБЕЖДЁН",
        "Осмотрите добычу или уходите, не обыскивая противника.",
        [
            { label: "ОСМОТРЕТЬ ВРАГА", action: openEnemyLoot },
            { label: "УЙТИ, НЕ ОСМАТРИВАЯ", action: leaveEnemyLoot }
        ]
    );

    updateUI();
}

function openEnemyLoot() {
    state.isEventActive = true;

    const eventOptions = document.getElementById("event-options");
    const eventText = document.getElementById("event-text");

    if (eventOptions) eventOptions.innerHTML = "";
    if (eventText) {
        eventText.textContent = "Нажмите на предмет противника, чтобы переложить его в свой рюкзак.";
    }

    document.getElementById("enemy-loot-panel")?.classList.remove("hidden");

    renderGrid("enemy-loot-bg", "enemy-loot-items", state.enemyLoot, 4, "enemyLoot");
    renderGrid("loot-player-bg", "loot-player-items", state.inventory, sizeFor(), "lootPlayer");
    updateUI();
}

function leaveEnemyLoot() {
    state.enemyLoot = [];
    document.getElementById("enemy-loot-panel")?.classList.add("hidden");
    closeEvent();
}

document.getElementById("leave-loot-btn")?.addEventListener("click", leaveEnemyLoot);

function gameOver(reason) {
    if (!document.getElementById("game-screen")?.classList.contains("active")) return;

    addLog(
        `РЕЙД ПРОВАЛЕН: ${reason} Вся экипировка и добыча потеряны.`,
        "danger"
    );

    state.stats.died++;

    // Теряем содержимое рейдового рюкзака и добычу противника.
    state.inventory = [];
    state.enemyLoot = [];

    // Удаляем из схрона экипированные предметы.
    const equippedBackpackName = BACKPACKS[state.backpackLevel]?.name;

    state.stash = state.stash.filter(item =>
        !(
            (item.type === "weapon" && item.name === state.weapon) ||
            (item.type === "armor" &&
                item.name === state.equippedArmor?.name) ||
            (item.type === "mask" &&
                item.name === state.mask?.name) ||
            (item.type === "backpack" &&
                state.backpackLevel > 0 &&
                item.name === equippedBackpackName)
        )
    );

    // Сбрасываем экипировку.
    state.weapon = null;
    state.weaponDurability = 0;
    state.currentAmmo = 0;

    state.equippedArmor = null;
    state.armor = 0;
    state.armorDurability = 0;
    state.mask = null;

    // Потерянный рюкзак заменяется базовой сумкой 3×3.
    state.backpackLevel = 0;

    // Восстанавливаем персонажа и сбрасываем состояние рейда.
    state.hp = state.maxHp;
    state.energy = state.maxEnergy;
    state.injury = false;

    state.stimTurns = 0;
    state.stimHp = 0;
    state.stimEnergy = 0;

    state.enemy = null;
    state.isInCombat = false;
    state.isEventActive = false;
    state.isExtracting = false;
    state.stepsToExit = 0;

    document.getElementById("event-panel")?.classList.add("hidden");
    document.getElementById("enemy-loot-panel")?.classList.add("hidden");

    updateUI();

    setTimeout(() => {
        document.getElementById("game-screen")?.classList.remove("active");
        document.getElementById("hub-screen")?.classList.add("active");
        document.body.style.backgroundImage = "none";
        updateUI();
    }, 1200);
}

function winRaid() {
    addLog("ВЫ УСПЕШНО ЭВАКУИРОВАЛИСЬ!", "success");

    state.stats.survived++;
    state.stash.push(...state.inventory);
    state.inventory = [];

    if (state.weapon) {
        let weapon = state.stash.find(item =>
            item.type === "weapon" && item.name === state.weapon
        );

        if (!weapon) {
            const gun = WEAPONS[state.weapon];

            if (gun) {
                weapon = {
                    name: state.weapon,
                    type: "weapon",
                    value: gun.exclusive ? 0 : 10000,
                    damage: gun.damage,
                    ammo: gun.ammo,
                    mag: gun.mag,
                    durability: state.weaponDurability,
                    maxDurability: gun.durability,
                    exclusive: !!gun.exclusive,
                    w: 2,
                    h: 2,
                    rarity: gun.exclusive ? "legendary" : "rare"
                };

                state.stash.push(weapon);
            }
        } else {
            weapon.durability = state.weaponDurability;
        }
    }

    if (state.equippedArmor) {
        const armor = state.stash.find(item =>
            item.type === "armor" && item.name === state.equippedArmor.name
        );

        if (armor) {
            armor.durability = state.armorDurability;
        } else {
            const copy = clone(state.equippedArmor);
            copy.durability = state.armorDurability;
            state.stash.push(copy);
        }
    }

    state.isExtracting = false;
    state.injury = false;
    state.enemyLoot = [];

    updateUI();

    setTimeout(() => {
        document.getElementById("game-screen")?.classList.remove("active");
        document.getElementById("hub-screen")?.classList.add("active");
        document.body.style.backgroundImage = "none";

        const stashTab = document.querySelectorAll(".tab-btn")[2];
        switchHubTab("stash", stashTab);
    }, 1200);
}

document.getElementById("repair-btn")?.addEventListener("click", () => {
    let cost = 0;
    const gun = state.weapon && WEAPONS[state.weapon];

    if (gun && !gun.exclusive) {
        cost += Math.ceil((gun.durability - state.weaponDurability) * 120);
    }

    if (state.equippedArmor && !state.equippedArmor.exclusive) {
        const maxDurability = state.equippedArmor.maxDurability ||
            ARMORS[state.equippedArmor.name]?.durability || 0;

        cost += Math.ceil((maxDurability - state.armorDurability) * 80);
    }

    if (!cost) {
        alert("Нет обычного снаряжения, которое можно починить.");
        return;
    }

    if (state.money < cost) {
        alert(`Ремонт стоит ${cost} ₽. Недостаточно денег.`);
        return;
    }

    state.money -= cost;

    if (gun && !gun.exclusive) {
        state.weaponDurability = gun.durability;
    }

    if (state.equippedArmor && !state.equippedArmor.exclusive) {
        const maxDurability = state.equippedArmor.maxDurability ||
            ARMORS[state.equippedArmor.name]?.durability || 0;

        state.armorDurability = maxDurability;
        state.equippedArmor.durability = maxDurability;
    }

    updateUI();
    addLog(`Экипировка отремонтирована за ${cost} ₽.`, "success");
});

document.getElementById("reset-game-btn")?.addEventListener("click", () => {
    if (!confirm("Обнулить весь прогресс?")) return;

    state = createNewState();
    selectedMap = "";
    selectedBg = "";
    selectedFaction = state.faction;

    localStorage.removeItem("tarkov_rpg_save");

    document.querySelectorAll(".faction-btn, .map-btn").forEach(button => {
        button.classList.remove("selected");
    });

    const startButton = document.getElementById("start-btn");
    if (startButton) startButton.disabled = true;

    document.getElementById("game-screen")?.classList.remove("active");
    document.getElementById("hub-screen")?.classList.add("active");

    switchHubTab("raid", document.querySelector(".tab-btn"));
    updateUI();
});

const extraStyles = document.createElement("style");

extraStyles.textContent = `
    .drop-btn {
        opacity: 0;
        pointer-events: none;
        transition: opacity .15s ease;
    }

    .inv-item:hover .drop-btn,
    .inv-item:focus-within .drop-btn {
        opacity: 1;
        pointer-events: auto;
    }

    .zone-chance {
        display: block;
        font-size: .75em;
    }

    .fullscreen-hint {
        position: absolute;
        left: 50%;
        bottom: 22px;
        transform: translateX(-50%);
        width: max-content;
        max-width: calc(100% - 28px);
        padding: 9px 14px;
        border: 1px solid rgba(102, 182, 161, .55);
        border-radius: 4px;
        background: rgba(15, 20, 17, .84);
        color: #c9d1b3;
        font-size: .8rem;
        text-align: center;
        box-shadow: 0 4px 16px #0008;
    }
`;

document.head.appendChild(extraStyles);

updateUI();