
const inventory = [
    { "productId": "bike1", "stock": 5, "price": 98 },
    { "productId": "helmet1", "stock": 10, "price": 20 },
    { "productId": "gloves1", "stock": 8, "price": 10 }
]

const findItem = (productId) => inventory.find((item) => item.productId === productId);

const deductStock = (productId, quantity) => {
  const item = findItem(productId);
  if (item && item.stock >= quantity) {
    item.stock -= quantity;
    return true;
  }
  return false;
};

const addStock = (productId, quantity) => {
  const item = findItem(productId);
  if (item) {
    item.stock += quantity;
    return true;
  }
  return false;
};

export default { findItem, deductStock, addStock };