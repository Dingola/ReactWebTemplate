[CmdletBinding()]
param(
    [Parameter()]
    [string]$TemplateSource = "gh:Dingola/ReactWebTemplate",

    [Parameter()]
    [string]$ProjectName = (Split-Path -Leaf (Get-Location)),

    [Parameter()]
    [string]$VcsRef
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Assert-CommandAvailable {
    param(
        [Parameter(Mandatory)]
        [string]$Name,

        [Parameter(Mandatory)]
        [string]$InstallationHint
    )

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found. $InstallationHint"
    }
}

function ConvertTo-PackageName {
    param([Parameter(Mandatory)][string]$Value)

    $packageName = $Value.Trim().ToLowerInvariant()
    $packageName = $packageName -replace '[^a-z0-9._-]+', '-'
    $packageName = $packageName.Trim('-', '.', '_')

    if (-not $packageName) {
        throw "The repository directory name cannot be converted to a valid npm package name. Pass -ProjectName explicitly."
    }

    return $packageName
}

function Assert-BootstrapRepository {
    if (-not (Test-Path -LiteralPath ".git" -PathType Container)) {
        throw "Run this script from the root of the repository created with GitHub's 'Use this template' button."
    }

    if (-not (Test-Path -LiteralPath "copier.yml" -PathType Leaf) -or
        -not (Test-Path -LiteralPath "template" -PathType Container)) {
        throw "The Copier bootstrap files are missing or this project has already been initialized."
    }

    if (Test-Path -LiteralPath ".copier-answers.yml" -PathType Leaf) {
        throw "This repository already contains .copier-answers.yml. Use 'copier update' instead."
    }

    if ($ProjectName -notmatch "^[A-Za-z0-9][A-Za-z0-9._-]*$") {
        throw "ProjectName may contain letters, numbers, dots, underscores, and hyphens."
    }

    $pendingChanges = git status --porcelain
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to inspect the Git working tree."
    }
    if ($pendingChanges) {
        throw "The Git working tree must be clean before initialization. Commit or discard pending changes first."
    }
}

Assert-CommandAvailable `
    -Name "git" `
    -InstallationHint "Install Git and make it available through PATH."
Assert-CommandAvailable `
    -Name "copier" `
    -InstallationHint "Install Copier 9 or newer through pipx and restart the terminal. See README.md for details."
Assert-BootstrapRepository

$packageName = ConvertTo-PackageName -Value $ProjectName
$copyArguments = @(
    "copy",
    "--overwrite",
    "--data",
    "project_name=$ProjectName",
    "--data",
    "package_name=$packageName"
)

if ($VcsRef) {
    $copyArguments += @("--vcs-ref", $VcsRef)
}

$copyArguments += @($TemplateSource, ".")

Write-Host "Generating project '$ProjectName' from '$TemplateSource'..."
& copier @copyArguments
if ($LASTEXITCODE -ne 0) {
    throw "Copier failed. The bootstrap files were kept so initialization can be retried."
}

if (-not (Test-Path -LiteralPath ".copier-answers.yml" -PathType Leaf)) {
    throw "Copier completed without creating .copier-answers.yml. Bootstrap files were kept."
}

$bootstrapTemplatePath = (Resolve-Path -LiteralPath "template").Path
$repositoryPath = (Resolve-Path -LiteralPath ".").Path
if (-not $bootstrapTemplatePath.StartsWith(
        $repositoryPath + [System.IO.Path]::DirectorySeparatorChar,
        [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove a template directory outside the repository."
}

Remove-Item -LiteralPath $bootstrapTemplatePath -Recurse -Force
Remove-Item -LiteralPath "copier.yml" -Force
$bootstrapWorkflow = ".github/workflows/validate_template.yml"
if (Test-Path -LiteralPath $bootstrapWorkflow -PathType Leaf) {
    Remove-Item -LiteralPath $bootstrapWorkflow -Force
}

foreach ($bootstrapScript in @("initialize.cmd", "initialize.sh")) {
    if (Test-Path -LiteralPath $bootstrapScript -PathType Leaf) {
        Remove-Item -LiteralPath $bootstrapScript -Force
    }
}

Write-Host ""
Write-Host "Project generation completed successfully."
Write-Host "Install dependencies, review the generated files, and commit them:"
Write-Host ""
$usesPnpm = Select-String -LiteralPath ".copier-answers.yml" -Pattern '^package_manager:\s+pnpm\s*$' -Quiet
if ($usesPnpm) {
    Write-Host "  corepack enable"
    Write-Host "  pnpm install"
    Write-Host "  pnpm check"
}
else {
    Write-Host "  npm install"
    Write-Host "  npm run check"
}
Write-Host "  git status"
Write-Host "  git add ."
Write-Host '  git commit -m "Initialize project from ReactWebTemplate"'
Write-Host "  git push"
Write-Host ""
Write-Host "Future template updates can be applied from a clean working tree with:"
Write-Host ""
Write-Host "  copier update"

Remove-Item -LiteralPath $PSCommandPath -Force
