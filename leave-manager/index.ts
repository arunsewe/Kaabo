import readline from 'readline-sync';
import chalk from 'chalk';
import { LeaveService } from './services/ LeaveService';
import { isFutureDate, isDateRangeValid, calculateLeaveDays, checkOverlap, getMonthlyLeaveDays } from './utils/validation';

//Apply for leave
function applyForLeave() {
  const name = readline.question('Enter your name: ');
  const startDate = readline.question('Enter start date (YYYY-MM-DD): ');
  const endDate = readline.question('Enter end date (YYYY-MM-DD): ');
  const reason = readline.question('Enter reason for leave: ');

  if (!isFutureDate(startDate) || !isFutureDate(endDate)) {
    console.log(chalk.red('Dates must be in the future.'));
    return;
  }

  if (!isDateRangeValid(startDate, endDate)) {
    console.log(chalk.red('Start date must be before end date.'));
    return;
  }

  const days = calculateLeaveDays(startDate, endDate);
  const allRequests = LeaveService.getAllRequests();

  const overlaps = checkOverlap(
    { id: '', name, startDate, endDate, reason, status: 'Pending' },
    allRequests
  );
//  not more than 10 leave days in a month
  const daysThisMonth = getMonthlyLeaveDays(
    name,
    new Date(startDate).getMonth(),
    new Date(startDate).getFullYear(),
    allRequests
  );
// if the leave overlaps with an approved one or exceeded 
  if (overlaps) {
    console.log(chalk.red('This leave overlaps with an approved one.'));
    return;
  }

  if (daysThisMonth + days > 10) {
    console.log(chalk.red('Exceeded 10 leave days for the month.'));
    return;
  }

  const request = LeaveService.addRequest(name, startDate, endDate, reason);
  console.log(chalk.green('Leave request submitted successfully.'));
  console.log(`ID: ${request.id}`);
}

function listLeaveRequests() {
  const requests = LeaveService.getAllRequests();

  if (requests.length === 0) {
    console.log('No leave requests found.');
    return;
  }

  requests.forEach(req => {
    let color = chalk.yellow;
    if (req.status === 'Approved') color = chalk.green;
    if (req.status === 'Rejected') color = chalk.red;

    console.log(color(
      `ID: ${req.id}\nName: ${req.name}\nDates: ${req.startDate} → ${req.endDate}\nStatus: ${req.status}`
    ));
    console.log(chalk.gray(`Reason: ${req.reason}`));
    if (req.rejectionReason) {
      console.log(chalk.red(`Rejection: ${req.rejectionReason}`));
    }
    console.log('-'.repeat(40));
  });
}

function processLeave() {
  const id = readline.question('Enter Leave Request ID: ');
  const action = readline.question('Approve or Reject? (A/R): ').toUpperCase();

  if (action === 'A') {
    const updated = LeaveService.updateRequest(id, { status: 'Approved' });
    if (updated) console.log(chalk.green('Leave approved.'));
    else console.log('Leave ID not found.');
  } else if (action === 'R') {
    const reason = readline.question('Enter reason for rejection: ');
    const updated = LeaveService.updateRequest(id, {
      status: 'Rejected',
      rejectionReason: reason,
    });
    if (updated) console.log(chalk.red('Leave rejected.'));
    else console.log('Leave ID not found.');
  } else {
    console.log('Invalid action.');
  }
}

function mainMenu() {
  console.log('\nKAABO CLI LEAVE SYSTEM');
  console.log('----------------------');
  console.log('1. Apply for Leave');
  console.log('2. List Leave Requests');
  console.log('3. Approve/Reject Leave');
  console.log('4. Exit');

  const choice = readline.question('Select an option: ');

  switch (choice) {
    case '1': applyForLeave(); break;
    case '2': listLeaveRequests(); break;
    case '3': processLeave(); break;
    case '4':
      console.log('Exited');
      process.exit(0);
    default:
      console.log('Invalid option.');
  }

  mainMenu(); // Loop
}

mainMenu();
