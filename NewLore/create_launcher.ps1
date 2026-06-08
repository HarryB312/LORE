$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop")
$ShortcutPath = [System.IO.Path]::Combine($DesktopPath, "NewLore Researcher.lnk")

# Path to the batch file and icon
$ScriptDir = Split-Path -Parent $PSScriptRoot
$TargetPath = Join-Path $ScriptDir "run_app.bat"
$IconPath = Join-Path $ScriptDir "lore_icon.ico"

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.WorkingDirectory = $ScriptDir
$Shortcut.IconLocation = $IconPath
$Shortcut.Description = "Launch NewLore Private AI Researcher"
$Shortcut.Save()

Write-Host "========================================"
Write-Host "  Desktop Shortcut Created Successfully! "
Write-Host "========================================"
Write-Host "You can now find 'NewLore Researcher' on your desktop."
