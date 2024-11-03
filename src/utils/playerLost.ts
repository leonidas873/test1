export function playerLost(): boolean {
    const rand = Math.random();
    console.log(rand)
    return rand > 0.99999;
}