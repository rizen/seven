import type { SevenPlayer, MyGame } from './index.js';
import { Card } from './index.js';

export const sortByValue = (hand: any[]) => {
    const copy = JSON.parse(JSON.stringify(hand)) as any[];
    return copy.sort((a, b) => {
        if (a.value > b.value) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        return 0;
    });
}

export const sortByColor = (hand: any[]) => {
    const copy = JSON.parse(JSON.stringify(hand)) as any[];
    return copy.sort((a, b) => {
        if (a.color > b.color) {
            return 1;
        }
        if (a.color < b.color) {
            return -1;
        }
        return 0;
    });
}

export const scoreRunOf7In1Color = (hand: any[]) => {
    if (score7Card1Color(hand) == 0)
        return 0;
    if (scoreRunOf7(hand) == 0)
        return 0;
    return 7;
}

export const scoreSetOf7 = (hand: any[]) => {
    const sorted = sortByValue(hand);
    if (sorted[0].value == sorted[6].value)
        return 6;
    return 0;
}

export const score7Card1Color = (hand: any[]) => {
    const sorted = sortByColor(hand)
    if (sorted[0].color == sorted[6].color)
        return 5;
    return 0;
}

export const scoreSetOf5AndSetOf2 = (hand: any[]) => {
    const sorted = sortByValue(hand);
    if (
        (sorted[0].value == sorted[1].value && sorted[2].value == sorted[6].value)
        ||
        (sorted[0].value == sorted[4].value && sorted[5].value == sorted[6].value)
    )
        return 4;
    return 0;
}

export const scoreRunOf7 = (hand: any[]) => {
    const sorted = sortByValue(hand);
    if (sorted.every((card, index) => card.value == index + 1))
        return 3;
    return 0;
}

export const scoreSetsAndRuns = (hand: any[]) => {
    if (hand.every((card) => card.value == '+1'))
        return 0;
    let sorted = sortByValue(hand);

    // remove pairs
    let previous = undefined;
    let pairs = 0;
    for (let index = hand.length - 1; index >= 0; index--) {
        if (sorted[index].value == previous) {
            sorted.splice(index, 2)
            previous = undefined;
            pairs++;
        }
        else {
            previous = sorted[index].value
        }
    }
    if (pairs != 2)
        return 0;

    // test for run
    if (sorted[0].value + 1 == sorted[1].value && sorted[1].value + 1 == sorted[2].value)
        return 2;

    // no joy
    return 0;
}

export const scoreEvenOrOdd = (hand: any[]) => {
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
        game.message(`${player.name} has scored ${bonus} bonus point${bonus == 1 ? 's' : ''}.`);
}