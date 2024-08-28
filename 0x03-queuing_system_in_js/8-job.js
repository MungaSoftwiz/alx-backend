function createPushNoticationsJobs (jobs, queue) {
  if (!Array.isArray(jobs)) { throw new Error('Jobs is not an array'); }

  jobs.forEach((element) => {
    const job = queue.createJob('push_notification_code_3', element)

    /* .save directly attached to save so works in test mode too */
    job.save((err) => {
      if (!err) {
        console.log(`Notification job created: ${job.id}`);
      }
    });

    job.on('complete', (result) => {
      console.log(`Notification job ${job.id} completed`);
    });

    job.on('failed', (errMessage) => {
      console.log(`Notification job ${job.id} failed: ${errMessage}`);
    });

    job.on('progress', (progress, data) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
}


export default createPushNoticationsJobs;
