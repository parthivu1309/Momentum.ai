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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskResponsesService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let TaskResponsesService = class TaskResponsesService {
    firebaseService;
    collection = 'task_responses';
    userId = 'default-user';
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async create(createTaskResponseDto) {
        const docRef = this.firebaseService.firestore.collection(this.collection).doc();
        const response = {
            id: docRef.id,
            userId: this.userId,
            ...createTaskResponseDto,
            createdAt: new Date().toISOString(),
        };
        await docRef.set(response);
        return response;
    }
    async findAll(date) {
        let query = this.firebaseService.firestore
            .collection(this.collection)
            .where('userId', '==', this.userId);
        if (date) {
            query = query.where('date', '==', date);
        }
        const snapshot = await query.get();
        return snapshot.docs.map((doc) => doc.data());
    }
    async findOne(id) {
        const doc = await this.firebaseService.firestore.collection(this.collection).doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`TaskResponse with ID ${id} not found`);
        }
        return doc.data();
    }
    async update(id, updateTaskResponseDto) {
        const docRef = this.firebaseService.firestore.collection(this.collection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`TaskResponse with ID ${id} not found`);
        }
        await docRef.update(updateTaskResponseDto);
        const updatedDoc = await docRef.get();
        return updatedDoc.data();
    }
    async remove(id) {
        const docRef = this.firebaseService.firestore.collection(this.collection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`TaskResponse with ID ${id} not found`);
        }
        await docRef.delete();
        return { success: true };
    }
};
exports.TaskResponsesService = TaskResponsesService;
exports.TaskResponsesService = TaskResponsesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], TaskResponsesService);
//# sourceMappingURL=task-responses.service.js.map