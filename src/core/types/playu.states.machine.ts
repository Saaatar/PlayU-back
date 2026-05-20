export enum PlayuStates {
  LOBBY = "LOBBY",
  PLAYING = "PLAYING",
  SCORE_BOARD = "SCORE_BOARD",
  FINISHED = "FINISHED",
}

export enum PlayuEvents {
  START_GAME = "START_GAME",
  END_MINIGAME = "END_MINIGAME",
  NEXT_GAME = "NEXT_GAME",
  END_GAME = "END_GAME",
}

export const validatorMachine: any = {
  LOBBY: {
    START_GAME: PlayuStates.PLAYING,
  },
  PLAYING: {
    END_MINIGAME: PlayuStates.SCORE_BOARD,
  },
  SCORE_BOARD: {
    NEXT_GAME: PlayuStates.PLAYING,
    END_GAME: PlayuStates.FINISHED,
  },
};

export const transition = (currentState: PlayuStates, event: PlayuEvents): PlayuStates => {
  if (!validatorMachine[currentState]) {
    return currentState;
  }

  const nextState = validatorMachine[currentState][event];

  if (nextState) {
    return nextState;
  }
  return currentState;
};
