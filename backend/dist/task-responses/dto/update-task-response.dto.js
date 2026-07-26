"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_task_response_dto_1 = require("./create-task-response.dto");
class UpdateTaskResponseDto extends (0, swagger_1.PartialType)(create_task_response_dto_1.CreateTaskResponseDto) {
}
exports.UpdateTaskResponseDto = UpdateTaskResponseDto;
//# sourceMappingURL=update-task-response.dto.js.map