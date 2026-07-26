"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const reports_controller_1 = require("./reports.controller");
const ai_report_service_1 = require("./ai-report.service");
const tasks_module_1 = require("../tasks/tasks.module");
const task_responses_module_1 = require("../task-responses/task-responses.module");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [tasks_module_1.TasksModule, task_responses_module_1.TaskResponsesModule],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService, ai_report_service_1.AiReportService],
        exports: [reports_service_1.ReportsService, ai_report_service_1.AiReportService]
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map