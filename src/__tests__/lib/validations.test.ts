import { createSubscriptionSchema } from "@/lib/validations/subscription";

describe("createSubscriptionSchema", () => {
  const valid = {
    name: "Netflix",
    category: "Streaming",
    amount: "15.99",
    billingCycle: "monthly",
    renewalDate: "2026-03-01",
  };

  it("accepts valid input and transforms amount to cents", () => {
    const result = createSubscriptionSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(1599);
    }
  });

  it("rejects missing name", () => {
    const result = createSubscriptionSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid amount format", () => {
    const result = createSubscriptionSchema.safeParse({ ...valid, amount: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects negative amount", () => {
    const result = createSubscriptionSchema.safeParse({ ...valid, amount: "-5.00" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid billing cycle", () => {
    const result = createSubscriptionSchema.safeParse({ ...valid, billingCycle: "weekly" });
    expect(result.success).toBe(false);
  });

  it("accepts annual billing cycle", () => {
    const result = createSubscriptionSchema.safeParse({ ...valid, billingCycle: "annual" });
    expect(result.success).toBe(true);
  });

  it("defaults category to Other when not provided", () => {
    const { category: _, ...withoutCategory } = valid;
    const result = createSubscriptionSchema.safeParse(withoutCategory);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.category).toBe("Other");
    }
  });
});
