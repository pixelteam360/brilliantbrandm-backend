import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { ProfileRoutes } from "../modules/Profile/profile.routes";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/profiles",
    route: ProfileRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
