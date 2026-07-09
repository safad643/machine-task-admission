import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { assertCanTransition } from '../common/utils/status-transition.util.js';
import {
  Student,
  StudentDocument,
  StudentStatus,
} from '../students/students.schema.js';
import { BookExamSlotDto } from './dto/book-exam-slot.dto.js';
import { CreateExamSlotDto } from './dto/create-exam-slot.dto.js';
import { ExamSlot, ExamSlotDocument } from './exam-slots.schema.js';

@Injectable()
export class ExamSlotsService {
  constructor(
    @InjectModel(ExamSlot.name)
    private readonly examSlotModel: Model<ExamSlotDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async create(dto: CreateExamSlotDto): Promise<ExamSlotDocument> {
    const slot = new this.examSlotModel({
      startTime: new Date(dto.startTime),
      capacity: dto.capacity,
      bookedCount: 0,
    });

    return slot.save();
  }

  async findAvailable(): Promise<ExamSlotDocument[]> {
    return this.examSlotModel
      .find({ $expr: { $lt: ['$bookedCount', '$capacity'] } })
      .sort({ startTime: 1 })
      .exec();
  }

  async findAll(): Promise<ExamSlotDocument[]> {
    return this.examSlotModel.find().sort({ startTime: 1 }).exec();
  }

  async bookSlot(
    slotId: string,
    dto: BookExamSlotDto,
    parentId: string,
  ): Promise<StudentDocument> {
    const studentObjectId = new Types.ObjectId(dto.studentId);

    const student = await this.studentModel.findById(studentObjectId).exec();
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.parentId.toString() !== parentId) {
      throw new ForbiddenException('You do not have access to this student');
    }

    if (student.slotId) {
      throw new ConflictException('Student already has a booked slot');
    }

    assertCanTransition(student.status, StudentStatus.SLOT_BOOKED);

    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      const slotObjectId = new Types.ObjectId(slotId);

      const updatedSlot = await this.examSlotModel
        .findOneAndUpdate(
          {
            _id: slotObjectId,
            $expr: { $lt: ['$bookedCount', '$capacity'] },
          },
          { $inc: { bookedCount: 1 } },
          { new: true, session },
        )
        .exec();

      if (!updatedSlot) {
        throw new ConflictException('Slot is full or does not exist');
      }

      const updatedStudent = await this.studentModel
        .findOneAndUpdate(
          {
            _id: studentObjectId,
            slotId: null,
            status: StudentStatus.REGISTRATION_FEE_PAID,
          },
          {
            $set: {
              slotId: slotObjectId,
              status: StudentStatus.SLOT_BOOKED,
            },
          },
          { new: true, session },
        )
        .exec();

      if (!updatedStudent) {
        throw new ConflictException(
          'Student is not eligible for booking or already has a slot',
        );
      }

      await session.commitTransaction();
      return updatedStudent;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async remove(id: string): Promise<void> {
    const slot = await this.examSlotModel.findById(id).exec();
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (slot.bookedCount > 0) {
      throw new ConflictException('Slot has bookings and cannot be deleted');
    }

    await this.examSlotModel.findByIdAndDelete(id).exec();
  }
}
