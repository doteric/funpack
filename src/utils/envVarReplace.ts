const envVarReplace = (value: string) => {
  let newValue = value;
  for (let i = 0; i < value.length; i++) {
    if (value.substring(i, i + 2) === '${') {
      const stopIndex = value.indexOf('}', i);
      if (stopIndex !== -1) {
        const envVarName = value.substring(i + 2, stopIndex);
        const envVarValue = process.env[envVarName];
        const regex = new RegExp(`\\\${${envVarName}}`, 'g');
        newValue = newValue.replace(regex, envVarValue || '');
      }
    }
  }
  return newValue;
};

export default envVarReplace;
