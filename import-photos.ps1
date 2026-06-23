# One-click photo import for BILLI birthday site
# Select ALL your photos at once in the file picker (hold Ctrl to multi-select)

Add-Type -AssemblyName System.Windows.Forms

$billiDir = Join-Path $PSScriptRoot "assets\photos\billi"
$meDir    = Join-Path $PSScriptRoot "assets\photos\me"
New-Item -ItemType Directory -Force -Path $billiDir, $meDir | Out-Null

$billiNames = @(
  "01-childhood.jpg",
  "02-restaurant.jpg",
  "03-siblings.jpg",
  "04-aesthetic.jpg",
  "05-white-hearts.jpg",
  "06-flower-filter.jpg",
  "07-blazer.jpg",
  "08-with-baby.jpg",
  "09-calligraphy.jpg",
  "10-mirror.jpg",
  "11-blue-polo.jpg",
  "12-pout.jpg",
  "13-sleeping.jpg",
  "14-red-sari.jpg",
  "15-stairs.jpg"
)

$meNames = @(
  "01-motorcycle.jpg",
  "02-outdoors.jpg",
  "03-bike-angle.jpg"
)

$dialog = New-Object System.Windows.Forms.OpenFileDialog
$dialog.Title = "Select ALL photos for BILLI's site (Billi photos first, then yours)"
$dialog.Filter = "Images|*.jpg;*.jpeg;*.png;*.webp"
$dialog.Multiselect = $true

if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) {
  Write-Host "Cancelled."
  exit 1
}

$files = @($dialog.FileNames)
$needed = $billiNames.Count + $meNames.Count

if ($files.Count -lt $needed) {
  [System.Windows.Forms.MessageBox]::Show(
    "Please select at least $needed photos.`nYou selected $($files.Count).",
    "Not enough photos",
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Warning
  ) | Out-Null
  exit 1
}

for ($i = 0; $i -lt $billiNames.Count; $i++) {
  $dest = Join-Path $billiDir $billiNames[$i]
  Copy-Item -Path $files[$i] -Destination $dest -Force
  Write-Host "Billi: $($billiNames[$i])"
}

for ($i = 0; $i -lt $meNames.Count; $i++) {
  $srcIndex = $billiNames.Count + $i
  $dest = Join-Path $meDir $meNames[$i]
  Copy-Item -Path $files[$srcIndex] -Destination $dest -Force
  Write-Host "ASH: $($meNames[$i])"
}

[System.Windows.Forms.MessageBox]::Show(
  "Done! $($billiNames.Count) BILLI photos + $($meNames.Count) ASH photos imported.`nOpen index.html and refresh.",
  "Photos imported!",
  [System.Windows.Forms.MessageBoxButtons]::OK,
  [System.Windows.Forms.MessageBoxIcon]::Information
) | Out-Null
