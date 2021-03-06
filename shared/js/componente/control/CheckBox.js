var CheckBox = function(id) {
	this.id = id;
	this.ativo = false
	this.visible = 0;
	
	this.ative = function(value) {
		this.ativo = value;
		if (value == true) {
			$('#' + this.id).attr('src', 'image/chkSelected.png');
		} else {
			$('#' + this.id).attr('src', 'image/chkBranco.png');
		}
	}

	this.validar = function(value) {
		var acertou = false;
		if (this.ativo == true) {
			if (value == true) {
				$('#' + this.id).attr('src', 'image/certo.png');
				acertou = true;
			} else {
				$('#' + this.id).attr('src', 'image/errado.png');
			}	
		}else{
			this.exibir(0.5);	
			if (value == true) {
				$('#' + this.id).attr('src', 'image/certo.png');
			} else {
				$('#' + this.id).attr('src', 'image/errado.png');
			}
		}
		return acertou;
	}
	
	this.exibir = function(valor){
		$('#' + this.id).css("opacity", valor);
	}
	
	this.isAtivo = function(){
		return this.ativo;
	}
}