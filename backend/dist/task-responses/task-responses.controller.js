"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskResponsesController = void 0;
const common_1 = require("@nestjs/common");
const task_responses_service_1 = require("./task-responses.service");
const create_task_response_dto_1 = require("./dto/create-task-response.dto");
const update_task_response_dto_1 = require("./dto/update-task-response.dto");
const swagger_1 = require("@nestjs/swagger");
let TaskResponsesController = class TaskResponsesController {
    taskResponsesService;
    constructor(taskResponsesService) {
        this.taskResponsesService = taskResponsesService;
    }
    create(createTaskResponseDto) {
        return this.taskResponsesService.create(createTaskResponseDto);
    }
    findAll(date) {
        return this.taskResponsesService.findAll(date);
    }
    findOne(id) {
        return this.taskResponsesService.findOne(id);
    }
    update(id, updateTaskResponseDto) {
        return this.taskResponsesService.update(id, updateTaskResponseDto);
    }
    remove(id) {
        return this.taskResponsesService.remove(id);
    }
};
exports.TaskResponsesController = TaskResponsesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Record a behavioural event (completed, missed, etc)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_response_dto_1.CreateTaskResponseDto]),
    __metadata("design:returntype", void 0)
], TaskResponsesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all task responses, optionally filtered by date' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false }),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaskResponsesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific task response by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaskResponsesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a specific task response' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_response_dto_1.UpdateTaskResponseDto]),
    __metadata("design:returntype", void 0)
], TaskResponsesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a task response' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaskResponsesController.prototype, "remove", null);
exports.TaskResponsesController = TaskResponsesController = __decorate([
    (0, swagger_1.ApiTags)('TaskResponses'),
    (0, common_1.Controller)('task-responses'),
    __metadata("design:paramtypes", [task_responses_service_1.TaskResponsesService])
], TaskResponsesController);
//# sourceMappingURL=task-responses.controller.js.map