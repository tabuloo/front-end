// Safely coerce various date-like values (Date, string, number, Firestore Timestamp) into a Date
const coerceToDate = (value: any): Date | null => {
  try {
    if (!value) return null;
    // Firestore Timestamp
    if (typeof value?.toDate === 'function') {
      const d = value.toDate();
      return isNaN(d as unknown as number) ? null : d;
    }
    // Firestore Timestamp plain object
    if (typeof value === 'object' && (value.seconds || value._seconds)) {
      const ms = ((value.seconds ?? value._seconds) as number) * 1000;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }
    // Unix ms or ISO string
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

export const formatOrderDate = (date: any): string => {
  const today = new Date();
  const orderDate = coerceToDate(date) || new Date();
  
  // Check if it's the same day
  if (orderDate.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  // Check if it's yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (orderDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // Return formatted date for other days
  return orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatBookingDate = (date: any): string => {
  const today = new Date();
  const bookingDate = coerceToDate(date) || new Date();
  
  // Check if it's the same day
  if (bookingDate.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  // Check if it's yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (bookingDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // Return formatted date for other days
  return bookingDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (date: any): string => {
  const d = coerceToDate(date);
  if (!d) return '-';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
