import type { SevenPlayer } from './index.js';
import { Card } from './index.js';

const scoreStraightFlush = (hand: Card[]) => {
    let score = 0;
    //for (const color )

    return score;
}

export const scorePlayer = (player: SevenPlayer) => {
    const hand = player.my('hand')?.all(Card) || [];
    let score = scoreStraightFlush(hand);
    if (score) {
        player.score += score;
    }
    else {

    }
    // add bonus points
    for (const card of hand) {
        if (card.color == 'black') {
            player.score++;
        }
    }
}