export function getTimeBasedGreeting(userName?: string): string {
  const hour = new Date().getHours();
  let timeGreeting: string;

  if (hour >= 5 && hour < 12) {
    timeGreeting = 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (hour >= 17 && hour < 22) {
    timeGreeting = 'Good evening';
  } else {
    timeGreeting = 'Good night';
  }

  const userPart = userName ? `, ${userName}` : '';
  return `${timeGreeting}${userPart}! How may I assist you today?`;
} 