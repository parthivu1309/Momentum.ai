import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class TimetableService {
  private readonly collection = 'timetables';
  private readonly userId = 'default-user'; // Single-user MVP

  constructor(private firebaseService: FirebaseService) {}

  async create(createTimetableDto: CreateTimetableDto) {
    const docRef = this.firebaseService.firestore.collection(this.collection).doc();
    const timetable = {
      id: docRef.id,
      userId: this.userId,
      ...createTimetableDto,
      isActive: createTimetableDto.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await docRef.set(timetable);
    return timetable;
  }

  async findAll() {
    const snapshot = await this.firebaseService.firestore
      .collection(this.collection)
      .where('userId', '==', this.userId)
      .get();
    
    return snapshot.docs.map((doc: any) => doc.data());
  }

  async findOne(id: string) {
    const doc = await this.firebaseService.firestore.collection(this.collection).doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
    return doc.data();
  }

  async update(id: string, updateTimetableDto: UpdateTimetableDto) {
    const docRef = this.firebaseService.firestore.collection(this.collection).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }

    const updates = {
      ...updateTimetableDto,
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
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
    await docRef.delete();
    return { success: true };
  }
}
