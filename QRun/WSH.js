var objFSO = new ActiveXObject("Scripting.FileSystemObject");
var objShell = new ActiveXObject("WScript.Shell");

var scriptDir = objShell.CurrentDirectory; // + '\\QRun';
var scriptSubDir = objShell.CurrentDirectory + '\\QRun';
var scriptParentDir = objFSO.GetParentFolderName(scriptDir);



// WScript.Echo(scriptParentDir + '\n' + scriptDir + '\n' + scriptSubDir + '\n');

// '*********************************************************************************************
// '*  РАБОТА С ФАЙЛАМИ И ПАПКАМИ
// '*********************************************************************************************

// Читаем файл
function readFile(strFilePath){
	return objFSO.GetFile(strFilePath).OpenAsTextStream(1, 0).ReadAll();
}

// Сохраняет в файл перезаписывая существующий
function saveFile(strFilePath, sText){
	var f = objFSO.CreateTextFile(strFilePath, -1, 0);
	f.WriteLine(sText); f.close();
}

// Дописывает строку в файл           
function logFile(strFilePath, sText){
	var f = objFSO.OpenTextFile(strFilePath, 8, 1);
	f.WriteLine(sText); f.close();
}


// '*********************************************************************************************
// '*  ЗАПУСК ДОКУМЕНТОВ И ПРИЛОЖЕНИЙ
// '*********************************************************************************************

//  Открывает файл в блокноте        
function EditWithNotepad(sFileFullPath){
	var WshShell = new ActiveXObject("WScript.Shell");
	WshShell.Run ("notepad.exe " + sFileFullPath);
	WshShell.AppActivate ("notepad.exe");    // Активизируем окно Блокнота
}

// Открывает файл в ассоциированном приложении           
function EditWithOwnApp(sFileFullPath){
	var Arr = Split (sFileFullPath, "\\");
	var sFileName = new Arr(ubound(Arr));
	var sFileFolder = left (sFileFullPath, len(sFileFullPath) - (len(sFileName)+1));
	
	var objShell = new ActiveXObject("Shell.Application");
	objShell.ShellExecute (sFileName, "", sFileFolder, "", 1);
}

// RUN           
function runFile(exePath, cmd){		
	return objShell.Run(exePath + " " + cmd); 
}
				