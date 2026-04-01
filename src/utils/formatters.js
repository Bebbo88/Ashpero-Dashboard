export function formatCurrency(value) {
  const numeric = Number(value || 0);

  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2
  }).format(numeric);
}

export function formatDateTime(value) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function toCommaSeparatedText(items) {
  if (!Array.isArray(items)) {
    return "";
  }

  return items.join(", ");
}

export function parseCommaSeparatedText(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function parseLineSeparatedText(value) {
  if (!value) {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function toLineSeparatedText(items) {
  if (!Array.isArray(items)) {
    return "";
  }

  return items.join("\n");
}
