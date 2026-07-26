"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTimetableDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_timetable_dto_1 = require("./create-timetable.dto");
class UpdateTimetableDto extends (0, swagger_1.PartialType)(create_timetable_dto_1.CreateTimetableDto) {
}
exports.UpdateTimetableDto = UpdateTimetableDto;
//# sourceMappingURL=update-timetable.dto.js.map