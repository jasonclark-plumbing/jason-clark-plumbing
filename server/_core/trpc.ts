import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { type Request, type Response } from "express";
import { getAdminByEmail } from "../db";

export interface CreateContextOptions {
  req: Request;
  res: Response;
}

export const createContext = async ({ req, res }: CreateContextOptions) => {
  const adminId = (req.session as any)?.adminId;
  const adminEmail = (req.session as any)?.adminEmail;

  let user: { id: number; email: string; role: "admin" } | null = null;

  if (adminId && adminEmail) {
    user = {
      id: adminId,
      email: adminEmail,
      role: "admin",
    };
  }

  return {
    req,
    res,
    user,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
