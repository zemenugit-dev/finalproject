
import { Router } from 'express';

import {
  listInspections,
  getInspection,
  createInspection,
  updateInspection,
  replaceInspection,
  deleteInspection,
} from './inspections.controller';

const router = Router();

router.get('/', listInspections);
router.get('/:id', getInspection);
router.post('/', createInspection);
router.patch('/:id', updateInspection);
router.put('/:id', replaceInspection);
router.delete('/:id', deleteInspection);

export default router;

