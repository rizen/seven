import {
  createGame,
  createGameClasses,
  Player,
  Game,
} from '@boardzilla/core';
import { cards } from './cards.js';

export class SevenPlayer extends Player<SevenPlayer, MyGame> {
  score = 0;
};

class MyGame extends Game<SevenPlayer, MyGame> {
  round = 1;
}

const { Space, Piece } = createGameClasses<SevenPlayer, MyGame>();

export class Card extends Piece {
  color: 'purple' | 'blue' | 'red' | 'green' | 'black'
  value: 1 | 2 | 3 | 4 | 5 | 6 | 7 | '+1'
  quantity: number
}

export default createGame(SevenPlayer, MyGame, game => {

  const { action } = game;
  const { playerActions, loop, everyPlayer, whileLoop } = game.flowCommands;

  game.registerClasses(Card);

  game.create(Space, 'mess');
  //$.mess.onEnter(Card, t => t.hideFromAll());
  for (const card of cards) {
    $.mess.createMany(card.quantity!, Card, card.name!, card);
  }

  for (const player of game.players) {
    const hand = game.create(Space, 'hand', { player });
    //hand.onEnter(Card, c => c.showOnlyTo(player.position));
    const discard = game.create(Space, 'discard', { player });
    //discard.onEnter(Card, c => c.showToAll());
  }

  game.defineActions({
    drawCard: player => action({ prompt: 'Draw a card' })
      .chooseOnBoard('card', $.mess.all(Card))
      .move('card', player.my('hand')!),
    discardCard: player => action({ prompt: 'Discard a card' })
      .chooseOnBoard('card', player.my('hand')!.all(Card))
      .move('card', player.my('discard')!),
  });

  game.defineFlow(
    () => {
      $.mess.shuffle();
      for (const player of game.players) {
        $.mess.firstN(3, Card).putInto(player.my('hand')!)
      }
    },
    whileLoop({
      while: () => game.round < 8,
      do: loop(
        everyPlayer({
          do: playerActions({ actions: ['drawCard'] })
        }),
        everyPlayer({
          do: playerActions({ actions: ['discardCard'] })
        }),
      )
    }),
  );
});
