
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const start = document.querySelector("#start");
const rand = document.querySelector("#randomize");
const slidespeed = document.querySelector("#slidespeed");
const slidesize = document.querySelector("#slidesize");
const arrsize = document.querySelector("#current_num_rects");
const currspeed = document.querySelector("#current_speed");
const b_clear = document.querySelectorAll(".b_clear");
const num_comp = document.querySelector("#num_comp");
const swap_cnt = document.querySelector("#swap_cnt");
const rec_cnt = document.querySelector("#rec_cnt");
const arr_cnt = document.getElementById("arr_cnt");

const quick_b = document.getElementById("quickSORT");
const merge_b = document.getElementById("mergeSORT");
const bit_b = document.getElementById("bitSORT");
const bubble_b = document.getElementById("bubbleSORT");
const shell_b = document.getElementById("shellSORT");
const selec_b = document.getElementById("selecSORT");
const cock_b = document.getElementById("cockSORT");

canvas.width = 1024;
canvas.height *= 4;
canvas.style.border = "1px solid black";
document.body.appendChild(canvas);
Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };
let delay = slidespeed.value;
let rects = [];
const d = {
	CMPCNT:0,
	RECCNT:0,
	SWAPCNT:0,
	TARRCNT:0
};

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

clear = () =>{
	ctx.fillStyle = "rgba(0,0,0)";
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function wait(milisec) { 
    return new Promise(resolve => { 
        setTimeout(() => { resolve('') }, milisec); 
    }) 
}



var rectangle = function(x, y, width, height, color) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.draw = function() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

var colorStruct = function(r, g, b){
	this.r = r;
	this.g = g;
	this.b = b;
}

HSItoRGB = (i, numElem) =>{
    var factor = 360.0/numElem;
    var h = i * factor;
    var inte = 78.0;
    var hp = h/60.0;
    var s = 1.0;
    var z = 1.0 - Math.abs(Math.fmod(hp, 2)-1);
    var c = (3.0 * inte * s)/1+z;
    var x = c*z;
    var r = 0, g = 0, b = 0;
    if(hp >= 0 && hp <= 1){
        r = c;
        g = x;
        b = 0;
    }else if(hp >= 1 && hp <= 2){
        r = x;
        g = c;
        b = 0;
    }else if(hp >= 2 && hp <= 3){
        r = 0;
        g = c;
        b = x;
    }else if(hp >= 3 && hp <= 4){
        r = 0;
        g = x;
        b = c;
    }else if(hp >= 4 && hp <= 5){
        r = x;
        g = 0;
        b = c;
    }else{
        r = c;
        g = 0;
        b = x;
    }
    var m = inte * (1-s);
    var result = new colorStruct(r+m, g+m, b+m);
    return result;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(Math.ceil(r)) + componentToHex(Math.ceil(g)) + componentToHex(Math.ceil(b));
}

fillscreen = (arrrect) => {
	arrrect = [];
	const size = (2**parseInt(slidesize.value));
	var rectWidth = canvas.width / size;
	var rectInc = canvas.height / size;
	var startHeight = rectInc;
	var startLoc = 0.0;
	for (var i = 0; i < size; i++) {
		var color = HSItoRGB(i, size);
		arrrect.push(new rectangle(startLoc, canvas.height-startHeight, rectWidth, startHeight, rgbToHex(color.r, color.g, color.b)));
		startHeight += rectInc;
		startLoc += rectWidth;
	}
	drawRects(arrrect);
	return arrrect;
}

reset = (rectarray) =>{
	currspeed.innerHTML = parseInt(slidespeed.value);
	arrsize.innerHTML = (2**parseInt(slidesize.value));
	num_comp.innerHTML = 0;
	swap_cnt.innerHTML = 0;
	rec_cnt.innerHTML = 0;
	arr_cnt.innerHTML = 0;
	const size = rectarray.length;
	var rectWidth = canvas.width / size;
	var rectInc = canvas.height / size;
	var startHeight = rectInc;
	var startLoc = 0.0;
	for (var i = 0; i < size; i++) {
		var color = HSItoRGB(i, size);
		rectarray[i].x = startLoc;
		rectarray[i].y = canvas.height-startHeight;
		rectarray[i].width = rectWidth;
		rectarray[i].height = startHeight;
		rectarray[i].color = rgbToHex(color.r, color.g, color.b);
		startHeight += rectInc;
		startLoc += rectWidth;
	}
	drawRects(rectarray);
}



drawRects = (rectarr) => {
	clear();
	for(var i = 0; i <rectarr.length; i++){
		rectarr[i].draw();
	}
}

swap = (a, b) =>{
	const wt = a.width;
	const ht = a.height;
	const ct = a.color;
	const yt = a.y;
		a.y = b.y;
		a.width = b.width;
		a.height = b.height;
		a.color = b.color;
		b.y = yt;
		b.width = wt;
		b.height = ht;
		b.color = ct;
}

async function randomize(rectarr){
	for(var i = 0; i < rectarr.length; i++){
		var j = getRandomInt(rectarr.length) % (i + 1);
		await wait(delay);
		swap(rectarr[i], rectarr[j]);
		clear();
		drawRects(rectarr);
	}
}


async function bubblesort(rect, d) {
	var cmp = 0;
	for(var i = rect.length-2; i >= 0; i--){
		for(var j = 0; j <= i; j++){
			d.CMPCNT++;
			cmp++;
			num_comp.innerHTML = cmp;
			if(rect[j].height > rect[j+1].height){
				d.SWAPCNT++;
				swap_cnt.innerHTML = d.SWAPCNT;
				await wait(delay);
				swap(rect[j+1], rect[j]);
				clear();
				drawRects(rect);
			}
		}
	}
}

async function selectionsort(arrrect, d){
	var i, j;
	for(i = 0; i < arrrect.length; i++){
		var min = arrrect[i].height;
		var minIDX = i;
		for(j = i; j < arrrect.length; j++){
			d.CMPCNT++;
			num_comp.innerHTML = d.CMPCNT;
			if(arrrect[j].height < min){
				min = arrrect[j].height;
				minIDX = j;
			}
		}
		d.SWAPCNT++;
		swap_cnt.innerHTML = d.SWAPCNT;
		await wait(delay);
		swap(arrrect[i], arrrect[minIDX]);
		clear();
		drawRects(arrrect);
	}
}

async function shellsort(arrrect, ){
	for(var gap = (arrrect.length/2)>>0; gap > 0; gap = (gap/2)>>0){
			for(var i = gap; i < arrrect.length; i++){
					var temp = arrrect[i].height;
					var j;
					for(j = i; j >= gap && arrrect[j-gap].height > temp; j-=gap){
						d.CMPCNT+=2;
						num_comp.innerHTML = d.CMPCNT;
						d.SWAPCNT++;
						swap_cnt.innerHTML = 	d.SWAPCNT;
						await wait(delay);
						swap(arrrect[j], arrrect[j-gap]);
						clear();
						drawRects(arrrect);
					}
					arrrect[j].height = temp;
					clear();
					drawRects(arrrect);
			}
	}
}

async function partition(rect, low, high,d){
	var pivot = rect[high].height;
	var i = (low - 1); 
	d.SWAPCNT++;
	swap_cnt.innerHTML = d.SWAPCNT;
	for (var j = low; j <= high - 1; j++){
		d.CMPCNT++;
		num_comp.innerHTML = d.CMPCNT;
		if (rect[j].height < pivot){
			i++; 
			d.SWAPCNT++;
			swap_cnt.innerHTML = d.SWAPCNT;
			await wait(delay);
			wait(delay);
			swap(rect[i], rect[j]);
			clear();
			drawRects(rect);
		}
	}
	await wait(delay);
	swap(rect[i + 1], rect[high]);
	clear();
	drawRects(rect);
	return (i + 1);
}


async function quickSort(rect, low, high, d){
	if (low < high){
		d.RECCNT+=2;
		rec_cnt.innerHTML = d.RECCNT;
		var pi = await partition(rect, low, high, d);
		await quickSort(rect, low, pi - 1, d);
		await quickSort(rect, pi + 1, high, d);
	}
}



async function cocktail(rect, d){
	var swapped = true;
	var start = 0;
	var end = rect.length-1;
	while(swapped){
		swapped = false;
		for(var i = start; i < end; i++){
			d.CMPCNT++;
			num_comp.innerHTML = d.CMPCNT;
			if(rect[i].height > rect[i+1].height){
				d.SWAPCNT++;
				swap_cnt.innerHTML = d.SWAPCNT;
				await wait(delay);
				swap(rect[i], rect[i+1]);
				clear();
				swapped = true;
				drawRects(rect);
			}
		}
		if(!swapped){
			break;
		}
		swapped = false;
		--end;
		for(var i = end - 1; i >= start; --i){
			d.CMPCNT++;
			num_comp.innerHTML = d.CMPCNT;
			if(rect[i].height > rect[i+1].height){
				d.SWAPCNT++;
				swap_cnt.innerHTML = d.SWAPCNT;
				await wait(delay);
				swap(rect[i], rect[i+1]);
				clear();
				swapped = true;
				drawRects(rect);
			}
		}
		++start;
	}
}

async function merge(rect, low, mid, high, d){
	 var n1 = mid - low + 1;
    var n2 = high - mid;
 
    // Create temp arrays
    left = new Array(n1);
    right = new Array(n2);


    // Copy data to temp arrays leftArray[] and rightArray[]
    for (var i = 0; i < n1; i++)
        left[i] = rect[low + i];
    for (var j = 0; j < n2; j++)
        right[j] = rect[mid + 1 + j];
 
    var i = 0, // Initial index of first sub-array
        j = 0; // Initial index of second sub-array
    var k = low; // Initial index of merged array
 
    // Merge the temp arrays back into array[left..right]
    while (i < n1 && j < n2) {
        if (left[i].height <= right[j].height) {
					await wait(delay);
            rect[k].height = left[i].height;
            rect[k].color = left[i].color;//added
            clear();
           	drawRects(rect);
            i++;
        }
        else {
						await wait(delay);
            rect[k].height = right[j].height;
            rect[k].color = right[j].color;
            clear();
            drawRects(rect);
            j++;
        }
        k++;
    }
    // Copy the remaining elements of
    // left[], if there are any
    while (i < n1) {
			await wait(delay);
        rect[k].height = left[i].height;
        rect[k].color = left[i].color;
        clear();
        drawRects(rect);
        i++;
        k++;
    }
    // Copy the remaining elements of
    // right[], if there are any
    while (j < n2) {
			await wait(delay);
        rect[k].height = right[j].height;
        rect[k].color = right[j].color;
        clear();
        drawRects(rect);
        j++;
        k++;
    }
}

async function mergeSort(rect, begin,  end, d){
	d.RECCNT+=3;
	rec_cnt.innerHTML = d.RECCNT;
	d.CMPCNT++;
	num_comp.innerHTML = d.CMPCNT;
	if (begin >= end){
		return; 
	}
	var mid = begin + ((end - begin)/2)>>0;
	await mergeSort(rect, begin, mid, d);
	await mergeSort(rect, mid + 1, end, d);
	await merge(rect, begin, mid, end, d);
}


async function bitonicMerge(rect, low, cnt, dir, d){
	d.RECCNT
	if(cnt > 1){
		var k = ((cnt/2)>>0);
		for(var i = low; i < low+k; i++){
			d.CMPCNT++;
			num_comp.innerHTML = d.CMPCNT;
			if(dir==(rect[i].height > rect[i+k].height)){
				d.SWAPCNT++;
				swap_cnt.innerHTML = d.SWAPCNT;
				await wait(delay);
				swap(rect[i], rect[i+k]);
			}
			clear();
			drawRects(rect);
		}
		await bitonicMerge(rect, low, k, dir, d);
		await bitonicMerge(rect, low+k, k, dir, d);
	}
}

async function bitonicSort(rect, low, cnt,dir, d){
	if(cnt > 1){
		d.RECCNT+=3;
		rec_cnt.innerHTML = d.RECCNT;
		var k = (cnt/2)>>0;
		await bitonicSort(rect, low, k, 1, d);
		await bitonicSort(rect, low+k, k, 0, d);
		await bitonicMerge(rect, low, cnt, dir, d);
	}
}

function bitonicCaller(rect, up, d){
	bitonicSort(rect, 0, rect.length, up, d);
}

async function inmerge(rect, start, end, d){
    var gap = end - start + 1;
    for(gap = inMergeNextGap(gap); gap > 0; gap = inMergeNextGap(gap)){
        for(var i = start; i+gap <= end; i++){
            var j = i + gap;
						d.CMPCNT++;
						num_comp.innerHTML = d.CMPCNT;
            if(rect[i].height > rect[j].height){
							await wait(delay);
								d.SWAPCNT++;
								swap_cnt.innerHTML = d.SWAPCNT;
                swap(rect[i], rect[j]);
                clear();
                drawRects(rect);
            }
        }
    }
}
async function inmergesort(rect, start, end, d){
    if(start == end)
        return;
    var mid = ((start+end)/2)>>0;
		d.RECCNT+=3;
		rec_cnt.innerHTML = d.RECCNT;
    await inmergesort(rect, start, mid, d);
    await inmergesort(rect, mid + 1, end, d);
    await inmerge(rect, start, end, d);
    
}

function inMergeNextGap(gap){
    if (gap <= 1)
            return 0;
    return (gap / 2)>>0;
}

rects = fillscreen(rects);


slidespeed.addEventListener("change", function(){
	delay = parseInt(slidespeed.value);
	currspeed.innerHTML = parseInt(slidespeed.value);
});

slidesize.addEventListener("change", function(){
	rects = fillscreen(rects);
	arrsize.innerHTML = (2**parseInt(slidesize.value));
});

for(var i = 1; i < b_clear.length; i++){
	b_clear[i].addEventListener("click", function(){
	d.RECCNT = 0;
	d.CMPCNT = 0
	d.SWAPCNT = 0;
	d.TARRCNT = 0;
	arr_cnt.innerHTML = 0;
	rec_cnt.innerHTML = 0;
	num_comp.innerHTML = 0;
	swap_cnt.innerHTML = 0;
	});
}

