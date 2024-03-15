import React from 'react';
import { render } from '@boardzilla/core';
import { default as setup, Card } from '../game/index.js';

import './style.scss';
import '@boardzilla/core/index.css';

render(setup, {
  settings: {
  },
  layout: game => {

  }
});
