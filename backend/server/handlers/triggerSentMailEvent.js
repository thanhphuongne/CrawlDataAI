import eventEmitter from '../events/notifyEvent';

const triggerSentMailEvent = (data) => {
  console.log('Triggering sentEmailNotify event...');
  eventEmitter.emit('sentEmailNotify', data); // Kích hoạt sự kiện
};

export default triggerSentMailEvent;
