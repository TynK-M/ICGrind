/**
 * ICGrind Script
 * -------------------
 * Author: TynK-M
 */

/* ============================
   DOM ELEMENTS
============================ */
const toggleBtn = document.getElementById('themeToggle'); // Theme toggle button
const currentLevelInput = document.getElementById('currentLevelInput'); // User's current level input
const totalXPInput = document.getElementById('totalXP'); // User's current total XP input
const targetLevelInput = document.getElementById('targetLevelInput'); // Target level input
const targetXPInput = document.getElementById('targetXPInput'); // Target XP input
const resultDiv = document.getElementById('result'); // Div for showing calculation results

/* ============================
   CONSTANTS
============================ */
const MAX_LEVEL = 120;       // Maximum level allowed
const MAX_XP = 500_000_000;  // Maximum total XP
const MIN_START_XP = 0;      // Minimum XP for starting level
const MIN_TARGET_XP = 1;     // Minimum XP for target level

/* ============================
   THEME TOGGLING
============================ */

/**
 * Updates the theme toggle button text based on current theme
 * 🌙 for dark mode, ☀️ for light mode
 */
function updateThemeButton() {
  toggleBtn.textContent = document.documentElement.classList.contains('dark') ? '🌙' : '☀️';
}

// Initialize theme based on saved preference or system setting
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

updateThemeButton();

// Event listener to toggle theme on button click
toggleBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  updateThemeButton();
});

/* ============================
   XP TABLE & UTILITIES
============================ */

/**
 * XP table: total XP required to reach each level
 * Index corresponds to level - 1
 * Sourced from the official Idle Clans wiki:
 * https://wiki.idleclans.com/index.php/XP_Table
 *
 * This table applies to all skills in the game. Once you hit level 120, you can no longer gain any levels.
 * Experience is capped at 500,000,000.
 */
const xpPerLevel = [
  0,75,151,227,303,380,531,683,836,988,
  1141,1294,1447,1751,2054,2358,2663,2967,3272,3577,
  4182,4788,5393,5999,6606,7212,7819,9026,10233,11441,
  12648,13856,15065,16273,18682,21091,23500,25910,28319,30729,
  33140,37950,42761,47572,52383,57195,62006,66818,76431,86043,
  95656,105269,114882,124496,134109,153323,172538,191752,210967,230182,
  249397,268613,307028,345444,383861,422277,460694,499111,537528,614346,
  691163,767981,844800,921618,998437,1075256,1228875,1382495,1536114,1689734,
  1843355,1996975,2150596,2457817,2765038,3072260,3379481,3686703,3993926,4301148,
  4915571,5529994,6144417,6758841,7373264,7987688,8602113,9830937,11059762,12288587,
  13517412,14746238,15975063,17203889,19661516,22119142,24576769,27034396,29492023,31949651,
  34407278,39322506,44237735,49152963,54068192,58983421,63898650,68813880,78644309,88474739
];

/**
 * Returns level corresponding to total XP
 * @param {number} totalXP - Total XP
 * @returns {number} Level
 */
function getLevelFromXP(totalXP) {
  for (let lvl = 1; lvl <= xpPerLevel.length; lvl++) {
    if (totalXP < xpPerLevel[lvl]) return lvl;
  }
  return xpPerLevel.length;
}

/**
 * Returns total XP required for a given level
 * @param {number} level - Level number
 * @returns {number} Total XP
 */
function getXPFromLevel(level) {
  if (level < 1) level = 1;
  if (level > xpPerLevel.length) level = xpPerLevel.length;
  return xpPerLevel[level - 1];
}

/* ============================
   INPUT SANITIZATION
============================ */

/**
 * Ensures input contains only digits and is within allowed range
 * @param {HTMLInputElement} input - Input element
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 */
function sanitizeInput(input, min, max) {
  input.value = input.value.replace(/\D/g, ''); // digits only
  input.value = input.value.replace(/^0+(?=\d)/, ''); // remove leading zeros
  if (input.value === '' || parseInt(input.value) < min) input.value = min;
  if (parseInt(input.value) > max) input.value = max;
}

/* ============================
   UPDATE FUNCTIONS
============================ */

/** Updates total XP input based on current level input */
function updateTotalXPFromCurrentLevel() {
  totalXPInput.value = getXPFromLevel(parseInt(currentLevelInput.value));
}

/** Updates current level input based on total XP input */
function updateCurrentLevelFromTotalXP() {
  currentLevelInput.value = getLevelFromXP(parseInt(totalXPInput.value));
}

/** Updates target XP input based on target level input */
function updateTargetXPFromLevel() {
  targetXPInput.value = getXPFromLevel(parseInt(targetLevelInput.value));
}

/** Updates target level input based on target XP input */
function updateTargetLevelFromXP() {
  targetLevelInput.value = getLevelFromXP(parseInt(targetXPInput.value));
}

/* ============================
   EVENT LISTENERS
============================ */

// Current level input
currentLevelInput.addEventListener('input', () => {
  sanitizeInput(currentLevelInput, 1, MAX_LEVEL);
  updateTotalXPFromCurrentLevel();
});

// Total XP input
totalXPInput.addEventListener('input', () => {
  sanitizeInput(totalXPInput, MIN_START_XP, MAX_XP);
  updateCurrentLevelFromTotalXP();
});

// Target level input
targetLevelInput.addEventListener('input', () => {
  sanitizeInput(targetLevelInput, 1, MAX_LEVEL);
  updateTargetXPFromLevel();
});

// Target XP input
targetXPInput.addEventListener('input', () => {
  sanitizeInput(targetXPInput, MIN_TARGET_XP, MAX_XP);
  updateTargetLevelFromXP();
});

// Initial update of inputs
updateTotalXPFromCurrentLevel();
updateTargetXPFromLevel();

/* ============================
   CALCULATION
============================ */

/**
 * Calculates XP needed to reach target level
 * Displays result in resultDiv
 */
document.getElementById('calculateBtn').addEventListener('click', () => {
  const currentXP = parseInt(totalXPInput.value);
  const targetXP = parseInt(targetXPInput.value);
  const targetLevel = parseInt(targetLevelInput.value);

  if (targetXP <= currentXP) {
    resultDiv.innerHTML = `<p class="text-red-500 font-bold">
      Target XP must be higher than current XP.
    </p>`;
    return;
  }

  const xpNeeded = targetXP - currentXP;
  resultDiv.innerHTML = `<p class="font-bold text-lg">
    Total XP Needed to reach level ${targetLevel}: ${xpNeeded}
  </p>`;
});
