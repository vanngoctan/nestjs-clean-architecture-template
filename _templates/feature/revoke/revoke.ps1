param(
    [Parameter(Mandatory=$true)]
    [string]$FeatureName
)

Write-Host "Revoking $FeatureName feature..."

# Get the project root directory
$projectRoot = (Get-Location).Path

# Build the list of files to delete
$filesToDelete = @(
    # Domain Layer
    "src\domain\entities\$FeatureName.entity.ts",
    "src\domain\repositories\$FeatureName.repository.ts",
    "src\domain\exceptions\$FeatureName-not-found.exception.ts",
    
    # Application Layer
    "src\application\use-cases\$FeatureName\create-$FeatureName.use-case.ts",
    "src\application\use-cases\$FeatureName\get-$FeatureName-by-id.use-case.ts",
    
    # Infrastructure Layer - MySQL
    "src\infrastructure\database\mysql\models\$FeatureName.model.ts",
    "src\infrastructure\database\mysql\repositories\$FeatureName.repository.impl.ts",
    
    # Infrastructure Layer - MongoDB
    "src\infrastructure\database\mongodb\schemas\$FeatureName.schema.ts",
    "src\infrastructure\database\mongodb\repositories\$FeatureName.repository.impl.ts",
    
    # Presentation Layer
    "src\presentation\modules\$FeatureName\$FeatureName.controller.ts",
    "src\presentation\modules\$FeatureName\$FeatureName.module.ts",
    "src\presentation\modules\$FeatureName\$FeatureName.module.mysql.ts",
    "src\presentation\modules\$FeatureName\$FeatureName.module.mongodb.ts",
    "src\presentation\modules\$FeatureName\dtos\create-$FeatureName-request.dto.ts",
    "src\presentation\modules\$FeatureName\dtos\$FeatureName-response.dto.ts",
    "src\presentation\modules\$FeatureName\dtos\update-$FeatureName-request.dto.ts"
)

# Process each file
foreach ($file in $filesToDelete) {
    $fullPath = Join-Path $projectRoot $file
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "Deleted: $file" -ForegroundColor Green
    } else {
        Write-Host "Not found: $file" -ForegroundColor Yellow
    }
}

# Directories to check and remove if empty
$dirsToCheck = @(
    "src\application\use-cases\$FeatureName",
    "src\presentation\modules\$FeatureName\dtos",
    "src\presentation\modules\$FeatureName"
)

# Process each directory
foreach ($dir in $dirsToCheck) {
    $fullPath = Join-Path $projectRoot $dir
    if (Test-Path $fullPath) {
        $items = Get-ChildItem -Path $fullPath
        if ($items.Count -eq 0) {
            Remove-Item $fullPath -Force
            Write-Host "Removed empty directory: $dir" -ForegroundColor Green
        } else {
            Write-Host "Directory not empty, skipping: $dir" -ForegroundColor Yellow
        }
    }
}

Write-Host "Revoke operation complete for $FeatureName feature." -ForegroundColor Cyan
