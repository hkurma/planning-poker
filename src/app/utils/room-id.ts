export function generateRoomId(): string {
  const adjectives = ['cosmic', 'stellar', 'quantum', 'cyber', 'neon', 'pixel', 'retro', 'turbo'];
  const nouns = ['phoenix', 'dragon', 'nebula', 'vortex', 'pulse', 'spark', 'wave', 'storm'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}-${noun}-${num}`;
}

