import { expect, test, beforeEach } from 'vitest'
import { TestRunner } from "@boardzilla/core";
import { MyGame, SevenPlayer, Card, default as setup } from '../src/game/index.js';
import { scorePlayer } from '../src/game/scoring.js';

//@ts-ignore
let runner: TestRunner<SevenPlayer, MyGame>;

beforeEach(() => {
  runner = new TestRunner(setup);
})

test('allows you to take turns', () => {
  const [p1, p2] = runner.start({
    players: 2,
    settings: {}
  });

  expect(runner.server.game.round).toBe(7);

  expect(p1.player.my('hand')?.all(Card).length).toBe(11);
  expect(p2.player.my('hand')?.all(Card).length).toBe(11);

  expect(p1.actions()).toStrictEqual(['discardCard']);
  expect(p2.actions()).toStrictEqual(['discardCard']);

  // console.log('p1 hand', p1.player.my('hand')?.all(Card).map(card => card.name))
  p1.move('discardCard', {
    //@ts-ignore
    card: p1.player.my('hand')!.last(Card)!
  });

  expect(p1.player.my('hand')?.all(Card).length).toBe(10);

  expect(p1.actions()).toStrictEqual([]);
  expect(p2.actions()).toStrictEqual(['discardCard']);

  //  console.log('p2 hand', p2.player.my('hand')?.all(Card).map(card => card.name))
  p2.move('discardCard', {
    //@ts-ignore
    card: p2.player.my('hand')!.last(Card)!
  });

  expect(p2.player.my('hand')?.all(Card).length).toBe(10);

  expect(p1.actions()).toStrictEqual(['discardDown']);
  expect(p2.actions()).toStrictEqual(['discardDown']);

  p1.move('discardDown', {
    //@ts-ignore
    cards: p1.player.my('hand')!.firstN(3, Card)!
  });

  expect(p1.player.my('hand')?.all(Card).length).toBe(7);

  expect(p1.actions()).toStrictEqual([]);
  expect(p2.actions()).toStrictEqual(['discardDown']);

  p2.move('discardDown', {
    //@ts-ignore
    cards: p2.player.my('hand')!.firstN(3, Card)!
  });

  expect(p2.player.my('hand')?.all(Card).length).toBe(11);

  expect(p1.actions()).toStrictEqual(['discardCard'])
  expect(p2.actions()).toStrictEqual(['discardCard'])


});

test('player hand scoring', () => {
  const [p1, p2] = runner.start({
    players: 2,
    settings: {}
  });


  p1.player.my('hand')?.all().putInto(runner.server.game.first('mess')!)
  expect(p1.player.my('hand')?.all().length).toBe(0);
  p2.player.my('hand')?.all().putInto(runner.server.game.first('mess')!)
  expect(p2.player.my('hand')?.all().length).toBe(0);

  //console.log('mess', runner.server.game.all('mess').all(Card).map(card => card.name))

  for (const value of [1, 2, 3, 4, 5, 6, 7])
    runner.server.game.first('mess')?.firstN(1, Card, { name: 'blue' + value }).putInto(p1.player.my('hand')!);

  //console.log('p1 hand', p1.player.my('hand')?.all(Card).map(card => card.name))

  expect(p1.player.my('hand')?.all().length).toBe(7);

  expect(p1.player.score).toBe(0);

  scorePlayer(p1.player, runner.server.game);

  expect(p1.player.score).toBe(7);

});