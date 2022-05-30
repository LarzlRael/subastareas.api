export function capitalizeFirstLetter(string): string {
  if (string.length === 0 || string == null) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}
