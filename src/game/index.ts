import {
  createGame,
  createGameClasses,
  Player,
  Game,
} from '@boardzilla/core';
import { cards } from './cards.js';
import { scorePlayer } from './scoring.js';

export class SevenPlayer extends Player<SevenPlayer, MyGame> {
  score = 0;
};

export class MyGame extends Game<SevenPlayer, MyGame> {
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
  $.mess.onEnter(Card, t => t.hideFromAll());
  for (const card of cards) {
    $.mess.createMany(card.quantity!, Card, card.name!, card);
  }

  for (const player of game.players) {
    const hand = game.create(Space, 'hand', { player });
    hand.onEnter(Card, c => c.showOnlyTo(player.position));
    const discard = game.create(Space, 'discard', { player });
    discard.onEnter(Card, c => c.showToAll());
  }

  game.defineActions({
    drawCards: player => action({ prompt: 'Draw 2 cards' })
      .chooseOnBoard('card', $.mess.all(Card))
      .move('card', player.my('hand')!)
      .chooseOnBoard('card2', $.mess.all(Card))
      .move('card2', player.my('hand')!),
    discardCard: player => action({ prompt: 'Discard a card' })
      .chooseOnBoard('card', player.my('hand')!.all(Card))
      .move('card', player.my('discard')!),
    discardDown: player => action({ prompt: 'Choose 3 cards to discard' })
      .chooseOnBoard('cards', player.my('hand')!.all(Card), {
        number: 3,
        confirm: 'Are you sure these are the 3 you want to discard?',
      })
      .move('cards', player.my('discard')!),
  });


  const determineWinner = () => {
    let highestPlayer: SevenPlayer | undefined = undefined;
    let highestScore = 0;
    for (const player of game.players) {
      if (player.score > highestScore) {
        highestPlayer = player;
        highestScore = player.score;
      }
      else if (player.score == highestScore) {
        highestPlayer = undefined;
      }
      console.log(player.name, player.score)
    }
    game.finish(highestPlayer);
  }

  game.defineFlow(
    () => {
      $.mess.shuffle();
      game.round = 7;
      for (const player of game.players) {
        $.mess.firstN(9, Card).putInto(player.my('hand')!)
      }
    },
    whileLoop({
      while: () => game.round < 8,
      do: (
        [() => {
          for (const player of game.players) {
            $.mess.firstN(2, Card).putInto(player.my('hand')!)
          }
        },
        everyPlayer({
          do: playerActions({ actions: ['discardCard'] })
        }),
        () => {
          game.round++;
        }]
      )
    }),
    playerActions({ actions: ['discardDown'] }),
    () => {
      for (const player of game.players) {
        scorePlayer(player, game);
      }
      determineWinner();
    },
  );

});

