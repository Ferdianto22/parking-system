/**
 * Validation utilities
 */

export function isValidPlateNumber(plate: string): boolean {
  // Indonesian plate format: 1-2 letters, 1-4 digits, 1-3 letters
  const plateRegex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/i;
  return plateRegex.test(plate.trim());
}

export function normalizePlateNumber(plate: string): string {
  return plate.toUpperCase().replace(/\s+/g, " ").trim();
}
