import kue from 'kue';

const queue = kue.createQueue();

const job = queue.create('push_notification_code', {
  phoneNumber: '55484846824-',
  message: 'This is a message to verify your account',
});

job.on('created', () => {
  console.log(`Notification job created: ${job.id}`);
}).save();

job.on('complete', () => {
  console.log(`Notification job completed`);
});

job.on('failed', () => {
  console.log(`Notification job failed`);
});
