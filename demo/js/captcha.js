/*
ListType = {
  0 = Random (HEX(0-255)HEX(0-255)HEX(0-255));
  1 = You list, defined in list variable.
  2 = You list more words on page with 4-6 letters.
  3 = Words on page with 4-6 letters.
}
*/

function captcha (c,listType) {
  if (typeof(c) === 'undefined') var c = document.querySelector("canvas#captcha");
  var yourList = Array('GitHUB','OPEN','SOURCE');
  var list;
  var value = "";
  this.generate = function() {
    switch (listType) {
      case 3:
        list = getPageList();
        value = list[parseInt(Math.random()*1000%list.length)];
      break;
      case 2:
        list = getPageList(yourList);
        value = list[parseInt(Math.random()*1000%list.length)];
      break;
      case 1:
        list = yourList;
        value = list[parseInt(Math.random()*1000%list.length)];
      break;
      case 0:
      default:
        value = ("0"+parseInt(Math.random()*255).toString(16)).slice(-2);
        value += ("0"+parseInt(Math.random()*255).toString(16)).slice(-2);
        value += ("0"+parseInt(Math.random()*255).toString(16)).slice(-2);
        value = value.toUpperCase();
      break;
    }

    setCookie('captcha_hash',hash(value));
    draw(value);
  }
  
  this.audio = function () {
    playAudio(value);
  }
  
  function playAudio(value) {
    var separetedValue = '';
    for (var i =0; i < value.length; i++) {
      separetedValue += (value[i]+';').replace("E","EH").replace("A","AH");
    }
    var player = document.createElement('video');
    var file = document.createElement('source');
    player.setAttribute('autoplay','true');
    player.appendChild(file);
    file.setAttribute('type','audio/mpeg');
    file.src="http://www.voicerss.org/controls/speech.ashx?hl=pt-br&src="+separetedValue+"&c=mp3&rnd=" + Math.random();
  }

  function getPageList(insertList) {
    var pat = /(\b)([a-\uFFFF]|\d)+\1/gi;
    var list = (Array.isArray(insertList)?insertList:[]);
    var match;
    while (match = pat.exec(document.body.innerText)) {
      if (match[0].length >= 4 && match[0].length <= 6 && !(list.indexOf(match[0])+1)) list.push(match[0]);
    }
    return list;
  }

  this.check = function (input) {
    if (hash(input.value) === getCookie('captcha_hash')) return true; else return false;
  }
  
  function draw(value) {
    var ctx = c.getContext("2d"),
    pat1 = document.createElement('canvas').getContext("2d"),
    textcolor="black",
    bgcolor="white";
    
    pat1.canvas.width='4';pat1.canvas.height='4';
    pat1.lineWidth="2";
    pat1.beginPath();pat1.moveTo(0,1);pat1.lineTo(4,1);pat1.strokeStyle=textcolor;pat1.stroke();
    pat1.beginPath();pat1.moveTo(0,3);pat1.lineTo(4,3);pat1.strokeStyle=bgcolor;pat1.stroke();
    pat1=ctx.createPattern(pat1.canvas,"repeat");
    ctx.clearRect(0, 0, c.width, c.height);
    var fontSize=Math.min(c.width/(value.length*1.15),c.height/1.15);
    var posW = Math.min(Math.max(parseInt((Math.random()*10000)%(c.width-((fontSize*0.7)*value.length))),0),c.width-((fontSize*0.7)*value.length));
    var posH = Math.min(Math.max(parseInt((Math.random()*10000)%(c.height-(fontSize))),0),c.height-(fontSize));
    ctx.beginPath();
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.fillStyle = pat1;
    ctx.font = "bold "+fontSize+"px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline="top"
    ctx.fillText(value, posW,posH); 
  }
  
  function hash(value) {
    value = value.toLowerCase();
    var value64=btoa(value),
    hash = '',
    timer = parseInt(+new Date()/1000),
    tenMin =  Math.round(+timer/(60*10));
    for (var x=0; x < value64.length; x++) {
      hash += ((value64[x].charCodeAt()+value[x%value.length].charCodeAt()+tenMin)%32).toString(32);
    }
    return hash;
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  if (c) this.generate();
  
}

HTMLFormElement.prototype.captcha = function(listType) { 
  var cap = this.getElementsByTagName('captcha')[0];
  var canvas = document.createElement('canvas');
  var fldset = document.createElement('div');
  var input = document.createElement('input');
  var refresh = document.createElement('button');
  var audio = document.createElement('button');
  if (cap) {
    fldset.style['width'] = (cap.width?cap.width:250)+'px';
    fldset.style['display'] = 'inline-block';
    fldset.style['padding'] = '10px';
    fldset.style['text-align'] = 'center';
    fldset.style['background-color'] = '#eee';
    fldset.style['margin'] = '15px auto';
    fldset.style['border'] = '2px groove';
    canvas.width = (cap.width?cap.width:250);
    canvas.height = (cap.width?cap.height:100);
    canvas.style['margin'] = '0 0 10px 0';
    input.width=Math.max(canvas.width/2,250);
    input.name='captcha';
    input.id='captcha';
    refresh.style['background-image'] = 'url(\'img/refresh.png\')';
    refresh.style['background-size'] = '100% 100%';
    refresh.style['width'] = '17px';
    refresh.style['height'] = '17px';
    refresh.style['margin'] = '0 0 0 5px';
    refresh.setAttribute('type','button');
    audio.style['background-image'] = 'url(\'img/som.png\')';
    audio.style['background-size'] = '100% 100%';
    audio.style['width'] = '16px';
    audio.style['height'] = '16px';
    audio.style['margin'] = '0 0 0 5px';
    audio.setAttribute('type','button');

    cap.parentNode.insertBefore(fldset,cap);
    fldset.appendChild(canvas);
    fldset.appendChild(document.createElement('br'));
    fldset.appendChild(input);
    fldset.appendChild(audio);
    fldset.appendChild(refresh);
    cap.parentNode.removeChild(cap);
    canvas.captcha = new captcha(canvas,listType);
    refresh.addEventListener('click',canvas.captcha.generate);
    audio.addEventListener('click',canvas.captcha.audio);
    this.addEventListener('submit',function(e){if (!canvas.captcha.check(input)) {e.preventDefault();alert('Code verification typed is wrong!');canvas.captcha.generate();}});
    return canvas;
  }
}

