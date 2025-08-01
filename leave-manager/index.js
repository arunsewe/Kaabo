"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
// Step 1: Setup readline and todo array
const readline = require('readline');
const readToUser = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const chalk_1 = __importDefault(require("chalk"));
const LeaveService_1 = require("./services/LeaveService");
const validation_1 = require("./utils/validation");
function applyForLeave() {
    const name = readline.question('Enter your name: ');
    const startDate = readline.question('Enter start date (YYYY-MM-DD): ');
    const endDate = readline.question('Enter end date (YYYY-MM-DD): ');
    const reason = readline.question('Enter reason for leave: ');
    if (!(0, validation_1.isFutureDate)(startDate) || !(0, validation_1.isFutureDate)(endDate)) {
        console.log(chalk_1.default.red('Dates must be in the future.'));
        return;
    }
    if (!(0, validation_1.isDateRangeValid)(startDate, endDate)) {
        console.log(chalk_1.default.red('Start date must be before end date.'));
        return;
    }
    const days = (0, validation_1.calculateLeaveDays)(startDate, endDate);
    const allRequests = LeaveService_1.LeaveService.getAllRequests();
    const overlaps = (0, validation_1.checkOverlap)({ id: '', name, startDate, endDate, reason, status: 'Pending' }, allRequests);
    const daysThisMonth = (0, validation_1.getMonthlyLeaveDays)(name, new Date(startDate).getMonth(), new Date(startDate).getFullYear(), allRequests);
    if (overlaps) {
        console.log(chalk_1.default.red('This leave overlaps with an approved one.'));
        return;
    }
    if (daysThisMonth + days > 10) {
        console.log(chalk_1.default.red('Exceeded 10 leave days for the month.'));
        return;
    }
    const request = LeaveService_1.LeaveService.addRequest(name, startDate, endDate, reason);
    console.log(chalk_1.default.green('Leave request submitted successfully.'));
    console.log(`ID: ${request.id}`);
}
function listLeaveRequests() {
    const requests = LeaveService_1.LeaveService.getAllRequests();
    if (requests.length === 0) {
        console.log(chalk_1.default.gray('No leave requests found.'));
        return;
    }
    requests.forEach(req => {
        let color = chalk_1.default.yellow;
        if (req.status === 'Approved')
            color = chalk_1.default.green;
        if (req.status === 'Rejected')
            color = chalk_1.default.red;
        console.log(color(`ID: ${req.id}\nName: ${req.name}\nDates: ${req.startDate} → ${req.endDate}\nStatus: ${req.status}`));
        console.log(chalk_1.default.gray(`Reason: ${req.reason}`));
        if (req.rejectionReason) {
            console.log(chalk_1.default.red(`Rejection: ${req.rejectionReason}`));
        }
        console.log('-'.repeat(40));
    });
}
function processLeave() {
    const id = readline.question('Enter Leave Request ID: ');
    const action = readline.question('Approve or Reject? (A/R): ').toUpperCase();
    if (action === 'A') {
        const updated = LeaveService_1.LeaveService.updateRequest(id, { status: 'Approved' });
        if (updated)
            console.log(chalk_1.default.green('Leave approved.'));
        else
            console.log(chalk_1.default.red('Leave ID not found.'));
    }
    else if (action === 'R') {
        const reason = readline.question('Enter reason for rejection: ');
        const updated = LeaveService_1.LeaveService.updateRequest(id, {
            status: 'Rejected',
            rejectionReason: reason,
        });
        if (updated)
            console.log(chalk_1.default.red('Leave rejected.'));
        else
            console.log(chalk_1.default.red('Leave ID not found.'));
    }
    else {
        console.log(chalk_1.default.red('Invalid action.'));
    }
}
function mainMenu() {
    console.log(chalk_1.default.cyan('\n=== KAABO CLI LEAVE SYSTEM ==='));
    console.log('1. Apply for Leave');
    console.log('2. List Leave Requests');
    console.log('3. Approve/Reject Leave');
    console.log('0. Exit');
    const choice = readline.question('Select an option: ');
    switch (choice) {
        case '1':
            applyForLeave();
            break;
        case '2':
            listLeaveRequests();
            break;
        case '3':
            processLeave();
            break;
        case '0':
            console.log(chalk_1.default.blue('Exiting...'));
            process.exit(0);
        default:
            console.log(chalk_1.default.red('Invalid option.'));
    }
    mainMenu(); // Loop
}
mainMenu();
