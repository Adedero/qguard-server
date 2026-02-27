// Helper functions for error messages
export function setMissingVariableErrorMessage(name: string): string {
  return `Environment variable '${name}' is not set.`;
}

export function setInvalidVariableErrorMessage(name: string): string {
  return `Environment variable' ${name}' is not valid.`;
}

export function setInvalidEnumErrorMessage(name: string, enumArray: Array<unknown>): string {
  const values = enumArray.map(String);

  let valuesStr = "";

  const formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "disjunction"
  });
  valuesStr = formatter.format(values);

  return `Environment variable '${name}' must have a value of ${valuesStr}`;
}
