import { router } from "../trpc";
import { authRouter } from "./auth";
import { commentRouter } from "./comment";
import { postRouter } from "./post";
import { tagRouter } from "./tag";
import { unsplashRouter } from "./unsplash";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  post: postRouter,
  unsplash: unsplashRouter,
  tag: tagRouter,
  user: userRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
