String.prototype.trim = function()
{
	return this.replace(/(^\s*)|(\s*$)/g, '')
};
console.vlog = function(x){
	console.log('--'+x+'--');
};
console.tlog = function(title, x){
	console.log('***'+title+'***');
	console.log('--'+x+'--');
};
Salix = {
	blockKeywords : ['for', 'def', 'if', 'class'],
	indent : {
		count: 0,
		wait: false,
		white: '',
		stack: []
	},
	resetIndent : function()
	{
		this.indent = {
			count: 0,
			wait: false,
			white: '',
			stack: []
		};
	},
	inputHistory: '',
	outputHistory: '',
	preOutputHistory: '',
	isOutputting: false,
	processProg : function(prog)
	{
		prog = this.inputHistory + prog + '\n';
		return prog;
	},
	setInputHistory : function(prog)
	{
		this.preInputHistory = this.inputHistory;
		this.inputHistory += prog + '\n';
	},
	beginOutput : function(){},
	endOutput : function(){
		if(this.isOutputting){
			this.preOutputHistory = this.outputHistory;
		}
		this.isOutputting = false;
		this.outputHistory = '';
	},
	setOutputHistory: function(text)
	{
		this.isOutputting = true;
		this.outputHistory += text;
		if(this.preOutputHistory.length >= this.outputHistory.length){
			return false
		}else{
			return true;
		}
	},
	shouldOutput: function(text)
	{
		var result = '';
		if(this.setOutputHistory(text)){
			result = text;
		}
		return result;
	},
	whiteCheck : function(defaultIndent, indent)
	{
		if(indent != '' && indent.length%defaultIndent.length == 0)
			return true;
	},
	check : function(cmd)
	{
		this.resetIndent();
		//var cmdArray = cmd.replace(/\S+(\s*)$/m, '').split('\n');
		var cmdArray = cmd.split('\n');
		var count = cmdArray.length
		for(var i in cmdArray){
			if(count > 2){
				if(cmdArray[count-1].trim() != '' || cmdArray[count-2].trim() != ''){
					if(cmdArray[i].trim() == '') continue;
				}
			}
			if(this.indentCheck(cmdArray[i])){
				return true;
			}
		}
		return false;
	},
	indentCheck : function(cmd)
	{
		var block = this.blockKeywords;
		var words, word, white, indent, isKeyWord;
		if(cmd.trim().indexOf(';') > 0){
			//console.log('return because of ;');
			return true;
		}
		words = cmd.match(/(^[\t ]*)(\S+)[\t ]*/);
		white = '';
		for(var i = 1; i < this.indent.count; i++){
			white += this.indent.white;
		}
		//console.log('words:');
		//console.log(words);
		if(words != null){
			//console.log("indent:");
			//console.log(this.indent);
			indent = words[1];
			word = words[2];
			isKeyword = false;
			for(var i in block){
				if(block[i] == word){
					isKeyword = true;
				}
			}
			if(isKeyword){
				if(this.indent.count > 0 ){
					if(indent == ''){
						this.resetIndent();
						return true;
					}else{
						if(this.indent.wait){
							if(this.indent.count == 1){
								this.indent.count++;
								this.indent.wait = true;
								this.indent.stack.push(word);
								this.indent.white = indent;
								return false;
							}else if (this.whiteCheck(this.indent.white, indent) ){
								this.indent.count++;
								this.indent.wait = true;
								this.indent.stack.push(word);
								return false;
							}else{
								this.resetIndent();
								//console.log('white is wrong');
								return true;
							}
						}else{
							if (this.whiteCheck(this.indent.white, indent) ){
								this.indent.count++;
								this.indent.wait = true;
								this.indent.stack.push(word);
								return false;
							}else{
								this.resetIndent();
								//console.log('Jump because wait is wrong');
								return true;
							}
						}
					}
				}else{
					this.indent.count++;
					this.indent.wait = true;
					this.indent.stack.push(word);
					return false;
				}
			}else {
				if(this.indent.wait){
					if(this.indent.count == 1){
						this.indent.white = indent;
						this.indent.wait = false;
						return false;
					}else if (this.whiteCheck(this.indent.white, indent) ){
						this.indent.wait = false;
						return false;
					}
					this.resetIndent();
					//console.log('Jump because wait white');
					return true;
				}else if (this.whiteCheck(this.indent.white, indent) ){
					if(this.indent.count == 0){
						this.resetIndent();
						//console.log('Jump because no block');
						return true;
					}
					this.indent.wait = false;
					return false;
				}
				this.resetIndent();
				//console.log('Jump because not wait and white is wrong');
				return true;
			}
		}
		this.resetIndent();
		//console.log('Jump because finish');
		return true;
	},
}
