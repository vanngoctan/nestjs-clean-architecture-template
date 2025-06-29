# NestJS Clean Architecture Feature Generator

This document provides a comprehensive guide for the automated feature scaffolding system implemented for the NestJS Clean Architecture project using the Hygen code generator.

## Installation

The generator has been installed as a dev dependency and configured in the package.json file with a "generate" script.

```bash
npm install --save-dev hygen
```

## Using the Generator

### Generating a New Feature

To generate a new feature, run:

```bash
npm run generate -- feature new
```

This will prompt you for the feature name and automatically create all necessary files across the different layers of the Clean Architecture.

### Revoking a Feature

If you made a mistake when creating a feature (e.g., typo in the name), you can revoke (delete) all generated files:

```bash
npm run generate -- feature revoke
```

This will prompt you for the feature name to remove and delete all associated files and empty directories.

## Directory Structure

The Hygen generator follows this structure:

```
_templates/
└── feature/
    ├── new/     # For creating new features
    └── revoke/  # For removing mistakenly created features
        ├── prompt.js                      # Prompts for feature name and generates case variations
        ├── domain-entity.ejs.t            # Domain entity template
        ├── domain-repository.ejs.t        # Domain repository interface template
        ├── domain-exception.ejs.t         # Domain exception template
        ├── app-create-use-case.ejs.t      # Application create use case template
        ├── app-get-by-id-use-case.ejs.t   # Application get-by-id use case template
        ├── infra-mysql-model.ejs.t        # MySQL entity model template
        ├── infra-mysql-repository.ejs.t   # MySQL repository implementation template
        ├── infra-mongodb-schema.ejs.t     # MongoDB schema template
        ├── infra-mongodb-repository.ejs.t # MongoDB repository implementation template
        ├── pres-controller.ejs.t          # Presentation controller template
        ├── pres-module.ejs.t              # Generic module template
        ├── pres-module-mysql.ejs.t        # MySQL-specific module template
        ├── pres-module-mongodb.ejs.t      # MongoDB-specific module template
        ├── pres-create-dto.ejs.t          # Create DTO template
        ├── pres-response-dto.ejs.t        # Response DTO template
        └── pres-update-dto.ejs.t          # Update DTO template
    └── revoke/
        ├── prompt.js                      # Prompts for feature name to remove
        ├── delete-files.ejs.t             # Shell script template for Unix-like systems
        └── revoke.ps1.ejs.t               # PowerShell script template for Windows
```

## Generated Files

For a feature named "order", the generator creates:

### Domain Layer

- `src/domain/entities/order.entity.ts`
- `src/domain/repositories/order.repository.ts`
- `src/domain/exceptions/order-not-found.exception.ts`

### Application Layer

- `src/application/use-cases/order/create-order.use-case.ts`
- `src/application/use-cases/order/get-order-by-id.use-case.ts`

### Infrastructure Layer

- `src/infrastructure/database/mysql/models/order.model.ts`
- `src/infrastructure/database/mysql/repositories/order.repository.impl.ts`
- `src/infrastructure/database/mongodb/schemas/order.schema.ts`
- `src/infrastructure/database/mongodb/repositories/order.repository.impl.ts`

### Presentation Layer

- `src/presentation/modules/order/order.controller.ts`
- `src/presentation/modules/order/order.module.ts`
- `src/presentation/modules/order/order.module.mysql.ts`
- `src/presentation/modules/order/order.module.mongodb.ts`
- `src/presentation/modules/order/dtos/create-order-request.dto.ts`
- `src/presentation/modules/order/dtos/order-response.dto.ts`
- `src/presentation/modules/order/dtos/update-order-request.dto.ts`

## Best Practices

This generator implements several best practices:

- Proper separation of concerns between layers
- Clear naming conventions
- Documentation with JSDoc comments
- Type safety with TypeScript
- Support for both MySQL and MongoDB
- Comprehensive error handling
- Swagger integration for API documentation
- Class-validator integration for input validation

## Usage Example

After generating the feature, you will need to:

1. Choose the database implementation by importing the correct module:
   - For MySQL: `import { OrderModule } from './presentation/modules/order/order.module.mysql';`
   - For MongoDB: `import { OrderModule } from './presentation/modules/order/order.module.mongodb';`

2. Add the module to your app module imports:

   ```typescript
   @Module({
     imports: [
       // Other imports
       OrderModule,
     ],
   })
   export class AppModule {}
   ```

3. Customize the generated files to fit your specific business requirements.
