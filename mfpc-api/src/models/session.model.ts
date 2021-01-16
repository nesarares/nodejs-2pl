import { ObjectId } from 'mongodb';

export interface Session {
  _id?: string | ObjectId;
  uid: string;
  token: string;
  created: Date;
}
