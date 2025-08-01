"use strict";
// utils/validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFutureDate = isFutureDate;
exports.isDateRangeValid = isDateRangeValid;
exports.calculateLeaveDays = calculateLeaveDays;
exports.checkOverlap = checkOverlap;
exports.getMonthlyLeaveDays = getMonthlyLeaveDays;
/**
 * Check if a date is in the future.
 */
function isFutureDate(dateStr) {
    const today = new Date();
    const date = new Date(dateStr);
    return date > today;
}
/**
 * Ensure start date comes before end date.
 */
function isDateRangeValid(start, end) {
    return new Date(start) < new Date(end);
}
/**
 * Calculate number of leave days between two dates.
 * Includes both start and end date.
 */
function calculateLeaveDays(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays + 1;
}
/**
 * Check if the new leave overlaps with any existing approved leaves.
 */
function checkOverlap(newReq, existing) {
    const newStart = new Date(newReq.startDate).getTime();
    const newEnd = new Date(newReq.endDate).getTime();
    return existing.some(req => {
        if (req.status !== 'Approved')
            return false;
        const existingStart = new Date(req.startDate).getTime();
        const existingEnd = new Date(req.endDate).getTime();
        return newStart <= existingEnd && newEnd >= existingStart;
    });
}
/**
 * Sum all approved leave days by a user in a given month and year.
 */
function getMonthlyLeaveDays(name, month, // 0-indexed
year, existing) {
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
