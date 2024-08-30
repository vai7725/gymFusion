import { Router } from 'express';
import {
  createEquipment,
  deleteAllEquipment,
  deleteOneEquipment,
  getAllEquipment,
  getOneEquipment,
  updateOneEquipment,
} from '../controllers/equipment.controllers';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Equipment
 *   description: API for managing equipment
 */

/**
 * @swagger
 * /api/equipment:
 *   get:
 *     summary: Get all equipment
 *     tags: [Equipment]
 *     responses:
 *       200:
 *         description: Successfully retrieved all equipment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Equipment ID
 *                   name:
 *                     type: string
 *                     description: Equipment name
 *                   type:
 *                     type: string
 *                     description: Type of equipment
 *                   brand:
 *                     type: string
 *                     description: Brand of the equipment
 *                   purchaseDate:
 *                     type: string
 *                     format: date
 *                     description: Date when the equipment was purchased
 *                   condition:
 *                     type: string
 *                     enum: [NEW, GOOD, FAIR, POOR]
 *                     description: Condition of the equipment
 *                   location:
 *                     type: string
 *                     description: Location of the equipment
 *                   maintenanceSchedule:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: date
 *                     description: List of maintenance dates
 *                   isAvailable:
 *                     type: boolean
 *                     description: Availability status of the equipment
 *   post:
 *     summary: Create new equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Equipment name
 *               type:
 *                 type: string
 *                 description: Type of equipment
 *               brand:
 *                 type: string
 *                 description: Brand of the equipment
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 description: Date when the equipment was purchased
 *               condition:
 *                 type: string
 *                 enum: [NEW, GOOD, FAIR, POOR]
 *                 description: Condition of the equipment
 *               location:
 *                 type: string
 *                 description: Location of the equipment
 *               maintenanceSchedule:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *                 description: List of maintenance dates
 *               isAvailable:
 *                 type: boolean
 *                 description: Availability status of the equipment
 *     responses:
 *       201:
 *         description: Successfully created equipment
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete all equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Successfully deleted all equipment
 *       401:
 *         description: Unauthorized
 */

router
  .route('/')
  .get(getAllEquipment)
  .post(verifyJWT, createEquipment)
  .delete(verifyJWT, deleteAllEquipment);

/**
 * @swagger
 * /api/equipment/{id}:
 *   get:
 *     summary: Get a single piece of equipment
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Equipment ID
 *     responses:
 *       200:
 *         description: Successfully retrieved equipment
 *       404:
 *         description: Equipment not found
 *   put:
 *     summary: Update a single piece of equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Equipment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Equipment name
 *               type:
 *                 type: string
 *                 description: Type of equipment
 *               brand:
 *                 type: string
 *                 description: Brand of the equipment
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 description: Date when the equipment was purchased
 *               condition:
 *                 type: string
 *                 enum: [NEW, GOOD, FAIR, POOR]
 *                 description: Condition of the equipment
 *               location:
 *                 type: string
 *                 description: Location of the equipment
 *               maintenanceSchedule:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *                 description: List of maintenance dates
 *               isAvailable:
 *                 type: boolean
 *                 description: Availability status of the equipment
 *     responses:
 *       200:
 *         description: Successfully updated equipment
 *       404:
 *         description: Equipment not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete a single piece of equipment
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Equipment ID
 *     responses:
 *       204:
 *         description: Successfully deleted equipment
 *       404:
 *         description: Equipment not found
 *       401:
 *         description: Unauthorized
 */

router
  .route('/:id')
  .get(getOneEquipment)
  .put(verifyJWT, updateOneEquipment)
  .delete(verifyJWT, deleteOneEquipment);

export default router;
