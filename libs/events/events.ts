import EasyApi from '../../app';
import EventEmitter from 'events';

export class Events {
  private app: EasyApi;
  private _eventEmitter: EventEmitter = new EventEmitter();
  private _events: Array<object> = [];

  constructor(app: EasyApi) {
    this.app = app;
    this.onStart();
  }

  private onStart() {
    this._eventEmitter.on('start', () => {
      this.app.logger.info('events loaded');
    });
  }

  get events(): Array<object> {
    return this._events;
  }

  set events(value: Array<object>) {
    this._events = value;
  }

  get eventEmitter(): EventEmitter {
    return this._eventEmitter;
  }
}
