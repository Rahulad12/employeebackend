import express from 'express';
import { createAttendace, getAttendance } from '../controllers/attendanceController.js';
import { auth, isAdmin, isSuperAdmin } from '../middleware/accessMiddleware.js';

const attendanceRouter = express.Router();

attendanceRouter.post('/:id', auth, createAttendace);
attendanceRouter.get('/:id', auth, getAttendance);

export default attendanceRouter;