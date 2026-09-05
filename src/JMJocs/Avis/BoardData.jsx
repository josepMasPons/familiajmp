// boardData.js

//const TOTAL = 63;
const TOTAL = 50;
const neusPositions = [0,8,15,22,26,31,35,44,49];
//const neusPositions = [0,4,8,13,17,22,26,31,35,40,44,49,53,58,62];
const limitedTypes = ["gemma", "esther", "julia", "jordi"];
const MAX_PER_TYPE = 6;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateBoard() {

  const typesArray = Array(TOTAL).fill(null);

  // 1️⃣ neus fixes
  neusPositions.forEach(pos => {
    typesArray[pos] = "neus";
  });

  // 2️⃣ posicions lliures
  let freePositions = [];
  for (let i = 0; i < TOTAL; i++) {
    if (!neusPositions.includes(i)) {
      freePositions.push(i);
    }
  }

  freePositions = shuffle(freePositions);

  // 3️⃣ pool exacta de 6 de cada
  let typePool = [];
  limitedTypes.forEach(type => {
    for (let i = 0; i < MAX_PER_TYPE; i++) {
      typePool.push(type);
    }
  });

  typePool = shuffle(typePool);

  // 4️⃣ assignació sense tocar-se
  for (let pos of freePositions) {

    if (typePool.length === 0) break;

    const left = typesArray[pos - 1];
    const right = typesArray[pos + 1];

    if (left === null && right === null) {
      typesArray[pos] = typePool.pop();
    }
  }

  // 5️⃣ retornem el board
  return Array.from({ length: TOTAL }, (_, i) => ({
    id: i,
    angle: (360 / TOTAL) * i,
    type: typesArray[i],
    action() {
      if (!this.type) return;
      console.log(`Acció de ${this.type} a la casella ${this.id + 1}`);
    }
  }));
}
/* **** old  boardData.js
export const board = Array.from({ length: 63 }, (_, i) => ({
  id: i,
  angle: (360 / 63) * i,
  type: ["neus","gemma","esther","julia","jordi"]
        [Math.floor(Math.random()*5)],
  //image: `/assets/cells/cell_${i+1}.png`,
  action: () => alert("Acció de la casella " + (i+1))
}));
*/
