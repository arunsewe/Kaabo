import fs from 'fs';
import path from 'path';
import { LeaveRequest } from '../models/LeaveRequest';
import { v4 as uuidv4 } from 'uuid';

const filePath = path.join(__dirname, '../data/leaves.json');

export class LeaveService {
  static getAllRequests(): LeaveRequest[] {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as LeaveRequest[];
  }

  static saveRequests(requests: LeaveRequest[]) {
    fs.writeFileSync(filePath, JSON.stringify(requests, null, 2));
  }

  static addRequest(
    name: string,
    startDate: string,
    endDate: string,
    reason: string
  ): LeaveRequest {
    const newRequest: LeaveRequest = {
      id: uuidv4(),
      name,
      startDate,
      endDate,
      reason,
      status: 'Pending',
    };

    const requests = this.getAllRequests();
    requests.push(newRequest);
    this.saveRequests(requests);
    return newRequest;
  }

  static updateRequest(id: string, updates: Partial<LeaveRequest>): LeaveRequest | null {
    const requests = this.getAllRequests();
    const index = requests.findIndex(req => req.id === id);
    if (index === -1) return null;

    requests[index] = { ...requests[index], ...updates };
    this.saveRequests(requests);
    return requests[index];
  }
}
