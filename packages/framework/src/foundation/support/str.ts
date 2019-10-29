

export class Str {
  /**
   * Capitalizes the first letter of a single string
   * @param str
   */
  static upperCamelCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
}