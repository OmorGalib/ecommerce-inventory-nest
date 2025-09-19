import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.findOne({ where: { id } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.create(userData);
    return this.save(user);
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    await this.update(id, updateData);
    return this.findById(id);
  }

  async deleteUser(id: string): Promise<void> {
    await this.delete(id);
  }

  async userExists(email: string): Promise<boolean> {
    const count = await this.count({ where: { email } });
    return count > 0;
  }
}