$ErrorActionPreference = 'Stop'
$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$artifactRoot = Join-Path $packageRoot 'artifacts'
New-Item -ItemType Directory -Path $artifactRoot -Force | Out-Null
Add-Type -AssemblyName System.IO.Compression
$deployOutput = Join-Path $artifactRoot 'anthroprime-netlify.zip'
$deployRoot = (Resolve-Path (Join-Path $packageRoot 'dist')).Path
$deployStream = [System.IO.File]::Open($deployOutput, [System.IO.FileMode]::Create)
$deployArchive = [System.IO.Compression.ZipArchive]::new($deployStream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($file in (Get-ChildItem -LiteralPath $deployRoot -File -Recurse)) {
        $entryName = $file.FullName.Substring($deployRoot.Length + 1).Replace('\', '/')
        $entry = $deployArchive.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
        $entryStream = $entry.Open()
        $inputStream = [System.IO.File]::OpenRead($file.FullName)
        try { $inputStream.CopyTo($entryStream) } finally { $inputStream.Dispose(); $entryStream.Dispose() }
    }
} finally { $deployArchive.Dispose(); $deployStream.Dispose() }

$sourceOutput = Join-Path $artifactRoot 'anthroprime-source.zip'
$zipStream = [System.IO.File]::Open($sourceOutput, [System.IO.FileMode]::Create)
$sourceArchive = [System.IO.Compression.ZipArchive]::new($zipStream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    $sourceItems = @('content', 'web', 'tools', 'original', 'package.json', 'package-lock.json', 'netlify.toml', 'README.md', 'DEVELOPMENT-PLAN.md', 'PROFESSIONAL-REVIEW.md', '.gitignore')
    foreach ($item in $sourceItems) {
        $itemPath = Join-Path $packageRoot $item
        $files = if (Test-Path -LiteralPath $itemPath -PathType Container) { Get-ChildItem -LiteralPath $itemPath -File -Recurse | Where-Object { $_.FullName -notmatch '[\\/]node_modules[\\/]' } } else { Get-Item -LiteralPath $itemPath }
        foreach ($file in $files) {
            $relativeName = $file.FullName.Substring($packageRoot.Length + 1).Replace('\', '/')
            $entry = $sourceArchive.CreateEntry($relativeName, [System.IO.Compression.CompressionLevel]::Optimal)
            $entryStream = $entry.Open()
            $inputStream = [System.IO.File]::OpenRead($file.FullName)
            try { $inputStream.CopyTo($entryStream) } finally { $inputStream.Dispose(); $entryStream.Dispose() }
        }
    }
} finally { $sourceArchive.Dispose(); $zipStream.Dispose() }
Get-Item -LiteralPath $deployOutput, $sourceOutput | Select-Object FullName, Length
