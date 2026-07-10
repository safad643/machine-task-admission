import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { assertCanTransition } from '../common/utils/status-transition.util.js';
import {
  Course,
  Student,
  StudentDocument,
  StudentStatus,
} from '../students/students.schema.js';

@Injectable()
export class AdmissionService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async findAll(
    status?: StudentStatus,
    limit?: number,
    sort?: string,
  ): Promise<StudentDocument[]> {
    if (status && !Object.values(StudentStatus).includes(status)) {
      throw new BadRequestException('Invalid status filter');
    }

    const filter: Partial<Record<string, StudentStatus>> = {};
    if (status) {
      filter.status = status;
    }

    const sortOption = this.parseSort(sort);

    const query = this.studentModel
      .find(filter)
      .populate('slotId')
      .sort(sortOption);

    if (limit && limit > 0) {
      query.limit(limit);
    }

    return query.exec();
  }

  private parseSort(sort?: string): Record<string, 1 | -1> {
    if (!sort) {
      return { createdAt: -1 };
    }

    const [field, direction] = sort.split(':');
    const allowedFields = ['createdAt', 'updatedAt'];
    const allowedDirections: Record<string, 1 | -1> = {
      asc: 1,
      desc: -1,
    };

    if (
      !allowedFields.includes(field) ||
      !(direction in allowedDirections)
    ) {
      throw new BadRequestException('Invalid sort parameter');
    }

    return { [field]: allowedDirections[direction] };
  }

  async findOne(id: string): Promise<StudentDocument> {
    const student = await this.studentModel
      .findById(id)
      .populate('slotId')
      .exec();

    if (!student) {
      throw new NotFoundException('Application not found');
    }

    return student;
  }

  async enterScore(id: string, score: number): Promise<StudentDocument> {
    const student = await this.studentModel.findById(id).exec();

    if (!student) {
      throw new NotFoundException('Application not found');
    }

    assertCanTransition(student.status, StudentStatus.EXAM_COMPLETED);

    const updated = await this.studentModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), status: StudentStatus.SLOT_BOOKED },
        {
          $set: {
            examScore: score,
            status: StudentStatus.EXAM_COMPLETED,
          },
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Application not found');
    }

    return updated;
  }

  async assignCourse(id: string, course: Course): Promise<StudentDocument> {
    const student = await this.studentModel.findById(id).exec();

    if (!student) {
      throw new NotFoundException('Application not found');
    }

    assertCanTransition(student.status, StudentStatus.ADMISSION_COMPLETED);

    const updated = await this.studentModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          status: StudentStatus.EXAM_COMPLETED,
        },
        {
          $set: {
            assignedCourse: course,
            status: StudentStatus.ADMISSION_COMPLETED,
          },
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Application not found');
    }

    return updated;
  }
}
