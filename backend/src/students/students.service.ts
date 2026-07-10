import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { assertCanTransition } from '../common/utils/status-transition.util.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { Student, StudentDocument, StudentStatus } from './students.schema.js';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async create(
    dto: CreateStudentDto,
    parentId: string,
  ): Promise<StudentDocument> {
    const student = new this.studentModel({
      ...dto,
      dateOfBirth: new Date(dto.dateOfBirth),
      parentId: new Types.ObjectId(parentId),
      status: StudentStatus.APPLICATION_CREATED,
      feePaid: false,
      examScore: null,
      assignedCourse: null,
      slotId: null,
    });

    return student.save();
  }

  async findAllByParent(
    parentId: string,
    limit?: number,
  ): Promise<StudentDocument[]> {
    const query = this.studentModel
      .find({ parentId: new Types.ObjectId(parentId) })
      .populate('slotId')
      .sort({ createdAt: -1 });

    if (limit && limit > 0) {
      query.limit(limit);
    }

    return query.exec();
  }

  async findByIdAndParent(
    id: string,
    parentId: string,
  ): Promise<StudentDocument> {
    const student = await this.studentModel
      .findById(id)
      .populate('slotId')
      .exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.parentId.toString() !== parentId) {
      throw new ForbiddenException('You do not have access to this student');
    }

    return student;
  }

  async update(
    id: string,
    dto: UpdateStudentDto,
    parentId: string,
  ): Promise<StudentDocument> {
    const student = await this.findByIdAndParent(id, parentId);

    if (student.feePaid) {
      throw new ForbiddenException(
        'Student details cannot be edited after registration fee is paid',
      );
    }

    const updatePayload: Partial<Student> = {};
    if (dto.studentName !== undefined) {
      updatePayload.studentName = dto.studentName;
    }
    if (dto.dateOfBirth !== undefined) {
      updatePayload.dateOfBirth = new Date(dto.dateOfBirth);
    }
    if (dto.gender !== undefined) {
      updatePayload.gender = dto.gender;
    }
    if (dto.previousSchool !== undefined) {
      updatePayload.previousSchool = dto.previousSchool;
    }
    if (dto.applyingGrade !== undefined) {
      updatePayload.applyingGrade = dto.applyingGrade;
    }

    const updated = await this.studentModel
      .findByIdAndUpdate(id, { $set: updatePayload }, { new: true })
      .populate('slotId')
      .exec();

    if (!updated) {
      throw new NotFoundException('Student not found');
    }

    return updated;
  }

  async payRegistrationFee(
    id: string,
    parentId: string,
  ): Promise<StudentDocument> {
    const student = await this.findByIdAndParent(id, parentId);

    assertCanTransition(student.status, StudentStatus.REGISTRATION_FEE_PAID);

    const updated = await this.studentModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        {
          $set: {
            feePaid: true,
            status: StudentStatus.REGISTRATION_FEE_PAID,
          },
        },
        { new: true },
      )
      .populate('slotId')
      .exec();

    if (!updated) {
      throw new NotFoundException('Student not found');
    }

    return updated;
  }
}
