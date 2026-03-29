import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    number: z.string().regex(/^\d{10,}$/, "Phone number must be at least 10 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    role: z.enum(["admin", "user"] as const, {
      error: "Please select a role",
    }),
    accessKey: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "admin") {
        return data.accessKey === "1234";
      }
      return true;
    },
    {
      message: "Invalid admin access key",
      path: ["accessKey"],
    }
  );

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type SignupValues = z.infer<typeof signupSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
