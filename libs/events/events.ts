import EasyApi from '../../app';
import EventEmitter from 'events';
import { IEvents } from '../types/events';

export class Events {
  private app: EasyApi;
  private _eventEmitter: EventEmitter = new EventEmitter();
  private _events: Array<IEvents> = [
    {
      name: 'start',
      log: true,
      cb: () => {
        this.app.logger.info('Event start triggered');
      }
    },
    { name: 'defaultPluginRegistered', log: true, cb: () => {} }
  ];

  constructor(app: EasyApi) {
    this.app = app;
  }

  /**
   * It takes an array of objects, each object has a name and a callback function, and it loops through the array and adds
   * an event listener to the event emitter for each object
   */
  public loadEvents() {
    this.events.map(event => {
      this.on(event);
    });
  }

  /**
   * The addListener function takes an event object as an argument and adds it to the event emitter
   * You can also alter the default event before initializing  it
   * @param {IEvents} event - IEvents - this is the interface that we created earlier.
   */
  public addListener(event: IEvents): void {
    this.on(event);
  }

  private on(event: IEvents) {
    this._eventEmitter.on(event.name, () => {
      event.log
        ? this.app.logger.info(`${event.name} events loaded`)
        : undefined;
      event.cb();
    });
  }

  /**
   * It removes a listener from the event emitter
   * @param {string} eventName - The name of the event to listen for.
   */
  public removeEvent(eventName: string) {
    try {
      this._eventEmitter.removeListener(eventName, () => {
        this.app.logger.info(`removing "${eventName}" listener`);
      });
      //const test: IEvents | undefined = this._events.find(event => event.name === eventName);
    } catch (e) {
      this.app.logger.error('An error happened');
      this.app.logger.error(e);
    }
  }

  /**
   * The addEvent function takes an event object as a parameter and adds it to the events array
   * @param {IEvents} event - IEvents - This is the event that we want to add to the array.
   */
  public addEvent(event: IEvents): void {
    this._events.push(event);
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
