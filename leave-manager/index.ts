import readline from 'readline-sync';
import { LeaveService } from './services/LeaveService';
import { isFutureDate, isDateRangeValid, calculateLeaveDays, checkOverlap, getMonthlyLeaveDays } from './utils/validation';

//allows intern to apply for leave 
function applyForLeave() {
  const name = readline.question('Enter your name: ');
  const startDate = readline.question('Enter start date (YYYY-MM-DD): ');
  const endDate = readline.question('Enter end date (YYYY-MM-DD): ');
  const reason = readline.question('Enter reason for leave: ');

  if (!isFutureDate(startDate) || !isFutureDate(endDate)) {
    console.log('Error: Dates must be in the future.');
    return;
  }

  if (!isDateRangeValid(startDate, endDate)) {
    console.log('Error: Start date must be before end date.');
    return;
  }

  const days = calculateLeaveDays(startDate, endDate);
  const allRequests = LeaveService.getAllRequests();

  const overlaps = checkOverlap(
    { id: '', name, startDate, endDate, reason, status: 'Pending' },
    allRequests
  );

  const daysThisMonth = getMonthlyLeaveDays(
    name,
    new Date(startDate).getMonth(),
    new Date(startDate).getFullYear(),
    allRequests
  );

  if (overlaps) {
    console.log('Error: This leave overlaps with an approved leave.');
    return;
  }

  if (daysThisMonth + days > 10) {
    console.log('Error: You have exceeded the 10 leave days allowed this month.');
    return;
  }

  const request = LeaveService.addRequest(name, startDate, endDate, reason);
  console.log('Leave request submitted successfully.');
  console.log(`Request ID: ${request.id}`);
}


//function to list all leave requests
function listLeaveRequests() {
  const requests = LeaveService.getAllRequests();

  if (requests.length === 0) {
    console.log('No leave requests found.');
    return;
  }

  for (const req of requests) {
    console.log(`ID: ${req.id}`);
    console.log(`Name: ${req.name}`);
    console.log(`Dates: ${req.startDate} to ${req.endDate}`);
    console.log(`Status: ${req.status}`);
    console.log(`Reason: ${req.reason}`);
    if (req.rejectionReason) {
      console.log(`Rejection Reason: ${req.rejectionReason}`);
    }
    console.log('----------------------------------------');
  }
}


//function to approve or reject leave requests
function processLeave() {
  const id = readline.question('Enter Leave Request ID to process: ');
  const action = readline.question('Approve or Reject? (A/R): ').toUpperCase();

  if (action === 'A') {
    const updated = LeaveService.updateRequest(id, { status: 'Approved' });
    if (updated) {
      console.log('Leave approved successfully.');
    } else {
      console.log('Error: Leave ID not found.');
    }
  } else if (action === 'R') {
    const reason = readline.question('Enter reason for rejection: ');
    const updated = LeaveService.updateRequest(id, {
      status: 'Rejected',
      rejectionReason: reason
    });
    if (updated) {
      console.log('Leave rejected successfully.');
    } else {
      console.log('Error: Leave ID not found.');
    }
  } else {
    console.log('Invalid action. Please enter A or R.');
  }
}

function mainMenu() {
  console.log('\n KAABO LEAVE MANAGER SYSTEM');
    console.log('---------------------------');
  console.log('1. Apply for Leave');
  console.log('2. List Leave Requests');
  console.log('3. Approve/Reject Leave');
  console.log('4. Exit');

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
    case '4':
      console.log('Exited System.');
      process.exit(0);
    default:
      console.log('Invalid option. Please select a valid menu number.');
  }

  mainMenu(); // Loop again
}

mainMenu();
