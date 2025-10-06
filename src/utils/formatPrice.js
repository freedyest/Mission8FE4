export const formatPrice = (value, currency = "IDR") => {
  if (!value) return "";
  const num = Number(value);
  if (currency === "IDR") {
    if (num >= 1000) return "Rp " + (num / 1000).toFixed(0) + "K";
    return "Rp " + num;
  } else if (currency === "USD") {
    const rate = 15000;
    return "$" + (num / rate).toFixed(2);
  }
  return value;
};
