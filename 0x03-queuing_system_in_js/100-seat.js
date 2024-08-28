import { createClient } from 'redis';
import { createQueue } from 'kue';
import { promisify } from 'util';
import pkg from 'express';

const express = pkg;
const app = express();

const client = createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

function reserveSeat (number) {
  return setAsync('available_seats', number)
    .then((data) => console.log(data));
}

function getCurrentAvailableSeats () {
  return getAsync('available_seats');
}

await reserveSeat(50);
let reservationEnabled = true;

const queue = createQueue();

app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }
  const job = queue.create('reserve_seat', { key: 'emptyJob' }).save((err) => {
    if (!err) { res.json({ status: 'Reservation in process' }); }
  });
  job.on('failed', (errMessage) => {
    res.json({ status: 'Reservation failed' });
    console.log(`Seat reservation job ${job.id} failed: ${errMessage}`);
  });
  job.on('complete', (result) => {
    console.log(`Seat reservation job ${job.id} completed`);
  });
});

app.get('/process', async (req, res) => {
  res.json({ status: 'Queue Processing' });
  async function process (job, done) {
    let availableSeats = await getCurrentAvailableSeats();
    await reserveSeat(availableSeats - 1);
    availableSeats = await getCurrentAvailableSeats();
    if (Number(availableSeats) === 0) {
      reservationEnabled = false;
      done();
    }
    if (Number(availableSeats) > 0) { done(); }
    if (Number(availableSeats) < 0) { done(new Error('Not enough seats available')); }
  }
  queue.process('reserve_seat', async function (job, done) {
    process(job, done);
  });
});

app.listen(1245, () => {
  console.log('Server Running on Port 1245');
});
