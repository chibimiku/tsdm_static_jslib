/*
 * addon.js
 * chibimiku@TSDM.net
 * some common functions for forum.
 */

var jq = jQuery.noConflict();
var smjq = jQuery;


function setCookie(name, val, ex){
	var times = new Date();
	times.setTime(times.getTime() + ex);
	if(ex == 0){
		document.cookie = name+"="+val+";";
	}else{
		document.cookie = name+"="+val+"; expires="+times.toGMTString();
	}
}
function getCookie(name){
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));   
	if(arr != null) return unescape(arr[2]); return null;
}

function bgScroll(){
//Y setting
var y1 = smjq(window).scrollTop();
var y2 = smjq('#wp').height();
smjq('#yuki_1').css('background-position', 'center ' + y1 * -2 + 'px');
smjq('#yuki_2').css('background-position', 'center ' + y1 * -0.6 + 'px');
smjq('#yuki_3').css('background-position', 'center ' + y1 * -0.1 + 'px');
smjq('#yuki_4').css('background-position', 'center ' + y1 * 0.5 + 'px');
};
//resize
smjq(window).resize(function(){
//bgScroll();
});
//load
smjq(window).load(function(){
//bgScroll();
});
//scroll
smjq(window).scroll(function(){
//bgScroll();
}); 

smjq.snowfall = function(element, options){
		var	defaults = {
				flakeCount : 35,
				flakeColor : '#ffffff',
				flakeIndex: 999999,
				minSize : 1,
				maxSize : 2,
				minSpeed : 1,
				maxSpeed : 5,
				round : false,
				shadow : false,
				pic: false,
				picUrl: '',
				collection : false,
				collectionHeight : 40,
				intTime:80
			},
			options = smjq.extend(defaults, options),
			random = function random(min, max){
				return Math.round(min + Math.random()*(max-min)); 
			};

			smjq(element).data("snowfall", this);			

			// Snow flake object
			function Flake(_x, _y, _size, _speed, _id)
			{
				// Flake properties
				this.id = _id; 
				this.x  = _x;
				this.y  = _y;
				this.size = _size;
				this.speed = _speed;
				this.step = 0;
				this.stepSize = random(1,10) / 100;

				if(options.collection){
					this.target = canvasCollection[random(0,canvasCollection.length-1)];
				}
				var mathSize = Math.round(this.size);
				if(!options.pic){
					var flakeMarkup = smjq(document.createElement("div")).attr({'class': 'snowfall-flakes', 'id' : 'flake-' + this.id}).css({'width' : mathSize, 'height' : mathSize, 'position' : 'absolute', 'top' : this.y, 'left' : this.x, 'fontSize' : mathSize, 'zIndex' : options.flakeIndex});
				} else {
					var flakeMarkup = smjq(document.createElement("img")).attr({'class': 'snowfall-flakes', 'id' : 'flake-' + this.id}).css({'width' : mathSize, 'height' : mathSize, 'position' : 'absolute', 'top' : this.y, 'left' : this.x, 'zIndex' : options.flakeIndex,'-ms-interpolation-mode': 'bicubic'}).attr("src",options.picUrl + "snow" + Math.floor(Math.random() * 4) + ".gif");
				}
				if(smjq(element).get(0).tagName === smjq(document).get(0).tagName){
					smjq('body').append(flakeMarkup);
					element = smjq('body');
				}else{
					smjq(element).append(flakeMarkup);
				}

				this.element = document.getElementById('flake-' + this.id);

				// Update function, used to update the snow flakes, and checks current snowflake against bounds
				this.update = function(){
					this.y += this.speed;

					if(this.y > (elHeight) - (this.size  + 6)){
						this.reset();
					}

					this.element.style.top = this.y + 'px';
					this.element.style.left = this.x + 'px';

					this.step += this.stepSize;
					this.x += Math.cos(this.step);

					// Pileup check
					if(options.collection){
						if(this.x > this.target.x && this.x < this.target.width + this.target.x && this.y > this.target.y && this.y < this.target.height + this.target.y){
							var ctx = this.target.element.getContext("2d"),
								curX = this.x - this.target.x,
								curY = this.y - this.target.y,
								colData = this.target.colData;

								if(colData[parseInt(curX)][parseInt(curY+this.speed+this.size)] !== undefined || curY+this.speed+this.size > this.target.height){
									if(curY+this.speed+this.size > this.target.height){
										while(curY+this.speed+this.size > this.target.height && this.speed > 0){
											this.speed *= .5;
										}

										ctx.fillStyle = "#fff";

										if(colData[parseInt(curX)][parseInt(curY+this.speed+this.size)] == undefined){
											colData[parseInt(curX)][parseInt(curY+this.speed+this.size)] = 1;
											ctx.fillRect(curX, (curY)+this.speed+this.size, this.size, this.size);
										}else{
											colData[parseInt(curX)][parseInt(curY+this.speed)] = 1;
											ctx.fillRect(curX, curY+this.speed, this.size, this.size);
										}
										this.reset();
									}else{
										// flow to the sides
										this.speed = 1;
										this.stepSize = 0;

										if(parseInt(curX)+1 < this.target.width && colData[parseInt(curX)+1][parseInt(curY)+1] == undefined ){
											// go left
											this.x++;
										}else if(parseInt(curX)-1 > 0 && colData[parseInt(curX)-1][parseInt(curY)+1] == undefined ){
											// go right
											this.x--;
										}else{
											//stop
											ctx.fillStyle = "#fff";
											ctx.fillRect(curX, curY, this.size, this.size);
											colData[parseInt(curX)][parseInt(curY)] = 1;
											this.reset();
										}
									}
								}
						}
					}

					if(this.x > (elWidth) - widthOffset || this.x < widthOffset){
						this.reset();
					}
				}

				// Resets the snowflake once it reaches one of the bounds set
				this.reset = function(){
					this.y = 0;
					this.x = random(widthOffset, elWidth - widthOffset);
					this.stepSize = random(1,10) / 100;
					this.size = random((options.minSize * 100), (options.maxSize * 100)) / 100;
					this.speed = random(options.minSpeed, options.maxSpeed);
				}
			}

			// Private vars
			var flakes = [],
				flakeId = 0,
				i = 0,
				elHeight = smjq(element).height(),
				elWidth = smjq(element).width(),
				widthOffset = 0,
				snowTimeout = 0;

			// Collection Piece ******************************
			if(options.collection !== false){
				var testElem = document.createElement('canvas');
				if(!!(testElem.getContext && testElem.getContext('2d'))){
					var canvasCollection = [],
						elements = smjq(options.collection),
						collectionHeight = options.collectionHeight;

					for(var i =0; i < elements.length; i++){
							var bounds = elements[i].getBoundingClientRect(),
								canvas = document.createElement('canvas'),
								collisionData = [];

							if(bounds.top-collectionHeight > 0){									
								document.body.appendChild(canvas);
								canvas.style.position = 'absolute';
								canvas.height = collectionHeight;
								canvas.width = bounds.width;
								canvas.style.left = bounds.left;
								canvas.style.top = bounds.top-collectionHeight;

								for(var w = 0; w < bounds.width; w++){
									collisionData[w] = [];
								}

								canvasCollection.push({element :canvas, x : bounds.left, y : bounds.top-collectionHeight, width : bounds.width, height: collectionHeight, colData : collisionData});
							}
					}
				}else{
					// Canvas element isnt supported
					options.collection = false;
				}
			}
			// ************************************************

			// This will reduce the horizontal scroll bar from displaying, when the effect is applied to the whole page
			if(smjq(element).get(0).tagName === smjq(document).get(0).tagName){
				widthOffset = 25;
			}

			// Bind the window resize event so we can get the innerHeight again
			smjq(window).bind("resize", function(){  
				elHeight = smjq(element).height();
				elWidth = smjq(element).width();
			}); 


			// initialize the flakes
			for(i = 0; i < options.flakeCount; i+=1){
				flakeId = flakes.length;
				flakes.push(new Flake(random(widthOffset,elWidth - widthOffset), random(0, elHeight), random((options.minSize * 100), (options.maxSize * 100)) / 100, random(options.minSpeed, options.maxSpeed), flakeId));
			}

			// This adds the style to make the snowflakes round via border radius property 
			if(options.round){
				//smjq('.snowfall-flakes').css({'-moz-border-radius' : options.maxSize, '-webkit-border-radius' : options.maxSize, 'border-radius' : options.maxSize});
				smjq('.snowfall-flakes').text(String.fromCharCode(9679)).css({'color':options.flakeColor});
			}

			// This adds shadows just below the snowflake so they pop a bit on lighter colored web pages
			if(options.shadow){
				smjq('.snowfall-flakes').css({'-moz-box-shadow' : '1px 1px 1px #555', '-webkit-box-shadow' : '1px 1px 1px #555', 'box-shadow' : '1px 1px 1px #555'});
			}

			// this controls flow of the updating snow
			function snow(){
				for( i = 0; i < flakes.length; i += 1){
					flakes[i].update();
				}

				snowTimeout = setTimeout(function(){snow()}, options.intTime);
			}

			snow();

		// Public Methods

		// clears the snowflakes
		this.clear = function(){
						smjq(element).children('.snowfall-flakes').remove();
						flakes = [];
						clearTimeout(snowTimeout);
					};
};

	// Initialize the options and the plugin
smjq.fn.snowfall = function(options){
	if(typeof(options) == "object" || options == undefined){		
			 return this.each(function(i){
				(new smjq.snowfall(this, options)); 
			});	
	}else if (typeof(options) == "string") {
		return this.each(function(i){
			var snow = smjq(this).data('snowfall');
			if(snow){
				snow.clear();
			}
		});
	}
};


(function( smjq ) {
 
  smjq.fn.rainbowize = function() {
    return this.each(function() {
      var rainbowtext = '';
      var hue=0;
      var step=0;
 
      // get the current text inside element
      var text = smjq(this).text();
 
      // hue is 360 degrees
      if (text.length > 0)
        step = 360 / (text.length);
 
      // iterate the whole 360 degrees
      for (var i = 0; i < text.length; i++)
      {
        rainbowtext = rainbowtext + '<span style="color:' + color_from_hue(hue) + '">' + text.charAt(i) + '</span>';
        hue += step;
      }
 
      smjq(this).html(rainbowtext);
    });
  };
})( smjq );

//fix cache problem when page loaded

function color_from_hue(hue)
{
  var h = hue/60;
  var c = 255;
  var x = (1 - Math.abs(h%2 - 1))*255;
  var color;
 
  var i = Math.floor(h);
  if (i == 0) color = rgb_to_hex(c, x, 0);
  else if (i == 1) color = rgb_to_hex(x, c, 0);
  else if (i == 2) color = rgb_to_hex(0, c, x);
  else if (i == 3) color = rgb_to_hex(0, x, c);
  else if (i == 4) color = rgb_to_hex(x, 0, c);
  else color = rgb_to_hex(c, 0, x);
 
  return color;
}
 
function rgb_to_hex(red, green, blue)
{
  var h = ((red << 16) | (green << 8) | (blue)).toString(16);
  // add the beginning zeros
  while (h.length < 6) h = '0' + h;
  return '#' + h;
}

function switchNeedHash(hashtext){
	var needHash = getCookie("needHash");
	var hashStatus = 0;
	if(needHash != null){
		if(needHash == ""){
			setCookie("needHash",hashtext);
			hashStatus = 1;
		}else{
			setCookie("needHash","");
			hashStatus = 0;
		}
	}else{
		setCookie("needHash",hashtext);
		hashStatus = 1;
	}
	if(hashStatus == 1){
		ensureHash(hashtext);
		alert("hash模式开启. ");
	}else{
		alert("hash模式关闭. ");
	}
	return hashStatus;
}

function ensureHash(hash){
	var tslinks = document.getElementsByTagName("a");
	var done = false;
	for(var tmpi=0;tmpi<tslinks.length;++tmpi){
		var gethref = tslinks[tmpi].href;
		//return gethref;
		if(gethref != "http://www.tsdm.net/forum.php" && gethref.indexOf(":;") == -1){
			tslinks[tmpi].href = gethref + "&hash=" + hash;
			done = true;
		}
	}
	return done;
}

function checkHash(){
	if(getCookie("needHash") != null){
		if(getCookie("needHash").length>0){
				ensureHash(getCookie("needHash"));
		}
	}
}

function topswitch(){
	var toppic1 = "http://dm.tsdm.net/images/GG/960.jpg";  //insert pic here
	var toppic2 = "http://dm.tsdm.net/images/GG/960x80-1.jpg";  //
	var toppic3 = "http://dm.tsdm.net/images/GG/960x80-2.jpg";
	var toppic4 = "http://dm.tsdm.net/images/GG/960.jpg";
	
	var toplink1 = "http://item.taobao.com/item.htm?id=35582589752";
	var toplink2 = "http://item.taobao.com/item.htm?id=35333485317";
	var toplink3 = "http://item.taobao.com/item.htm?id=35291545769";
	var toplink4 = "http://item.taobao.com/item.htm?id=35582589752";
	
	var targeta = document.getElementById('tsdm_banner_37');
	var targetimg = document.getElementById('tsdm_banner_37').firstChild;
	
	var classNow = targeta.className;
	if(classNow == 'topban_1'){
		targeta.href = toplink2;
		targeta.className = 'topban_2';
		targetimg.src = toppic2;
	}else if(classNow == 'topban_2'){
		targeta.href = toplink3;
		targeta.className = 'topban_3';
		targetimg.src = toppic3;
	}else if(classNow == 'topban_3'){
		targeta.href = toplink4;
		targeta.className = 'topban_4';
		targetimg.src = toppic4;
	}else{
		targeta.href = toplink1;
		targeta.className = 'topban_1';
		targetimg.src = toppic1;
	}
}


function fixheadframe(pid, headid){
	smjq('#ts_avatar_' + pid+' .avatar img').attr('id','ts_avatar_img_' + pid);
	smjq('#ts_avatar_' + pid+' .avatar img').css({"margin":"0", "padding":"0"});
	dohead('ts_avatar_img_' + pid, headid);
}

function dohead(headpicid, headid){
	smjq('#'+ headpicid).wrap('<table class="headframe" style="table-layout:initial;width:auto;margin:0 auto"><tbody id="' + headpicid + '_outside"><tr id="' + headpicid + '_mainpic_in_tr"><td id="' + headpicid + '_mainpic_in_td"></td></tr></tbody></table>');
	smjq('<tr><td></td><td></td><td></td></tr>').insertAfter('#' + headpicid + '_mainpic_in_tr');
	smjq('<td></td>').insertAfter('#' + headpicid + '_mainpic_in_td');
	smjq('<tr><td></td><td></td><td></td></tr>').insertBefore('#' + headpicid + '_mainpic_in_tr');
	smjq('<td></td>').insertBefore('#' + headpicid + '_mainpic_in_td');
	addhead(headpicid, headid);
}

function addhead(headpicid, headid){
	smjq('#'+headpicid+'_outside tr:nth-child(1) td:nth-child(1)').append('<img class="hdimg" style="padding:0;margin:0" src="http://img01.tsdm.net/frame/' + headid + '/1.png" />');
	smjq('#'+headpicid+'_outside tr:nth-child(1) td:nth-child(2)').append('<img class="hdimg" style="padding:0;margin:0" src="http://img01.tsdm.net/frame/' + headid + '/2.png" />');
	smjq('#'+headpicid+'_outside tr:nth-child(1) td:nth-child(3)').append('<img class="hdimg" style="padding:0;margin:0" src="http://img01.tsdm.net/frame/' + headid + '/3.png" />');
	smjq('#'+headpicid+'_outside tr:nth-child(2) td:nth-child(1)').append('<img class="hdimg" style="padding:0;margin:0" src="http://img01.tsdm.net/frame/' + headid + '/4.png" />');
	smjq('#'+headpicid+'_outside tr:nth-child(2) td:nth-child(3)').append('<img class="hdimg" style="padding:0;margin:0" src="http://img01.tsdm.net/frame/' + headid + '/5.png" />');
	smjq('#'+headpicid+'_outside tr:nth-child(3) td:nth-child(1)').append('<img class="hdimg" style="padding:0;margin:0" src="http://img01.tsdm.net/frame/' + headid + '/6.png" />');
	smjq('#'+headpicid+'_outside tr:nth-child(3) td:nth-child(2)').append('<img class="hdimg" style="padding:0;margin:0" src="http://img01.tsdm.net/frame/' + headid + '/7.png" />');
	smjq('#'+headpicid+'_outside tr:nth-child(3) td:nth-child(3)').append('<img class="hdimg" style="padding:0;margin:0" src="http://img01.tsdm.net/frame/' + headid + '/8.png" />');

	smjq('#'+headpicid+'_outside tr:nth-child(1) td:nth-child(1)').css({"background":"url(http://img01.tsdm.net/frame/" + headid + "/1.png) no-repeat"});
	smjq('#'+headpicid+'_outside tr:nth-child(1) td:nth-child(2)').css({"background":"url(http://img01.tsdm.net/frame/" + headid + "/2.png) repeat-x"});
	smjq('#'+headpicid+'_outside tr:nth-child(1) td:nth-child(3)').css({"background":"url(http://img01.tsdm.net/frame/" + headid + "/3.png) no-repeat"});
	smjq('#'+headpicid+'_outside tr:nth-child(2) td:nth-child(1)').css({"background":"url(http://img01.tsdm.net/frame/" + headid + "/4.png) repeat-y"});
	smjq('#'+headpicid+'_outside tr:nth-child(2) td:nth-child(3)').css({"background":"url(http://img01.tsdm.net/frame/" + headid + "/5.png) repeat-y"});
	smjq('#'+headpicid+'_outside tr:nth-child(3) td:nth-child(1)').css({"background":"url(http://img01.tsdm.net/frame/" + headid + "/6.png) no-repeat"});
	smjq('#'+headpicid+'_outside tr:nth-child(3) td:nth-child(2)').css({"background":"url(http://img01.tsdm.net/frame/" + headid + "/7.png) repeat-x"});
	smjq('#'+headpicid+'_outside tr:nth-child(3) td:nth-child(3)').css({"background":"url(http://img01.tsdm.net/frame/" + headid + "/8.png) no-repeat"});
}