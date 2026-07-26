import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { Query, DocumentData } from 'firebase-admin/firestore';

@Injectable()
export class ReportsService {
  private readonly collection = 'reports';
  private readonly userId = 'default-user'; // Single-user MVP

  constructor(private firebaseService: FirebaseService) {}

  async create(createReportDto: CreateReportDto) {
    const docRef = this.firebaseService.firestore.collection(this.collection).doc();
    const report = {
      id: docRef.id,
      userId: this.userId,
      ...createReportDto,
      createdAt: new Date().toISOString(),
    };
    await docRef.set(report);
    return report;
  }

  async findAll(type?: string) {
    let query: Query<DocumentData> = this.firebaseService.firestore
      .collection(this.collection)
      .where('userId', '==', this.userId);
    
    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => doc.data());
  }

  async findOne(id: string) {
    const doc = await this.firebaseService.firestore.collection(this.collection).doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return doc.data();
  }
}
