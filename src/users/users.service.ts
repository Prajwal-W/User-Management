import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllByFilters(queryParams: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    id?: number;
  }): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    let firstCondition = true;

    // Apply filters based on the provided object
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        let value = decodeURIComponent(queryParams[key]);
        if (value !== null && value !== undefined) {
          if (firstCondition) {
            if (key === 'firstName' || key === 'lastName') {
              queryBuilder.where(`user.${key} LIKE :${key}`, {
                [key]: `%${value}%`,
              });
            } else {
              queryBuilder.where(`user.${key} = :${key}`, {
                [key]: value,
              });
            }
            firstCondition = false;
          } else {
            if (key === 'firstName' || key === 'lastName') {
              queryBuilder.orWhere(`user.${key} LIKE :${key}`, {
                [key]: `%${value}%`,
              });
            } else {
              queryBuilder.orWhere(`user.${key} = :${key}`, {
                [key]: value,
              });
            }
          }
        }
      }
    }

    return await queryBuilder.getMany();
  }

  async findOne(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.isDeleted) {
        throw new NotFoundException('User deleted');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    try {
      await this.userRepository.update(user, updateUserDto);
      const updatedUser = await this.findOne(id);
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    try {
      await this.userRepository.update(user, { isDeleted: true });
      const updatedUser = await this.findOne(id);
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateDeleteStatus(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.userRepository.update(user, { isDeleted: false });
      const updatedUser = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
