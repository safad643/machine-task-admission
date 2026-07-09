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

  async findAll(status?: StudentStatus): Promise<StudentDocument[]> {
    if (status && !Object.values(StudentStatus).includes(status)) {
      throw new BadRequestException('Invalid status filter');
    }

    const filter: Partial<Record<string, StudentStatus>> = {};
    if (status) {
      filter.status = status;
    }

    return this.studentModel
      .find(filter)
      .populate('slotId')
      .sort({ createdAt: -1 })
      .exec();
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
