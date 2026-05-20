import type { Player } from "./player.model.js";
import { PlayuStates, PlayuEvents, transition } from "./playu.states.machine.js";

export class RoomState {
  public code: string;
  public players: Player[] = [];
  private rawCatalog: string[] = [];
  public currentState: PlayuStates = PlayuStates.LOBBY;
  public selectedGame: string[] = [];
  public currentGameIndex: number = 0;
  public scores: Record<string, number> = {};
  public broadcast: (eventName: string, payload: any) => void = () => {};

  constructor(code: string) {
    this.code = code;
  }

  public changeEvent(event: PlayuEvents) {
    const nextState = transition(this.currentState, event);

    if (nextState !== this.currentState) {
      this.currentState = nextState;
      this.executeSideEffects(nextState);
    }
  }

  public setCatalog(catalog: string[]): void {
    this.rawCatalog = catalog;
  }
  private executeSideEffects(state: PlayuStates): void {
    switch (state) {
      case PlayuStates.PLAYING:
        this.handlePlayingEntry();
        break;
      case PlayuStates.SCORE_BOARD:
        this.handleScoreBoard();
        break;
      case PlayuStates.FINISHED:
        this.handleFinishedEntry();
        break;
    }
  }

  private handlePlayingEntry() {
    if (this.currentGameIndex === 0 && this.selectedGame.length === 0) {
      this.selectedGame = [...this.rawCatalog].sort(() => 0.5 - Math.random()).slice(0, 4);
      this.players.forEach((p) => (this.scores[p.id] = 0));
    }
    const currentGame = this.selectedGame[this.currentGameIndex];
    this.broadcast("game:start", { game: currentGame });
  }

  private handleScoreBoard() {
    this.broadcast("game:scoreboard", { scores: this.scores });

    this.currentGameIndex++;
  }

  private handleFinishedEntry() {
    this.broadcast("game:finished", { finalScores: this.scores });
  }

  public getNextEvent(): PlayuEvents {
    if (this.currentGameIndex >= 4) {
      return PlayuEvents.END_GAME;
    }
    return PlayuEvents.NEXT_GAME;
  }
}
