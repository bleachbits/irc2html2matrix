function formReset() {
	convmatrix = true;
	document.querySelector('h2').hidden = false;
	document.getElementById("backbutt").hidden = false;
	document.getElementById("forbutt").hidden = false;
	


	document.getElementById("convertbutt").onclick = convert;
	document.getElementById('showcase').innerHTML = "<span class=\"placeholder\">*HTML view will appear here*</span>";
	
}




// it crapped out at 75k characters
var matrixLimit = 2000;
var maxLines = 30;
var elementLimit = 50;

const mircColors = {
  foreground: {
    0: "#ffffff",
    1: "#000000",
    2: "#00007f",
    3: "#009300",
    4: "#ff0000",
    5: "#7f0000",
    6: "#9c009c",
    7: "#fc7f00",
    8: "#ffff00",
    9: "#00fc00",
    10: "#009393",
    11: "#00ffff",
    12: "#0000fc",
    13: "#ff00ff",
    14: "#7f7f7f",
    15: "#d2d2d2",
	16: ""
  },
  background: {
    0: "#ffffff",
    1: "#000000",
    2: "#00007f",
    3: "#009300",
    4: "#ff0000",
    5: "#7f0000",
    6: "#9c009c",
    7: "#fc7f00",
    8: "#ffff00",
    9: "#00fc00",
    10: "#009393",
    11: "#00ffff",
    12: "#0000fc",
    13: "#ff00ff",
    14: "#7f7f7f",
    15: "#d2d2d2",
	16: ""
  }
};

function toggle(bool) {
	if (bool == true) {
		return false;
	}
	else {
		return true;
	}
}
var showcases = [""];
var cur_part = 0;
var convmatrix = true;


function updateLines() {
	maxLines = document.getElementById("linecount").value;
}

function updateLimit() {
	matrixLimit = document.getElementById("limitcount").value;
}

function updateElements() {
	elementLimit = document.getElementById("elementcount").value;
}

function switchconv() {
	document.querySelector('h2').hidden = convmatrix;
	document.getElementById("backbutt").hidden = convmatrix;
	document.getElementById("forbutt").hidden = convmatrix;
	

	convmatrix = !convmatrix;

	document.getElementById("convertbutt").onclick = convmatrix? convert : converthtml;


	return false;
}

function convert() {
	if (document.getElementById('text').value == "") {
		return false;
	}
	showcases = [""];
	document.getElementById('html').value = null;
	document.getElementById('showcase').innerHTML = null;
	lines = document.getElementById('text').value.split("\n");
	reg = new RegExp("(([0-9]{1,2})?((?:,([0-9]{1,2}))?))|(||||)");
	var tempcase = "";
	cur_part = 0;
	var cur_case = 0;
	var cur_line = 1;
	var element_count = 0;
	for (var i = 0, all=lines.length; i < all; i++) {
		var line = lines[i];
		line = line.replace(new RegExp('<','g'),'&lt;');
		line = line.replace(new RegExp('>','g'),'&gt;');
		line = line.replace(new RegExp(' ','g'),'&nbsp;');
		var match, lastf = 16, lastb = 16;
		var bold, italic, underline, reverse = false;
		var first = true;
		while ((match = reg.exec(line)) != null) {
			var f, b, span;
			if (match[2] != null) {
				f = Number(match[2])
				if (f > 15) { f = f-16; }
				f = f.toString();
				if (match[4] != null) {
					b =  Number(match[4])
					if (b > 15) { b = b-16; }
					b = b.toString();
				}
				else {
					b = lastb;
				}
			}
			else if (match[2] == null && (match[5] == null || match[5] == '')) {
				if (match[5] == null) {
					f = 16; b = 16;
				}
				else {
					f = 16; b = 16;
					bold = false;
					italic = false;
					underline = false;
					reverse = false;
				}
			}
			else {
				f = lastf, b = lastb;
				if (match[5] == '') {
					bold = !bold;
				}
				else if (match[5] == '') {
					italic = !italic;
				}
				else if (match[5] == '') {
					underline = !underline;
				}
				else if (match[5] == '') {
					reverse = !reverse;
				}
			}
			if (reverse == true) {
				[f, b] = [b, f];
			}
			if (bold == true) { line = "<b>"+line+"</b>"; }
			if (italic == true) { line = "<i>"+line+"</i>"; }
			if (underline == true) { line = "<u>"+line+"</u>"; }
			if (first == false) {
				line = line.replace(match[0],'</font><font color="'+mircColors.foreground[f]+'" data-mx-bg-color="'+mircColors.background[b]+'">');
			}
			else {
				line = line.replace(match[0],'<font color="'+mircColors.foreground[f]+'" data-mx-bg-color="'+mircColors.background[b]+'">');
				first = false;
			}
			lastf = f; lastb = b;
			element_count++;
		}
		tempcase += (line+"<br>");

		if (tempcase.length + showcases[cur_case] > matrixLimit || cur_line > maxLines || element_count > elementLimit) {
			cur_case += 1;
			showcases[cur_case] = tempcase;
			cur_line = 1;
		} else {
			showcases[cur_case] += tempcase;
		}
		tempcase = "";
		cur_line += 1;
	}
	document.getElementById('html').value = "/html "+showcases[0];
	document.querySelector('h2').textContent = "Currently on Part "+(cur_part+1)+"/"+showcases.length;
	//document.getElementById('showcase').innerHTML = showcase;
	//document.getElementById('html').value += document.getElementById('showcase').innerHTML;
	converthtml();
	return false;
}

function converthtml() {
	if (document.getElementById('text').value == "") {
		return false;
	}
	document.getElementById('showcase').innerHTML = null;
	lines = document.getElementById('text').value.split("\n");
	reg = new RegExp("(([0-9]{1,2})?((?:,([0-9]{1,2}))?))|(||||)");
	var showcase = "";
	for (var i = 0, all=lines.length; i < all; i++) {
		var line = lines[i];
		line = line.replace(new RegExp('<','g'),'&lt;');
		line = line.replace(new RegExp('>','g'),'&gt;');
		var match, lastf = "1", lastb = "0";
		var bold, italic, underline, reverse = false;
		var first = true;
		while ((match = reg.exec(line)) != null) {
			var f, b, span;
			if (match[2] != null) {
				f = Number(match[2])
				if (f > 15) { f = f-16; }
				f = f.toString();
				if (match[4] != null) {
					b =  Number(match[4])
					if (b > 15) { b = b-16; }
					b = b.toString();
				}
				else {
					b = lastb;
				}
			}
			else if (match[2] == null && (match[5] == null || match[5] == '')) {
				if (match[5] == null) {
					f = "1"; b = "0";
				}
				else {
					f = "1"; b = "0";
					bold = false;
					italic = false;
					underline = false;
					reverse = false;
				}
			}
			else {
				f = lastf, b = lastb;
				if (match[5] == '') {
					bold = toggle(bold);
				}
				else if (match[5] == '') {
					italic = toggle(italic);
				}
				else if (match[5] == '') {
					underline = toggle(underline);
				}
				else if (match[5] == '') {
					reverse = toggle(reverse);
				}
			}
			if (reverse == false) {
				span = 'f'+f+' b'+b;
			}
			else {
				span = 'f'+b+' b'+f;
			}
			if (bold == true) { span += ' _b'; }
			if (italic == true) { span += ' _i'; }
			if (underline == true) { span += ' _u'; }
			if (first == false) {
				line = line.replace(match[0],'</span><span class="'+span+'">');
			}
			else {
				line = line.replace(match[0],'<span class="'+span+'">');
				first = false;
			}
			lastf = f; lastb = b;
		}
		if (first == false) {
			showcase += (line+"</span>\n");
		}
		else {
			showcase += (line+"\n");
		}
	}
	showcase = showcase.replace(new RegExp("\<span class=\"(?:[a-zA-Z0-9_ ]+\")>\<\/span>","g"),"");
	document.getElementById('showcase').innerHTML = ("<pre>\n"+showcase+"</pre>");
	if (!convmatrix) {
		document.getElementById('html').value = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<title>IRC2HTML - https://git.supernets.org/acidvegas/irc2html</title>\n<style type=\"text/css\">\n.f0 { color: #ffffff; }\n.b0 { background-color: #ffffff; }\n.f1 { color: #000000; }\n.b1 { background-color: #000000; }\n.f2 { color: #00007f; }\n.b2 { background-color: #00007f; }\n.f3 { color: #009300; }\n.b3 { background-color: #009300; }\n.f4 { color: #ff0000; }\n.b4 { background-color: #ff0000; }\n.f5 { color: #7f0000; }\n.b5 { background-color: #7f0000; }\n.f6 { color: #9c009c; }\n.b6 { background-color: #9c009c; }\n.f7 { color: #fc7f00; }\n.b7 { background-color: #fc7f00; }\n.f8 { color: #ffff00; }\n.b8 { background-color: #ffff00; }\n.f9 { color: #00fc00; }\n.b9 { background-color: #00fc00; }\n.f10 { color: #009393; }\n.b10 { background-color: #009393; }\n.f11 { color: #00ffff; }\n.b11 { background-color: #00ffff; }\n.f12 { color: #0000fc; }\n.b12 { background-color: #0000fc; }\n.f13 { color: #ff00ff; }\n.b13 { background-color: #ff00ff; }\n.f14 { color: #7f7f7f; }\n.b14 { background-color: #7f7f7f; }\n.f15 { color: #d2d2d2; }\n.b15 { background-color: #d2d2d2; }\n._b { font-weight: bold; }\n._i { font-style: italic; }\n._u { text-decoration: underline; }\npre { margin: 0; font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, monospace, serif; font-size: 0.9em; }\n</style>\n</head>\n<body>\n";
		document.getElementById('html').value += document.getElementById('showcase').innerHTML;
		document.getElementById('html').value += "\n</body>\n</html>";
	}
	return false;
}



function nextpart() {
	if (!showcases[cur_part+1]) {
		alert("no more parts!");
	} else {
		document.getElementById('html').value = "/html "+showcases[++cur_part];
		document.querySelector('h2').textContent = "Currently on Part "+(cur_part+1)+"/"+showcases.length;
	}
}

function backpart() {
	if (!showcases[cur_part-1]) {
		alert("youre on the first part!");
	} else {
		document.getElementById('html').value = "/html "+showcases[--cur_part];
		document.querySelector('h2').textContent = "Currently on Part "+(cur_part+1)+"/"+showcases.length;
	}
}

function Submit() {
	if (document.getElementById('text').value != "" && document.getElementById('text').value != null) {
		return true;
	}
	return false;
}

function Download() {

	const link = document.createElement("a");
	if (convmatrix) {
		var ascii = "TOTAL SEGMENTS: "+showcases.length+"\n\n/html ";
		ascii += showcases.join("\n\n\n/html ");
		
	} else {
		var ascii = document.getElementById('html').value;
	}
	

	link.href = URL.createObjectURL(new Blob([ascii], { type: "text/plain" }));
	link.download = "ascii.txt";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

window.onload = convert;
