import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import Facility from '../models/facility.model';
import { ApiError } from '../utils/ApiError';
import { availableUserRoles } from '../constants';
import mongoose from 'mongoose';

// declare module 'express' {
//   export interface Request {
//     user?: {
//       name: string;
//       email: string;
//       phone: number;
//       role: 'ADMIN' | 'TRAINER' | 'USER';
//     };
//   }
// }

interface FacilityBodyType {
  name?: string;
  description?: string;
  availability?: boolean;
  location?: string;
  openingHours?: string;
  capacity?: number;
  equipment?: string[];
}

export const getAllFacilities = asyncHandler(async (_, res: Response) => {
  const pipeline = [
    {
      $lookup: {
        from: 'facilities',
        localField: 'equipment',
        foreignField: '_id',
        as: 'equipment',
      },
    },
  ];

  const facilities = await Facility.aggregate(pipeline);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { facilityInfo: facilities },
        'all facilities fetched'
      )
    );
});

export const createFacility = asyncHandler(
  async (req: Request<{}, {}, FacilityBodyType>, res: Response) => {
    const user = req.user;
    const {
      name,
      description,
      availability,
      location,
      openingHours,
      capacity,
      equipment,
    } = req.body;

    if (!user || user.role !== availableUserRoles.ADMIN) {
      throw new ApiError(500, "you don't have access");
    }

    if (
      !name ||
      !description ||
      availability === undefined ||
      !location ||
      !openingHours ||
      capacity === undefined ||
      !equipment
    ) {
      return res
        .status(400)
        .json({ error: 'all required fields must be provided' });
    }

    const newFacility = await Facility.create({
      name,
      description,
      availability,
      location,
      openingHours,
      capacity,
      equipment,
    });

    if (!newFacility) {
      throw new ApiError(500, 'something went worng');
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { facilityInfo: newFacility },
          'facility created successfully'
        )
      );
  }
);

export const deleteAllFacilities = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user || user.role !== availableUserRoles.ADMIN) {
      throw new ApiError(500, "you don't have access");
    }

    const result = await Facility.deleteMany({});

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { facilityInfo: { deletedCount: result.deletedCount } },
          'all facilities deleted'
        )
      );
  }
);

export const getOneFacility = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const pipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'facilities',
          localField: 'equipment',
          foreignField: '_id',
          as: 'equipment',
        },
      },
    ];

    const facility = await Facility.aggregate(pipeline);

    if (!facility) {
      throw new ApiError(404, 'facility not found');
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { facilityInfo: facility }, 'facility fetched')
      );
  }
);

export const updateOneFacility = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const updateData: FacilityBodyType = req.body;

    if (!user || user?.role !== availableUserRoles.ADMIN) {
      throw new ApiError(500, "you don't have access");
    }

    const updatedFacility = await Facility.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedFacility) {
      throw new ApiError(404, 'facility not found');
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { facilityInfo: updatedFacility },
          'facility updated successfully'
        )
      );
  }
);

export const deleteOneFacility = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;

    if (!user || user.role !== availableUserRoles.ADMIN) {
      throw new ApiError(500, "you don't have access");
    }

    const result = await Facility.findByIdAndDelete(id);

    if (!result) {
      throw new ApiError(404, 'facility not found');
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { facilityInfo: result },
          'facility deleted successfully'
        )
      );
  }
);
