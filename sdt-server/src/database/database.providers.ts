import * as mongoose from 'mongoose';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> =>
            mongoose.connect('mongodb://' + process.env.MONGODB_HOST || 'localhost' + '/' + process.env.MONGODB_DATABASE || 'sdf'),
    },
];
