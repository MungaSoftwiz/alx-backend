import { createQueue } from 'kue';
import { expect } from 'chai';
import createPushNotificationsJobs from './8-job';

const queue = createQueue();

describe('test for job creation', function () {
  before(function () {
    queue.testMode.enter();
  });

  afterEach(function () {
    queue.testMode.clear();
  });

  after(function () {
    queue.testMode.exit();
  });

  it('testing', function () {
    createPushNotificationsJobs([
      { id: 1, phoneNumber: '895744' },
      { id: 2, phoneNumber: '093664' }
    ], queue);

    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).to.deep.equal({ id: 1, phoneNumber: '895744' });
    expect(queue.testMode.jobs[1].data).to.deep.equal({ id: 2, phoneNumber: '093664' });
  });
});

