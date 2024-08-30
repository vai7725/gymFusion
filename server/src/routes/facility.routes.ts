import { Router } from 'express';
import {
  createFacility,
  deleteAllFacilities,
  deleteOneFacility,
  getAllFacilities,
  getOneFacility,
  updateOneFacility,
} from '../controllers/facility.controllers';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Facility:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - location
 *         - openingHours
 *         - capacity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the facility
 *         name:
 *           type: string
 *           description: The name of the facility
 *         description:
 *           type: string
 *           description: A description of the facility
 *         availability:
 *           type: boolean
 *           description: The availability status of the facility
 *           default: true
 *         location:
 *           type: string
 *           description: The location of the facility
 *         openingHours:
 *           type: string
 *           description: The opening hours of the facility
 *         capacity:
 *           type: number
 *           description: The capacity of the facility
 *         equipment:
 *           type: array
 *           items:
 *             type: string
 *           description: List of equipment IDs associated with the facility
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         name: Gym Room 1
 *         description: A fully equipped gym facility.
 *         availability: true
 *         location: "123 Main St"
 *         openingHours: "06:00 AM - 10:00 PM"
 *         capacity: 50
 *         equipment: ["60d0fe4f5311236168a109aa", "60d0fe4f5311236168a109ab"]
 */

/**
 * @swagger
 * /api/facilities:
 *   get:
 *     summary: Get all facilities
 *     tags: [Facilities]
 *     responses:
 *       200:
 *         description: List of all facilities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Facility'
 *   post:
 *     summary: Create a new facility
 *     tags: [Facilities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Facility'
 *     responses:
 *       201:
 *         description: Facility created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Facility'
 *       400:
 *         description: Bad request
 *   delete:
 *     summary: Delete all facilities
 *     tags: [Facilities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: All facilities deleted successfully
 *       400:
 *         description: Bad request
 */

router
  .route('/')
  .get(getAllFacilities)
  .post(verifyJWT, createFacility)
  .delete(verifyJWT, deleteAllFacilities);

/**
 * @swagger
 * /api/facilities/{id}:
 *   get:
 *     summary: Get a facility by ID
 *     tags: [Facilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the facility
 *     responses:
 *       200:
 *         description: The requested facility
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Facility'
 *       404:
 *         description: Facility not found
 *   put:
 *     summary: Update a facility by ID
 *     tags: [Facilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the facility
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Facility'
 *     responses:
 *       200:
 *         description: Facility updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Facility'
 *       404:
 *         description: Facility not found
 *   delete:
 *     summary: Delete a facility by ID
 *     tags: [Facilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the facility
 *     responses:
 *       204:
 *         description: Facility deleted successfully
 *       404:
 *         description: Facility not found
 */

router
  .route('/:id')
  .get(getOneFacility)
  .put(verifyJWT, updateOneFacility)
  .delete(verifyJWT, deleteOneFacility);

export default router;
