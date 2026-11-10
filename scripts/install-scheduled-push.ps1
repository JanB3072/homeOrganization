param(
    [ValidateSet('install', 'uninstall', 'status', 'run', 'enable', 'disable')]
    [string]$Action = 'install',
    [int]$IntervalMinutes = 30
)

$ErrorActionPreference = 'Stop'
$taskName = 'HomeOrg-30min-Push'
$repo = Split-Path -Parent $PSScriptRoot
$nodeExe = (Get-Command node).Source
$worker = Join-Path $PSScriptRoot 'scheduled-push.mjs'
$log = Join-Path $PSScriptRoot 'scheduled-push.log'

switch ($Action) {
    'install' {
        $taskAction = New-ScheduledTaskAction -Execute $nodeExe -Argument "`"$worker`"" -WorkingDirectory $repo
        $startAt = (Get-Date).AddMinutes($IntervalMinutes)
        $trigger = New-ScheduledTaskTrigger -Once -At $startAt `
            -RepetitionInterval (New-TimeSpan -Minutes $IntervalMinutes) `
            -RepetitionDuration (New-TimeSpan -Days 30)
        $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable `
            -MultipleInstances IgnoreNew `
            -ExecutionTimeLimit (New-TimeSpan -Minutes 10)
        $principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" `
            -LogonType Interactive -RunLevel Limited
        Register-ScheduledTask -TaskName $taskName -Action $taskAction -Trigger $trigger `
            -Settings $settings -Principal $principal `
            -Description "Commit and push one untracked article every $IntervalMinutes minutes; skip when nothing is staged" `
            -Force | Out-Null
        Write-Host "Registered task: $taskName"
        Write-Host "First run: $startAt | interval: $IntervalMinutes min | 20 articles take about $(20 * $IntervalMinutes / 60) hours"
        Write-Host "Runs under the interactive logon token so git credential manager is available"
    }
    'uninstall' {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
        Write-Host "Removed task: $taskName"
    }
    'enable' {
        Enable-ScheduledTask -TaskName $taskName | Out-Null
        Write-Host 'Task enabled'
    }
    'disable' {
        Disable-ScheduledTask -TaskName $taskName | Out-Null
        Write-Host 'Task disabled'
    }
    'status' {
        Get-ScheduledTask -TaskName $taskName | Select-Object TaskName, State | Format-Table -AutoSize
        Get-ScheduledTaskInfo -TaskName $taskName | Format-List LastRunTime, LastTaskResult, NextRunTime
        if (Test-Path $log) { Get-Content $log -Tail 8 -Encoding UTF8 }
    }
    'run' {
        Start-ScheduledTask -TaskName $taskName
        Write-Host 'Triggered one run'
        Start-Sleep -Seconds 2
        if (Test-Path $log) { Get-Content $log -Tail 8 -Encoding UTF8 }
    }
}
