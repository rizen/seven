import React from 'react';
import { render, ProfileBadge } from '@boardzilla/core';
import { default as setup, Card } from '../game/index.js';

import './style.scss';
import '@boardzilla/core/index.css';

render(setup, {
  boardSizes: (_screenX, _screenY, mobile) => mobile ? {
    name: 'mobile',
    aspectRatio: 2.2,
  } : {
    name: 'desktop',
    aspectRatio: 8 / 5,
  },

  settings: {
  },
  layout: game => {
    game.all('scoreboard').appearance({
      render: scoreboard => (
        <div>
          {game.players.map(player =>
            <div key={player.name}>
              <ProfileBadge player={player!} />
              <div className="score">
                {player!.score}
              </div>
            </div>
          )}
        </div>
      )
    });

  }
});
