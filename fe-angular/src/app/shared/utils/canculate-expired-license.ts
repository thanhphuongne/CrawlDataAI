// utils/dateUtils.ts
export function calculateRemainingDays(expiredDateStr: string | null): number | null {
    if (!expiredDateStr) return null;
  
    const today = new Date();
    const expiredDate = new Date(expiredDateStr);
  
    if (isNaN(expiredDate.getTime())) {
      console.error('Invalid expiration date format.');
      return null;
    }
  
    const timeDiff = expiredDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  export function formatDate(date: Date, format: string): string {
    return null;
  }
  
  export function isDateInPast(dateStr: string): boolean {
    const date = new Date(dateStr);
    return date.getTime() < new Date().getTime();
  }
  
  