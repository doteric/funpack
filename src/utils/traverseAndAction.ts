type ValueType = string | object | number | any[] | null;
type ObjectType = Record<string, ValueType>;

const isObject = (value: unknown): boolean => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true;
  }
  return false;
};

const traverseAndAction = (
  input: ValueType,
  actionOnString: (value: string) => string
): ValueType => {
  if (typeof input === 'string') {
    return actionOnString(input);
  } else if (typeof input === 'number') {
    return input;
  } else if (Array.isArray(input)) {
    return input.map((arrayValue) =>
      traverseAndAction(arrayValue, actionOnString)
    );
  } else if (isObject(input)) {
    const newObject: ObjectType = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const element = (input as ObjectType)[key];
        newObject[key] = traverseAndAction(element, actionOnString);
      }
    }
    return newObject;
  }

  return null;
};

export default traverseAndAction;
