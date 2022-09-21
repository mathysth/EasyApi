import EasyApi from '../../app';
import EventEmitter from 'events';
import { IEvents } from '../types/events';

export class Events {
  private app: EasyApi;
  private _eventEmitter: EventEmitter = new EventEmitter();
  //todo add getter / setter
  private _events: Set<IEvents> = new Set<IEvents>([
    {
      name: 'start',
      cb: (data: any) => {
        this.app.logger.info('Api loaded');
      }
    }
  ]);

  constructor(app: EasyApi) {
    this.app = app;
  }

  /**
   * It takes an array of objects, each object has a name and a callback function, and it loops through the array and adds
   * an event listener to the event emitter for each object
   */
  public loadEvents() {
    this._events.forEach(event => {
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
    this.addEvent(event);
  }

  private on(event: IEvents) {
    this._eventEmitter.on(event.name, event.cb);
  }

  /**
   * It removes a listener from the event emitter
   * @param {string} eventName - The name of the event to listen for.
   */
  public off(eventName: string) {
    const event = this.getEventByName(eventName);
    if (typeof event === 'object') {
      this._eventEmitter.removeListener(eventName, () => event.cb);
    }
  }

  /**
   * It loops through the events array and returns the event object if the event name matches the event name passed in as a
   * parameter
   * @param {string} eventName - The name of the event you want to get.
   * @returns The event object that matches the eventName.
   */
  public getEventByName(eventName: string): IEvents | boolean {
    for (const event of this._events) {
      if (event.name === eventName) {
        return event;
      }
    }
    return false;
  }

  /**
   * The addEvent function takes an event object as a parameter and adds it to the events array
   * @param {IEvents} event - IEvents - This is the event that we want to add to the array.
   */
  public addEvent(event: IEvents): void {
    this._events.add(event);
  }

  get events(): Set<IEvents> {
    return this._events;
  }

  set events(value: Set<IEvents>) {
    this._events = value;
  }

  get eventEmitter(): EventEmitter {
    return this._eventEmitter;
  }
}
