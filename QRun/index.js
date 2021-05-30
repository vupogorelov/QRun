var config = JSON.parse(readFile(scriptDir + '\\config.json').toString());
var database = JSON.parse(readFile(scriptDir + '\\database.json').toString());

// config.servers.all[1].name = 'qwrqqe';
// sText = JSON.stringify(config);
// saveFile(scriptDir + '//config1.json', sText);


// '*********************************************************************************************
// '*  подгружаем данные на старте
// '*********************************************************************************************
$(function () {

	// подгружаем local сервера
	for (n in config.servers.local) {
		var data = '<li id="locSrvName' + n + '" class="mdl-list__item mdl-list__item--two-line">';
			data += '<div class="mdl-tooltip" for="locSrvName' + n + '">' + config.servers.local[n].command + '</div>';
			data += '<span class="mdl-list__item-primary-content">';
			data += '<i class="material-icons mdl-list__item-avatar">perm_identity</i>';
			data += '<span>' + config.servers.local[n].name + '</span>';
			// data += '<span class="mdl-list__item-sub-title">' + 'bots count...' + '</span>';
			data += '</span>';
			data += '<span class="mdl-list__item-secondary-content">';
			data += '<button id="btnRun" cmd="' + config.servers.local[n].command + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored"><i class="material-icons">play_circle_outline</i></button>';
			data += '</span>';
		$(localServersList).append(data);
	}

	// подгружаем web сервера
	for (n in config.servers.web) {

		var data = '<li id="webSrvName' + n + '" class="mdl-list__item mdl-list__item--two-line">';
			data += '<div class="mdl-tooltip" for="webSrvName' + n + '">' + config.servers.web[n].command + '</div>';
			data += '<span class="mdl-list__item-primary-content">';
			data += '<i class="material-icons mdl-list__item-avatar">public</i>';
			data += '<span>' + config.servers.web[n].name + '</span>';
			data += '<span id="srvPlayers' + n + '" class="mdl-list__item-sub-title">' + 'update players online...' + '</span>';
			data += '</span>';
			data += '<span class="mdl-list__item-secondary-content">';
			data += '<button id="btnRun" cmd="' + config.servers.web[n].command + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored"><i class="material-icons">play_circle_outline</i></button>';
			data += '</span>';
		$(webServersList).append(data);
		
	}

	// асинхронно подгружаем игроков онлайн
	$.ajax('http://n2.q3msk.ru/', {
		success: function (data) {
			var ret = $(data).find('.playersTitle')
			for (n in config.servers.web) {
				if (config.servers.web[n].hasOwnProperty('index')) {
					$('#srvPlayers' + n).text(ret[config.servers.web[n].index].innerHTML);
				} else
				{
					$('#srvPlayers' + n).text('---');
				}
			}
		},
		error: function () {
			alert('Не удалось спарсить игроков');
		}
	})
});


//################################################################################################################################
//################################################################################################################################
// обработка разных дейтствий
//################################################################################################################################
//################################################################################################################################

$(function(){
	
	// Hide all blocks at start and show main page
	$("#main_box").children().hide();
	$("#box_Start").show();
	
	$('.mdl-layout__drawer').click(function(event){
		var d = document.querySelector('.mdl-layout');
		d.MaterialLayout.toggleDrawer();
	});
	
	// переход на Старт
	$("#drawer_Start").click(function(event){
		$("#main_box").children().hide();
		$('span#header_panel').text('Старт');
		$("#box_Start").show();
	});
	
	// переход на Конфиги
	$("#drawer_Configs").click(function(event){
		$("#main_box").children().hide();
		$('span#header_panel').text('Конфиги');
		$("#box_Configs").show();
	});
	
	// переход на Карты
	$("#drawer_Maps").click(function(event){
		$("#main_box").children().hide();
		$('span#header_panel').text('Карты');
		$("#box_Maps").show();
	});
	
	// Переход на Статистику
	$("#drawer_Progress").click(function(event){
		
		$("#main_box").children().hide();
		$('span#header_panel').text('Статистика');
		
		google.charts.load('current', {packages: ['corechart']});
		google.charts.setOnLoadCallback(drawChart1);
		google.charts.setOnLoadCallback(drawChart2);
		$('#box_Progress').show();
		
	});
	
	// Переход на Настройки
	$("#drawer_Settings").click(function(event){
		$("#main_box").children().hide();
		$('span#header_panel').text('Настройки');
		$('#box_Settings').show();
	});
	
	// переход на О программе
	$("#drawer_AboutApp").click(function(event){
		$("#main_box").children().hide();
		$('span#header_panel').text('О программе');
		$('#box_AboutApp').show();
	});
	
	
	// buttons on start page
	$('.mdl-button').click(function(event){
		
        switch ($(this).attr('id')){
			
        	// round buttons in low right corner
			case "new_command_button":

        		break
        	case "reload_stat":
        		window.alert($(this).attr('id'));
        		break
    		case "refresh-maps-button":
    			window.alert($(this).attr('id'));
    			break
			case "reload_configs":
				window.alert($(this).attr('id'));
    			break
    		default:
        }
	});

	// кнопка справа от каждого сервера - обработка нажатий
	$(btnRun).click(function(event){
		runFile(scriptParentDir + '\\xq3e.exe ', $(this).attr('cmd'));
	});

});
	


// '*********************************************************************************************
// '*  Показываем графики
// '*********************************************************************************************
function drawChart1() {
	// Define the chart to be drawn.
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Element');
	data.addColumn('number', 'Percentage');
	data.addRows([
		['Rail', 0.78],
		['Rocket', 0.21],
		['Other', 0.01]
	]);

	// Instantiate and draw the chart.
	var chart = new google.visualization.PieChart(document.getElementById('myChart1'));
	chart.draw(data, null);
}

function drawChart2() {
	// Define the chart to be drawn.
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Acc1');
	data.addColumn('number', 'Acc');
	data.addRows([
		['Rail', 46],
		['Rocket', 62],
		['Lightning', 25],
		['Granades', 24],
		['Plasma', 15]
	]);

	// var options for Anthony's pie chart.
	var options = {title:'Выбор оружия',
				   width:400,
				   height:300};
			   
	// Instantiate and draw the chart.
	var chart = new google.visualization.BarChart(document.getElementById('myChart2'));
	chart.draw(data, null);
}