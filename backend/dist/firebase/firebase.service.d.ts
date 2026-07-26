import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Firestore } from 'firebase-admin/firestore';
export declare class FirebaseService implements OnModuleInit {
    private configService;
    private readonly logger;
    private app;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    get firestore(): Firestore;
}
