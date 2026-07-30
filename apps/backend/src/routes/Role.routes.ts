import { Router } from "express";
import { RoleController } from "../controllers/Role.controller";
import { authGuard } from "../middlewares/authGuard";
import { requirePermissions } from "../middlewares/rbacGuard";
import { PERMISSIONS } from "@mmit-ieee/shared";

const router = Router();

router.use(authGuard);
router.use(requirePermissions(PERMISSIONS.ROLES_MANAGE));

router.get("/", RoleController.getRoles);
router.get("/users", RoleController.getUsers);
router.post("/", RoleController.createRole);
router.post("/assign-user", RoleController.assignUserRole);
router.delete("/:id", RoleController.deleteRole);

export default router;
