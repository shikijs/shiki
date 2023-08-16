## Define the service name in a variable
$ServiceName = 'EventLog'

## Read the service from Windows to return a service object
$ServiceInfo = Get-Service -Name $ServiceName

## If the server is not running (ne)
if ($ServiceInfo.Status -ne 'Running') {
	## Write to the console that the service is not running
	Write-Host 'Service is not started, starting service'
	## Start the service
	Start-Service -Name $ServiceName
	## Update the $ServiceInfo object to reflect the new state
	$ServiceInfo.Refresh()
	## Write to the console the Status property which indicates the state of the service
	Write-Host $ServiceInfo.Status
} else { ## If the Status is anything but Running
	## Write to the console the service is already running
	Write-Host 'The service is already running.'
}

## From https://adamtheautomator.com/powershell-script-examples/
