function createPlayer(name, marker) {
  const _name = name;
  const _marker = marker;
  let score = 0;
  const getName = () => _name;
  const getMarker = () => _marker;
  const getScore = () => score;
  const addScore = () => score++;
  const resetScore = () => (score = 0);
  return { getName, getMarker, getScore, addScore, resetScore };
}

export { createPlayer };
