export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSlotDate(value: string, options?: { long?: boolean }): string {
  return new Date(value).toLocaleDateString(undefined, {
    weekday: options?.long ? "long" : "short",
    year: "numeric",
    month: options?.long ? "long" : "short",
    day: "numeric",
  });
}

export function formatSlotTime(value: string): string {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSlotRange(slot: { startTime: string; endTime: string }): string {
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);
  const datePart = start.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const startPart = start.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endPart = end.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}, ${startPart} – ${endPart}`;
}
