import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/services/database.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { User } from './models/user.model';
import { ObjectId } from 'mongodb';
import { MongoUtils } from 'src/shared/utils/mongo.utils';
import e from 'express';

const SALT_ROUNDS = 10;
const jwtSecret = config.get<string>('jwt.secret');

@Injectable()
export class AuthService {
  constructor(private db: DatabaseService) {}

  public async getToken(user: User): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          uid: user._id,
          email: user.email,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        }
      );
    });
  }

  public async verifyToken(token: string): Promise<{ valid: boolean; user?: User }> {
    return new Promise((resolve) => {
      jwt.verify(token, jwtSecret, {}, async (err, decoded: any) => {
        if (err) resolve({ valid: false });
        else {
          try {
            const queryResult = await this.db.sessions
              .aggregate([
                { $match: { token } },
                ...MongoUtils.buildLookup('users', 'uid', '_id', 'user', true, false),
                { $replaceRoot: { newRoot: '$user' } },
                { $project: { password: 0 } },
              ])
              .toArray();

            if (!queryResult || queryResult.length === 0 || queryResult[0]._id?.toString() !== decoded.uid) {
              resolve({ valid: false });
            } else {
              resolve({ valid: true, user: queryResult[0] });
            }
          } catch (error) {
            console.error(error);
            resolve({ valid: false });
          }
        }
      });
    });
  }

  public async register(user: { email: string; password: string; name: string }) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
    await this.db.users.insertOne({ ...user, discountCodes: [], points: 0 });
  }

  public async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const ex = new BadRequestException('The email or password is invalid');

    if (!email || !password) throw ex;

    const user = await this.db.users.findOne<User>({ email });
    if (!user) throw ex;

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) throw ex;

    const token = await this.getToken(user);
    delete user.password;

    await this.db.sessions.insertOne({
      uid: user._id,
      token,
      created: new Date(),
    });

    return { user, token };
  }

  public async logout(token: string) {
    await this.db.sessions.deleteOne({ token });
  }

  public async getUserById(id: string) {
    const user = await this.db.users.findOne<User>({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    return user;
  }
}
