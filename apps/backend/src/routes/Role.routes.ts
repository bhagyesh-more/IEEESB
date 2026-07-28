import { Router } from "express";
import { RoleController } from "../controllers/Role.controller";
import { authGuard } from "../middlewares/authGuard";
import { requirePermissions } from "../middlewares/rbacGuard";
import { PERMISSIONS } from "@mmit-ieee/shared";

const router = Router();

router.use(authGuard);
router.use(requirePermissions(PERMISSIONS.ROLES_MANAGE));

router.get("/", RoleController.getRoles);
router.post("/", RoleController.createRole);
router.delete("/:id", RoleController.deleteRole);

export default router;
