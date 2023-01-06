import { Message } from '../../../../src/utils/message';

describe('Message', () => {
  describe('Message#add', () => {
    it('should return field and message object', () => {
      const msg = new Message();
      msg.add('key1', 'message1');
      expect(msg.messages).toEqual([{
        field: 'key1',
        message: 'message1',
      }]);
      msg.add('key2', 'message2');
      expect(msg.messages).toEqual([{
        field: 'key1',
        message: 'message1',
      }, {
        field: 'key2',
        message: 'message2',
      }]);
    });
  });

  describe('Message#isEmpty', () => {
    it('should return true when no messages', () => {
      const msg = new Message();
      expect(msg.isEmpty()).toBeTruthy();
    });

    it('should return false when have messages', () => {
      const msg = new Message();
      msg.add('key1', 'message1');
      expect(msg.isEmpty()).toBeFalsy();
    });
  });

  describe('Message#all', () => {
    it('should return all messages', () => {
      const msg = new Message();
      msg.add('key1', 'message1');
      msg.add('key2', 'message2');
      expect(msg.all()).toEqual(['message1', 'message2']);
    });
  });

  describe('Message#format', () => {
    it('should return format messages', () => {
      const msg = new Message();
      msg.add('key1', 'message1');
      msg.add('key1', 'message3');
      msg.add('key2', 'message2');
      expect(msg.format()).toEqual({
        key1: ['message1', 'message3'],
        key2: ['message2'],
      });
    });
  });

  describe('Message#first', () => {
    it('should return first message', () => {
      const msg = new Message();
      msg.add('key1', 'message1');
      msg.add('key1', 'message3');
      msg.add('key2', 'message2');
      expect(msg.first()).toBe('message1');
    });

    it('should return null when no message', () => {
      const msg = new Message();
      expect(msg.first()).toBeNull();
    });
  });

  describe('Message#iterator', () => {
    it('should implement symbol.iterator', () => {
      const msg = new Message();
      msg.add('key1', 'message1');
      msg.add('key1', 'message3');
      msg.add('key2', 'message2');
      expect(msg[Symbol.iterator]().next).toBe(msg.next);
      expect(msg.next().value).toEqual({
        field: 'key1',
        message: 'message1',
      });
      expect(msg.next().value).toEqual({
        field: 'key1',
        message: 'message3',
      });
      expect(msg.next().value).toEqual({
        field: 'key2',
        message: 'message2',
      });
      expect(msg.next()).toEqual({ done: true, value: undefined });
    });
  });
});
