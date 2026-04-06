export function normalizeList(values = []) {
  return values
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter(
      (value, index, list) => list.findIndex((entry) => entry.toLowerCase() === value.toLowerCase()) === index
    );
}

export function formatSizes(sizes) {
  if (!Array.isArray(sizes) || sizes.length === 0) {
    return "No sizes";
  }

  return sizes.join(", ");
}

export function formatList(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return "-";
  }

  return values.join(", ");
}
