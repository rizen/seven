import type { SevenPlayer, MyGame } from './index.js';
import { Card } from './index.js';

const sortByValue = (hand: Card[]) => {
    return hand.sort((a, b) => {
        if (a.value > b.value) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        return 0;
    });
}

const sortByColor = (hand: Card[]) => {
    return hand.sort((a, b) => {
        if (a.color > b.color) {
            return 1;
        }
        if (a.color < b.color) {
            return -1;
        }
        return 0;
    });
}

const scoreRunOf7In1Color = (hand: Card[]) => {
    if (score7Card1Color(hand) == 0)
        return 0;
    if (scoreRunOf7(hand) == 0)
        return 0;
    return 7;
}

const scoreSetOf7 = (hand: Card[]) => {
    const sorted = sortByValue(hand);
    if (sorted[0].value == sorted[6].value)
        return 6;
    return 0;
}

const score7Card1Color = (hand: Card[]) => {
    const sorted = sortByColor(hand)
    if (sorted[0].color == sorted[6].color)
        return 5;
    return 0;
}

const scoreSetOf5AndSetOf2 = (hand: Card[]) => {
    const sorted = sortByValue(hand);
    if (
        (sorted[0].value == sorted[1].value && sorted[2].value == sorted[6].value)
        ||
        (sorted[0].value == sorted[4].value && sorted[5].value == sorted[6].value)
    )
        return 4;
    return 0;
}

const scoreRunOf7 = (hand: Card[]) => {
    const sorted = sortByValue(hand);
    if (sorted.every((card, index) => card.value == index + 1))
        return 3;
    return 0;
}

const scoreSetsAndRuns = (hand: Card[]) => {
    if (hand.every((card) => card.value == '+1'))
        return 0;
    const sorted = sortByValue(hand);
    let startOfRun = 0;
    let index = 0;
    let lastValue = 0;
    for (const card of sorted) {
        if (lastValue != card.value) {
            //@ts-ignore
            lastValue = card.value;
            startOfRun = index;
        }
        if (startOfRun - index == 3)
            break;
        index++;
    }
    if (startOfRun - index < 3)
        return 0;
    const remainder = sorted.splice(startOfRun, 3);
    if (remainder[0].value == remainder[1].value && remainder[2].value == remainder[3].value)
        return 2;
    return 0;
}

const scoreEvenOrOdd = (hand: Card[]) => {
    if (hand.every((card) => card.value == '+1'))
        return 0;
    //@ts-ignore
    if (hand.every(card => card.value % 2 == 0) || hand.every(card => card.value % 2 != 0))
        return 1;
    return 0;
}


export const scorePlayer = (player: SevenPlayer, game: MyGame) => {
    const hand = player.my('hand')?.all(Card) || [];
    let score = scoreRunOf7In1Color(hand);
    if (score) {
        player.score += score;
        game.message(`${player.name} has scored a run of 7 in 1 color.`);
    }
    else {
        score = scoreSetOf7(hand);
        if (score) {
            player.score += score;
            game.message(`${player.name} has scored a set of 7.`);
        }
        else {
            score = score7Card1Color(hand);
            if (score) {
                player.score += score;
                game.message(`${player.name} has scored 7 cards in 1 color.`);
            }
            else {
                score = scoreSetOf5AndSetOf2(hand);
                if (score) {
                    player.score += score;
                    game.message(`${player.name} has scored a set of 5 + a set of 2.`);
                }
                else {
                    score = scoreRunOf7(hand);
                    if (score) {
                        player.score += score;
                        game.message(`${player.name} has scored a run of 7.`);
                    }
                    else {
                        score = scoreSetsAndRuns(hand);
                        if (score) {
                            player.score += score;
                            game.message(`${player.name} has scored a bunch of sets and runs.`);
                        }
                        else {
                            score = scoreEvenOrOdd(hand);
                            if (score) {
                                player.score += score;
                                game.message(`${player.name} has scored all even or odd.`);
                            }
                            else {
                                game.message(`${player.name} failed to create sets or runs.`);
                            }
                        }
                    }
                }
            }
        }
    }
    // add bonus points
    let bonus = 0;
    for (const card of hand) {
        if (card.color == 'black') {
            player.score++;
            bonus++;
        }
    }
    if (bonus)
        game.message(`${player.name} has scored ${bonus} point${bonus == 1 ? 's' : ''}.`);
}