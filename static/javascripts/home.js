(function() {
	var bootup, builtinRead, outf, runit, setSize;

	setSize = function() {
		var height, setHeight;
		height = $(window).height();
		setHeight = height - 100;
		if (height > 500) {
			return $("#codebase").height(setHeight);
		}
	};

	outf = function(text) {
		var output, type;
		output = $("#result");
		type = typeof text;
		if (type === 'string') {
			text = Salix.shouldOutput(text);
			text = '<div class="result">' + text + '</div>';
		} else if (type === 'object') {
			text = text.tp$str().v
			text = text.replace(/(on line \d+)/, '');
			text = '<div class="error">' + text + '</div>';
		} else {
			text = '<div class="info">' + text + '</div>';
		}
		
		return output.html(output.html() + text);
	};

	builtinRead = function(x) {
		if (Sk.builtinFiles === void 0 || Sk.builtinFiles["files"][x] === void 0) {
			throw "File not found: '" + x("'");
		}
		return Sk.builtinFiles["files"][x];
	};

	runit = function(prog, output) {
		var history, module, code;
		code = Salix.processProg(prog);
		try {
			Sk.configure({
				output: outf
			});
			module = Sk.importMainWithBody("<stdin>", false, code);
			Salix.setInputHistory(prog);
		} catch (e) {
			outf(e);
		}
	};

	bootup = function() {
		var wel;
		wel = '<div class="alert">';
		wel += 'WbpyCli 0.0.9 Alpha (default, 2013.2.5, 16:44) \n';
		wel += 'Build on skulpt\n';
		wel += '</div>';
		$("#result").append(wel);
		$("#code").focus()
	};

	$(document).ready(function() {
		bootup();
		$("#codebase").click(function() {
			$("#code").focus();
		});
		return $("#code").keydown(function(e) {
			var code, prog, ret, scrollHeight;
			if (e.keyCode === 13) {
				prog = $("#code").html();
				prog = prog.replace(/(<div.*?>)|(<\/div>)/g, '\n')
				prog = prog.replace(/(<span.*?>)|(<\/span>)/g, '')
				prog = prog.replace(/<br\/?>/g, '\n')
				//console.log(prog);
				if (Salix.check(prog)) {
					code = $("#code").html();
					$("#result").append('<div class="code">' + code + '</div>');
					$("#code").html('').focus();
					if(prog.trim() != ''){
						ret = runit(prog, $("#result"));
						Salix.endOutput();
					}
					scrollHeight = $("#result").height() + $("#code").height();
					return $("#codebase").animate({
						scrollTop: scrollHeight
					}, 1000);
				}
			}else if(e.keyCode === 9){
				var selection = window.getSelection();
				var range = selection.getRangeAt(0);
				selection.removeAllRanges();
				range.deleteContents();
				var container = range.startContainer;
				var pos = range.startOffset;
				var cons = window.document.createTextNode('    ');
				var inode = cons.nodeValue;
				if(container.nodeType == 3){
					container.insertData(pos, inode);
					window.c = container;
					range.setStart(container, pos+inode.length);
					range.setEnd(container, pos+inode.length);
					console.log(range);
					window.s = selection;
					window.r = range;
				}else{
					var afternode = container.childNodes[pos];
					container.insertBefore(cons, afternode);
					range.setStart(cons, pos+inode.length);
					range.setEnd(cons, pos+inode.length);
				}
				selection.addRange(range);
				$("#code").focus();
				return false;
			}
		});
	});

}).call(this);
