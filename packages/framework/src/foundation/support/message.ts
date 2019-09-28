/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export class Message {

  private message: any[] = []

  pointer: number;

  constructor() {
    /**
     * @type messages
     */
    this.message = [];

    /**
     * @type iterator pointer
     */
    this.pointer = 0;
  }

  /**
   * add message
   * @param field message key
   * @param message message content
   */
  add(field: string, message: string) {
    if (!field || !message) return this;
    this.message.push({
      field,
      message,
    });
    return this;
  }

  /**
   * check messages is empty
   */
  isEmpty() {
    return !this.messages.length;
  }

  /**
   * get all messages
   */
  all() {
    return this.message.map(m => m.message);
  }

  /**
   * format messages
   */
  format() {
    const res: any= {};
    for (const msg of this.messages) {
      if (!res[msg.field]) {
        res[msg.field] = [];
      }
      res[msg.field].push(msg.message);
    }
    return res;
  }

  /**
   * get first message
   */
  first() {
    return this.messages.length > 0 ? this.messages[0].message : null;
  }

  /**
   * all messages
   */
  get messages() {
    return this.message;
  }

  /**
   * Message iterator
   */
  next() {
    const { messages } = this;
    if (this.pointer < messages.length) {
      const { pointer } = this;
      this.pointer = this.pointer + 1;
      return {
        done: false,
        value: messages[pointer],
      };
    }
    return { done: true, value: undefined };
  }

  [Symbol.iterator]() { return this; }
}
