import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/services/database.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { User } from './models/user.model';
import { ObjectId } from 'mongodb';

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

  public async verifyToken(token: string): Promise<{ valid: boolean; decoded?: any }> {
    return new Promise((resolve) => {
      jwt.verify(token, jwtSecret, {}, (err, decoded) => {
        if (err) resolve({ valid: false });
        else resolve({ valid: true, decoded });
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
    return { user, token };
  }

  public async getUserById(id: string) {
    const user = await this.db.users.findOne<User>({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    return user;
  }
}
