import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import Facility from '../models/facility.model';
import { ApiError } from '../utils/ApiError';
import { availableUserRoles, AvailableUserRoles } from '../constants';
import Equipment from '../models/equipment.model';

// declare module 'express' {
//   export interface Request {
//     user?: {
//       name: string;
//       email: string;
//       phone: number;
//       role: AvailableUserRoles;
//     };
//   }
// }

interface EquipmentBodyType {
  name?: string;
  type?: string;
  brand: string;
  purchaseDate?: Date;
  condition?: 'NEW' | 'GOOD' | 'FAIR' | 'POOR';
  location?: string;
  maintenanceSchedule?: Date[];
  isAvailable?: boolean;
}

export const getAllEquipment = asyncHandler(async (_, res: Response) => {
  const equipments = await Equipment.find({});

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { equipmentInfo: equipments },
        'all equipments fetched'
      )
    );
});

export const createEquipment = asyncHandler(
  async (req: Request<{}, {}, EquipmentBodyType>, res: Response) => {
    const user = req.user;
    const {
      name,
      type,
      brand,
      purchaseDate,
      condition,
      location,
      maintenanceSchedule,
      isAvailable,
    } = req.body;

    if (!user || user.role !== availableUserRoles.ADMIN) {
      throw new ApiError(500, "you don't have access");
    }

    if (
      !name ||
      !type ||
      !brand ||
      !purchaseDate ||
      !condition ||
      !location ||
      !maintenanceSchedule ||
      !isAvailable
    ) {
      return res
        .status(400)
        .json({ error: 'all required fields must be provided' });
    }

    const newEquipment = await Equipment.create(req.body);

    if (!newEquipment) {
      throw new ApiError(500, 'something went worng');
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { equipmentInfo: newEquipment },
          'equipment created successfully'
        )
      );
  }
);

export const deleteAllEquipment = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user || user.role !== availableUserRoles.ADMIN) {
      throw new ApiError(500, "you don't have access");
    }

    const result = await Equipment.deleteMany({});

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { equipmentInfo: { deletedCount: result.deletedCount } },
          'all equipment deleted'
        )
      );
  }
);

export const getOneEquipment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);

    if (!equipment) {
      throw new ApiError(404, 'equipment not found');
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { equipmentInfo: equipment },
          'equipment data fetched'
        )
      );
  }
);

export const updateOneEquipment = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const updateData: EquipmentBodyType = req.body;

    if (!user || user.role !== availableUserRoles.ADMIN) {
      throw new ApiError(500, "you don't have access");
    }

    const updatedEquipment = await Equipment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEquipment) {
      throw new ApiError(404, 'equipment not found');
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { equipmentInfo: updatedEquipment },
          'equipment updated successfully'
        )
      );
  }
);

export const deleteOneEquipment = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;

    if (!user || user.role !== availableUserRoles.ADMIN) {
      throw new ApiError(500, "you don't have access");
    }

    const result = await Equipment.findByIdAndDelete(id);

    if (!result) {
      throw new ApiError(404, 'equipment not found');
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { equipmentInfo: result },
          'equipment deleted successfully'
        )
      );
  }
);
