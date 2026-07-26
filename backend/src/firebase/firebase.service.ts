import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app: App;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn('Firebase credentials not fully provided in environment variables.');
    }

    if (!getApps().length) {
      try {
        this.app = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        try {
          getFirestore(this.app).settings({ ignoreUndefinedProperties: true });
        } catch (e) {}
        this.logger.log('Firebase Admin initialized successfully.');
      } catch (error) {
        this.logger.error('Failed to initialize Firebase Admin', error);
      }
    } else {
      this.app = getApp();
      try {
        getFirestore(this.app).settings({ ignoreUndefinedProperties: true });
      } catch (e) {}
    }
  }

  get firestore(): Firestore {
    return getFirestore(this.app);
  }
}
