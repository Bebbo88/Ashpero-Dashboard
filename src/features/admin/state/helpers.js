export function getErrorMessage(error) {
  if (!error) {
    return "Something went wrong";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  return "Something went wrong";
}

export function replaceById(collection, nextItem) {
  const nextId = String(nextItem._id || nextItem.id);

  return collection.map((item) => (String(item._id || item.id) === nextId ? nextItem : item));
}
