var Pergunta = function(id,texto,titulo){
	this.id = id;
	this.texto = texto;
	this.titulo = titulo;
	this.respostas = []; 
	
	
	this.add = function(resposta){
		this.respostas.push(resposta);
	}
	
	this.getID = function(){
		return this.id;
	}
	
	this.getTexto = function(){
		return this.texto;
	}
	
	this.getTitulo = function(){
		return this.titulo;
	}
	
	this.getResposta = function(id){
		return this.respostas[id];
	}
	
	this.getRespostas = function(){
		this.respostas;
	}
}