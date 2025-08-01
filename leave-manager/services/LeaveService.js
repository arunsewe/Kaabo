"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const filePath = path_1.default.join(__dirname, '../data/leaves.json');
class LeaveService {
    static getAllRequests() {
        if (!fs_1.default.existsSync(filePath))
            return [];
        const data = fs_1.default.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }
    static saveRequests(requests) {
        fs_1.default.writeFileSync(filePath, JSON.stringify(requests, null, 2));
    }
    static addRequest(name, startDate, endDate, reason) {
        const newRequest = {
            id: (0, uuid_1.v4)(),
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
    static updateRequest(id, updates) {
        const requests = this.getAllRequests();
        const index = requests.findIndex(req => req.id === id);
        if (index === -1)
            return null;
        requests[index] = Object.assign(Object.assign({}, requests[index]), updates);
        this.saveRequests(requests);
        return requests[index];
    }
}
exports.LeaveService = LeaveService;
