async function fetchPriceForSize(menuItemId: number, sizeId: number): Promise<number> {
  const res = await fetch(
    `/api/cashier/getPrice?menuItemId=${menuItemId}&sizeId=${sizeId}`
  );

  if (!res.ok) {
    console.error("Failed to fetch price from backend", await res.text());
    throw new Error("Failed to fetch price");
  }

  const data = await res.json();

  const price = Number(data.price);

  if (isNaN(price)) {
    console.error(`Invalid price received for menuItemId=${menuItemId}, sizeId=${sizeId}:`, data.price);
    throw new Error("Invalid price received");
  }

  return price;
}
