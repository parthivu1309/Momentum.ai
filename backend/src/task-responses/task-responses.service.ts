import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskResponseDto } from './dto/create-task-response.dto';
import { UpdateTaskResponseDto } from './dto/update-task-response.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { Query, DocumentData } from 'firebase-admin/firestore';

@Injectable()
export class TaskResponsesService {
  private readonly collection = 'task_responses';
  private readonly userId = 'default-user'; // Single-user MVP

  constructor(private firebaseService: FirebaseService) {}

  async create(createTaskResponseDto: CreateTaskResponseDto) {
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

  async findAll(date?: string) {
    let query: Query<DocumentData> = this.firebaseService.firestore
      .collection(this.collection)
      .where('userId', '==', this.userId);
    
    if (date) {
      query = query.where('date', '==', date);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => doc.data());
  }

  async findOne(id: string) {
    const doc = await this.firebaseService.firestore.collection(this.collection).doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`TaskResponse with ID ${id} not found`);
    }
    return doc.data();
  }

  async update(id: string, updateTaskResponseDto: UpdateTaskResponseDto) {
    const docRef = this.firebaseService.firestore.collection(this.collection).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`TaskResponse with ID ${id} not found`);
    }

    await docRef.update(updateTaskResponseDto as any);
    
    const updatedDoc = await docRef.get();
    return updatedDoc.data();
  }

  async remove(id: string) {
    const docRef = this.firebaseService.firestore.collection(this.collection).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`TaskResponse with ID ${id} not found`);
    }
    await docRef.delete();
    return { success: true };
  }
}
