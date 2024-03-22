import { expect, test, beforeEach } from 'vitest'
import { TestRunner } from "@boardzilla/core";
import { MyGame, SevenPlayer, Card, default as setup } from '../src/game/index.js';

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


  console.log('player 1 stuff', p1);
  console.log('player 2 stuff', p1);

  expect(runner.server.game.round).toBe(7);


  expect(p1.actions()).toStrictEqual(['discardCard'])
  expect(p2.actions()).toStrictEqual(['discardCard'])

  console.log('p1 hand', p1.player.my('hand')?.all(Card).map(card => card.name))
  p1.move('discardCard', {
    //@ts-ignore
    card: p1.player.my('hand')!.last(Card)!
  });

  expect(p1.actions()).toStrictEqual([])
  expect(p2.actions()).toStrictEqual(['discardCard'])

  console.log('p2 hand', p1.player.my('hand')?.all(Card).map(card => card.name))
  p2.move('discardCard', {
    //@ts-ignore
    card: p1.player.my('hand')!.last(Card)!
  });


  //expect(p1.actions()).toStrictEqual(['discardDown'])
  // expect(p2.actions()).toStrictEqual(['discardDown'])


})
/*
test("doesn't allow one player to play twice", () => {
  const [ui1, ui2] = runner.start({
    players: 2,
    settings: { tokens: 4 }
  });

  expect(ui1.actions()).toStrictEqual(['take'])
  expect(ui2.actions()).toStrictEqual([])

  ui1.move('take', {
    token: ui1.game.first('pool')!.last(Token)!
  });

  expect(() => ui1.move('take', {
    token: ui1.game.first('pool')!.last(Token)!
  })).toThrowError()
})
    */
