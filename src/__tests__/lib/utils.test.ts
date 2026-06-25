import { centsToDisplay, displayToCents, toMonthlyCents } from "@/lib/utils";

describe("centsToDisplay", () => {
  it("converts 999 cents to '9.99'", () => {
    expect(centsToDisplay(999)).toBe("9.99");
  });
  it("converts 1000 cents to '10.00'", () => {
    expect(centsToDisplay(1000)).toBe("10.00");
  });
  it("handles 0 cents", () => {
    expect(centsToDisplay(0)).toBe("0.00");
  });
  it("adds thousands separator for large amounts", () => {
    expect(centsToDisplay(1234567)).toBe("12,345.67");
  });
});

describe("displayToCents", () => {
  it("converts '9.99' to 999", () => {
    expect(displayToCents("9.99")).toBe(999);
  });
  it("converts '10' to 1000", () => {
    expect(displayToCents("10")).toBe(1000);
  });
  it("returns 0 for non-numeric input", () => {
    expect(displayToCents("abc")).toBe(0);
  });
});

describe("toMonthlyCents", () => {
  it("returns same amount for monthly billing", () => {
    expect(toMonthlyCents(999, "monthly")).toBe(999);
  });
  it("divides by 12 for annual billing", () => {
    expect(toMonthlyCents(12000, "annual")).toBe(1000);
  });
  it("rounds to nearest cent for annual", () => {
    expect(toMonthlyCents(999, "annual")).toBe(83); // 999/12 = 83.25 -> 83
  });
});
