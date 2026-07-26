import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { Query, DocumentData } from 'firebase-admin/firestore';

@Injectable()
export class TasksService {
  private readonly collection = 'tasks';

  constructor(private firebaseService: FirebaseService) {}

  async create(createTaskDto: CreateTaskDto) {
    const docRef = this.firebaseService.firestore.collection(this.collection).doc();
    const task = {
      id: docRef.id,
      ...createTaskDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await docRef.set(task);
    return task;
  }

  async findAll(timetableId?: string) {
    let query: Query<DocumentData> = this.firebaseService.firestore.collection(this.collection);
    
    if (timetableId) {
      query = query.where('timetableId', '==', timetableId);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => doc.data());
  }

  async findOne(id: string) {
    const doc = await this.firebaseService.firestore.collection(this.collection).doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return doc.data();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const docRef = this.firebaseService.firestore.collection(this.collection).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updates = {
      ...updateTaskDto,
      updatedAt: new Date().toISOString(),
    };
    await docRef.update(updates);
    
    const updatedDoc = await docRef.get();
    return updatedDoc.data();
  }

  async remove(id: string) {
    const docRef = this.firebaseService.firestore.collection(this.collection).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await docRef.delete();
    return { success: true };
  }
}
