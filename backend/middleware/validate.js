import { BadRequestError } from "../utils/ApiError.js";

/**
 * Zod validation middleware factory
 * @param {import("zod").ZodSchema} schema - Zod schema to validate against
 * @param {"body"|"query"|"params"} source - Request property to validate
 */
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return next(new BadRequestError("Validation failed", errors));
    }
    req[source] = result.data;
    next();
  };
};
