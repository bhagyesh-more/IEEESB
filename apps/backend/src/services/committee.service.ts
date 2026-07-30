import { ExecutiveCommittee } from "../models/ExecutiveCommittee.model";
import { NotFoundError } from "../errors/AppError";
import { AuditLog } from "../models/AuditLog.model";

export class CommitteeService {
  static async getAllMembers(academicYear?: string, isExecutive?: boolean) {
    const filter: any = {};
    if (academicYear) filter.academicYear = academicYear;
    if (typeof isExecutive === "boolean") filter.isExecutive = isExecutive;

    return ExecutiveCommittee.find(filter).sort({ isExecutive: -1, displayOrder: 1, name: 1 });
  }

  static async createMember(input: any, userId: string, userName?: string) {
    const member = await ExecutiveCommittee.create({
      ...input,
      isExecutive: input.isExecutive ?? true,
      isActive: input.isActive ?? true,
    });

    await AuditLog.create({
      userId,
      userName,
      action: "COMMITTEE_MEMBER_ADDED",
      entity: "ExecutiveCommittee",
      entityId: member._id.toString(),
      changes: input,
    });

    return member;
  }

  static async updateMember(id: string, updates: any, userId: string, userName?: string) {
    const member = await ExecutiveCommittee.findByIdAndUpdate(id, updates, { new: true });
    if (!member) {
      throw new NotFoundError(`Committee member '${id}' not found`);
    }

    await AuditLog.create({
      userId,
      userName,
      action: "COMMITTEE_MEMBER_UPDATED",
      entity: "ExecutiveCommittee",
      entityId: id,
      changes: updates,
    });

    return member;
  }

  static async deleteMember(id: string, userId: string, userName?: string) {
    const member = await ExecutiveCommittee.findByIdAndDelete(id);
    if (!member) {
      throw new NotFoundError(`Committee member '${id}' not found`);
    }

    await AuditLog.create({
      userId,
      userName,
      action: "COMMITTEE_MEMBER_DELETED",
      entity: "ExecutiveCommittee",
      entityId: id,
    });

    return member;
  }
}
