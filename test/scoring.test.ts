import { expect, test } from 'vitest'
import { sortByValue, sortByColor, scoreRunOf7In1Color, scoreSetOf7, score7Card1Color, scoreSetOf5AndSetOf2, scoreRunOf7, scoreSetsAndRuns, scoreEvenOrOdd } from '../src/game/scoring.js';

test('sorting', () => {
    const hand = [
        { color: 'red', value: 3 },
        { color: 'red', value: 1 },
        { color: 'red', value: 7 },
        { color: 'purple', value: 4 },
        { color: 'red', value: 5 },
        { color: 'red', value: 6 },
        { color: 'red', value: 2 },
    ];
    const sortedByValue = sortByValue(hand);
    expect(sortedByValue[0].value).toBe(1);
    expect(sortedByValue[6].value).toBe(7);
    const sortedByColor = sortByColor(hand);
    expect(sortedByColor[0].color).toBe('purple');
    expect(sortedByColor[6].color).toBe('red');
});

test('run of 7 of 1 color', () => {
    const hand = [
        { color: 'red', value: 3 },
        { color: 'red', value: 1 },
        { color: 'red', value: 7 },
        { color: 'red', value: 4 },
        { color: 'red', value: 5 },
        { color: 'red', value: 6 },
        { color: 'red', value: 2 },
    ];
    expect(scoreRunOf7In1Color(hand)).toBe(7);
    hand[0].color = 'blue';
    expect(scoreRunOf7In1Color(hand)).toBe(0);
});

test('set of 7', () => {
    const hand = [
        { color: 'red', value: 2 },
        { color: 'blue', value: 2 },
        { color: 'purple', value: 2 },
        { color: 'red', value: 2 },
        { color: 'red', value: 2 },
        { color: 'red', value: 2 },
        { color: 'red', value: 2 },
    ];
    expect(scoreSetOf7(hand)).toBe(6);
    hand[3].value = 3;
    expect(scoreSetOf7(hand)).toBe(0);
});

test('seven cards 1 color', () => {
    const hand = [
        { color: 'red', value: 3 },
        { color: 'red', value: 1 },
        { color: 'red', value: 7 },
        { color: 'red', value: 4 },
        { color: 'red', value: 5 },
        { color: 'red', value: 6 },
        { color: 'red', value: 2 },
    ];
    expect(score7Card1Color(hand)).toBe(5);
    hand[0].color = 'blue';
    expect(score7Card1Color(hand)).toBe(0);
});

test('set of 5 and set of 2', () => {
    const hand = [
        { color: 'red', value: 2 },
        { color: 'blue', value: 2 },
        { color: 'red', value: 4 },
        { color: 'purple', value: 2 },
        { color: 'red', value: 2 },
        { color: 'red', value: 2 },
        { color: 'red', value: 4 },
    ];
    expect(scoreSetOf5AndSetOf2(hand)).toBe(4);
    hand[3].value = 3;
    expect(scoreSetOf5AndSetOf2(hand)).toBe(0);
});

test('run of 7', () => {
    const hand = [
        { color: 'red', value: 3 },
        { color: 'red', value: 1 },
        { color: 'purple', value: 7 },
        { color: 'red', value: 4 },
        { color: 'red', value: 5 },
        { color: 'blue', value: 6 },
        { color: 'red', value: 2 },
    ];
    expect(scoreRunOf7(hand)).toBe(3);
    hand[0].value = 7;
    expect(scoreRunOf7(hand)).toBe(0);
});

test('sets and runs', () => {
    const hand = [
        { color: 'red', value: 2 },
        { color: 'red', value: 1 },
        { color: 'purple', value: 1 },
        { color: 'red', value: 4 },
        { color: 'red', value: 5 },
        { color: 'blue', value: 3 },
        { color: 'red', value: 2 },
    ];
    expect(scoreSetsAndRuns(hand)).toBe(2);
    hand[0].value = 7;
    expect(scoreSetsAndRuns(hand)).toBe(0);
});

test('even or odd', () => {
    let hand = [
        { color: 'red', value: 1 },
        { color: 'red', value: 1 },
        { color: 'purple', value: 1 },
        { color: 'red', value: 7 },
        { color: 'red', value: 5 },
        { color: 'blue', value: 3 },
        { color: 'red', value: 3 },
    ];
    expect(scoreEvenOrOdd(hand)).toBe(1);
    hand[0].value = 2;
    expect(scoreEvenOrOdd(hand)).toBe(0);
    hand = [
        { color: 'red', value: 2 },
        { color: 'red', value: 4 },
        { color: 'purple', value: 6 },
        { color: 'red', value: 4 },
        { color: 'red', value: 4 },
        { color: 'blue', value: 2 },
        { color: 'red', value: 6 },
    ];
    expect(scoreEvenOrOdd(hand)).toBe(1);
});