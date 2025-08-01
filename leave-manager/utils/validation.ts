import { LeaveRequest } from '../models/LeaveRequest';
//Check if a date is in the future.
 
export function isFutureDate(dateStr: string): boolean {
  const today = new Date();
  const date = new Date(dateStr);
  return date > today;
}


//Ensure start date comes before end date.
export function isDateRangeValid(start: string, end: string): boolean {
  return new Date(start) < new Date(end);
}


 //Calculate number of leave days between two dates.
 //Includes both start and end date.
export function calculateLeaveDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays + 1;
}


// Check if the new leave overlaps with any existing approved leaves.
 
export function checkOverlap(
  newReq: LeaveRequest,
  existing: LeaveRequest[]
): boolean {
  const newStart = new Date(newReq.startDate).getTime();
  const newEnd = new Date(newReq.endDate).getTime();

  return existing.some(req => {
    if (req.status !== 'Approved') return false;
    const existingStart = new Date(req.startDate).getTime();
    const existingEnd = new Date(req.endDate).getTime();

    return newStart <= existingEnd && newEnd >= existingStart;
  });
}


// Sum all approved leave days by a user in a given month and year.

export function getMonthlyLeaveDays(
  name: string,
  month: number, // 0-indexed
  year: number,
  existing: LeaveRequest[]
): number {
  return existing.reduce((total, req) => {
    const reqDate = new Date(req.startDate);
    const isSameUser = req.name === name;
    const isSameMonth = reqDate.getMonth() === month && reqDate.getFullYear() === year;

    if (isSameUser && isSameMonth && req.status === 'Approved') {
      total += calculateLeaveDays(req.startDate, req.endDate);
    }

    return total;
  }, 0);
}
