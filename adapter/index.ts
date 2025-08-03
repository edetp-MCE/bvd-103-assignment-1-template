const baseUrl = "/";

async function fetchListings() {
  try {
    const res = await fetch(`${baseUrl}listings`);
    if (!res.ok) {
      throw new Error(`Failed to fetch listings: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in fetchListings:", error);
    return { error: "Could not retrieve listings." };
  }
}

async function fetchWarehouse() {
  try {
    const res = await fetch(`${baseUrl}warehouse`);
    if (!res.ok) {
      throw new Error(`Failed to fetch warehouse data: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in fetchWarehouse:", error);
    return { error: "Could not retrieve warehouse data." };
  }
}

async function submitOrder(order: any) {
  try {
    const res = await fetch(`${baseUrl}orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });
    if (!res.ok) {
      const errorResponse = await res.json().catch(() => ({}));
      throw new Error(errorResponse.message || "Failed to submit order");
    }
    return await res.json();
  } catch (error) {
    console.error("Error in submitOrder:", error);
    return { error: "Could not submit order." };
  }
}

export { fetchListings, fetchWarehouse, submitOrder };
