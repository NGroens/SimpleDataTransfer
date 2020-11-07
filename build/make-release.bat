set /p choice= "Please enter the new version number:" 
echo "Selected version: " %choice%
call build-frontend.bat
call push-frontend.bat %choice%
call build-server.bat
call push-server.bat %choice%