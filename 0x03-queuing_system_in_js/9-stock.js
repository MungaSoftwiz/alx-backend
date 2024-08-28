import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

function getItemById(id) {
  return listProducts.find(product => product.itemId === parseInt(id));
}

async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock) : null;
}

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = currentStock !== null ? currentStock : product.initialAvailableQuantity;

  res.json({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
    currentQuantity
  });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  let currentStock = await getCurrentReservedStockById(itemId);
  currentStock = currentStock !== null ? currentStock : product.initialAvailableQuantity;

  if (currentStock <= 0) {
    return res.status(400).json({ status: 'Not enough stock available', itemId: parseInt(itemId) });
  }

  await reserveStockById(itemId, currentStock - 1);

  res.json({ status: 'Reservation confirmed', itemId: parseInt(itemId) });
});

app.listen(1245, () => {
  console.log('Server is running on port 1245');
});

