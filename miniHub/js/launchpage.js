// declaração de constantes
var QUESTION_TYPE_CHOICE = "choice";
var QUESTION_TYPE_TF = "true-false";
var QUESTION_TYPE_NUMERIC = "numeric";
var SLIDE_TYPE_CONTEUDO = "conteudo";
var SLIDE_TYPE_CONTEUDOINICIAL = "conteudoInicial";
var SLIDE_TYPE_CONTEUDOFINAL = "conteudoFinal";
var SLIDE_TYPE_PERGUNTA = "pergunta";
// declaração de constantes

// declaração de variaveis de objeto
var conteudo = "";
var navegador = "";
var scorm = "";
var apresentacao = "";
var test = "";
var aluno = "";
// declaração de variaveis de objeto

// declaração de variaveis
var scormIsFinalized = false;
var scormIsRegistred = false;
var apresentacaoCount = 0;
var questaoAtual = 0;
var perguntas = [];
var perguntas = [];
var estilo = "teste";
var indicePerguntas = [];
var indicePosition = [];
var indice = 0;
var bookmarkAtual = 0;
var checkBoxGroup = [];
var respondido = false;
var complemeto = "";
var chkSelecionado = false;
var idquestao = 0;
var txtPergunta = "";
var txtResposta1 = "";
var txtResposta2 = "";
var txtResposta3 = "";
var estilo = "";
var indiceAtual = -1;
var videoAtual = 0;
var intervalo = "";
// declaração de variaveis
// inicializacao do player
var player = new Video("video");
for (var i = 1; i <= 15; i++) {
	player.addSource(new SourceVideo("video/conteudo/video" + i + ".ogg"));
}

// inicializacao do player
// SetupIFrame("contentFrame");

$(function() {
	$(window).on('beforeunload', doUnload(false));
	$(window).on('unload', doUnload());
	$(document).on('click', "#btnAction", function() {
		responder()
	});
	init();
});

function init() {
	setContent();
	navegador = new Navegador();
	navegador.setValorInativo(0, 0);
	initApresentacao()
	test = new Test();
	carregarTeste();
	carregaPerguntas();
	testeButon();
	defineEstiloBody();
	selectDiv();
	try {
		scorm = new Scorm();
		scorm.setStartTime(new Date());
		scorm.processInitialize(getAPI());
		verificaStatus();
		var bookmark = getBookmark();
		bookmark = testaBookmark(bookmark);
		bookmarkAtual = bookmarkAtual;
		idAluno = scorm.processGetValue("cmi.core.student_id");
		nomeAluno = scorm.processGetValue("cmi.core.student_name");
		scoreAluno = getScore();
		aluno = new Aluno(idAluno, nomeAluno, scoreAluno);
		scorm.processSetValue("cmi.core.lesson_location", bookmark);
	} catch (e) {
		aluno = new Aluno(1, "teste", 0);
		alert(e);
	}
}

function setContent(){
	conteudo = new Content();
	conteudo.addModulo("MiniHub");
	conteudo.addPage("");
	conteudo.addPage("");
	conteudo.addPage("");
	conteudo.addPage("");
	conteudo.addPage("");
}

// #########################################################################################################################################################
// manipula navegação
function funcaoNext() {
	apresentacao.next();
	defineEstiloBody();
	testeButon();
	if (estilo != "pergunta") {
		videoAtual++;
	}
	selectDiv();
	if (isNewBookmarck()) {
		var bookmark = getBookmarckVigente();
		verificaStatus();
		try {
			scorm.processSetValue("cmi.core.lesson_location", bookmark);
		} catch (e) {
			// TODO: handle exception
		}
		if (apresentacao.isLast()) {
			setScore();
			try {
				scorm.processSetValue("cmi.core.lesson_status", "completed");
			} catch (e) {
				// TODO: handle exception
			}
		}
	}
};

function funcaoPrev() {
	apresentacao.prev();
	defineEstiloBody();
	if (estilo != "pergunta") {
		videoAtual--;
	}
	selectDiv();
};
// manipula navegação
// #########################################################################################################################################################
// manipula botão de navegação
function exibiPrev(value) {
	navegador.ativaBtnPrev(value);
}

function exibiNext(value) {
	navegador.ativaBtnNext(value);
}

function testeButon() {
	var tipo = apresentacao.getTipoAtual();
	if (tipo == SLIDE_TYPE_PERGUNTA || tipo == SLIDE_TYPE_CONTEUDOFINAL) {
		exibiPrev(false);
		exibiNext(false);
	} else if (tipo == SLIDE_TYPE_CONTEUDOINICIAL) {
		exibiPrev(false);
		exibiNext(true);
	} else if (tipo == SLIDE_TYPE_CONTEUDO) {
		exibiPrev(true);
		exibiNext(true);
	}
}
// manipula botão de navegação
// #########################################################################################################################################################
// manipula apresentação

function initApresentacao() {
	apresentacao = new Apresentacao();
	apresentacao.add("conteudo", SLIDE_TYPE_CONTEUDOINICIAL);
	for (var i = 1; i <= 7; i++) {
		apresentacao.add("conteudo", SLIDE_TYPE_CONTEUDO);
	}
	apresentacao.add("pergunta", SLIDE_TYPE_PERGUNTA);
	apresentacao.add("conteudo", SLIDE_TYPE_CONTEUDOINICIAL);
	apresentacao.add("conteudo", SLIDE_TYPE_CONTEUDO);
	apresentacao.add("pergunta", SLIDE_TYPE_PERGUNTA);
	apresentacao.add("conteudo", SLIDE_TYPE_CONTEUDOINICIAL);
	apresentacao.add("conteudo", SLIDE_TYPE_CONTEUDO);
	apresentacao.add("conteudo", SLIDE_TYPE_CONTEUDO);
	apresentacao.add("pergunta", SLIDE_TYPE_PERGUNTA);
	apresentacao.add("conteudo", SLIDE_TYPE_CONTEUDOINICIAL);
	apresentacao.add("conteudo", SLIDE_TYPE_CONTEUDO);
	apresentacao.add("pergunta", SLIDE_TYPE_PERGUNTA);
	apresentacao.add("pergunta", SLIDE_TYPE_PERGUNTA);
	apresentacao.add("conteudo", SLIDE_TYPE_CONTEUDOFINAL);
}

function getSlideRetorno() {
	var retorno = 0;
	$.each(indicePosition, function(index, valor) {
		if (getBookmark() == indice) {
			retorno = valor;
		}
	});
	return retorno
}

function getBookmarckVigente() {
	var retorno = 0;
	$.each(indicePosition, function(index, valor) {
		if (apresentacao.getIndiceAtual() == valor) {
			retorno = index;
		}
	});
	return retorno
}

function isNewBookmarck() {
	var retorno = false;
	$.each(indicePosition, function(index, valor) {
		if (apresentacao.getIndiceAtual == valor) {
			retorno = true;
		}
	});
	return retorno
}

// manipula apresentação
// #########################################################################################################################################################
// manipula questionario
function getRespostas() {
	var questao = test.getQuestion(idquestao);
	return questao.getAnswers();
}

function getIDQuestao() {
	var questao = test.getQuestion(idquestao);
	return questao.getID();
}

function carregarTeste() {
	test.add("br.com.scorm.yesh.minihub_1", "separacao", QUESTION_TYPE_CHOICE,
			new Array(false, true, false, false), 2, "obj_minihub");
	test.add("br.com.scorm.yesh.minihub_2", "embalagem", QUESTION_TYPE_CHOICE,
			new Array(true, false, false, false), 1, "obj_minihub");
	test.add("br.com.scorm.yesh.minihub_3", "entrega", QUESTION_TYPE_CHOICE,
			new Array(true, false, false, false), 1, "obj_minihub");
	test.add("br.com.scorm.yesh.minihub_4", "recomendacao",
			QUESTION_TYPE_CHOICE, new Array(false, true, false, false), 2,
			"obj_minihub");
	test.add("br.com.scorm.yesh.minihub_5", "recomendacao",
			QUESTION_TYPE_CHOICE, new Array(false,false, true, false), 2,
			"obj_minihub");
}

function getScore() {
	var valor;
	try {
		valor = scorm.processGetValue("cmi.core.score.raw");
	} catch (e) {
		valor = 0;
	}
	return valor;
}

function addScore() {
	try {
		score = parseInt(aluno.getScore())
		if (isNaN(score)) {
			score = 0;
		}
		score = parseInt(score) + 20;
		aluno.setScore(score);
		scorm.processSetValue("cmi.core.score.raw", score);
	} catch (e) {
		// TODO: handle exception
	}

}

function setScore() {
	try {
		score = aluno.getScore();
		scorm.processSetValue("cmi.core.score.raw", score);
		scorm.processSetValue("cmi.core.score.min", "70");
		scorm.processSetValue("cmi.core.score.max", "100");
		if (score >= 0) {
			scorm.processSetValue("cmi.core.lesson_status", "passed");
		} else {
			scorm.processSetValue("cmi.core.lesson_status", "failed");
		}
	} catch (e) {
		// TODO: handle exception
	}

}

function carregaPerguntas() {
	for (var i = 1; i < 5; i++) {
		perguntas.push(geraPergunta(i));
	}
}

function geraPergunta(idPergunta) {
	switch (idPergunta) {
	case 0:
		titulo = "";
		texto = '';
		resposta1 = "";
		resposta2 = "";
		resposta3 = "";
	case 1:
		indicePerguntas.push(8);
		indicePosition.push(9);
		idPergunta = getIDQuestao();
		titulo = "Separação";
		texto = 'Quais são os primeiros passos a serem seguidos para iniciar o picking (separação)?';
		resposta1 = "O colaborador deverá bipar o código de barras na folha de separação e o EAN da mercadoria.";
		resposta2 = "O colaborador deverá imprimir a folha de separação e seguir o procedimento como descrito.";
		resposta3 = "O colaborador deverá gerar as “carguinhas” e seguir com o processo logístico.";
		break;
	case 2:
		indicePerguntas.push(10);
		indicePosition.push(11);
		idPergunta = getIDQuestao();
		titulo = "Embalagem";
		texto = "Qual a importância do cumprimento de todas as etapas de embalagem?";
		resposta1 = "Importância altíssima, pois se a embalagem não for feita de maneira adequada, o transportador poderá ter problemas com a Nota Fiscal.";
		resposta2 = "Importância média, pois o transportador pode entregar a Nota Fiscal ao cliente sem maiores problemas.";
		resposta3 = "Importância baixa, pois o Mini Hub não se responsabiliza pelas tratativas feitas pelo transportador.";
		break;
	case 3:
		indicePerguntas.push(16);
		indicePosition.push(17);
		idPergunta = getIDQuestao();
		titulo = "Entrega";
		texto = "Quais são os procedimentos necessários para fazer após obter insucesso nas entregas?";
		resposta1 = "O colaborador deverá registrar o tracking e incluir a nova entrega na próxima até a terceira tentativa.";
		resposta2 = "O colaborador deverá ligar para o cliente e relatar o acontecido.";
		resposta3 = "O colaborador deverá escanear os canhotos das NFs (comprovantes de entrega), salvar em uma pasta na rede (criar) e arquivá-los fisicamente.";
		break;
	case 4:
		indicePerguntas.push(18);
		indicePosition.push(19);
		idPergunta = getIDQuestao();
		titulo = "Recomendações";
		texto = "Porque é importante fazer o controle das folhas de cargas com as transportadoras?";
		resposta1 = "Porque o colaborador Mini hub tem 3 diaspara entregar tudo assinado.";
		resposta2 = "Porque é nescessário dar retorno com base nesse documento e nos canhotos das NF's.";
		resposta3 = "Porque o transportador deve arcar com os valoresdessas cargas.";
		break;
	case 5:
		indicePerguntas.push(18);
		indicePosition.push(19);
		idPergunta = getIDQuestao();
		titulo = "Recomendações";
		texto = "Pensando que o foco do serviço Mini Hub é garantir melhor experiência para o cliente, qual é o prazo de entrega estimado?";
		resposta1 = "Realizar a entrega em até 3 dias úteis.";
		resposta2 = "Realizar a entregas imediata após o pagamento.";
		resposta3 = "Realizar a entregas em até 1 dia útil após a aprovação do pagamento.";
		break;
	default:
		break;
	}
	var pergunta = new Pergunta(idPergunta, texto, titulo);
	pergunta.add(resposta1);
	pergunta.add(resposta2);
	pergunta.add(resposta3);
	return pergunta;
}

function getPergunta(idquestao) {
	return perguntas[idquestao];
}

function getIndice() {
	var retorno = 0;
	$.each(indicePerguntas, function(index, valor) {
		if (apresentacao.getIndiceAtual() == valor) {
			retorno = (index);
		}
	});
	;
	return retorno
}
// manipula questionario
// #########################################################################################################################################################
// evento de saida de tela
function doUnload(pressedExit) {
	try {
		if (processedUnload == true) {
			return;
		}
		processedUnload = true;
		var endTimeStamp = new Date();
		var totalMilliseconds = (endTimeStamp.getTime() - startTimeStamp
				.getTime());
		var scormTime = ConvertMilliSecondsToSCORMTime(totalMilliseconds, false);
		scorm.setStartTime = (scormTime);
		scorm.processSetValue("cmi.core.session_time", scormTime);
		if (pressedExit == false && reachedEnd == false) {
			scorm.processSetValue("cmi.core.exit", "suspend");
		}
		scorm.processFinish();
	} catch (e) {
		// TODO: handle exception
	}
}

function doExit() {
	try {
		if (reachedEnd == false
				&& confirm("Would you like to save your progress  to resume later?")) {
			scorm.processSetValue("cmi.core.exit", "suspend");
		} else {
			scorm.processSetValue("cmi.core.exit", "");
		}
		doUnload(true);
	} catch (e) {
		// TODO: handle exception
	}
}
// evento de saida de tela

// manipula seção da pagina
function selectDiv() {
	if (estilo == "pergunta") {
		definePerguntas();
		gerarCheckBoxs();
		exibirPerguntas();
		$("#dvpergunta").show();
		$("#dvconteudo").hide();
	} else {
		$("#dvconteudo").show();
		$("#dvpergunta").hide();
		initVideo();
	}
}
// manipula seção da pagina

// manipula estilo
function defineEstiloBody() {
	try {
		estilo = apresentacao.getSlideAtual();
	} catch (e) {
		estilo == "conteudo";
	}
	$("#corpo").attr("class", estilo);
}
// manipula estilo

// manipula checkbox
function gerarCheckBoxs() {
	for (var i = 0; i < 3; i++) {
		addCheckBox();
	}
}

function addCheckBox() {
	nome = "chkbox" + (checkBoxGroup.length + 1)
	checkBoxGroup.push(new CheckBox(nome));
	$(document).on('click', "#" + nome, function() {
		selectAtivo(this);
	});
}

function selectAtivo(me) {
	chkSelecionado = true;
	$("#btnAction").css("opacity", 1);
	if (respondido == false) {
		$.each(checkBoxGroup, function(index, item) {
			if (item.id == me.id) {
				item.ative(true);
			} else {
				item.ative(false);
			}
		})
	}
}

function resetSelect() {
	$.each(checkBoxGroup, function(index, item) {
		item.ative(false);
	})
}
// manipula checkbox

// manipula perguntas
function definePerguntas() {
	try {
		idquestao = getIndice();
		pergunta = getPergunta(idquestao);
		txtPergunta = pergunta.getTexto();
		var txtTitulo = pergunta.getTitulo();
		var txtResposta1 = pergunta.getResposta(0);
		var txtResposta2 = pergunta.getResposta(1);
		var txtResposta3 = pergunta.getResposta(2);
	} catch (e) {
		var txtTitulo = "";
		var txtPergunta = "";
		var txtResposta1 = "";
		var txtResposta2 = "";
		var txtResposta3 = "";
	}
	var str = new String(txtTitulo);
	$('#txtTitulo').text(str.toUpperCase());
	$("#dvtxtPergunta").text(txtPergunta);
	$("#lblAnwser1").text(txtResposta1);
	$("#lblAnwser2").text(txtResposta2);
	$("#lblAnwser3").text(txtResposta3);
}

function exibirPerguntas() {
	try {
		var tipo = apresentacao.getTipoAtual();
	} catch (e) {
		var tipo = "conteudo";
	}
	var taxa = 0;
	var taxaButon = 0
	if (tipo == "pergunta") {
		taxa = 1;
		taxaButon = 0.5;
	}
	$.each(checkBoxGroup, function(index, item) {
		item.exibir(taxa);
	});
	$("#btnAction").css("opacity", taxaButon);
}

function responder() {
	if (respondido == false) {
		if (chkSelecionado) {
			respostas = getRespostas();
			var idResposta = 0;
			$.each(checkBoxGroup, function(index, item) {
				testeAtivo = item.isAtivo();
				if (testeAtivo) {
					idResposta = index
				}
				teste = item.validar(respostas[index]);
				if (teste) {
					addScore();
				}
			});
			var result = "wrong";
			if (teste == true) {
				var result = "correct";
			}
			regiterResposta(result, idResposta);
			$('#btnAction').attr('src', '../shared/image/continuar.png');
			respondido = true;
		}
	} else {
		$('#btnAction').attr('src', '../shared/image/txtResponder.png');
		resetSelect();
		respondido = false;
		funcaoNext();
	}
}

function regiterResposta(result, idResposta) {
	try {
		scorm.processSetValue("cmi.interactions." + idquestao + ".id",
				getIDQuestao());
		scorm.processSetValue("cmi.interactions." + idquestao + ".type",
				QUESTION_TYPE_CHOICE);
		scorm.processSetValue("cmi.interactions." + idquestao + ".result",
				result);
		scorm.processSetValue("cmi.interactions." + idquestao
				+ ".student_response", idResposta);
	} catch (e) {
		// TODO: handle exception
	}
}

// manipula perguntas

// manipuçla de video
function initVideo() {
	try {
		exibiNext(false);
		exibiPrev(false);
	} catch (e) {
		// TODO: handle exception
	}
	player.intiVideo(videoAtual);
}

function acopanhaVideo(currentTime, duration) {
	player.onTrackedVideoFrame(currentTime, duration);
	$('#duracao').val(duration);
	$('#time').val(currentTime);
}

function encerraVideo() {
	testeButon();
}
// manipuçla de video

