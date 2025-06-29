// prompt.js
const fs = require('fs');
const path = require('path');

module.exports = {
  prompt: ({ prompter }) => {
    return prompter
      .prompt({
        type: 'input',
        name: 'featureName',
        message:
          'What is the name of the feature you want to revoke? (e.g., user, product, order)',
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

        // Build the list of files that would be deleted
        const filesToDelete = [
          // Domain Layer
          `src/domain/entities/${kebabCase}.entity.ts`,
          `src/domain/repositories/${kebabCase}.repository.ts`,
          `src/domain/exceptions/${kebabCase}-not-found.exception.ts`,

          // Application Layer
          `src/application/use-cases/${kebabCase}/create-${kebabCase}.use-case.ts`,
          `src/application/use-cases/${kebabCase}/get-${kebabCase}-by-id.use-case.ts`,

          // Infrastructure Layer - MySQL
          `src/infrastructure/database/mysql/models/${kebabCase}.model.ts`,
          `src/infrastructure/database/mysql/repositories/${kebabCase}.repository.impl.ts`,

          // Infrastructure Layer - MongoDB
          `src/infrastructure/database/mongodb/schemas/${kebabCase}.schema.ts`,
          `src/infrastructure/database/mongodb/repositories/${kebabCase}.repository.impl.ts`,

          // Presentation Layer
          `src/presentation/modules/${kebabCase}/${kebabCase}.controller.ts`,
          `src/presentation/modules/${kebabCase}/${kebabCase}.module.ts`,
          `src/presentation/modules/${kebabCase}/${kebabCase}.module.mysql.ts`,
          `src/presentation/modules/${kebabCase}/${kebabCase}.module.mongodb.ts`,
          `src/presentation/modules/${kebabCase}/dtos/create-${kebabCase}-request.dto.ts`,
          `src/presentation/modules/${kebabCase}/dtos/${kebabCase}-response.dto.ts`,
          `src/presentation/modules/${kebabCase}/dtos/update-${kebabCase}-request.dto.ts`,
        ];

        // Build the list of directories that might need to be deleted
        const dirsToCheck = [
          `src/application/use-cases/${kebabCase}`,
          `src/presentation/modules/${kebabCase}/dtos`,
          `src/presentation/modules/${kebabCase}`,
        ];

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
          filesToDelete,
          dirsToCheck,
        };
      });
  },
};
