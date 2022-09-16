import EasyApi from '../../app';
import EventEmitter from 'events';
import { IEvents } from '../types/events';

export class Events {
  private app: EasyApi;
  private _eventEmitter: EventEmitter = new EventEmitter();
  private _events: Array<IEvents> = [
    { name: 'start', log: true, cb: () => {} },
    { name: 'defaultPluginRegistered', log: true, cb: () => {} }
  ];

  constructor(app: EasyApi) {
    this.app = app;
    this.loadEvents();
  }

  private loadEvents() {
    this.events.map(event => {
      this._eventEmitter.on(event.name, () => {
        event.log
          ? this.app.logger.info(`${event.name} events loaded`)
          : undefined;
        event.cb();
      });
    });
  }

  get events(): Array<IEvents> {
    return this._events;
  }

  set events(value: Array<IEvents>) {
    this._events = value;
  }

  get eventEmitter(): EventEmitter {
    return this._eventEmitter;
  }
}
