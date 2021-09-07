var objFSO = new ActiveXObject("Scripting.FileSystemObject");
var objShell = new ActiveXObject("WScript.Shell");

var scriptDir = objShell.CurrentDirectory;
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

// cписок файлов в папке (без подпапок)
// WScript.Echo(enumFilesInFolfer(scriptDir + '//osp//screenshots'));
function enumFilesInFolfer(folderspec) {
	var f, s=[];
	
	var folder = objFSO.GetFolder(folderspec);
	f = new Enumerator(folder.files);

	for (; !f.atEnd(); f.moveNext()) {
		s.push(f.item().Name);
	}
	return (s);
}

// cписок файлов в папке (без подпапок)
// WScript.Echo(test_enumFilesInFolfer(scriptDir + '//osp//screenshots'));

function test_enumFilesInFolfer(folderspec) {
	var f, s=[], d=[], i=0;
	
	var folder = objFSO.GetFolder(folderspec);
	f = new Enumerator(folder.files);

	for (;!f.atEnd(); f.moveNext()) {
		i++;

		var fl = objFSO.GetFile(f.item());

		// d.push([f.item().Name], [new Date(fl.DateCreated)]);
		d.push([new Date(fl.DateCreated).toISOString]);

		// d.sort();

		// WScript.Echo(fl.DateCreated + "\n" + i);

		// s.push(d[i]);

		
	}
	return (d.join('\n'));
}



// проверка, есть файл или нет
function isFileExists(filePath) {
	if (objFSO.FileExists(filePath)){
		return (true);
	} else {
		return (false);
	}
}

// имя файла из полного пути
// WScript.Echo(getFNameFromPath("c:/dssdf/sdfsf/sdff/sdfsf.345"));
function getFNameFromPath(filePath) {

	return filePath.split('\\').pop().split('/').pop();
}

function ShowFileLastModified(filespec)
{
	var f, s;
	f = objFSO.GetFile(filespec);
	s = filespec.toUpperCase() + "\n";
	s += "Last Modified: " + f.DateLastModified;
	return(s);
}

function ShowFileLastAccessed(filespec)
{
	var f, s;
	f = objFSO.GetFile(filespec);
	s = filespec.toUpperCase() + "\n";
	s += "Last Accessed: " + f.DateLastAccessed;
	return(s);
}

function ShowFileDateCreated(filespec)
{
	var f, s;
	f = objFSO.GetFile(filespec);
	s = "Created: " + f.DateCreated;
	return(s);
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
				