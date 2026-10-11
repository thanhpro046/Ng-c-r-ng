const fighters = [
  { id: "goku", name: "Goku", type: "Saiyan", avatar: "🐉", hp: 120, maxHp: 120, ki: 30, maxKi: 30, attack: 18, special: 28, heal: 14 },
  { id: "vegeta", name: "Vegeta", type: "Saiyan", avatar: "🦅", hp: 110, maxHp: 110, ki: 35, maxKi: 35, attack: 17, special: 26, heal: 12 },
  { id: "piccolo", name: "Piccolo", type: "Namek", avatar: "🌿", hp: 130, maxHp: 130, ki: 25, maxKi: 25, attack: 16, special: 24, heal: 18 },
  { id: "krillin", name: "Krillin", type: "Nhân vật", avatar: "🥋", hp: 100, maxHp: 100, ki: 28, maxKi: 28, attack: 15, special: 22, heal: 16 }
];

const enemies = [
  { id: "frieza", name: "Frieza", type: "Ác quỷ", avatar: "👾", hp: 100, maxHp: 100, ki: 30, maxKi: 30, attack: 15, special: 25, heal: 10 },
  { id: "cell", name: "Cell", type: "Sinh vật", avatar: "🧬", hp: 120, maxHp: 120, ki: 28, maxKi: 28, attack: 16, special: 26, heal: 12 },
  { id: "buu", name: "Majin Buu", type: "Boss", avatar: "🧸", hp: 140, maxHp: 140, ki: 40, maxKi: 40, attack: 20, special: 30, heal: 14 },
  { id: "broly", name: "Broly", type: "Sát thủ", avatar: "🔥", hp: 125, maxHp: 125, ki: 35, maxKi: 35, attack: 18, special: 32, heal: 12 }
];

const STORAGE_KEY = "dragon_offline_save";

const state = {
  selectedFighterId: null,
  player: null,
  enemy: null,
  level: 1,
  battleEnded: false,
  log: []
};

function saveProgress() {
  const saveData = {
    selectedFighterId: state.selectedFighterId,
    level: state.level
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
}

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    state.selectedFighterId = data.selectedFighterId || null;
    state.level = Number(data.level) || 1;
  } catch (e) {
    console.log("Save lỗi, bỏ qua.");
  }
}

function renderCharSelect() {
  const container = document.getElementById("charSelect");
  container.innerHTML = "";

  fighters.forEach((fighter) => {
    const btn = document.createElement("button");
    btn.className = "char-btn" + (state.selectedFighterId === fighter.id ? " active" : "");
    btn.textContent = fighter.name;
    btn.onclick = () => {
      state.selectedFighterId = fighter.id;
      saveProgress();
      startBattle();
      renderCharSelect();
    };
    container.appendChild(btn);
  });
}

function randomEnemy(level) {
  const base = enemies[Math.floor(Math.random() * enemies.length)];
  return {
    ...base,
    hp: base.maxHp + (level - 1) * 8,
    maxHp: base.maxHp + (level - 1) * 8,
    ki: base.maxKi,
    maxKi: base.maxKi,
    attack: base.attack + Math.floor((level - 1) / 2),
    special: base.special + Math.floor((level - 1) / 2),
    heal: base.heal + Math.floor((level - 1) / 3)
  };
}

function startBattle() {
  const selected = fighters.find(f => f.id === state.selectedFighterId);
  if (!selected) return;

  state.player = {
    ...selected,
    hp: selected.maxHp,
    ki: selected.maxKi
  };

  state.enemy = randomEnemy(state.level);
  state.battleEnded = false;
  state.log = [];
  addLog(`Bạn chọn ${state.player.name} và chuẩn bị đối đầu ${state.enemy.name}!`);
  render();
}

function restartGame() {
  state.level = 1;
  state.selectedFighterId = null;
  state.player = null;
  state.enemy = null;
  state.battleEnded = false;
  state.log = [];
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById("battleLog").innerHTML = "Chọn nhân vật để bắt đầu.";
  renderCharSelect();
  render();
}

function addLog(message) {
  state.log.push(message);
  const logBox = document.getElementById("battleLog");
  logBox.innerHTML = state.log.slice(-8).map(line => `<div>${line}</div>`).join("");
}

function render() {
  const levelBadge = document.getElementById("levelBadge");

  if (state.player && state.enemy) {
    levelBadge.textContent = `Cấp ${state.level}`;

    document.getElementById("playerName").textContent = state.player.name;
    document.getElementById("playerType").textContent = state.player.type;
    document.getElementById("playerAvatar").textContent = state.player.avatar;

    document.getElementById("enemyName").textContent = state.enemy.name;
    document.getElementById("enemyType").textContent = state.enemy.type;
    document.getElementById("enemyAvatar").textContent = state.enemy.avatar;

    updateBar("playerHpBar", state.player.hp, state.player.maxHp);
    updateBar("playerKiBar", state.player.ki, state.player.maxKi);
    updateBar("enemyHpBar", state.enemy.hp, state.enemy.maxHp);
    updateBar("enemyKiBar", state.enemy.ki, state.enemy.maxKi);

    document.getElementById("playerHpText").textContent = `${state.player.hp} / ${state.player.maxHp}`;
    document.getElementById("playerKiText").textContent = `${state.player.ki} / ${state.player.maxKi}`;
    document.getElementById("enemyHpText").textContent = `${state.enemy.hp} / ${state.enemy.maxHp}`;
    document.getElementById("enemyKiText").textContent = `${state.enemy.ki} / ${state.enemy.maxKi}`;
  } else {
    levelBadge.textContent = "Cấp 1";
    document.getElementById("playerName").textContent = "-";
    document.getElementById("playerType").textContent = "-";
    document.getElementById("enemyName").textContent = "-";
    document.getElementById("enemyType").textContent = "-";
    document.getElementById("playerAvatar").textContent = "🦸";
    document.getElementById("enemyAvatar").textContent = "👹";
  }
}

function updateBar(id, value, maxValue) {
  const bar = document.getElementById(id);
  const percent = Math.max(0, Math.min(100, (value / maxValue) * 100));
  bar.style.width = `${percent}%`;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function enemyTurn() {
  const move = Math.random();

  if (move < 0.45) {
    const damage = state.enemy.attack + randomInt(0, 10);
    state.player.hp = Math.max(0, state.player.hp - damage);
    addLog(`${state.enemy.name} đánh thường, gây ${damage} sát thương.`);
  } else if (move < 0.75 && state.enemy.ki >= 8) {
    state.enemy.ki = Math.max(0, state.enemy.ki - 8);
    const damage = state.enemy.special + randomInt(2, 12);
    state.player.hp = Math.max(0, state.player.hp - damage);
    addLog(`${state.enemy.name} tung chiêu đặc biệt, gây ${damage} sát thương.`);
  } else {
    const heal = state.enemy.heal + randomInt(0, 8);
    state.enemy.hp = Math.min(state.enemy.maxHp, state.enemy.hp + heal);
    state.enemy.ki = Math.min(state.enemy.maxKi, state.enemy.ki + 5);
    addLog(`${state.enemy.name} hồi phục ${heal} HP.`);
  }
}

function doAction(action) {
  if (!state.player || !state.enemy || state.battleEnded) return;

  if (action === "attack") {
    const damage = state.player.attack + randomInt(0, 8);
    state.enemy.hp = Math.max(0, state.enemy.hp - damage);
    state.player.ki = Math.min(state.player.maxKi, state.player.ki + 4);
    addLog(`${state.player.name} dùng đánh thường, gây ${damage} sát thương.`);
  }

  if (action === "special") {
    if (state.player.ki < 10) {
      addLog(`${state.player.name} không đủ ki để dùng chiêu đặc biệt.`);
      enemyTurn();
      if (state.player.hp <= 0) {
        handleLose();
      }
      render();
      return;
    }

    state.player.ki = Math.max(0, state.player.ki - 10);
    const damage = state.player.special + randomInt(2, 12);
    state.enemy.hp = Math.max(0, state.enemy.hp - damage);
    addLog(`${state.player.name} tung chiêu đặc biệt, gây ${damage} sát thương.`);
  }

  if (action === "heal") {
    const heal = state.player.heal + randomInt(2, 10);
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
    state.player.ki = Math.min(state.player.maxKi, state.player.ki + 3);
    addLog(`${state.player.name} hồi phục ${heal} HP.`);
  }

  if (state.enemy.hp <= 0) {
    handleWin();
    return;
  }

  enemyTurn();

  if (state.player.hp <= 0) {
    handleLose();
    return;
  }

  render();
}

function handleWin() {
  state.battleEnded = true;
  state.level += 1;
  addLog(`<span class="status">Chiến thắng! Bạn đã đánh bại ${state.enemy.name}.</span>`);
  saveProgress();

  const nextEnemy = randomEnemy(state.level);
  state.enemy = nextEnemy;
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + 16);
  state.player.ki = state.player.maxKi;
  addLog(`Đối thủ mới: ${state.enemy.name}. Hãy tiếp tục!`);
  render();
}

function handleLose() {
  state.battleEnded = true;
  addLog(`<span class="status">Thua rồi! Hãy chọn nhân vật lại.</span>`);
  render();
}

loadProgress();
renderCharSelect();

if (state.selectedFighterId) {
  startBattle();
} else {
  render();
}
