// prompt.js
module.exports = {
  prompt: ({ prompter }) => {
    return prompter
      .prompt({
        type: 'input',
        name: 'featureName',
        message:
          'What is the name of your feature? (e.g., user, product, order)',
      })
      .then(({ featureName }) => {
        // Generate different case variations
        const camelCase =
          featureName.charAt(0).toLowerCase() + featureName.slice(1);
        const pascalCase =
          featureName.charAt(0).toUpperCase() + featureName.slice(1);
        const kebabCase = featureName
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .replace(/\s+/g, '-')
          .toLowerCase();
        const snakeCase = kebabCase.replace(/-/g, '_');

        // Generate plurals (simple approach)
        const camelCasePlural = camelCase + 's';
        const pascalCasePlural = pascalCase + 's';
        const kebabCasePlural = kebabCase + 's';
        const snakeCasePlural = snakeCase + 's';

        return {
          featureName,
          camelCase,
          pascalCase,
          kebabCase,
          snakeCase,
          camelCasePlural,
          pascalCasePlural,
          kebabCasePlural,
          snakeCasePlural,
          timestamp: new Date().toISOString(),
        };
      });
  },
};
